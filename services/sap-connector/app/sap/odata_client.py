"""Async OData V2/V4 client for SAP S/4HANA."""
from typing import Any
import httpx
from app.sap.connection import SapConfig


class ODataClient:
    """Thin async wrapper around SAP OData services."""

    def __init__(self, config: SapConfig):
        self._config = config
        self._base = config.base_url
        self._auth = (config.username, config.password)
        self._client_header = {"sap-client": config.client}

    async def get(
        self,
        service_path: str,
        entity_set: str,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """GET an OData entity set. Returns parsed JSON."""
        url = f"{self._base}/sap/opu/odata/sap/{service_path}/{entity_set}"
        query = {"$format": "json", **(params or {})}

        async with httpx.AsyncClient(
            auth=self._auth,
            headers=self._client_header,
            verify=self._config.verify_ssl,
            timeout=30,
        ) as client:
            resp = await client.get(url, params=query)
            resp.raise_for_status()
            return resp.json()

    async def post(
        self,
        service_path: str,
        entity_set: str,
        body: dict[str, Any],
    ) -> dict[str, Any]:
        url = f"{self._base}/sap/opu/odata/sap/{service_path}/{entity_set}"
        async with httpx.AsyncClient(
            auth=self._auth,
            headers={**self._client_header, "Content-Type": "application/json"},
            verify=self._config.verify_ssl,
            timeout=30,
        ) as client:
            resp = await client.post(url, json=body, params={"$format": "json"})
            resp.raise_for_status()
            return resp.json()
