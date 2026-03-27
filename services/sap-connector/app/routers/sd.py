"""SD router — sales orders, shipments, returns."""
from fastapi import APIRouter, Request
from app.sap.odata_client import ODataClient
from app.sap.connection import config_from_headers

router = APIRouter(prefix="/sd", tags=["SD"])


def _get_client(request: Request) -> ODataClient | None:
    cfg = config_from_headers(dict(request.headers))
    return ODataClient(cfg) if cfg else None


@router.post("/orders")
async def get_order_status(request: Request, body: dict):
    """Maps to Claude tool: get_order_status"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    filters = []
    if body.get("order_id"):
        filters.append(f"SalesOrder eq '{body['order_id']}'")
    if body.get("status_filter") and body["status_filter"] != "all":
        status_map = {"open": "A", "delivered": "C", "billed": "D"}
        code = status_map.get(body["status_filter"], "A")
        filters.append(f"OverallSDProcessStatus eq '{code}'")

    params = {
        "$select": "SalesOrder,SoldToParty,NetAmount,TransactionCurrency,OverallSDProcessStatus,CreationDate",
        "$top": str(body.get("limit", 20)),
        "$orderby": "CreationDate desc",
    }
    if filters:
        params["$filter"] = " and ".join(filters)

    return await client.get("API_SALES_ORDER_SRV", "A_SalesOrder", params)


@router.post("/shipments")
async def get_shipment_tracking(request: Request, body: dict):
    """Maps to Claude tool: get_shipment_tracking"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    params = {
        "$select": "DeliveryDocument,SalesOrder,ShippingCondition,DeliveryDate,ActualGoodsMovementDate,OverallGoodsMovementStatus",
        "$top": "50",
        "$orderby": "DeliveryDate desc",
    }
    if body.get("delivery_id"):
        params["$filter"] = f"DeliveryDocument eq '{body['delivery_id']}'"

    return await client.get("API_OUTBOUND_DELIVERY_SRV", "A_OutbDeliveryHeader", params)


@router.post("/returns")
async def get_return_orders(request: Request, body: dict):
    """Maps to Claude tool: get_return_order_info"""
    client = _get_client(request)
    if client is None:
        return {"error": "No SAP config provided"}

    params = {
        "$select": "ReturnOrder,SalesOrder,ReturnReason,NetAmount,OverallSDProcessStatus,CreationDate",
        "$filter": "SalesDocumentType eq 'RE'",
        "$top": "50",
        "$orderby": "CreationDate desc",
    }
    return await client.get("API_SALES_ORDER_SRV", "A_SalesOrder", params)
