import os
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


def test_validate_rejects_python_tokens():
    """Ensure the editor validation endpoint rejects raw Python syntax."""
    payload = {
        "dsl_code": "import os\ndef foo():\n    pass\nexec('print(1)')"
    }

    response = requests.post(f"{BASE_URL}/api/dsl/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data.get("valid") is False
    # Should instruct removal of Python syntax
    assert "Remove Python" in data.get("message", "") or "Python syntax" in data.get("error", "")
