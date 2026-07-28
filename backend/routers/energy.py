from fastapi import APIRouter
from database.connection import get_db

router = APIRouter(prefix="/energy", tags=["Energy Intelligence"])

@router.get("/metrics")
async def get_energy_metrics():
    db = get_db()
    if db is None:
        return {}

    bldgs = await db["buildings"].find().to_list(100)
    total_kw = sum(b.get("power_kw", 0) for b in bldgs)
    
    bldg_breakdown = [
        {"name": b.get("name"), "code": b.get("code"), "power_kw": b.get("power_kw", 0)}
        for b in bldgs
    ]
    
    return {
        "total_campus_power_kw": round(total_kw, 1),
        "peak_forecast_kw": round(total_kw * 1.25, 1),
        "solar_generation_kw": 45.8,
        "battery_storage_pct": 88.5,
        "energy_efficiency_score": 91.2,
        "building_breakdown": bldg_breakdown
    }
