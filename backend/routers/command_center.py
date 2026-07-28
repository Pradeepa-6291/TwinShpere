from fastapi import APIRouter
from database.connection import get_db

router = APIRouter(prefix="/command-center", tags=["Command Center"])

@router.get("/summary")
async def get_command_center_summary():
    db = get_db()
    if db is None:
        return {}

    bldgs = await db["buildings"].find().to_list(100)
    incidents = await db["incidents"].find({"status": {"$ne": "Closed"}}).to_list(100)
    predictions = await db["predictions"].find().to_list(100)
    approvals = await db["approvals"].find({"status": "PENDING"}).to_list(100)
    resources = await db["resources"].find({"status": "AVAILABLE"}).to_list(100)
    agent_runs = await db["agent_runs"].find().to_list(100)

    total_power = sum(b.get("power_kw", 0) for b in bldgs)
    total_water = sum(b.get("water_flow_lpm", 0) for b in bldgs)
    total_occ = sum(b.get("occupancy_current", 0) for b in bldgs)
    total_cap = sum(b.get("occupancy_capacity", 1) for b in bldgs)

    # Campus Health Score Calculation
    critical_incidents = sum(1 for i in incidents if i.get("severity") == "Critical")
    high_incidents = sum(1 for i in incidents if i.get("severity") == "High")
    health_score = max(35, 100 - (critical_incidents * 20 + high_incidents * 10 + len(incidents) * 3))

    return {
        "campus_health_score": round(health_score, 1),
        "health_status": "OPTIMAL" if health_score > 85 else "WARNING" if health_score > 65 else "CRITICAL",
        "active_incidents_count": len(incidents),
        "critical_alerts_count": critical_incidents,
        "predicted_incidents_count": len(predictions),
        "pending_approvals_count": len(approvals),
        "available_resources_count": len(resources),
        "active_agent_runs_count": len(agent_runs),
        "total_power_kw": round(total_power, 1),
        "total_water_lpm": round(total_water, 1),
        "total_occupancy": total_occ,
        "occupancy_capacity": total_cap,
        "occupancy_rate_pct": round((total_occ / total_cap) * 100, 1) if total_cap > 0 else 0,
        "buses_online": 8,
        "on_time_performance_pct": 94.2
    }
