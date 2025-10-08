import os
import json
import logging
import uuid
from typing import Dict, Any, Generator, Optional

import requests
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

# Coze API integration
try:
    from cozepy import COZE_CN_BASE_URL, Coze, TokenAuth, Message, ChatEventType
    COZE_AVAILABLE = True
except ImportError:
    COZE_AVAILABLE = False
    print("Warning: cozepy not available, using mock responses")

# ------------------------------------------------------------------------------
# Config
# ------------------------------------------------------------------------------
class Config:
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "5000"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # CORS
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

    # Coze API Configuration
    COZE_API_TOKEN: str = os.getenv("COZE_API_TOKEN", "cztei_llMVpoQe7Wy03GrvaiNgnf3fI0E09s6ko0KYvT10DaQfnTZeDemojOM6LGID3IqA7")
    COZE_API_BASE: str = os.getenv("COZE_API_BASE", "https://api.coze.cn")
    COZE_BOT_ID: str = os.getenv("COZE_BOT_ID", "7556964822257156146")
    COZE_TIMEOUT_SEC: int = int(os.getenv("COZE_TIMEOUT_SEC", "30"))
    
    # Legacy Volcengine API (fallback)
    VOLCENGINE_API_BASE: str = os.getenv("VOLCENGINE_API_BASE", "").strip()
    VOLCENGINE_CHAT_PATH: str = os.getenv("VOLCENGINE_CHAT_PATH", "/api/chat/completions")
    VOLCENGINE_API_KEY: str = os.getenv("VOLCENGINE_API_KEY", "").strip()
    VOLCENGINE_TIMEOUT_SEC: int = int(os.getenv("VOLCENGINE_TIMEOUT_SEC", "30"))
    VOLCENGINE_ENABLE_SSE: bool = os.getenv("VOLCENGINE_ENABLE_SSE", "false").lower() == "true"

    # Optional: model defaults
    DEFAULT_MODEL: str = os.getenv("DEFAULT_MODEL", "auto")
    DEFAULT_TEMPERATURE: float = float(os.getenv("DEFAULT_TEMPERATURE", "0.7"))

# ------------------------------------------------------------------------------
# App factory
# ------------------------------------------------------------------------------
def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # Load JSON config overrides (backend/config.json)
    try:
        import json as _json
        import os as _os
        cfg_path = _os.path.join(_os.path.dirname(__file__), "config.json")
        if _os.path.exists(cfg_path):
            with open(cfg_path, "r", encoding="utf-8") as f:
                file_cfg = _json.load(f)
            typed_keys_int = {"PORT","VOLCENGINE_TIMEOUT_SEC"}
            typed_keys_bool = {"DEBUG","VOLCENGINE_ENABLE_SSE"}
            typed_keys_float = {"DEFAULT_TEMPERATURE"}
            typed_keys_str = {
                "HOST","CORS_ORIGINS",
                "VOLCENGINE_API_BASE","VOLCENGINE_CHAT_PATH","VOLCENGINE_API_KEY",
                "DEFAULT_MODEL",
                "UPSTREAM_API_KEY","UPSTREAM_BOT_ID"
            }
            for k in (
                "HOST","PORT","DEBUG",
                "CORS_ORIGINS",
                "VOLCENGINE_API_BASE","VOLCENGINE_CHAT_PATH","VOLCENGINE_API_KEY",
                "VOLCENGINE_TIMEOUT_SEC","VOLCENGINE_ENABLE_SSE",
                "DEFAULT_MODEL","DEFAULT_TEMPERATURE",
                "UPSTREAM_API_KEY","UPSTREAM_BOT_ID"
            ):
                if k in file_cfg:
                    val = file_cfg[k]
                    if k in typed_keys_int:
                        try: val = int(val)
                        except Exception: continue
                    elif k in typed_keys_bool:
                        # accept true/false, "true"/"false", 1/0
                        if isinstance(val, str): val = val.lower() == "true"
                        else: val = bool(val)
                    elif k in typed_keys_float:
                        try: val = float(val)
                        except Exception: continue
                    elif k in typed_keys_str:
                        val = str(val)
                    app.config[k] = val
    except Exception as e:
        logging.getLogger("backend").warning("Failed to load backend/config.json: %s", e)

    # Logging
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logger = logging.getLogger("backend")

    # CORS — allow configured origins; default permissive
    try:
        cors_origins = str(app.config.get("CORS_ORIGINS", "*"))
        CORS(app, resources={r"/api/*": {"origins": cors_origins}})
    except Exception:
        # fallback to permissive if config parsing fails
        CORS(app)

    # Utilities
    def _public_config() -> Dict[str, Any]:
        return {
            "upstreamConfigured": bool(app.config["VOLCENGINE_API_BASE"]),
            "enableSSE": app.config["VOLCENGINE_ENABLE_SSE"],
            "timeoutSec": app.config["VOLCENGINE_TIMEOUT_SEC"],
            "cozeConfigured": bool(app.config["COZE_API_TOKEN"]),
            "chatEnabled": True,
            "maxMessageLength": 1000,
            "supportedLanguages": ["zh", "en", "ja"],
            "defaults": {
                "model": app.config["DEFAULT_MODEL"],
                "temperature": app.config["DEFAULT_TEMPERATURE"],
            },
        }

    def _error(code: int, message: str, details: Optional[Dict[str, Any]] = None):
        payload = {"code": code, "message": message}
        if details:
            payload["details"] = details
        return jsonify(payload), code

    def _build_auth_headers() -> Dict[str, str]:
        """
        Build auth headers if needed. For Volcengine, you might need AK/SK signing or token.
        This is a placeholder that uses VOLCENGINE_API_KEY if present.
        Do NOT commit real keys; inject via environment.
        """
        headers: Dict[str, str] = {
            "Content-Type": "application/json",
        }
        api_key = app.config["VOLCENGINE_API_KEY"]
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"
        return headers

    def _init_coze_client():
        """Initialize Coze client if available"""
        if not COZE_AVAILABLE or not app.config["COZE_API_TOKEN"]:
            return None
        
        try:
            coze = Coze(
                auth=TokenAuth(token=app.config["COZE_API_TOKEN"]),
                base_url=app.config["COZE_API_BASE"]
            )
            return coze
        except Exception as e:
            logger.error(f"Failed to initialize Coze client: {e}")
            return None

    def _chat_with_coze(message: str, user_id: str, language: str = "zh") -> Dict[str, Any]:
        """Chat with Coze API"""
        coze = _init_coze_client()
        if not coze:
            raise RuntimeError("Coze client not available")
        
        try:
            # Create user message
            user_message = Message.build_user_question_text(message)
            
            # Stream chat response
            response_text = ""
            token_count = 0
            
            for event in coze.chat.stream(
                bot_id=app.config["COZE_BOT_ID"],
                user_id=user_id,
                additional_messages=[user_message]
            ):
                if event.event == ChatEventType.CONVERSATION_MESSAGE_DELTA:
                    response_text += event.message.content
                elif event.event == ChatEventType.CONVERSATION_CHAT_COMPLETED:
                    token_count = event.chat.usage.token_count
            
            return {
                "response": response_text,
                "usage": {
                    "token_count": token_count
                },
                "model": "coze",
                "language": language
            }
            
        except Exception as e:
            logger.error(f"Coze API error: {e}")
            raise RuntimeError(f"Coze API error: {str(e)}")

    def _proxy_chat(body: Dict[str, Any]) -> requests.Response:
        base = app.config["VOLCENGINE_API_BASE"]
        path = app.config["VOLCENGINE_CHAT_PATH"]
        if not base:
            raise RuntimeError("Upstream not configured: VOLCENGINE_API_BASE is empty")
        url = f"{base.rstrip('/')}{path}"
        headers = _build_auth_headers()

        # merge defaults
        merged = {
            "model": body.get("model") or app.config["DEFAULT_MODEL"],
            "temperature": body.get("temperature", app.config["DEFAULT_TEMPERATURE"]),
            "messages": body.get("messages") or [],
            "stream": bool(body.get("stream", False)) and app.config["VOLCENGINE_ENABLE_SSE"],
        }
        # pass-through extra fields if any
        for k in ("max_tokens", "top_p", "stop", "presence_penalty", "frequency_penalty"):
            if k in body:
                merged[k] = body[k]

        stream_flag = True if bool(body.get("stream", False)) and bool(app.config["VOLCENGINE_ENABLE_SSE"]) else False
        logger.info("Proxying chat: stream=%s", stream_flag)
        resp = requests.post(
            url,
            headers=headers,
            json=merged,
            timeout=int(app.config["VOLCENGINE_TIMEOUT_SEC"]),
            stream=stream_flag
        )
        return resp

    def _stream_sse(resp: requests.Response) -> Generator[bytes, None, None]:
        """
        Stream upstream SSE to client. This assumes upstream returns proper event-stream lines.
        """
        try:
            for chunk in resp.iter_lines(decode_unicode=True):
                if chunk:
                    # forward as-is, ensure each line ends with \n\n as SSE event delimiter if already formatted upstream
                    yield (chunk + "\n").encode("utf-8")
        finally:
            resp.close()

    # Routes
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "backend", "config": _public_config()})

    @app.get("/api/config/public")
    def config_public():
        return jsonify(_public_config())

    @app.post("/api/chat/completions")
    def chat_completions():
        try:
            body = request.get_json(silent=True) or {}
        except Exception:
            return _error(400, "Invalid JSON body")

        # Enhanced validation for new API format
        message = body.get("message", "").strip()
        user_id = body.get("user_id", str(uuid.uuid4()))
        language = body.get("language", "zh")
        
        # Validate message
        if not message:
            return _error(400, "Missing or empty message")
        
        if len(message) > 1000:
            return _error(400, "Message too long (max 1000 characters)")
        
        # Validate language
        supported_languages = ["zh", "en", "ja"]
        if language not in supported_languages:
            return _error(400, f"Unsupported language. Supported: {supported_languages}")
        
        # Try Coze API first, fallback to legacy
        try:
            if COZE_AVAILABLE and app.config["COZE_API_TOKEN"]:
                result = _chat_with_coze(message, user_id, language)
                return jsonify(result)
        except Exception as e:
            logger.warning(f"Coze API failed, trying fallback: {e}")
        
        # Fallback to legacy API format
        legacy_body = {
            "messages": [{"role": "user", "content": message}],
            "model": body.get("model", app.config["DEFAULT_MODEL"]),
            "temperature": body.get("temperature", app.config["DEFAULT_TEMPERATURE"]),
            "stream": body.get("stream", False)
        }
        
        try:
            upstream_resp = _proxy_chat(legacy_body)
        except RuntimeError as e:
            return _error(501, "Upstream not configured", {"hint": str(e)})
        except requests.Timeout:
            return _error(504, "Upstream timeout")
        except requests.RequestException as e:
            return _error(502, "Upstream request error", {"error": str(e)})

        # Stream or JSON
        stream = True if bool(body.get("stream", False)) and bool(app.config["VOLCENGINE_ENABLE_SSE"]) else False
        if stream:
            # passthrough SSE
            return Response(_stream_sse(upstream_resp), mimetype="text/event-stream")
        try:
            data = upstream_resp.json()
        except ValueError:
            text = upstream_resp.text
            return _error(502, "Invalid upstream JSON", {"text": text})
        status = upstream_resp.status_code
        if status >= 400:
            # forward error with some context
            return _error(status, "Upstream error", {"upstream": data})
        return jsonify(data)

    # Error handlers
    @app.errorhandler(404)
    def not_found(_):
        return _error(404, "Not Found")

    @app.errorhandler(500)
    def internal_error(e):
        logging.getLogger("backend").exception("Internal server error: %s", e)
        return _error(500, "Internal Server Error")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host=app.config["HOST"], port=app.config["PORT"], debug=app.config["DEBUG"])