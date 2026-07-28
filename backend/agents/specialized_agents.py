from agents.base_agent import BaseAgent

class FacilityAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Facility Agent",
            role="Infrastructure & HVAC Specialist",
            description="Monitors building mechanics, plumbing, HVAC, and physical plant operations."
        )

class EnergyAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Energy Agent",
            role="Power & Substation Specialist",
            description="Detects power spikes, peak demand loads, and energy efficiency opportunities."
        )

class TransportAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Transport Agent",
            role="Fleet & Transit Coordinator",
            description="Monitors shuttle buses, GPS telemetry, route delays, and stop overcrowding."
        )

class OccupancyAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Occupancy Agent",
            role="Crowd & Utilization Analyst",
            description="Tracks real-time crowd density, classroom capacity, and lab usage rates."
        )

class SecurityAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Security Agent",
            role="Perimeter & Surveillance Guard",
            description="Monitors perimeter access control, unauthorized area entries, and camera alerts."
        )

class EmergencyAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Emergency Agent",
            role="Crisis & Safety Commander",
            description="Orchestrates high-priority safety alerts, evacuation routes, and first responder dispatches."
        )

class InvestigationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Incident Investigation Agent",
            role="Cross-System Telemetry Correlator",
            description="Correlates multi-domain IoT telemetry, complaints, and spatial sensor feeds."
        )

class RootCauseAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Root Cause Analysis Agent",
            role="Hypothesis & Failure Diagnostics Engine",
            description="Builds visual hypothesis trees to isolate single-point failures and underlying root causes."
        )

class ImpactAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Impact Assessment Agent",
            role="Cascading Risk & Population Modeler",
            description="Calculates affected campus population, secondary resource loss, and degradation timeline."
        )

class ResourceAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Resource Allocation Agent",
            role="Staff & Equipment Dispatcher",
            description="Finds available technicians, emergency vehicles, and assets matched by skill & proximity."
        )

class DecisionAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Decision Support Agent",
            role="Action Evaluator & Risk Classifier",
            description="Evaluates action safety (Low/Med/High risk) and prepares human approval payloads."
        )

class SimulationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Simulation Agent",
            role="What-If Scenario Evaluator",
            description="Simulates alternative mitigation paths comparing cost, downtime, and population impact."
        )

class CommunicationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Communication Agent",
            role="Notification & Broadcast Dispatcher",
            description="Sends automated alerts to facility leads, administrators, security, and affected students."
        )

class MonitoringAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Monitoring Agent",
            role="Resolution & Telemetry Verifier",
            description="Verifies telemetry stabilization after action execution to ensure incident resolution."
        )

class LearningAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Learning Agent",
            role="Institutional Insight Extractor",
            description="Extracts key learnings from incident outcomes to refine future anomaly thresholds."
        )

class MemoryAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Institutional Memory Agent",
            role="Historical Knowledge & Vector Search",
            description="Searches campus historical database for high-similarity prior incidents and proven solutions."
        )
