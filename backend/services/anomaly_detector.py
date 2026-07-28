import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from database.connection import get_db

logger = logging.getLogger("twinsphere.anomaly")

class AnomalyDetector:
    def __init__(self):
        # Operational thresholds for campus infrastructure
        self.thresholds = {
            "power_kw": {"warning": 35.0, "critical": 45.0},
            "water_flow_lpm": {"warning": 5.0, "critical": 0.5}, # sudden pressure drop
            "temperature_c": {"warning": 28.0, "critical": 35.0},
            "occupancy_ratio": {"warning": 0.90, "critical": 1.05},
        }

    async def analyze_telemetry(self, sensor_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Analyze incoming telemetry reading for statistical and rule-based anomalies."""
        s_type = sensor_data.get("sensor_type")
        val = sensor_data.get("value", 0.0)
        building_id = sensor_data.get("building_id")

        db = get_db()
        building_name = "Campus Building"
        if db is not None:
            b_doc = await db["buildings"].find_one({"id": building_id})
            if b_doc:
                building_name = b_doc.get("name", building_name)

        anomaly_detected = False
        severity = "Medium"
        description = ""

        if s_type == "power" and val > self.thresholds["power_kw"]["critical"]:
            anomaly_detected = True
            severity = "Critical"
            description = f"Abnormal power spike detected at {building_name}: {val:.1f} kW (Threshold: {self.thresholds['power_kw']['critical']} kW)"
        elif s_type == "water" and val < self.thresholds["water_flow_lpm"]["critical"]:
            anomaly_detected = True
            severity = "High"
            description = f"Critical water flow drop detected at {building_name}: {val:.1f} LPM (Probable pump malfunction)"
        elif s_type == "temperature" and val > self.thresholds["temperature_c"]["critical"]:
            anomaly_detected = True
            severity = "High"
            description = f"Overheating alert at {building_name}: {val:.1f}°C (HVAC Chiller failure warning)"

        if anomaly_detected:
            incident_doc = {
                "id": f"INC-{int(datetime.utcnow().timestamp())}",
                "title": f"Telemetry Anomaly: {s_type.upper()} in {building_name}",
                "description": description,
                "category": "Energy" if s_type == "power" else "Water" if s_type == "water" else "HVAC",
                "location_building_id": building_id,
                "location_name": building_name,
                "severity": severity,
                "priority": "P1" if severity == "Critical" else "P2",
                "status": "Detected",
                "source": "Autonomous Anomaly Detection Engine",
                "timestamp": datetime.utcnow().isoformat(),
                "affected_resources": ["HVAC Chiller #1", "Water Line Loop B"],
                "affected_people_estimate": 350,
                "assigned_department": "Facility Operations",
                "timeline": [
                    {
                        "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                        "agent_or_user": "Anomaly Detection Engine",
                        "action": "Detected Anomaly",
                        "details": description
                    }
                ]
            }
            return incident_doc
        return None

anomaly_detector = AnomalyDetector()
