from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- AUTH & USER SCHEMAS ---
class UserRole(str):
    SUPER_ADMIN = "Super Admin"
    ADMINISTRATOR = "Administrator"
    DEPARTMENT_HEAD = "Department Head"
    FACILITY_MANAGER = "Facility Manager"
    SECURITY_OFFICER = "Security Officer"
    TRANSPORT_MANAGER = "Transport Manager"
    ENERGY_MANAGER = "Energy Manager"
    FACULTY = "Faculty"
    STUDENT = "Student"
    VIEWER = "Viewer"

class UserBase(BaseModel):
    username: str
    email: str
    full_name: str
    role: str = "Administrator"
    department: Optional[str] = "Operations"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# --- DIGITAL TWIN SCHEMAS ---
class RoomSchema(BaseModel):
    id: str
    name: str
    building_id: str
    floor: int
    capacity: int
    current_occupancy: int
    temperature_c: float
    status: str = "GREEN" # GREEN, YELLOW, ORANGE, RED, BLUE

class BuildingSchema(BaseModel):
    id: str
    name: str
    code: str
    category: str # Academic, Hostel, Facility, Substation, Transport, Admin
    coordinates: Dict[str, float] # {x: float, y: float}
    status: str = "GREEN" # GREEN, YELLOW, ORANGE, RED, BLUE
    occupancy_current: int
    occupancy_capacity: int
    power_kw: float
    water_flow_lpm: float
    temperature_c: float
    active_incidents_count: int = 0
    predicted_risk_level: str = "Low"
    last_updated: str

# --- IOT & TELEMETRY SCHEMAS ---
class SensorReading(BaseModel):
    id: str
    sensor_id: str
    building_id: str
    sensor_type: str # power, water, temperature, occupancy, hvac, bus_gps
    value: float
    unit: str
    status: str = "NORMAL" # NORMAL, WARNING, CRITICAL
    timestamp: str

# --- INCIDENT SCHEMAS ---
class IncidentStatus(str):
    DETECTED = "Detected"
    INVESTIGATING = "Investigating"
    ROOT_CAUSE_IDENTIFIED = "Root Cause Identified"
    AWAITING_APPROVAL = "Awaiting Approval"
    ACTION_IN_PROGRESS = "Action In Progress"
    MONITORING = "Monitoring"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

class IncidentSeverity(str):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class IncidentEvent(BaseModel):
    timestamp: str
    agent_or_user: str
    action: str
    details: str

class IncidentCreate(BaseModel):
    title: str
    description: str
    category: str
    location_building_id: str
    severity: str = "Medium"
    priority: str = "P2"
    source: str = "IoT Anomaly"

class IncidentSchema(BaseModel):
    id: str
    title: str
    description: str
    category: str # Energy, Water, Transport, Security, Occupancy, HVAC
    location_building_id: str
    location_name: str
    severity: str # Low, Medium, High, Critical
    priority: str # P1, P2, P3, P4
    status: str
    source: str
    timestamp: str
    affected_resources: List[str] = []
    affected_people_estimate: int = 0
    assigned_department: str = "Facility Management"
    assigned_personnel: Optional[str] = None
    root_cause: Optional[str] = None
    recommended_actions: List[str] = []
    resolution: Optional[str] = None
    timeline: List[IncidentEvent] = []

# --- MULTI-AGENT SWARM SCHEMAS ---
class AgentStep(BaseModel):
    timestamp: str
    agent_name: str
    action_type: str
    message: str
    status: str = "SUCCESS" # SUCCESS, PENDING, FAILED

class AgentRunSchema(BaseModel):
    id: str
    incident_id: Optional[str] = None
    event_type: str
    activated_agents: List[str]
    current_agent: str
    status: str # RUNNING, COMPLETED, REQUIRES_APPROVAL, FAILED
    steps: List[AgentStep] = []
    created_at: str

# --- PREDICTION SCHEMAS ---
class PredictionSchema(BaseModel):
    id: str
    title: str
    category: str
    target_asset: str
    probability_pct: float
    confidence_pct: float
    expected_timeframe: str
    severity: str
    contributing_factors: List[str]
    recommended_prevention: str
    created_at: str

# --- WHAT-IF SIMULATION SCHEMAS ---
class SimulationOption(BaseModel):
    option_id: str
    name: str
    cost_estimate: str
    resolution_time_min: int
    impact_level: str
    pros: List[str]
    cons: List[str]

class SimulationResult(BaseModel):
    id: str
    scenario_query: str
    affected_buildings: List[str]
    affected_population: int
    cascading_risks: List[str]
    options: List[SimulationOption]
    recommended_option_id: str
    recommendation_reasoning: str
    created_at: str

# --- HUMAN APPROVAL SCHEMAS ---
class ApprovalRiskLevel(str):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class ApprovalSchema(BaseModel):
    id: str
    incident_id: str
    incident_title: str
    action_title: str
    action_description: str
    risk_level: str # LOW, MEDIUM, HIGH
    proposed_by_agent: str
    target_resources: List[str]
    estimated_impact: str
    status: str = "PENDING" # PENDING, APPROVED, REJECTED, MODIFIED
    approved_by: Optional[str] = None
    decision_timestamp: Optional[str] = None
    notes: Optional[str] = None
    created_at: str

# --- RESOURCE SCHEMAS ---
class ResourceSchema(BaseModel):
    id: str
    name: str
    category: str # Technician, Staff, Bus, Equipment, Emergency
    status: str # AVAILABLE, DISPATCHED, MAINTENANCE, OFFLINE
    skills: List[str] = []
    current_location: str
    workload_score: float # 0.0 - 1.0
    phone: Optional[str] = None

# --- COMPLAINT SCHEMAS ---
class ComplaintSchema(BaseModel):
    id: str
    student_id: str
    student_name: str
    category: str # Water, Energy, HVAC, Cleanliness, Noise, Transport, Security
    location_building_id: str
    location_name: str
    description: str
    priority: str = "Medium"
    status: str = "Open" # Open, Grouped, In Progress, Resolved
    cluster_id: Optional[str] = None
    created_at: str

# --- INSTITUTIONAL MEMORY SCHEMAS ---
class HistoricalIncidentSchema(BaseModel):
    id: str
    title: str
    category: str
    location_name: str
    root_cause: str
    solution_applied: str
    resolution_time_hours: float
    success_rate_pct: float
    similarity_score_pct: Optional[float] = None
    date: str
