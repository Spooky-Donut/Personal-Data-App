FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /app

COPY pyproject.toml /app
COPY uv.lock /app
COPY .python-version /app

WORKDIR /app
RUN uv sync --frozen --no-cache

CMD ["uv", "run", "chainlit", "run", "app.py", "-w", "--port", "8000", "--host", "0.0.0.0"]