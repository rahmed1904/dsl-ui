import pytest
from fastapi.testclient import TestClient
from backend import server

SIMPLE_DSL = """
amount = principal * rate
createTransaction(postingdate, effectivedate, 'Interest', amount)
"""


def test_save_and_fetch_artifact():
    # Use context-managed TestClient so FastAPI lifespan events run cleanly
    with TestClient(server.app) as client:
        # Load sample data (creates events)
        resp = client.post("/load-sample-data")
        assert resp.status_code in (200, 201, 204)

        # Save template
        payload = {
            "name": "test-artifact-template",
            "dsl_code": SIMPLE_DSL,
            "event_name": "LoanEvent",
            "replace": True
        }
        resp = client.post("/templates", json=payload)
        assert resp.status_code == 200
        body = resp.json()
        tid = body.get("template_id")
        assert tid

        # Fetch artifact
        resp = client.get(f"/templates/{tid}/artifact")
        assert resp.status_code == 200
        art = resp.json()
        assert art.get("python_code")

        # Delete template (should remove artifact)
        resp = client.delete(f"/templates/{tid}")
        assert resp.status_code == 200

        # Artifact should now be gone
        resp = client.get(f"/templates/{tid}/artifact")
        assert resp.status_code == 404
