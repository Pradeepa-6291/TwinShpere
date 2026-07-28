import logging
from typing import Dict, Any, List
from datetime import datetime

logger = logging.getLogger("twinsphere.simulation")

class SimulationEngine:
    async def run_simulation(self, query: str) -> Dict[str, Any]:
        """Simulate campus operational response and option trade-offs based on query."""
        q_lower = query.lower()

        if "power" in q_lower or "electricity" in q_lower or "substation" in q_lower or "grid" in q_lower:
            return {
                "id": f"SIM-{int(datetime.utcnow().timestamp())}",
                "scenario_query": query,
                "affected_buildings": ["Central Substation (PWR-01)", "Academic Complex Block A", "Tech Park (TP-01)", "Hostel Block A"],
                "affected_population": 1250,
                "cascading_risks": [
                    "Lab server thermal shutdown within 15 mins",
                    "Elevator passenger entrapment risk in Highrise B",
                    "Hostel lighting & water pump failure within 30 mins"
                ],
                "options": [
                    {
                        "option_id": "OPT-A",
                        "name": "Activate Secondary Solar + Battery Backup Array (BAT-01)",
                        "cost_estimate": "$200 / hr fuel equivalent",
                        "resolution_time_min": 5,
                        "impact_level": "Very Low",
                        "pros": ["Zero downtime for critical research servers", "Fully automated transfer"],
                        "cons": ["Battery capacity limited to 4.5 hours"]
                    },
                    {
                        "option_id": "OPT-B",
                        "name": "Load-Shed Non-Essential Air Conditioning & Activate Diesel Gensets",
                        "cost_estimate": "$650 / hr",
                        "resolution_time_min": 15,
                        "impact_level": "Medium",
                        "pros": ["Sustains entire campus load indefinitely"],
                        "cons": ["Noise and exhaust emission in academic zone"]
                    }
                ],
                "recommended_option_id": "OPT-A",
                "recommendation_reasoning": "OPT-A yields immediate zero-downtime cutover for critical server clusters and low operational cost.",
                "created_at": datetime.utcnow().isoformat()
            }
        elif "bus" in q_lower or "transport" in q_lower or "route" in q_lower or "transit" in q_lower:
            return {
                "id": f"SIM-{int(datetime.utcnow().timestamp())}",
                "scenario_query": query,
                "affected_buildings": ["Central Bus Hub (TRN-01)", "North Gate Depot (TRN-02)", "Hostel Block B (HST-B)"],
                "affected_population": 680,
                "cascading_risks": [
                    "Classroom attendance drop of 35% for morning lectures",
                    "Overcrowding and safety congestion at Bus Hub Terminal"
                ],
                "options": [
                    {
                        "option_id": "OPT-A",
                        "name": "Reallocate 3 Express Shuttles from South Line to Loop #1",
                        "cost_estimate": "$120",
                        "resolution_time_min": 10,
                        "impact_level": "Low",
                        "pros": ["Clears Bus Hub congestion in 12 minutes"],
                        "cons": ["Slightly increases wait times on South Line by 4 mins"]
                    },
                    {
                        "option_id": "OPT-B",
                        "name": "Charter External Emergency Transit Coaches",
                        "cost_estimate": "$900",
                        "resolution_time_min": 45,
                        "impact_level": "Medium",
                        "pros": ["Maintains 100% schedule fidelity across all lines"],
                        "cons": ["High cost and 45 minute arrival lead time"]
                    }
                ],
                "recommended_option_id": "OPT-A",
                "recommendation_reasoning": "OPT-A provides immediate dynamic fleet balancing with zero external expenditure.",
                "created_at": datetime.utcnow().isoformat()
            }
        elif "security" in q_lower or "access" in q_lower or "breach" in q_lower or "door" in q_lower:
            return {
                "id": f"SIM-{int(datetime.utcnow().timestamp())}",
                "scenario_query": query,
                "affected_buildings": ["Advanced Research Tech Park (TP-01)", "Data Center (DC-01)"],
                "affected_population": 85,
                "cascading_risks": [
                    "Unauthorized access to high-performance GPU cluster room",
                    "Triggering automated perimeter lockdown in adjacent wings"
                ],
                "options": [
                    {
                        "option_id": "OPT-A",
                        "name": "Dispatch Campus Security Squad Delta & Engage RFID Zone Isolation",
                        "cost_estimate": "$0",
                        "resolution_time_min": 4,
                        "impact_level": "Very Low",
                        "pros": ["Immediate perimeter containment", "Zero impact on unaffected academic blocks"],
                        "cons": ["Requires 2-factor physical badge verification for staff"]
                    },
                    {
                        "option_id": "OPT-B",
                        "name": "Full Building Lockdown & Police Notification",
                        "cost_estimate": "$500",
                        "resolution_time_min": 60,
                        "impact_level": "High",
                        "pros": ["Maximum security enforcement"],
                        "cons": ["Disrupts research operations for 150+ researchers"]
                    }
                ],
                "recommended_option_id": "OPT-A",
                "recommendation_reasoning": "OPT-A isolates the perimeter anomaly within 4 minutes without disrupting surrounding academic labs.",
                "created_at": datetime.utcnow().isoformat()
            }
        elif "crowd" in q_lower or "auditorium" in q_lower or "exit" in q_lower or "evacuation" in q_lower:
            return {
                "id": f"SIM-{int(datetime.utcnow().timestamp())}",
                "scenario_query": query,
                "affected_buildings": ["Grand Auditorium (AUD-01)", "Student Activity Center (SAC-01)"],
                "affected_population": 1150,
                "cascading_risks": [
                    "Egress bottleneck at Auditorium Gate 2",
                    "Minor injury risk if emergency evacuation triggered"
                ],
                "options": [
                    {
                        "option_id": "OPT-A",
                        "name": "Remotely Override Gate 3 & 4 Electromagnetic Latches & Reroute Crowd",
                        "cost_estimate": "$0",
                        "resolution_time_min": 6,
                        "impact_level": "Low",
                        "pros": ["Doubles egress flow capacity immediately", "Clears congestion in 6 mins"],
                        "cons": ["Requires usher manual guidance at East concourse"]
                    },
                    {
                        "option_id": "OPT-B",
                        "name": "Deploy Emergency Squad to Manual Door Override",
                        "cost_estimate": "$150",
                        "resolution_time_min": 20,
                        "impact_level": "Medium",
                        "pros": ["On-site crowd control supervision"],
                        "cons": ["20-minute technician travel lead time"]
                    }
                ],
                "recommended_option_id": "OPT-A",
                "recommendation_reasoning": "OPT-A provides immediate automated door latch override, dispersing the crowd bottleneck within 6 minutes.",
                "created_at": datetime.utcnow().isoformat()
            }
        else:
            # Water / Pump / HVAC / General Infrastructure simulation
            return {
                "id": f"SIM-{int(datetime.utcnow().timestamp())}",
                "scenario_query": query,
                "affected_buildings": ["Water Treatment Plant (WTR-01)", "Hostel Block B (HST-B)", "Central Cafeteria (SAC-01)"],
                "affected_population": 850,
                "cascading_risks": [
                    "Hostel overhead tank exhaustion in 45 minutes",
                    "Cafeteria hygiene closure at lunchtime"
                ],
                "options": [
                    {
                        "option_id": "OPT-A",
                        "name": "Bypass Chiller Line & Connect Emergency Mobile Pump Unit #2",
                        "cost_estimate": "$400",
                        "resolution_time_min": 30,
                        "impact_level": "Low",
                        "pros": ["Restores 100% flow pressure before tank depletion", "No student service shutdown"],
                        "cons": ["Requires on-site technician supervision"]
                    },
                    {
                        "option_id": "OPT-B",
                        "name": "Tether Auxiliary Feed from Tech Park Water Reserve",
                        "cost_estimate": "$850",
                        "resolution_time_min": 75,
                        "impact_level": "Medium",
                        "pros": ["Permanent redundant backup pipeline"],
                        "cons": ["Higher cost and longer resolution lead time"]
                    }
                ],
                "recommended_option_id": "OPT-A",
                "recommendation_reasoning": "OPT-A prevents student disruption within 30 minutes at under half the implementation cost.",
                "created_at": datetime.utcnow().isoformat()
            }

simulation_engine = SimulationEngine()
