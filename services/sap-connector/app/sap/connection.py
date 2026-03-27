"""Tenant SAP connection configuration manager."""
from dataclasses import dataclass
from typing import Literal


@dataclass
class SapConfig:
    base_url: str          # e.g. https://s4hana-host:443
    username: str
    password: str
    client: str            # SAP client, e.g. "100"
    conn_type: Literal["odata", "rfc"] = "odata"
    verify_ssl: bool = True


def config_from_headers(headers: dict) -> SapConfig | None:
    """Extract per-tenant SAP config injected by Next.js as request headers.

    Next.js injects:
      X-SAP-URL, X-SAP-USER, X-SAP-PASS, X-SAP-CLIENT, X-SAP-CONN-TYPE
    These come from the encrypted tenant config stored in Postgres.
    """
    url = headers.get("x-sap-url") or headers.get("X-SAP-URL")
    user = headers.get("x-sap-user") or headers.get("X-SAP-USER")
    password = headers.get("x-sap-pass") or headers.get("X-SAP-PASS")
    client = headers.get("x-sap-client") or headers.get("X-SAP-CLIENT") or "100"
    conn_type = headers.get("x-sap-conn-type") or headers.get("X-SAP-CONN-TYPE") or "odata"

    if not (url and user and password):
        return None

    return SapConfig(
        base_url=url.rstrip("/"),
        username=user,
        password=password,
        client=client,
        conn_type=conn_type,  # type: ignore[arg-type]
    )
