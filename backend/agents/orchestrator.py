import logging
import asyncio
from typing import Dict, Any, List
from datetime import datetime
from agents.specialized_agents import (
    FacilityAgent, EnergyAgent, TransportAgent, OccupancyAgent,
    SecurityAgent, EmergencyAgent, InvestigationAgent, RootCauseAgent,
    ImpactAgent, ResourceAgent, DecisionAgent, SimulationAgent,
    CommunicationAgent, MonitoringAgent, LearningAgent, MemoryAgent
)
from services.websocket_manager import manager as ws_manager
from database.connection import get_db

logger = logging.getLogger("twinsphere.orchestrator")

class OrchestratorAgent:
    def __init__(self):
        self.agents = {
            "Facility Agent": FacilityAgent(),
            "Energy Agent": EnergyAgent(),
            "Transport Agent": TransportAgent(),
            "Occupancy Agent": OccupancyAgent(),
            "Security Agent": SecurityAgent(),
            "Emergency Agent": EmergencyAgent(),
            "Incident Investigation Agent": InvestigationAgent(),
            "Root Cause Analysis Agent": RootCauseAgent(),
            "Impact Assessment Agent": ImpactAgent(),
            "Resource Allocation Agent": ResourceAgent(),
            "Decision Support Agent": DecisionAgent(),
            "Simulation Agent": SimulationAgent(),
            "Communication Agent": CommunicationAgent(),
            "Monitoring Agent": MonitoringAgent(),
            "Learning Agent": LearningAgent(),
            "Institutional Memory Agent": MemoryAgent(),
        }

    def determine_workflow(self, event_category: str) -> List[str]:
        """Dynamically determine agent activation DAG based on event category."""
        category = (event_category or "").lower()
        
        if "energy" in category or "power" in category:
            return [
                "Energy Agent",
                "Facility Agent",
                "Incident Investigation Agent",
                "Root Cause Analysis Agent",
                "Impact Assessment Agent",
                "Simulation Agent",
                "Resource Allocation Agent",
                "Decision Support Agent",
                "Communication Agent"
            ]
        elif "security" in category or "perimeter" in category:
            return [
                "Security Agent",
                "Incident Investigation Agent",
                "Impact Assessment Agent",
                "Emergency Agent",
                "Communication Agent",
                "Resource Allocation Agent"
            ]
        elif "transport" in category or "bus" in category:
            return [
                "Transport Agent",
                "Occupancy Agent",
                "Impact Assessment Agent",
                "Simulation Agent",
                "Resource Allocation Agent",
                "Decision Support Agent"
            ]
        elif "emergency" in category or "crowd" in category:
            return [
                "Emergency Agent",
                "Occupancy Agent",
                "Security Agent",
                "Impact Assessment Agent",
                "Resource Allocation Agent",
                "Communication Agent"
            ]
        else:
            # Default infrastructure / water / HVAC workflow (Full 16-agent collaboration capabilities)
            return [
                "Facility Agent",
                "Energy Agent",
                "Incident Investigation Agent",
                "Institutional Memory Agent",
                "Root Cause Analysis Agent",
                "Impact Assessment Agent",
                "Simulation Agent",
                "Resource Allocation Agent",
                "Decision Support Agent",
                "Communication Agent"
            ]

    async def run_workflow(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute dynamic multi-agent workflow for an incident."""
        incident_id = incident_data.get("id", "INC-UNKNOWN")
        category = incident_data.get("category", "Infrastructure")
        title = incident_data.get("title", "Campus Telemetry Anomaly")
        
        workflow = self.determine_workflow(category)
        
        run_id = f"RUN-{int(datetime.utcnow().timestamp())}"
        steps = []
        
        # Broadcast initial workflow activation to WebSocket
        await ws_manager.broadcast({
            "type": "AGENT_SWARM_START",
            "data": {
                "run_id": run_id,
                "incident_id": incident_id,
                "title": title,
                "workflow": workflow
            }
        })
        
        db = get_db()
        
        agent_outputs = {}
        
        for agent_name in workflow:
            agent = self.agents.get(agent_name)
            if not agent:
                continue
            
            # Run specialized agent
            result = await agent.run(task_type=f"Analyze {title}", context={**incident_data, **agent_outputs})
            agent_outputs[agent_name] = result["output"]
            
            step = {
                "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                "agent_name": agent_name,
                "action_type": agent.role,
                "message": result["output"].get("assessment") or result["output"].get("summary") or f"Completed {agent.role}",
                "status": "SUCCESS"
            }
            steps.append(step)
            
            # Broadcast step to live feed
            await ws_manager.broadcast({
                "type": "AGENT_STEP",
                "data": {
                    "run_id": run_id,
                    "incident_id": incident_id,
                    "step": step,
                    "output": result["output"]
                }
            })
            
            # Small delay for realistic demonstration visual flow
            await asyncio.sleep(0.4)
            
        # Check Decision Support Agent output for Approval requirement
        decision_out = agent_outputs.get("Decision Support Agent", {})
        risk_level = decision_out.get("risk_level", "MEDIUM")
        
        requires_approval = risk_level in ["MEDIUM", "HIGH"]
        
        # Save approval if required
        if requires_approval:
            approval_doc = {
                "id": f"APP-{int(datetime.utcnow().timestamp())}",
                "incident_id": incident_id,
                "incident_title": title,
                "action_title": decision_out.get("decision", "Execute Emergency Repair & Mobile Unit Dispatch"),
                "action_description": decision_out.get("rationale", "Mitigates cascading outage risks across campus."),
                "risk_level": risk_level,
                "proposed_by_agent": "Decision Support Agent",
                "target_resources": ["Facility Team Alpha", "Mobile Pump Unit #2"],
                "estimated_impact": agent_outputs.get("Impact Assessment Agent", {}).get("cascading_risk", "High impact on student services"),
                "status": "PENDING",
                "created_at": datetime.utcnow().isoformat()
            }
            if db is not None:
                await db["approvals"].insert_one(approval_doc)
            
            # Update incident status to Awaiting Approval
            if db is not None:
                await db["incidents"].update_one(
                    {"id": incident_id},
                    {"$set": {"status": "Awaiting Approval", "root_cause": agent_outputs.get("Root Cause Analysis Agent", {}).get("primary_root_cause")}}
                )
                
            await ws_manager.broadcast({
                "type": "APPROVAL_REQUIRED",
                "data": approval_doc
            })
        else:
            # Low risk action auto-executed
            if db is not None:
                await db["incidents"].update_one(
                    {"id": incident_id},
                    {"$set": {"status": "Action In Progress", "root_cause": agent_outputs.get("Root Cause Analysis Agent", {}).get("primary_root_cause")}}
                )

        # Persist Agent Run log
        run_record = {
            "id": run_id,
            "incident_id": incident_id,
            "event_type": category,
            "activated_agents": workflow,
            "current_agent": workflow[-1],
            "status": "REQUIRES_APPROVAL" if requires_approval else "COMPLETED",
            "steps": steps,
            "agent_outputs": agent_outputs,
            "created_at": datetime.utcnow().isoformat()
        }
        if db is not None:
            await db["agent_runs"].insert_one(run_record)

        await ws_manager.broadcast({
            "type": "AGENT_SWARM_COMPLETE",
            "data": run_record
        })
        
        return run_record

orchestrator = OrchestratorAgent()
