from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database.connection import get_db

from database.utils import clean_doc, clean_docs

router = APIRouter(prefix="/complaints", tags=["Student Complaints Intelligence"])

class ComplaintCreate(BaseModel):
    student_name: str = "Student User"
    category: str
    location_building_id: str
    description: str

@router.get("")
async def get_complaints():
    db = get_db()
    if db is None:
        return []
    res = await db["complaints"].find().sort("created_at", -1).to_list(100)
    return clean_docs(res)

@router.post("")
async def submit_complaint(body: ComplaintCreate):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    b_doc = await db["buildings"].find_one({"id": body.location_building_id})
    location_name = b_doc.get("name", "Campus Location") if b_doc else "Hostel Block"

    complaint_id = f"CMP-{int(datetime.utcnow().timestamp())}"
    doc = {
        "id": complaint_id,
        "student_id": f"STU-{int(datetime.utcnow().timestamp()) % 1000}",
        "student_name": body.student_name,
        "category": body.category,
        "location_building_id": body.location_building_id,
        "location_name": location_name,
        "description": body.description,
        "priority": "High" if "no water" in body.description.lower() or "power" in body.description.lower() else "Medium",
        "status": "Open",
        "cluster_id": f"CLUST-{body.category.upper()}-01",
        "created_at": datetime.utcnow().isoformat()
    }
    await db["complaints"].insert_one(doc)

    # Count similar complaints in the cluster to check for AI deduplication / incident grouping threshold
    cluster_count = await db["complaints"].count_documents({
        "location_building_id": body.location_building_id,
        "category": body.category
    })

    if cluster_count >= 2:
        # Auto-create infrastructure incident from grouped complaints!
        inc_id = f"INC-CMP-{int(datetime.utcnow().timestamp())}"
        inc_doc = {
            "id": inc_id,
            "title": f"Grouped Complaint Incident: {body.category} at {location_name}",
            "description": f"AI grouped {cluster_count} student complaints regarding: {body.description}",
            "category": body.category,
            "location_building_id": body.location_building_id,
            "location_name": location_name,
            "severity": "High",
            "priority": "P2",
            "status": "Detected",
            "source": "Student Complaint AI Clustering",
            "timestamp": datetime.utcnow().isoformat(),
            "affected_resources": ["Building Services"],
            "affected_people_estimate": cluster_count * 25,
            "assigned_department": "Facility Operations",
            "timeline": [
                {
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "agent_or_user": "Complaint Clustering Engine",
                    "action": "Grouped Complaints into Incident",
                    "details": f"Correlated {cluster_count} complaints from {location_name}"
                }
            ]
        }
        await db["incidents"].insert_one(inc_doc)
        
        # Update complaints to Grouped status
        await db["complaints"].update_one({"id": complaint_id}, {"$set": {"status": "Grouped"}})

    return clean_doc(doc)
