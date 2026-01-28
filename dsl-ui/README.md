# DSL Studio

Development startup and notes are in `STARTUP_GUIDE.md` and `startup.sh`.

## Artifacts (persisted Python)

The backend persists a deterministic Python artifact for saved templates. Use the API to fetch it:

Example curl:

```
curl -s http://localhost:8000/api/templates/<TEMPLATE_ID>/artifact | jq
```

Quick Python CLI (included): `tools/fetch_artifact.py` — prints or saves the stored Python artifact.

Frontend example component: `frontend/src/components/ArtifactFetcherExample.js` shows how to fetch and render the artifact.
# Here are your Instructions
