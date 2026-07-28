export type StatusColor = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'BLUE';
export type UserRole = 'admin' | 'faculty' | 'student' | 'Super Admin' | 'Administrator' | 'Faculty' | 'Student';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
}

export function getRoleCategory(role: string): 'admin' | 'faculty' | 'student' {
  const r = role.toLowerCase();
  if (r === 'student') return 'student';
  if (r === 'faculty') return 'faculty';
  return 'admin';
}

export interface Building {
  id: string;
  name: string;
  code: string;
  category: string;
  coordinates: { x: number; y: number };
  status: StatusColor;
  occupancy_current: number;
  occupancy_capacity: number;
  power_kw: number;
  water_flow_lpm: number;
  temperature_c: number;
  active_incidents_count: number;
  predicted_risk_level: string;
  last_updated: string;
}

export interface IncidentEvent {
  timestamp: string;
  agent_or_user: string;
  action: string;
  details: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  location_building_id: string;
  location_name: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'Detected' | 'Investigating' | 'Root Cause Identified' | 'Awaiting Approval' | 'Action In Progress' | 'Monitoring' | 'Resolved' | 'Closed';
  source: string;
  timestamp: string;
  affected_resources: string[];
  affected_people_estimate: number;
  assigned_department: string;
  assigned_personnel?: string;
  root_cause?: string;
  recommended_actions?: string[];
  timeline: IncidentEvent[];
}

export interface AgentStep {
  timestamp: string;
  agent_name: string;
  action_type: string;
  message: string;
  status: string;
}

export interface AgentRun {
  id: string;
  incident_id?: string;
  event_type: string;
  activated_agents: string[];
  current_agent: string;
  status: string;
  steps: AgentStep[];
  created_at: string;
}

export interface Prediction {
  id: string;
  title: string;
  category: string;
  target_asset: string;
  probability_pct: number;
  confidence_pct: number;
  expected_timeframe: string;
  severity: string;
  contributing_factors: string[];
  recommended_prevention: string;
  created_at: string;
}

export interface SimulationOption {
  option_id: string;
  name: string;
  cost_estimate: string;
  resolution_time_min: number;
  impact_level: string;
  pros: string[];
  cons: string[];
}

export interface SimulationResult {
  id: string;
  scenario_query: string;
  affected_buildings: string[];
  affected_population: number;
  cascading_risks: string[];
  options: SimulationOption[];
  recommended_option_id: string;
  recommendation_reasoning: string;
  created_at: string;
}

export interface Approval {
  id: string;
  incident_id: string;
  incident_title: string;
  action_title: string;
  action_description: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  proposed_by_agent: string;
  target_resources: string[];
  estimated_impact: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
  approved_by?: string;
  decision_timestamp?: string;
  notes?: string;
  created_at: string;
}

export interface Resource {
  id: string;
  name: string;
  category: string;
  status: string;
  skills: string[];
  current_location: string;
  workload_score: number;
  phone?: string;
}

export interface Complaint {
  id: string;
  student_id: string;
  student_name: string;
  category: string;
  location_building_id: string;
  location_name: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
}

export interface HistoricalIncident {
  id: string;
  title: string;
  category: string;
  location_name: string;
  root_cause: string;
  solution_applied: string;
  resolution_time_hours: number;
  success_rate_pct: number;
  similarity_score_pct?: number;
  date: string;
}

export interface CommandSummary {
  campus_health_score: number;
  health_status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  active_incidents_count: number;
  critical_alerts_count: number;
  predicted_incidents_count: number;
  pending_approvals_count: number;
  available_resources_count: number;
  active_agent_runs_count: number;
  total_power_kw: number;
  total_water_lpm: number;
  total_occupancy: number;
  occupancy_capacity: number;
  occupancy_rate_pct: number;
  buses_online: number;
  on_time_performance_pct: number;
}
