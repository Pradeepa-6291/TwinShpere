from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database.connection import get_db
from services.websocket_manager import manager as ws_manager

from database.utils import clean_doc, clean_docs

router = APIRouter(prefix="/approvals", tags=["Approvals Center"])

class ActionDecision(BaseModel):
    approver_name: str = "Dr. Aris Thorne"
    notes: Optional[str] = "Approved by Administrator in Operations Command"

@router.get("")
async def get_approvals(status: Optional[str] = None):
    db = get_db()
    if db is None:
        return []

    query = {}
    if status:
        query["status"] = status
    approvals = await db["approvals"].find(query).sort("created_at", -1).to_list(50)
    return clean_docs(approvals)

@router.post("/{approval_id}/approve")
async def approve_action(approval_id: str, body: ActionDecision):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    app = await db["approvals"].find_one({"id": approval_id})
    if not app:
        raise HTTPException(status_code=404, detail="Approval request not found")

    await db["approvals"].update_one(
        {"id": approval_id},
        {
            "$set": {
                "status": "APPROVED",
                "approved_by": body.approver_name,
                "decision_timestamp": datetime.utcnow().isoformat(),
                "notes": body.notes
            }
        }
    )

    inc_id = app.get("incident_id")
    if inc_id:
        event = {
            "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
            "agent_or_user": f"Human Approval ({body.approver_name})",
            "action": f"Approved Action: {app.get('action_title')}",
            "details": f"Dispatching resources: {', '.join(app.get('target_resources', []))}"
        }
        await db["incidents"].update_one(
            {"id": inc_id},
            {
                "$set": {"status": "Action In Progress"},
                "$push": {"timeline": event}
            }
        )

    updated = await db["approvals"].find_one({"id": approval_id})

    # Broadcast real-time websocket update
    await ws_manager.broadcast({
        "type": "APPROVAL_DECISION",
        "data": clean_doc(updated)
    })

    return clean_doc(updated)

@router.post("/{approval_id}/reject")
async def reject_action(approval_id: str, body: ActionDecision):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    await db["approvals"].update_one(
        {"id": approval_id},
        {
            "$set": {
                "status": "REJECTED",
                "approved_by": body.approver_name,
                "decision_timestamp": datetime.utcnow().isoformat(),
                "notes": body.notes
            }
        }
    )
    updated = await db["approvals"].find_one({"id": approval_id})

    await ws_manager.broadcast({
        "type": "APPROVAL_DECISION",
        "data": clean_doc(updated)
    })

    return clean_doc(updated)
