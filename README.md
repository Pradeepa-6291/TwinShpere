# TWINSPHERE AI
> **An Autonomous Digital Twin for Intelligent Campus Operations**

TWINSPHERE AI is an autonomous, self-learning, multi-agent AI-powered Digital Twin and Campus Operations Command Center. It connects campus infrastructure, IoT sensors, student complaints, security, energy, water, transportation, and occupancy data to deliver real-time monitoring, anomaly detection, predictive risk analysis, root-cause investigation, what-if simulations, and autonomous/human-in-the-loop incident resolution.

---

## 🌟 Key Features

1. **Executive Command Center**: Real-time overall campus health score, critical alerts, predicted risks, active telemetry graphs, and quick metrics.
2. **Digital Twin Campus Map**: Interactive SVG map of campus buildings with live status color coding (GREEN, YELLOW, ORANGE, RED, BLUE), layer filters (Energy, Water, Occupancy, Security, Infrastructure), and telemetry drawer.
3. **Multi-Agent AI Ecosystem**: 16 specialized agents (Facility, Energy, Transport, Occupancy, Security, Emergency, Investigation, Root Cause, Impact, Resource, Decision, Simulation, Communication, Monitoring, Learning, Institutional Memory) coordinated by an Orchestrator Agent via a state-machine DAG workflow.
4. **Autonomous Incident Detection & IoT Stream**: Real-time background telemetry emulator with statistical, rule-based, and AI anomaly detection.
5. **Predictive Intelligence Engine**: Proactive failure forecasting with confidence scores, target asset impact, and evidence factors.
6. **Diagnostic Root Cause Tree**: Visual diagnostic root cause tree mapping symptoms to single-point failures and maintenance factors.
7. **What-If Simulation Engine**: Scenario simulator evaluating multi-plan trade-offs (Cost, Resolution Time, Population Impact, Pros/Cons).
8. **Human-in-the-Loop Approval Queue**: Automated risk classifier routing LOW risk actions for auto-execution and MEDIUM/HIGH risk actions for 1-click administrator sign-off.
9. **Student Complaint Intelligence**: NLP clustering engine grouping duplicate student complaints into single infrastructure incidents.
10. **Institutional Memory**: Vector & keyword search through historical campus incidents and proven resolution blueprints.
11. **Interactive Hackathon Demo Scenarios**: 6 preconfigured interactive scenarios triggerable from the top toolbar (including the complete Water Pump Malfunction demo story).

---

## 🚀 Technology Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Recharts, Framer Motion, Lucide Icons, WebSockets.
- **Backend**: Python 3.13, FastAPI, Pydantic, Motor (Async MongoDB), PyMongo, JWT Auth.
- **Database**: MongoDB Atlas (with safe in-memory fallback engine for offline execution).
- **AI/LLM Layer**: Multi-agent DAG framework with OpenAI/Gemini/Ollama integration and high-fidelity deterministic fallback.

---

## ⚙️ Quick Setup & Run Instructions

### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```
*Backend server starts at `http://localhost:8000`. OpenAPI docs available at `http://localhost:8000/docs`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend app starts at `http://localhost:3000`.*

---

## 🎭 Running Demo Scenarios

Once both servers are running:
1. Open `http://localhost:3000` in your browser.
2. Sign in with demo credentials (pre-filled: `admin` / `password`).
3. Click any of the **Demo Scenarios** in the top toolbar:
   - **Scenario 1**: Water Pump Malfunction (Full Story Demo)
   - **Scenario 2**: Substation Energy Anomaly
   - **Scenario 3**: Bus Delay & Overcrowding
   - **Scenario 4**: Security Perimeter Breach
   - **Scenario 5**: Auditorium Crowd Bottleneck
   - **Scenario 6**: Cascading Infrastructure Grid Failure
4. Observe the live Digital Twin status change, active incidents update, 16-agent swarm activation feed, and human approval queue in real-time.
