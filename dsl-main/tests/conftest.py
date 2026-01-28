import os
import time

import pytest
from starlette.testclient import TestClient

import backend.server as server


# Ensure tests use local path-style URLs (TestClient will be used to handle requests)
os.environ['REACT_APP_BACKEND_URL'] = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


@pytest.fixture(scope='session', autouse=True)
def test_client_and_requests_monkeypatch():
    """Provide a TestClient for the FastAPI app and monkeypatch `requests` to route through it.

    This avoids starting an external HTTP server and allows existing tests that use `requests`
    to work by forwarding calls into the TestClient.
    """
    client = TestClient(server.app)

    import requests as _requests

    def _to_path(url: str) -> str:
        # Handle path-only URLs that start with /api
        if url.startswith('/api/'):
            return url[len('/api'):]
        if url == '/api':
            return '/'
        # If URL is absolute, extract path and query
        if url.startswith('http://') or url.startswith('https://'):
            # Find first slash after scheme://host
            parts = url.split('://', 1)[1]
            idx = parts.find('/')
            if idx == -1:
                return '/'
            path = '/' + parts[idx+1:]
            # The api_router in the app is mounted without the '/api' prefix
            # (a proxy normally provides it). Strip leading '/api' if present.
            if path.startswith('/api/'):
                return path[len('/api'):]
            if path == '/api':
                return '/'
            return path
        return url

    def _get(url, **kwargs):
        return client.get(_to_path(url), **kwargs)

    def _post(url, **kwargs):
        return client.post(_to_path(url), **kwargs)

    def _delete(url, **kwargs):
        return client.delete(_to_path(url), **kwargs)

    def _put(url, **kwargs):
        return client.put(_to_path(url), **kwargs)

    # Monkeypatch requests methods manually and restore on teardown
    orig_get = getattr(_requests, 'get', None)
    orig_post = getattr(_requests, 'post', None)
    orig_delete = getattr(_requests, 'delete', None)
    orig_put = getattr(_requests, 'put', None)

    _requests.get = _get
    _requests.post = _post
    _requests.delete = _delete
    _requests.put = _put

    try:
        yield
    finally:
        # Restore originals
        if orig_get is not None:
            _requests.get = orig_get
        if orig_post is not None:
            _requests.post = orig_post
        if orig_delete is not None:
            _requests.delete = orig_delete
        if orig_put is not None:
            _requests.put = orig_put
