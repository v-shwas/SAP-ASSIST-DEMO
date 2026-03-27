"""SAP Connector microservice — translates Claude tool calls to SAP OData/RFC calls."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import fico, sd, mm, analytics

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("SAP Connector starting on port %s", settings.port)
    yield
    logger.info("SAP Connector shutting down")


app = FastAPI(
    title="SAP AI Connector",
    description="Translates Claude tool-use calls into SAP OData/RFC requests",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
)

# CORS — only allow the Next.js app origin in prod; wide-open in dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.middleware("http")
async def verify_internal_secret(request: Request, call_next):
    """Reject requests that don't carry the shared internal secret."""
    # Skip auth for health check and docs
    if request.url.path in ("/health", "/docs", "/openapi.json"):
        return await call_next(request)

    secret = request.headers.get("X-Connector-Secret")
    if secret != settings.connector_secret:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return await call_next(request)


@app.middleware("http")
async def log_sap_calls(request: Request, call_next):
    tenant = request.headers.get("X-Tenant-ID", "unknown")
    logger.info("SAP call tenant=%s path=%s", tenant, request.url.path)
    response = await call_next(request)
    logger.info("SAP response tenant=%s status=%s", tenant, response.status_code)
    return response


# Routers
app.include_router(fico.router)
app.include_router(sd.router)
app.include_router(mm.router)
app.include_router(analytics.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "sap-connector"}


@app.post("/test-connection")
async def test_connection(request: Request):
    """Test SAP connectivity with provided credentials."""
    from app.sap.connection import config_from_headers
    from app.sap.odata_client import ODataClient
    import httpx

    cfg = config_from_headers(dict(request.headers))
    if cfg is None:
        raise HTTPException(status_code=400, detail="Missing SAP connection headers")

    try:
        client = ODataClient(cfg)
        # Ping the SAP OData catalog service
        url = f"{cfg.base_url}/sap/opu/odata/IWFND/CATALOGSERVICE/ServiceCollection"
        async with httpx.AsyncClient(
            auth=(cfg.username, cfg.password),
            headers={"sap-client": cfg.client},
            verify=cfg.verify_ssl,
            timeout=10,
        ) as http:
            resp = await http.get(url, params={"$top": "1", "$format": "json"})
            resp.raise_for_status()
        return {"connected": True, "sap_url": cfg.base_url}
    except Exception as exc:
        return {"connected": False, "error": str(exc)}
