from fastapi import APIRouter, HTTPException
from typing import List, Optional
from database.connection import get_db

from database.utils import clean_doc, clean_docs

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin Map"])

@router.get("/buildings")
async def get_buildings(category: Optional[str] = None):
    db = get_db()
    if db is None:
        return []
    
    query = {}
    if category and category != "all":
        query["category"] = category

    cursor = db["buildings"].find(query)
    buildings = await cursor.to_list(100)
    return clean_docs(buildings)

@router.get("/buildings/{building_id}")
async def get_building_detail(building_id: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    building = await db["buildings"].find_one({"id": building_id})
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    incidents = await db["incidents"].find({"location_building_id": building_id, "status": {"$ne": "Closed"}}).to_list(10)
    complaints = await db["complaints"].find({"location_building_id": building_id}).to_list(10)

    return {
        "building": clean_doc(building),
        "active_incidents": clean_docs(incidents),
        "recent_complaints": clean_docs(complaints)
    }
