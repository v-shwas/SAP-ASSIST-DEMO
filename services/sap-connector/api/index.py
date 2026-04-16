# Vercel Python serverless entrypoint.
# Vercel looks for an ASGI app exported from this file.
# All routes defined in app/main.py are served under /_/sap-connector/
import sys
import os

# Make the service root importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app  # noqa: E402  (FastAPI ASGI app)
