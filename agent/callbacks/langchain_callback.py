import time
from typing import Any, Dict, List, Optional, Tuple, TypedDict, Union
from uuid import UUID

import pydantic
from langchain_classic.callbacks.tracers.schemas import Run
from langchain_classic.load.dump import dumps
from langchain_classic.schema import BaseMessage
from langchain_core.outputs import ChatGenerationChunk, GenerationChunk
from langchain_core.tracers.base import AsyncBaseTracer
from literalai import ChatGeneration, CompletionGeneration, GenerationMessage
from literalai.observability.step import TrueStepType

from chainlit.context import context_var
from chainlit.message import Message
from chainlit.step import Step
from chainlit.utils import utc_now

# ============================================================
# CONFIGURACIÓN Y CONSTANTES
# ============================================================

DEFAULT_ANSWER_PREFIX_TOKENS = ["Final", "Answer", ":"]

DEFAULT_TO_IGNORE = [
    "RunnableSequence",
    "RunnableParallel",
    "RunnableAssign",
    "RunnableLambda",
    "<lambda>",
]
DEFAULT_TO_KEEP = ["retriever", "llm", "agent", "chain", "tool"]


# ============================================================
# CLASES AUXILIARES
# ============================================================


class FinalStreamHelper:
    """Maneja la detección del texto final ('Final Answer') en streams."""

    def __init__(
        self,
        answer_prefix_tokens: Optional[List[str]] = None,
        stream_final_answer: bool = False,
        force_stream_final_answer: bool = False,
        strip_tokens: bool = True,
    ) -> None:
        self.answer_prefix_tokens = answer_prefix_tokens or DEFAULT_ANSWER_PREFIX_TOKENS
        self.answer_prefix_tokens_stripped = [
            token.strip() for token in self.answer_prefix_tokens
        ]
        self.last_tokens = [""] * len(self.answer_prefix_tokens)
        self.last_tokens_stripped = [""] * len(self.answer_prefix_tokens)
        self.strip_tokens = strip_tokens
        self.answer_reached = force_stream_final_answer
        self.stream_final_answer = stream_final_answer
        self.final_stream: Optional[Message] = None
        self.has_streamed_final_answer = False

    def _append_to_last_tokens(self, token: str) -> None:
        self.last_tokens.append(token)
        self.last_tokens_stripped.append(token.strip())
        if len(self.last_tokens) > len(self.answer_prefix_tokens):
            self.last_tokens.pop(0)
            self.last_tokens_stripped.pop(0)

    def _compare_last_tokens(self, last_tokens: List[str]):
        if last_tokens == self.answer_prefix_tokens_stripped:
            return True
        return any(
            [
                all(
                    answer_token in last_token
                    for answer_token in self.answer_prefix_tokens_stripped
                )
                for last_token in last_tokens
            ]
        )

    def _check_if_answer_reached(self) -> bool:
        tokens = self.last_tokens_stripped if self.strip_tokens else self.last_tokens
        return self._compare_last_tokens(tokens)


class ChatGenerationStart(TypedDict):
    input_messages: List[BaseMessage]
    start: float
    token_count: int
    tt_first_token: Optional[float]


class CompletionGenerationStart(TypedDict):
    prompt: str
    start: float
    token_count: int
    tt_first_token: Optional[float]


class GenerationHelper:
    """Maneja el estado de generación de mensajes o completions."""

    def __init__(self) -> None:
        self.chat_generations: Dict[str, ChatGenerationStart] = {}
        self.completion_generations: Dict[str, CompletionGenerationStart] = {}
        self.generation_inputs: Dict[str, Dict] = {}

    def ensure_values_serializable(self, data):
        """Convierte recursivamente cualquier estructura a tipos serializables JSON."""
        if isinstance(data, dict):
            return {k: self.ensure_values_serializable(v) for k, v in data.items()}
        elif isinstance(data, pydantic.BaseModel):
            if pydantic.VERSION.startswith("1"):
                return data.dict()
            return data.model_dump()
        elif isinstance(data, list):
            return [self.ensure_values_serializable(item) for item in data]
        elif isinstance(data, (str, int, float, bool, type(None))):
            return data
        elif isinstance(data, (tuple, set)):
            return list(data)
        else:
            return str(data)

    def _convert_message_role(self, role: str):
        role_lower = role.lower()
        if "human" in role_lower:
            return "user"
        if "system" in role_lower:
            return "system"
        if "function" in role_lower:
            return "function"
        if "tool" in role_lower:
            return "tool"
        return "assistant"

    def _convert_message(self, message: Union[Dict, BaseMessage]):
        """Convierte un mensaje LangChain a formato GenerationMessage."""
        if isinstance(message, dict):
            class_name = message["id"][-1]
            kwargs = message.get("kwargs", {})
            msg = GenerationMessage(
                role=self._convert_message_role(class_name),
                content=kwargs.get("content", ""),
            )
            return msg

        msg = GenerationMessage(
            role=self._convert_message_role(message.type),
            content=message.content or "",
        )
        if message.additional_kwargs.get("function_call"):
            msg["function_call"] = message.additional_kwargs["function_call"]
        return msg

    def _build_llm_settings(
        self, serialized: Dict, invocation_params: Optional[Dict] = None
    ):
        if invocation_params is None:
            return None, None, None, None

        provider = invocation_params.pop("_type", "")
        model_kwargs = invocation_params.pop("model_kwargs", {}) or {}
        merged = {
            **invocation_params,
            **model_kwargs,
            **serialized.get("kwargs", {}),
        }
        settings = {k: v for k, v in merged.items() if not k.endswith("_api_key")}
        model_keys = ["azure_deployment", "deployment_name", "model", "model_name"]
        model = next((settings[k] for k in model_keys if k in settings), None)
        if isinstance(model, str):
            model = model.replace("models/", "")
        tools = None
        if "functions" in settings:
            tools = [{"type": "function", "function": f} for f in settings["functions"]]
        if "tools" in settings:
            tools = [
                (
                    {"type": "function", "function": t}
                    if t.get("type") != "function"
                    else t
                )
                for t in settings["tools"]
            ]
        return provider, model, tools, settings


def process_content(content: Any) -> Tuple[Dict | str, Optional[str]]:
    if content is None:
        return {}, None
    if isinstance(content, str):
        return {"content": content}, "text"
    return dumps(content), "json"


# ============================================================
# CLASE PRINCIPAL: CustomLangchainTracer
# ============================================================


class CustomLangchainTracer(AsyncBaseTracer, GenerationHelper, FinalStreamHelper):
    """Tracer personalizado y compatible con LangChain >= 1.0 y Chainlit."""

    def __init__(
        self,
        answer_prefix_tokens: Optional[List[str]] = None,
        stream_final_answer: bool = False,
        force_stream_final_answer: bool = False,
        to_ignore: Optional[List[str]] = None,
        to_keep: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> None:
        AsyncBaseTracer.__init__(self, **kwargs)
        GenerationHelper.__init__(self)
        FinalStreamHelper.__init__(
            self,
            answer_prefix_tokens=answer_prefix_tokens,
            stream_final_answer=stream_final_answer,
            force_stream_final_answer=force_stream_final_answer,
        )
        self.context = context_var.get()
        self.steps: Dict[str, Step] = {}
        self.parent_id_map: Dict[str, str] = {}
        self.ignored_runs = set()
        self._registered_runs: Dict[str, Run] = {}

        self.to_ignore = to_ignore or DEFAULT_TO_IGNORE
        self.to_keep = to_keep or DEFAULT_TO_KEEP
        self.root_parent_id = (
            self.context.current_step.id if self.context.current_step else None
        )

    # -------------------------------------------
    # FIX: Registro de runs (soluciona TracerException)
    # -------------------------------------------

    async def _persist_run(self, run: Run) -> None:
        """Registra cada run para que el tracer pueda actualizarlo luego."""
        self._registered_runs[str(run.id)] = run

    def _get_run(self, run_id: UUID) -> Optional[Run]:
        return self._registered_runs.get(str(run_id))

    # -------------------------------------------
    # Lógica de ejecución
    # -------------------------------------------

    async def on_chat_model_start(
        self,
        serialized: Dict[str, Any],
        messages: List[List[BaseMessage]],
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        **kwargs: Any,
    ) -> Run:
        self.chat_generations[str(run_id)] = {
            "input_messages": messages[0],
            "start": time.time(),
            "token_count": 0,
            "tt_first_token": None,
        }
        run = await super().on_chat_model_start(
            serialized, messages, run_id=run_id, parent_run_id=parent_run_id, **kwargs
        )
        await self._persist_run(run)
        return run

    async def on_llm_new_token(
        self,
        token: str,
        *,
        chunk: Optional[Union[GenerationChunk, ChatGenerationChunk]] = None,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        **kwargs: Any,
    ) -> None:
        await super().on_llm_new_token(
            token=token,
            chunk=chunk,
            run_id=run_id,
            parent_run_id=parent_run_id,
            **kwargs,
        )

        # Guardar métricas básicas
        if isinstance(chunk, ChatGenerationChunk):
            start = self.chat_generations.get(str(run_id))
        else:
            start = self.completion_generations.get(str(run_id))
        if not start:
            return

        start["token_count"] += 1
        if start["tt_first_token"] is None:
            start["tt_first_token"] = (time.time() - start["start"]) * 1000

        token_str = "".join(map(str, token)) if isinstance(token, list) else str(token)

        if self.stream_final_answer:
            self._append_to_last_tokens(token_str)
            if self.answer_reached:
                if not self.final_stream:
                    self.final_stream = Message(content="")
                    await self.final_stream.send()
                await self.final_stream.stream_token(token_str)
                self.has_streamed_final_answer = True
            else:
                self.answer_reached = self._check_if_answer_reached()

    async def _start_trace(self, run: Run) -> None:
        """Intercepta el inicio de cada run y lo registra correctamente."""
        await super()._start_trace(run)
        await self._persist_run(run)
        context_var.set(self.context)

        step = Step(
            id=str(run.id),
            name=run.name,
            type="llm" if run.run_type == "llm" else "run",
            parent_id=(
                str(run.parent_run_id) if run.parent_run_id else self.root_parent_id
            ),
        )
        step.start = utc_now()
        step.input, _ = process_content(run.inputs)
        step.tags = run.tags
        self.steps[str(run.id)] = step
        await step.send()

    async def _on_run_update(self, run: Run) -> None:
        """Actualiza el estado de cada run."""
        context_var.set(self.context)
        current_step = self.steps.get(str(run.id))
        if not current_step:
            return
        current_step.output, current_step.language = process_content(run.outputs)
        current_step.end = utc_now()
        await current_step.update()

        if self.final_stream and self.has_streamed_final_answer:
            await self.final_stream.update()

    async def _on_error(self, error: BaseException, *, run_id: UUID, **kwargs: Any):
        """Registra errores sin interrumpir la sesión."""
        context_var.set(self.context)
        if current_step := self.steps.get(str(run_id)):
            current_step.is_error = True
            current_step.output = str(error)
            current_step.end = utc_now()
            await current_step.update()
