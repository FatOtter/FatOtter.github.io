# Backend (Flask)

A minimal Flask service to support RESTful endpoints for the front-end, including a health check and a proxy to Volcengine chat completions.

## Endpoints
- GET /api/health — service health and public config
- GET /api/config/public — non-sensitive runtime config
- POST /api/chat/completions — proxy to Volcengine chat API (JSON or SSE)

## Configuration (config file preferred)

Use backend/config.json to manage all backend settings (no hardcoding in code). Sensitive values (API Token/Bot ID) must be placed in backend/config.json (do NOT hardcode or commit). A template is provided:

- Copy backend/config.example.json to backend/config.json
- Fill in your values (do NOT commit secrets)

Keys:
- HOST, PORT, DEBUG, CORS_ORIGINS
- VOLCENGINE_API_BASE (required to proxy), VOLCENGINE_CHAT_PATH, VOLCENGINE_API_KEY
- UPSTREAM_API_KEY, UPSTREAM_BOT_ID (sensitive values: store in backend/config.json, never in code or examples)
- VOLCENGINE_TIMEOUT_SEC, VOLCENGINE_ENABLE_SSE
- DEFAULT_MODEL, DEFAULT_TEMPERATURE

The service automatically loads backend/config.json on start and overrides defaults.

You can still override via env vars if needed.

## Install
pip install -r backend/requirements.txt

## Run
python backend/app.py

The server reads backend/config.json if present.

## Notes
- Do not commit any keys. Store API tokens/Bot IDs in backend/config.json (not in code) and/or inject via environment variables.
- If VOLCENGINE_API_BASE is not set, /api/chat/completions returns 501 with a helpful hint.
- SSE streaming is supported when both client sets stream=true and VOLCENGINE_ENABLE_SSE=true.