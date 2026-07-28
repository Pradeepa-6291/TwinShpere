import asyncio
import logging
from datetime import datetime
from database.connection import get_db

logger = logging.getLogger("twinsphere.seed")

async def seed_database(force_reseed: bool = True):
    db = get_db()
    if db is None:
        logger.warning("Database unavailable for seeding.")
        return

    # Check existing count
    existing_bldgs = await db["buildings"].count_documents({})
    if existing_bldgs >= 50 and not force_reseed:
        logger.info(f"Database already populated with {existing_bldgs} buildings.")
        return

    logger.info("Seeding database with 50+ unique records per collection for production-grade operational simulation...")

    # Clear existing collections for a clean, non-duplicated 50+ dataset if force_reseed
    if force_reseed:
        for col_name in ["buildings", "users", "resources", "historical_incidents", "predictions", "complaints", "incidents"]:
            await db[col_name].delete_many({})

    # 1. 50+ UNIQUE CAMPUS BUILDINGS
    categories = ["Academic", "Hostel", "Lab", "Substation", "Facility", "Transport", "Admin", "Dining", "Sports"]
    statuses = ["GREEN", "GREEN", "GREEN", "GREEN", "YELLOW", "ORANGE", "RED", "BLUE"]
    
    bldg_names = [
        ("Academic Complex Block A", "AC-A", "Academic", 25, 35),
        ("Academic Complex Block B", "AC-B", "Academic", 30, 40),
        ("Academic Complex Block C", "AC-C", "Academic", 35, 42),
        ("Advanced Research & AI Tech Park", "TP-01", "Lab", 55, 30),
        ("Bio-Engineering Research Wing", "BIO-01", "Lab", 60, 25),
        ("Quantum Computing & Robotics Lab", "QNT-01", "Lab", 65, 28),
        ("Hostel Block A (North)", "HST-A", "Hostel", 70, 60),
        ("Hostel Block B (Residential)", "HST-B", "Hostel", 75, 65),
        ("Hostel Block C (South)", "HST-C", "Hostel", 80, 70),
        ("Hostel Block D (International)", "HST-D", "Hostel", 85, 75),
        ("Central Substation & Solar Array", "PWR-01", "Substation", 15, 70),
        ("Secondary Transformer Vault East", "PWR-02", "Substation", 20, 80),
        ("Central Campus Water Treatment Plant", "WTR-01", "Facility", 80, 20),
        ("Auxiliary Pumping Station West", "WTR-02", "Facility", 85, 30),
        ("Central Bus Hub & Depot", "TRN-01", "Transport", 40, 80),
        ("North Transit Terminal", "TRN-02", "Transport", 45, 15),
        ("Grand Auditorium & Convention Center", "AUD-01", "Academic", 45, 50),
        ("Student Activity Center & Dining Hall", "SAC-01", "Facility", 60, 55),
        ("Central Campus Library & Knowledge Hub", "LIB-01", "Academic", 50, 45),
        ("Administration Headquarters", "ADM-01", "Admin", 20, 20),
        ("Campus Health & Emergency Medical Center", "MED-01", "Facility", 15, 45),
        ("Indoor Sports Complex & Gymnasium", "GYM-01", "Sports", 90, 80),
        ("Olympic Athletic Stadium", "STD-01", "Sports", 95, 85),
        ("High-Performance Data Center", "DC-01", "Lab", 50, 25),
        ("Chemical Engineering Experimental Facility", "CHM-01", "Lab", 55, 15),
        ("Aerospace Wind Tunnel Facility", "AERO-01", "Lab", 65, 15),
        ("Nanotechnology Cleanroom Complex", "NANO-01", "Lab", 70, 20),
        ("Graduate Student Housing Tower 1", "HST-E", "Hostel", 75, 80),
        ("Graduate Student Housing Tower 2", "HST-F", "Hostel", 80, 85),
        ("Faculty Residential Enclave Block A", "FAC-A", "Hostel", 10, 30),
        ("Faculty Residential Enclave Block B", "FAC-B", "Hostel", 12, 35),
        ("Central Cafeteria & Food Court", "CAF-01", "Dining", 62, 50),
        ("North Campus Dining Hall", "CAF-02", "Dining", 68, 45),
        ("South Campus Dining Hall", "CAF-03", "Dining", 78, 60),
        ("Multi-Level Parking Complex East", "PRK-01", "Transport", 30, 90),
        ("Multi-Level Parking Complex West", "PRK-02", "Transport", 10, 80),
        ("Facilities Operations Depot & Workshop", "MAINT-01", "Facility", 85, 90),
        ("Hazardous Material Storage Unit", "HAZ-01", "Facility", 90, 15),
        ("Campus Security Control Headquarters", "SEC-01", "Admin", 18, 50),
        ("Astronomical Observatory Tower", "OBS-01", "Lab", 5, 15),
        ("Environmental Science Greenhouse", "GRN-01", "Lab", 88, 40),
        ("Civil Engineering Structural Testing Yard", "CIV-01", "Lab", 40, 30),
        ("Electrical Engineering Power Systems Lab", "EE-01", "Lab", 22, 60),
        ("Mechanical Engineering Thermal Plant Lab", "ME-01", "Lab", 28, 65),
        ("School of Management & Business Complex", "SOM-01", "Academic", 32, 25),
        ("Humanities & Performing Arts Center", "HSS-01", "Academic", 38, 35),
        ("Campus Mail & Logistics Distribution Hub", "LOG-01", "Facility", 42, 85),
        ("Renewable Hydrogen Test Facility", "H2-01", "Substation", 8, 70),
        ("Chilled Water Loop Central Plant", "CHIL-01", "Facility", 72, 35),
        ("Microgrid Battery Storage Station", "BAT-01", "Substation", 12, 75)
    ]

    buildings = []
    for i, (name, code, cat, x, y) in enumerate(bldg_names):
        status = "RED" if i == 4 or i == 12 else "ORANGE" if i in [7, 14, 23] else "YELLOW" if i in [2, 10, 31] else "GREEN"
        power = round(15.0 + (i * 3.4) % 180, 1)
        water = round(5.0 + (i * 4.2) % 110, 1)
        temp = round(20.0 + (i * 0.3) % 12, 1)
        cap = 100 + (i * 30) % 800
        occ = int(cap * (0.4 + (i * 0.01) % 0.55))

        buildings.append({
            "id": f"BLDG-{i+1:02d}",
            "name": name,
            "code": code,
            "category": cat,
            "coordinates": {"x": x, "y": y},
            "status": status,
            "occupancy_current": occ,
            "occupancy_capacity": cap,
            "power_kw": power,
            "water_flow_lpm": water,
            "temperature_c": temp,
            "active_incidents_count": 1 if status in ["RED", "ORANGE"] else 0,
            "predicted_risk_level": "High" if status == "RED" else "Medium" if status == "ORANGE" else "Low",
            "last_updated": datetime.utcnow().isoformat()
        })
    await db["buildings"].insert_many(buildings)

    # 2. 50+ UNIQUE USERS
    roles_pool = ["Super Admin", "Administrator", "Department Head", "Facility Manager", "Security Officer", "Transport Manager", "Energy Manager", "Faculty", "Student", "Viewer"]
    depts = ["Campus Operations Command", "Physical Plant & Engineering", "Sustainability & Power", "Campus Security", "Transport Services", "Computer Science", "Electrical Engineering", "Civil Engineering", "Student Council"]
    
    first_names = ["Aris", "Elena", "Marcus", "Priya", "David", "Sarah", "Michael", "Robert", "Jennifer", "James", "Patricia", "John", "Linda", "William", "Elizabeth", "Richard", "Barbara", "Joseph", "Susan", "Thomas", "Jessica", "Charles", "Sarah", "Christopher", "Karen"]
    last_names = ["Thorne", "Rostova", "Vance", "Sharma", "Miller", "Jenkins", "Chang", "Vance", "Davis", "Wilson", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee"]

    users = []
    for i in range(50):
        fn = first_names[i % len(first_names)]
        ln = last_names[(i * 3) % len(last_names)]
        role = roles_pool[i % len(roles_pool)]
        dept = depts[i % len(depts)]

        users.append({
            "id": f"USR-{i+1:02d}",
            "username": f"user_{i+1:02d}" if i > 3 else ["admin", "facility_mgr", "energy_mgr", "student_lead"][i],
            "email": f"user{i+1}@twinsphere.edu",
            "full_name": f"Dr. {fn} {ln}" if i < 15 else f"{fn} {ln}",
            "role": role,
            "department": dept,
            "created_at": datetime.utcnow().isoformat()
        })
    await db["users"].insert_many(users)

    # 3. 50+ UNIQUE RESOURCES
    res_cats = ["Technician", "Equipment", "Bus", "Emergency", "Staff"]
    skills_pool = [
        ["HVAC", "Plumbing", "Pump Repair"],
        ["Substation", "High Voltage", "Transformer"],
        ["Access Control", "Evacuation", "First Aid"],
        ["Transit", "High Capacity", "Route Navigation"],
        ["Chiller Overhaul", "Pipe Bypass", "Hydraulics"],
        ["Network Infrastructure", "Fiber Repair", "UPS"],
        ["Chemical Containment", "Hazmat Response"],
        ["Elevator Mechanics", "Cable Inspection"]
    ]

    resources = []
    for i in range(50):
        cat = res_cats[i % len(res_cats)]
        status = "AVAILABLE" if i % 4 != 0 else "DISPATCHED"
        skills = skills_pool[i % len(skills_pool)]
        b_id = f"BLDG-{(i % 50) + 1:02d}"

        if cat == "Technician":
            name = f"Rapid Response Team {chr(65 + i%26)}"
        elif cat == "Equipment":
            name = f"Mobile Unit #{i+1:02d} ({skills[0]})"
        elif cat == "Bus":
            name = f"Shuttle Bus #{i+1:02d} (Transit)"
        elif cat == "Emergency":
            name = f"Campus Safety Unit {i+1:02d}"
        else:
            name = f"Facilities Specialist Crew {i+1}"

        resources.append({
            "id": f"RES-{i+1:02d}",
            "name": name,
            "category": cat,
            "status": status,
            "skills": skills,
            "current_location": b_id,
            "workload_score": round((i * 0.07) % 0.85, 2),
            "phone": f"+1-555-{1000 + i * 17}"
        })
    await db["resources"].insert_many(resources)

    # 4. 50+ HISTORICAL INCIDENTS (INSTITUTIONAL MEMORY)
    hist_categories = ["HVAC", "Water", "Energy", "Transport", "Security", "Infrastructure", "Elevator", "Network"]
    hist_incidents = []
    for i in range(50):
        cat = hist_categories[i % len(hist_categories)]
        b_name = bldg_names[i % len(bldg_names)][0]
        ttr = round(0.4 + (i * 0.15) % 4.5, 1)
        succ = round(88.0 + (i * 0.23) % 11.5, 1)

        hist_incidents.append({
            "id": f"HIST-2025-{(i+100):03d}",
            "title": f"Past {cat} System Failure at {b_name}",
            "category": cat,
            "location_name": b_name,
            "root_cause": f"Primary {cat.lower()} actuator binding coupled with delayed scheduled flush.",
            "solution_applied": f"Isolated secondary circuit, deployed auxiliary bypass unit, calibrated sensor feedback loop.",
            "resolution_time_hours": ttr,
            "success_rate_pct": succ,
            "date": f"2025-{(i%12)+1:02d}-{(i%28)+1:02d}"
        })
    await db["historical_incidents"].insert_many(hist_incidents)

    # 5. 50+ AI PREDICTIONS
    pred_categories = ["Infrastructure Risk", "Energy Demand", "Thermal Anomaly", "Crowd Density", "Transit Delay", "Access Security"]
    predictions = []
    for i in range(50):
        cat = pred_categories[i % len(pred_categories)]
        b_name = bldg_names[i % len(bldg_names)][0]
        prob = round(65.0 + (i * 0.65) % 32.0, 1)
        conf = round(84.0 + (i * 0.31) % 14.5, 1)

        predictions.append({
            "id": f"PRED-{(i+1):02d}",
            "title": f"Predicted {cat} at {b_name}",
            "category": cat,
            "target_asset": f"{b_name} Primary Loop",
            "probability_pct": prob,
            "confidence_pct": conf,
            "expected_timeframe": f"Within {(i%12)+2} to {(i%12)+8} Hours",
            "severity": "High" if prob > 85 else "Medium",
            "contributing_factors": [
                f"Telemetry load variance: +{round(15 + i*1.2, 1)}%",
                f"Vibration & acoustic pattern frequency shift detected",
                f"Maintenance overdue by {(i%15)+3} days",
                f"Correlated historical incident: HIST-2025-{(i+100):03d}"
            ],
            "recommended_prevention": f"Schedule preventative diagnostic check and deploy auxiliary fallback line before peak hours.",
            "created_at": datetime.utcnow().isoformat()
        })
    await db["predictions"].insert_many(predictions)

    # 6. 50+ STUDENT COMPLAINTS
    complaints = []
    cmp_categories = ["Water", "Energy", "HVAC", "Cleanliness", "Noise", "Transport", "Security"]
    descriptions = [
        "Water pressure dropped significantly on upper floor washrooms.",
        "Air conditioning unit making loud metallic rattle and failing to cool.",
        "Main power outlet bank tripped in central study area.",
        "Shuttle bus wait time exceeded 25 minutes during morning rush.",
        "Access card reader failing to recognize valid student badges.",
        "Unusual water discoloration in drinking fountain assembly.",
        "High ambient noise levels interfering with laboratory experiments."
    ]

    for i in range(50):
        cat = cmp_categories[i % len(cmp_categories)]
        b_id = f"BLDG-{(i % 50) + 1:02d}"
        b_name = bldg_names[i % len(bldg_names)][0]
        desc = descriptions[i % len(descriptions)]

        complaints.append({
            "id": f"CMP-{(i+100):03d}",
            "student_id": f"STU-{(i+800):03d}",
            "student_name": f"{first_names[i % len(first_names)]} {last_names[(i+2) % len(last_names)]}",
            "category": cat,
            "location_building_id": b_id,
            "location_name": b_name,
            "description": f"{desc} ({b_name})",
            "priority": "High" if i % 3 == 0 else "Medium",
            "status": "Open" if i % 2 == 0 else "Grouped",
            "cluster_id": f"CLUST-{cat.upper()}-{(i%5)+1:02d}",
            "created_at": datetime.utcnow().isoformat()
        })
    await db["complaints"].insert_many(complaints)

    # 7. 50+ INCIDENTS ACROSS DEMO SCENARIOS
    inc_categories = ["Water", "Energy", "HVAC", "Transport", "Security", "Emergency"]
    incidents = []

    # Include Scenario 1 through 6 Primary Incidents
    primary_scenarios = [
        ("INC-SCENARIO-1", "Water Treatment Plant Main Pump Cavitation & Failure", "Water", "BLDG-05", "Central Campus Water Treatment Plant", "Critical", "P1", "Auxiliary Water Pump #2 bearing seized. Flow dropped to 0 LPM."),
        ("INC-SCENARIO-2", "Main Substation Transformer Phase Overload", "Energy", "BLDG-04", "Central Substation & Solar Array", "High", "P1", "Power consumption spiked to 245 kW (+45% above peak threshold)."),
        ("INC-SCENARIO-3", "Route #2 Bus Breakdown & Terminal Overcrowding", "Transport", "BLDG-06", "Central Bus Hub & Depot", "Medium", "P2", "Bus #03 transmission fault on South Loop. Terminal crowd density reached 145%."),
        ("INC-SCENARIO-4", "Unauthorized Access Attempt at Quantum Lab", "Security", "BLDG-02", "Advanced Research & AI Tech Park", "High", "P1", "Perimeter sensor trip and invalid badge scan sequence in restricted wing."),
        ("INC-SCENARIO-5", "Auditorium Exit Congestion & Bottleneck", "Emergency", "BLDG-07", "Grand Auditorium & Convention Center", "Critical", "P1", "Emergency exit door latch failure during symposium conclusion."),
        ("INC-SCENARIO-6", "Cascading Grid Power Failure & Backup Cutover", "Energy", "BLDG-04", "Central Substation & Solar Array", "Critical", "P1", "Main utility supply trip cascading into Academic Complex sub-panels.")
    ]

    for inc_tuple in primary_scenarios:
        incidents.append({
            "id": inc_tuple[0],
            "title": inc_tuple[1],
            "description": inc_tuple[7],
            "category": inc_tuple[2],
            "location_building_id": inc_tuple[3],
            "location_name": inc_tuple[4],
            "severity": inc_tuple[5],
            "priority": inc_tuple[6],
            "status": "Detected",
            "source": "Autonomous Anomaly Detection Engine",
            "timestamp": datetime.utcnow().isoformat(),
            "affected_resources": ["Infrastructure Line", "Facility Crew Alpha"],
            "affected_people_estimate": 650,
            "assigned_department": "Facility Operations",
            "timeline": [
                {
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "agent_or_user": "Anomaly Detection Engine",
                    "action": "Detected Telemetry Anomaly",
                    "details": inc_tuple[7]
                }
            ]
        })

    # Fill remaining to reach 50+ unique incidents
    for i in range(7, 52):
        cat = inc_categories[i % len(inc_categories)]
        b_id = f"BLDG-{(i % 50) + 1:02d}"
        b_name = bldg_names[i % len(bldg_names)][0]
        sev = "Critical" if i % 5 == 0 else "High" if i % 3 == 0 else "Medium"

        incidents.append({
            "id": f"INC-{i+100:03d}",
            "title": f"{cat} Telemetry Anomaly at {b_name}",
            "description": f"Telemetry drift detected on primary {cat.lower()} distribution line in {b_name}.",
            "category": cat,
            "location_building_id": b_id,
            "location_name": b_name,
            "severity": sev,
            "priority": "P1" if sev == "Critical" else "P2",
            "status": "Investigating" if i % 2 == 0 else "Detected",
            "source": "Autonomous IoT Anomaly Engine",
            "timestamp": datetime.utcnow().isoformat(),
            "affected_resources": [f"{cat} Line #{i}"],
            "affected_people_estimate": 120 + i * 15,
            "assigned_department": "Facility Management",
            "timeline": [
                {
                    "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                    "agent_or_user": "Monitoring Agent",
                    "action": "Logged Telemetry Warning",
                    "details": f"Tracked variance on {b_name} sensor feed."
                }
            ]
        })
    await db["incidents"].insert_many(incidents)

    logger.info("Successfully populated 50+ unique production records per collection into MongoDB Atlas!")
