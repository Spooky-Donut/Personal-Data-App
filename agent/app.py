import chainlit as cl
from langchain.agents import create_agent
from langchain.messages import AIMessageChunk
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from langchain_community.utilities.sql_database import SQLDatabase
from database.postgresql.connect import engine
from langchain_openai import ChatOpenAI


llm = ChatOpenAI(model_name="gpt-5-nano", temperature=0)

db = SQLDatabase(engine)
toolkit = SQLDatabaseToolkit(llm=llm, db=db)
system_message = """You are an agent designed to interact with a SQL database.
Given an input question, create a syntactically correct PostgreSQL query to run, then look at the results of the query and return the answer.
You can order the results by a relevant column to return the most interesting examples in the database.
Never query for all the columns from a specific table, only ask for the relevant columns given the question.
You have access to tools for interacting with the database.
Only use the below tools. Only use the information returned by the below tools to construct your final answer.
If you get an error while executing a query, check it, and then rewrite the query and try again.
Before making any query you should ALWAYS look at the tables in the database to see what you can query."""

agent = create_agent(
    model="openai:gpt-5-mini",
    system_prompt=system_message,
    tools=toolkit.get_tools(),
)


@cl.on_chat_start
async def chat_start():
    cl.user_session.set("history", [])


@cl.on_message
async def on_message(message: cl.Message):
    global agent

    history = cl.user_session.get("history")
    history.append({"role": "user", "content": message.content})

    steps = {}
    last_step = None

    message = cl.Message(content="")
    async for token, metadata in agent.astream(
        {"messages": history},
        stream_mode="messages",
    ):
        if metadata["langgraph_node"] == "model":
            await message.stream_token(token.content)

            if token.tool_calls:
                for tool_call in token.tool_calls:
                    if tool_call["id"] is None:
                        continue

                    last_step = tool_call["id"]

                    steps[tool_call["id"]] = cl.Step(
                        name=tool_call["name"],
                        type="tool",
                        language="sql",
                        show_input=True,
                    )
                    await steps[tool_call["id"]].send()

            if token.tool_call_chunks:
                for tool_call_chunk in token.tool_call_chunks:
                    await steps[last_step].stream_token(tool_call_chunk['args'], is_input=True)

        elif metadata["langgraph_node"] == "tools" and not isinstance(token, AIMessageChunk):
            await steps[token.tool_call_id].stream_token(token.content)
            await steps[token.tool_call_id].update()

    message.update()
