from fastapi import APIRouter

router = APIRouter(prefix="/transport", tags=["Transport Intelligence"])

@router.get("/status")
async def get_transport_status():
    buses = [
        {"id": "BUS-01", "route": "Route #1 (Main Loop)", "driver": "David Miller", "status": "ON_SCHEDULE", "capacity_pct": 68, "lat": 12.971, "lng": 77.594, "next_stop": "Academic Complex"},
        {"id": "BUS-02", "route": "Route #1 (Main Loop)", "driver": "Sarah Jenkins", "status": "ON_SCHEDULE", "capacity_pct": 74, "lat": 12.975, "lng": 77.598, "next_stop": "Tech Park"},
        {"id": "BUS-03", "route": "Route #2 (Hostel Express)", "driver": "Michael Chang", "status": "DELAYED", "delay_min": 18, "capacity_pct": 140, "lat": 12.968, "lng": 77.590, "next_stop": "Hostel Block B"},
        {"id": "BUS-04", "route": "Route #3 (Sports Complex)", "driver": "Robert Vance", "status": "ON_SCHEDULE", "capacity_pct": 45, "lat": 12.980, "lng": 77.602, "next_stop": "Gymnasium"}
    ]
    return {
        "active_buses_count": len(buses),
        "fleet_on_time_pct": 75.0,
        "total_passengers_hourly": 540,
        "buses": buses
    }
