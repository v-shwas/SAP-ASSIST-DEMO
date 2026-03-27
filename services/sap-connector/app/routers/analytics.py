"""Analytics router — demand forecast, ad-hoc queries via SAP BW/CDS."""
from fastapi import APIRouter, Request
from app.sap.odata_client import ODataClient
from app.sap.connection import config_from_headers

router = APIRouter(prefix="/analytics", tags=["Analytics"])


def _get_client(request: Request) -> ODataClient | None:
    cfg = config_from_headers(dict(request.headers))
    return ODataClient(cfg) if cfg else None


@router.post("/forecast")
async def get_demand_forecast(request: Request, body: dict):
    """Maps to Claude tool: get_demand_forecast"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    params = {
        "$select": "Material,Plant,ForecastPeriod,ForecastQty,LowerBound,UpperBound,ForecastMethod",
        "$top": str((body.get("horizon_months") or 3) * 10),
        "$orderby": "ForecastPeriod asc",
    }
    if body.get("material"):
        params["$filter"] = f"Material eq '{body['material']}'"

    return await client.get("API_DEMAND_FORECAST_SRV", "ForecastSet", params)


@router.post("/query")
async def run_analytics_query(request: Request, body: dict):
    """Maps to Claude tool: run_analytics_query.
    Routes to SAP BW OData services based on the requested metric.
    """
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    metric = body.get("metric", "revenue")
    dimensions = body.get("dimensions", [])
    period = body.get("period", "")

    # Map metrics to SAP BW query OData services
    service_map = {
        "revenue": ("BW_REVENUE_QUERY_SRV", "RevenueSet"),
        "margin": ("BW_MARGIN_QUERY_SRV", "MarginSet"),
        "stock_turns": ("BW_INVENTORY_QUERY_SRV", "StockTurnsSet"),
    }
    service, entity = service_map.get(metric, ("BW_GENERIC_QUERY_SRV", "ResultSet"))

    params: dict[str, str] = {"$top": "200"}
    if dimensions:
        params["$select"] = ",".join(dimensions + [metric])
    if period:
        params["$filter"] = f"FiscalPeriod eq '{period}'"

    return await client.get(service, entity, params)
