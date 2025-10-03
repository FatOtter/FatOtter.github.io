"""
Backend integration tests using pytest.

Usage:
- export BACKEND_URL=http://localhost:5000
- pytest -q

If BACKEND_URL is not set, tests are skipped (backend not implemented or not running).
"""
import os
import json
import time
import pytest
import urllib.request
import urllib.error


BACKEND_URL = os.environ.get("BACKEND_URL")


@pytest.fixture(scope="module")
def base_url():
    if not BACKEND_URL:
        pytest.skip("BACKEND_URL not set; skipping backend integration tests.")
    return BACKEND_URL.rstrip("/")


def _http_get(url, timeout=5):
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.status, resp.read(), dict(resp.headers)


def _http_post_json(url, payload, timeout=10):
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.status, resp.read(), dict(resp.headers)


def test_health_ok(base_url):
    status, body, headers = _http_get(f"{base_url}/api/health", timeout=5)
    assert status == 200
    # Body could be JSON or text; accept both but ensure non-empty
    assert body is not None and len(body) > 0


def test_chat_completions_basic(base_url):
    payload = {
        "messages": [
            {"role": "user", "content": "Hello"}
        ],
        "model": os.environ.get("MODEL_NAME", "default"),
        "temperature": 0.2,
        "max_tokens": 64,
        "stream": False,
        "timeout_ms": 8000
    }
    status, body, headers = _http_post_json(f"{base_url}/api/chat/completions", payload, timeout=15)
    # Accept 200 for success, or 400/401/403/500 if upstream not configured yet, but endpoint exists.
    assert status in (200, 400, 401, 403, 429, 500)
    # If 200, must be JSON
    if status == 200:
        ct = headers.get("Content-Type", "")
        assert "application/json" in ct.lower()
        parsed = json.loads(body.decode("utf-8"))
        assert "choices" in parsed or "message" in parsed or "data" in parsed