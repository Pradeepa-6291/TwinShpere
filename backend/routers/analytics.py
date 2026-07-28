from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["Analytics & Reporting"])

@router.get("/metrics")
async def get_analytics_metrics():
    return {
        "monthly_incident_trends": [
            {"month": "Jan", "resolved": 42, "critical": 4},
            {"month": "Feb", "resolved": 38, "critical": 2},
            {"month": "Mar", "resolved": 45, "critical": 5},
            {"month": "Apr", "resolved": 31, "critical": 1},
            {"month": "May", "resolved": 52, "critical": 6},
            {"month": "Jun", "resolved": 29, "critical": 2},
            {"month": "Jul", "resolved": 18, "critical": 1}
        ],
        "mttr_minutes": {
            "HVAC": 42.5,
            "Water": 35.0,
            "Energy": 18.2,
            "Transport": 12.0,
            "Security": 8.5
        },
        "agent_performance_pct": {
            "Anomaly Detection Accuracy": 96.4,
            "Root Cause Precision": 92.1,
            "Simulation Fidelity": 94.8,
            "Autonomous Resolution Rate": 78.5
        },
        "department_resolution_times": [
            {"dept": "Facility Management", "avg_hours": 1.1},
            {"dept": "Energy & Power", "avg_hours": 0.4},
            {"dept": "Transport Services", "avg_hours": 0.3},
            {"dept": "Campus Security", "avg_hours": 0.2}
        ]
    }
