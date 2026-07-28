import axios from 'axios';

const API_BASE = '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('twinsphere_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Calls
export const getCommandCenterSummary = async () => (await api.get('/command-center/summary')).data;

export const getBuildings = async (category?: string) => (await api.get('/digital-twin/buildings', { params: { category } })).data;
export const getBuildingDetail = async (id: string) => (await api.get(`/digital-twin/buildings/${id}`)).data;

export const getIncidents = async (status?: string, severity?: string) => 
  (await api.get('/incidents', { params: { status, severity } })).data;
export const createIncident = async (data: any) => (await api.post('/incidents', data)).data;
export const updateIncidentStatus = async (id: string, status: string, notes?: string) => 
  (await api.patch(`/incidents/${id}/status`, { status, notes })).data;
export const triggerIncidentWorkflow = async (id: string) => (await api.post(`/incidents/${id}/trigger-workflow`)).data;
export const getRootCauseTree = async (id: string) => (await api.get(`/incidents/${id}/root-cause-tree`)).data;

export const getAgentRuns = async () => (await api.get('/agents/runs')).data;
export const getSwarmStatus = async () => (await api.get('/agents/swarm-status')).data;

export const getPredictions = async () => (await api.get('/predictions')).data;

export const runSimulation = async (query: string) => (await api.post('/simulations/run', { query })).data;
export const getSimulationHistory = async () => (await api.get('/simulations/history')).data;

export const getApprovals = async (status?: string) => (await api.get('/approvals', { params: { status } })).data;
export const approveAction = async (id: string, approver_name?: string, notes?: string) => 
  (await api.post(`/approvals/${id}/approve`, { approver_name, notes })).data;
export const rejectAction = async (id: string, approver_name?: string, notes?: string) => 
  (await api.post(`/approvals/${id}/reject`, { approver_name, notes })).data;

export const getResources = async () => (await api.get('/resources')).data;
export const getEnergyMetrics = async () => (await api.get('/energy/metrics')).data;
export const getTransportStatus = async () => (await api.get('/transport/status')).data;

export const getComplaints = async () => (await api.get('/complaints')).data;
export const submitComplaint = async (data: any) => (await api.post('/complaints', data)).data;

export const searchMemory = async (query?: string) => (await api.get('/memory/search', { params: { query } })).data;
export const getAnalyticsMetrics = async () => (await api.get('/analytics/metrics')).data;

export const triggerDemoScenario = async (id: number) => (await api.post(`/scenarios/trigger/${id}`)).data;
