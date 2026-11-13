import os
import logging
from typing import Any, Dict, List, Optional

try:
    from supabase import create_client, Client  # type: ignore
except ImportError:
    # Supabase library may not be installed in demo mode
    Client = Any  # type: ignore
    def create_client(*_, **__):
        raise RuntimeError("Supabase client not available")

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def get_client() -> Optional[Client]:
    if SUPABASE_URL and SUPABASE_ANON_KEY:
        try:
            client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
            return client
        except Exception as e:
            logger.error(f"Failed to create Supabase client: {e}")
            return None
    logger.info("Supabase credentials not set; running in demo mode.")
    return None

client = get_client()

def save_report(user_id: str, report_data: Dict[str, Any]) -> Dict[str, Any]:
    """Insert a report record for the given user.

    Expected ``report_data`` keys: ``filename``, ``extraction_method``, ``report_title``,
    ``summary``, ``gemini_results`` (JSON), ``created_at`` (ISO timestamp).
    """
    if not client:
        raise RuntimeError("Supabase not configured")
    payload = {"user_id": user_id, **report_data}
    resp = client.table("reports").insert(payload).execute()
    if resp.get("error"):
        raise RuntimeError(f"Supabase insert error: {resp['error']}")
    return resp.get("data", [{}])[0]

def delete_report(user_id: str, report_id: str) -> None:
    if not client:
        raise RuntimeError("Supabase not configured")
    resp = (
        client.table("reports")
        .delete()
        .eq("id", report_id)
        .eq("user_id", user_id)
        .execute()
    )
    if resp.get("error"):
        raise RuntimeError(f"Supabase delete error: {resp['error']}")

def list_reports(user_id: str) -> List[Dict[str, Any]]:
    if not client:
        return []
    resp = client.table("reports").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    if resp.get("error"):
        logger.error(f"Supabase list error: {resp['error']}")
        return []
    return resp.get("data", [])
