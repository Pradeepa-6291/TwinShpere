from fastapi import APIRouter, HTTPException
from datetime import datetime
from database.connection import get_db
from agents.orchestrator import orchestrator
from services.websocket_manager import manager as ws_manager

router = APIRouter(prefix="/scenarios", tags=["Interactive Demo Scenarios"])

@router.post("/trigger/{scenario_id}")
async def trigger_demo_scenario(scenario_id: int):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    import asyncio

    if scenario_id == 1:
        # SCENARIO 1: Water Pump Malfunction & Cascading Hostel Shortage (Full Demo Story)
        bldgs = ["BLDG-05", "BLDG-03"] # Water plant & Hostel B
        await db["buildings"].update_one({"id": "BLDG-05"}, {"$set": {"status": "RED", "water_flow_lpm": 0.0, "power_kw": 48.2}})
        await db["buildings"].update_one({"id": "BLDG-03"}, {"$set": {"status": "ORANGE", "water_flow_lpm": 1.2}})

        inc_doc = {
            "id": f"INC-SCENARIO-1",
            "title": "Water Treatment Plant Main Pump Cavitation & Failure",
            "description": "Auxiliary Water Pump #2 bearing seized. Flow dropped to 0 LPM. Hostel Block B water reserve depleting in 45 minutes.",
            "category": "Water",
            "location_building_id": "BLDG-05",
            "location_name": "Central Campus Water Treatment Plant",
            "severity": "Critical",
            "priority": "P1",
            "status": "Detected",
            "source": "IoT Sensor Anomaly",
            "timestamp": datetime.utcnow().isoformat(),
            "affected_resources": ["Water Treatment Plant", "Hostel Block B", "Central Cafeteria"],
            "affected_people_estimate": 850,
            "assigned_department": "Facility Management",
            "timeline": [
                {
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "agent_or_user": "Scenario Controller",
                    "action": "Triggered Demo Scenario 1 (Water Pump Malfunction)",
                    "details": "Telemetry simulated zero water flow at main outlet valve."
                }
            ]
        }
        await db["incidents"].insert_one(inc_doc)
        
        await ws_manager.broadcast({
            "type": "DEMO_SCENARIO_ACTIVATED",
            "data": {"scenario_id": 1, "name": "Water Pump Malfunction", "incident": inc_doc}
        })

        asyncio.create_task(orchestrator.run_workflow(inc_doc))
        return {"status": "SUCCESS", "scenario_id": 1, "message": "Demo Scenario 1 Activated: Water Pump Malfunction"}

    elif scenario_id == 2:
        # SCENARIO 2: Main Substation Energy Anomaly
        await db["buildings"].update_one({"id": "BLDG-04"}, {"$set": {"status": "RED", "power_kw": 245.0}})
        inc_doc = {
            "id": f"INC-SCENARIO-2",
            "title": "Main Substation Transformer Phase Overload",
            "description": "Power consumption spiked to 245 kW (+45% above peak threshold). Transformer coil temperature rising rapidly.",
            "category": "Energy",
            "location_building_id": "BLDG-04",
            "location_name": "Central Substation & Solar Array",
            "severity": "High",
            "priority": "P1",
            "status": "Detected",
            "source": "Power Telemetry Anomaly",
            "timestamp": datetime.utcnow().isoformat(),
            "affected_resources": ["Substation Busbar A", "Tech Park HVAC"],
            "affected_people_estimate": 1400,
            "assigned_department": "Energy Operations",
            "timeline": [
                {
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "agent_or_user": "Scenario Controller",
                    "action": "Triggered Demo Scenario 2 (Energy Anomaly)",
                    "details": "Simulated power spike on main grid feed."
                }
            ]
        }
        await db["incidents"].insert_one(inc_doc)
        asyncio.create_task(orchestrator.run_workflow(inc_doc))
        return {"status": "SUCCESS", "scenario_id": 2, "message": "Demo Scenario 2 Activated: Energy Anomaly"}

    elif scenario_id == 3:
        # SCENARIO 3: Bus Delay & Overcrowding
        await db["buildings"].update_one({"id": "BLDG-06"}, {"$set": {"status": "ORANGE"}})
        inc_doc = {
            "id": f"INC-SCENARIO-3",
            "title": "Route #2 Bus Breakdown & Terminal Overcrowding",
            "description": "Bus #03 transmission fault on South Loop. Terminal crowd density reached 145% capacity.",
            "category": "Transport",
            "location_building_id": "BLDG-06",
            "location_name": "Central Bus Hub & Depot",
            "severity": "Medium",
            "priority": "P2",
            "status": "Detected",
            "source": "GPS Telemetry & Transit AI",
            "timestamp": datetime.utcnow().isoformat(),
            "affected_resources": ["Shuttle Bus #03", "Bus Hub Terminal"],
            "affected_people_estimate": 420,
            "assigned_department": "Transport Management",
            "timeline": [
                {
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "agent_or_user": "Scenario Controller",
                    "action": "Triggered Demo Scenario 3 (Transport Disruption)",
                    "details": "Simulated transit delay and passenger overcrowding."
                }
            ]
        }
        await db["incidents"].insert_one(inc_doc)
        asyncio.create_task(orchestrator.run_workflow(inc_doc))
        return {"status": "SUCCESS", "scenario_id": 3, "message": "Demo Scenario 3 Activated: Transport Disruption"}

    elif scenario_id == 4:
        # SCENARIO 4: Security Anomaly
        await db["buildings"].update_one({"id": "BLDG-02"}, {"$set": {"status": "ORANGE"}})
        inc_doc = {
            "id": f"INC-SCENARIO-4",
            "title": "Unauthorized Access Attempt at Quantum Computing Lab",
            "description": "Perimeter sensor trip and invalid badge scan sequence in restricted Bio-AI server wing.",
            "category": "Security",
            "location_building_id": "BLDG-02",
            "location_name": "Advanced Research & AI Tech Park",
            "severity": "High",
            "priority": "P1",
            "status": "Detected",
            "source": "Access Control Security System",
            "timestamp": datetime.utcnow().isoformat(),
            "affected_resources": ["Tech Park Wing B Access Control"],
            "affected_people_estimate": 45,
            "assigned_department": "Campus Security",
            "timeline": [
                {
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "agent_or_user": "Scenario Controller",
                    "action": "Triggered Demo Scenario 4 (Security Anomaly)",
                    "details": "Simulated unauthorized door access sequence."
                }
            ]
        }
        await db["incidents"].insert_one(inc_doc)
        asyncio.create_task(orchestrator.run_workflow(inc_doc))
        return {"status": "SUCCESS", "scenario_id": 4, "message": "Demo Scenario 4 Activated: Security Anomaly"}

    elif scenario_id == 5:
        # SCENARIO 5: Emergency Crowd Incident
        await db["buildings"].update_one({"id": "BLDG-07"}, {"$set": {"status": "RED", "occupancy_current": 1150}})
        inc_doc = {
            "id": f"INC-SCENARIO-5",
            "title": "Auditorium Exit Congestion & Crowd Bottleneck",
            "description": "Emergency exit door latch failure during symposium conclusion. High crowd density at Gate 2.",
            "category": "Emergency",
            "location_building_id": "BLDG-07",
            "location_name": "Grand Auditorium & Convention Center",
            "severity": "Critical",
            "priority": "P1",
            "status": "Detected",
            "source": "Camera Crowd Density AI",
            "timestamp": datetime.utcnow().isoformat(),
            "affected_resources": ["Auditorium Gate 2", "Safety Response Squad"],
            "affected_people_estimate": 1150,
            "assigned_department": "Emergency Response",
            "timeline": [
                {
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "agent_or_user": "Scenario Controller",
                    "action": "Triggered Demo Scenario 5 (Emergency Crowd Incident)",
                    "details": "Simulated egress bottleneck at Auditorium."
                }
            ]
        }
        await db["incidents"].insert_one(inc_doc)
        asyncio.create_task(orchestrator.run_workflow(inc_doc))
        return {"status": "SUCCESS", "scenario_id": 5, "message": "Demo Scenario 5 Activated: Emergency Crowd Incident"}

    else:
        # SCENARIO 6: Cascading Infrastructure Failure
        await db["buildings"].update_one({"id": "BLDG-04"}, {"$set": {"status": "RED"}})
        await db["buildings"].update_one({"id": "BLDG-01"}, {"$set": {"status": "RED"}})
        inc_doc = {
            "id": f"INC-SCENARIO-6",
            "title": "Cascading Grid Power Failure & Backup Cutover",
            "description": "Main utility supply trip cascading into Academic Complex sub-panels. Backup generator delayed.",
            "category": "Energy",
            "location_building_id": "BLDG-04",
            "location_name": "Central Substation & Solar Array",
            "severity": "Critical",
            "priority": "P1",
            "status": "Detected",
            "source": "Infrastructure Failure Sensor",
            "timestamp": datetime.utcnow().isoformat(),
            "affected_resources": ["Academic Complex", "Research Tech Park"],
            "affected_people_estimate": 2200,
            "assigned_department": "Operations Command",
            "timeline": [
                {
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "agent_or_user": "Scenario Controller",
                    "action": "Triggered Demo Scenario 6 (Cascading Failure)",
                    "details": "Simulated multi-substation trip."
                }
            ]
        }
        await db["incidents"].insert_one(inc_doc)
        asyncio.create_task(orchestrator.run_workflow(inc_doc))
        return {"status": "SUCCESS", "scenario_id": 6, "message": "Demo Scenario 6 Activated: Cascading Failure"}
