"""FI/CO router — profitability, revenue, cost, GST."""
from fastapi import APIRouter, Request
from app.sap.connection import config_from_headers, SapConfig
from app.sap.odata_client import ODataClient
from app.cache import cache

router = APIRouter(prefix="/fico", tags=["FI/CO"])


def _get_client(request: Request) -> ODataClient | None:
    cfg = config_from_headers(dict(request.headers))
    if cfg is None:
        return None
    return ODataClient(cfg)


@router.post("/profitability")
async def get_profitability(request: Request, body: dict):
    """Maps to Claude tool: get_profitability_report"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    period = body.get("period", "")
    # SAP CO-PA OData service: COPA_ACTUAL_LINEITEM_SRV
    params = {
        "$select": "OrderID,ProductID,Revenue,Cost,GrossMargin,Period",
        "$filter": f"Period eq '{period}'" if period else None,
        "$top": str(body.get("top_n", 10)),
    }
    params = {k: v for k, v in params.items() if v is not None}
    return await client.get("COPA_ACTUAL_LINEITEM_SRV", "ProfitabilitySet", params)


@router.post("/revenue")
async def get_revenue(request: Request, body: dict):
    """Maps to Claude tool: get_revenue_data"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    params = {
        "$select": "Period,NetRevenue,BillingDocumentType,SalesOrganization,Region",
        "$orderby": "Period desc",
        "$top": "100",
    }
    return await client.get("API_BILLING_DOCUMENT_SRV", "A_BillingDocumentItem", params)


@router.post("/cost-analysis")
async def get_cost_analysis(request: Request, body: dict):
    """Maps to Claude tool: get_cost_analysis"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    cost_center = body.get("cost_center", "")
    params = {
        "$select": "CostCenter,CostElement,ActualCosts,PlannedCosts,Variance,FiscalPeriod",
        "$filter": f"CostCenter eq '{cost_center}'" if cost_center else None,
    }
    params = {k: v for k, v in params.items() if v is not None}
    return await client.get("API_COSTCENTER_0101_SRV", "A_CostCenterActual", params)


@router.post("/gst-reconciliation")
async def get_gst_reconciliation(request: Request, body: dict):
    """Maps to Claude tool: get_gst_reconciliation"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    params = {
        "$select": "GSTIN,TaxPeriod,OutputTax,InputTax,NetLiability,ReconciliationStatus",
    }
    if body.get("period"):
        params["$filter"] = f"TaxPeriod eq '{body['period']}'"
    return await client.get("API_TAX_RECONCILIATION_SRV", "GSTReconciliationSet", params)
