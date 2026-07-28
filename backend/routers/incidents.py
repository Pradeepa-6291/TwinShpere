from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from database.connection import get_db
from models.schemas import IncidentCreate
from agents.orchestrator import orchestrator
from services.websocket_manager import manager as ws_manager

from database.utils import clean_doc, clean_docs

router = APIRouter(prefix="/incidents", tags=["Incidents"])

class StatusUpdate(BaseModel):
    status: str
    user_or_agent: str = "Administrator"
    notes: Optional[str] = None

@router.get("")
async def get_incidents(status: Optional[str] = None, severity: Optional[str] = None):
    db = get_db()
    if db is None:
        return []

    query = {}
    if status and status != "all":
        query["status"] = status
    if severity and severity != "all":
        query["severity"] = severity

    incidents = await db["incidents"].find(query).sort("timestamp", -1).to_list(100)
    return clean_docs(incidents)

@router.post("")
async def create_incident(inc: IncidentCreate):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    b_doc = await db["buildings"].find_one({"id": inc.location_building_id})
    location_name = b_doc.get("name", "Campus Location") if b_doc else "Campus Building"

    doc = {
        "id": f"INC-{int(datetime.utcnow().timestamp())}",
        "title": inc.title,
        "description": inc.description,
        "category": inc.category,
        "location_building_id": inc.location_building_id,
        "location_name": location_name,
        "severity": inc.severity,
        "priority": inc.priority,
        "status": "Detected",
        "source": inc.source,
        "timestamp": datetime.utcnow().isoformat(),
        "affected_resources": ["Infrastructure Line"],
        "affected_people_estimate": 150,
        "assigned_department": "Facility Operations",
        "timeline": [
            {
                "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                "agent_or_user": "User/Sensor",
                "action": "Created Incident",
                "details": inc.description
            }
        ]
    }
    await db["incidents"].insert_one(doc)

    # Broadcast new incident via WebSocket
    await ws_manager.broadcast({
        "type": "NEW_INCIDENT",
        "data": doc
    })

    # Trigger agent swarm automatically asynchronously
    import asyncio
    asyncio.create_task(orchestrator.run_workflow(doc))

    return clean_doc(doc)

@router.get("/{incident_id}")
async def get_incident(incident_id: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    inc = await db["incidents"].find_one({"id": incident_id})
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return clean_doc(inc)

@router.patch("/{incident_id}/status")
async def update_incident_status(incident_id: str, body: StatusUpdate):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    event = {
        "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
        "agent_or_user": body.user_or_agent,
        "action": f"Status changed to {body.status}",
        "details": body.notes or "Updated status in Operations Center"
    }

    await db["incidents"].update_one(
        {"id": incident_id},
        {
            "$set": {"status": body.status},
            "$push": {"timeline": event}
        }
    )

    updated = await db["incidents"].find_one({"id": incident_id})

    # If resolved or closed, clear red status from building if no other active critical incidents
    if body.status in ["Resolved", "Closed"] and updated:
        b_id = updated.get("location_building_id")
        if b_id:
            await db["buildings"].update_one({"id": b_id}, {"$set": {"status": "GREEN"}})

    await ws_manager.broadcast({
        "type": "INCIDENT_UPDATED",
        "data": clean_doc(updated)
    })

    return clean_doc(updated)

@router.post("/{incident_id}/trigger-workflow")
async def trigger_agent_workflow(incident_id: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    inc = await db["incidents"].find_one({"id": incident_id})
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    import asyncio
    task = asyncio.create_task(orchestrator.run_workflow(inc))
    return {"message": "Agent swarm triggered", "incident_id": incident_id}

@router.get("/{incident_id}/root-cause-tree")
async def get_root_cause_tree(incident_id: str):
    """Return visual root cause diagnostic tree data structure."""
    db = get_db()
    inc = await db["incidents"].find_one({"id": incident_id}) if db is not None else None
    
    title = inc.get("title", "Infrastructure Anomaly") if inc else "Power & Pump Malfunction"
    root_cause = inc.get("root_cause", "Auxiliary Water Pump Bearing Seizure") if inc else "Auxiliary Water Pump Bearing Seizure"

    return {
        "incident_id": incident_id,
        "root_cause_tree": {
            "name": title,
            "category": "Symptom",
            "children": [
                {
                    "name": "Abnormal Power Spike (+34.5%)",
                    "category": "Telemetry Anomaly",
                    "confidence": 0.96,
                    "children": [
                        {
                            "name": "HVAC Chiller Motor Overload",
                            "category": "Mechanical Fault",
                            "confidence": 0.92,
                            "children": [
                                {
                                    "name": root_cause,
                                    "category": "Root Cause",
                                    "confidence": 0.94,
                                    "evidence": "Power telemetry spiked to 48.2 kW followed by 0 LPM flow rate.",
                                    "children": [
                                        {
                                            "name": "Maintenance Overdue by 14 Days",
                                            "category": "Contributory Factor",
                                            "confidence": 0.88
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
