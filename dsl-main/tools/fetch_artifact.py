#!/usr/bin/env python3
"""
Fetch stored Python artifact for a template and optionally save to a file.

Usage:
  python tools/fetch_artifact.py <TEMPLATE_ID> [--host http://localhost:8000] [--save out.py]

Environment:
  DSL_API_HOST     override host (default: http://localhost:8000)
  DSL_API_PREFIX   override API prefix (default: /api)
"""
import argparse
import os
import sys

import requests


def fetch_artifact(template_id, host="http://localhost:8000", api_prefix="/api"):
    url = f"{host.rstrip('/')}{api_prefix}/templates/{template_id}/artifact"
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    return resp.json()


def main():
    p = argparse.ArgumentParser()
    p.add_argument("template_id")
    p.add_argument("--host", default=os.environ.get("DSL_API_HOST", "http://localhost:8000"))
    p.add_argument("--api-prefix", default=os.environ.get("DSL_API_PREFIX", "/api"))
    p.add_argument("--save", "-s", help="save python code to this filename")
    args = p.parse_args()

    try:
        doc = fetch_artifact(args.template_id, host=args.host, api_prefix=args.api_prefix)
    except requests.HTTPError as e:
        print("HTTP error while fetching artifact:", e, file=sys.stderr)
        sys.exit(2)
    except Exception as e:
        print("Error while fetching artifact:", e, file=sys.stderr)
        sys.exit(2)

    # tolerate multiple response shapes
    code = (
        doc.get("python_code")
        or doc.get("code")
        or (doc.get("artifact") or {}).get("python_code")
    )

    if not code:
        print("No `python_code` found in response:")
        print(doc)
        sys.exit(3)

    if args.save:
        with open(args.save, "w", encoding="utf-8") as f:
            f.write(code)
        print(f"Saved artifact to {args.save}")
    else:
        print(code)


if __name__ == "__main__":
    main()
