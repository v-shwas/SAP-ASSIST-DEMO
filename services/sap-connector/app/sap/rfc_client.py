"""RFC/BAPI client wrapper for SAP ECC.

pyrfc requires the SAP NetWeaver RFC SDK to be installed on the host.
When USE_MOCK_SAP=true or pyrfc is not installed, this module is a no-op.
"""
from typing import Any


def _pyrfc_available() -> bool:
    try:
        import pyrfc  # noqa: F401
        return True
    except ImportError:
        return False


class RfcClient:
    """Wrapper around pyrfc.Connection for calling SAP BAPIs and function modules."""

    def __init__(self, ashost: str, sysnr: str, client: str, user: str, passwd: str):
        if not _pyrfc_available():
            raise RuntimeError(
                "pyrfc is not installed. Install it together with the SAP NW RFC SDK "
                "to use RFC/BAPI connectivity. See services/sap-connector/README.md."
            )
        import pyrfc
        self._conn = pyrfc.Connection(
            ashost=ashost,
            sysnr=sysnr,
            client=client,
            user=user,
            passwd=passwd,
        )

    def call(self, fm_name: str, **kwargs: Any) -> dict[str, Any]:
        """Call a SAP function module/BAPI and return the result dict."""
        return self._conn.call(fm_name, **kwargs)

    def close(self) -> None:
        self._conn.close()
