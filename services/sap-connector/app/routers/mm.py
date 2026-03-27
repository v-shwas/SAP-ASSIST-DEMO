"""MM router — inventory, suppliers."""
from fastapi import APIRouter, Request
from app.sap.odata_client import ODataClient
from app.sap.connection import config_from_headers

router = APIRouter(prefix="/mm", tags=["MM"])


def _get_client(request: Request) -> ODataClient | None:
    cfg = config_from_headers(dict(request.headers))
    return ODataClient(cfg) if cfg else None


@router.post("/inventory")
async def get_inventory_levels(request: Request, body: dict):
    """Maps to Claude tool: get_inventory_levels"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    filters = []
    if body.get("material") and body["material"] != "all":
        filters.append(f"Material eq '{body['material']}'")
    if body.get("plant") and body["plant"] != "all":
        filters.append(f"Plant eq '{body['plant']}'")
    if body.get("alert_only"):
        # Stock below MRP safety stock
        filters.append("UnrestrictedQty lt SafetyStock")

    params = {
        "$select": "Material,MaterialName,Plant,UnrestrictedQty,SafetyStock,BaseUnit",
        "$top": "100",
    }
    if filters:
        params["$filter"] = " and ".join(filters)

    return await client.get("API_MATERIAL_STOCK_SRV", "MaterialStockSet", params)


@router.post("/suppliers")
async def get_supplier_info(request: Request, body: dict):
    """Maps to Claude tool: get_supplier_info"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    params = {
        "$select": "Supplier,SupplierName,PurchaseOrganization,Country,PaymentTerms",
        "$top": "50",
    }
    if body.get("vendor_id"):
        params["$filter"] = f"Supplier eq '{body['vendor_id']}'"

    return await client.get("API_BUSINESS_PARTNER", "A_Supplier", params)
