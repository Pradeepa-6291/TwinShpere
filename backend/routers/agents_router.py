from fastapi import APIRouter
from database.connection import get_db

from database.utils import clean_docs

router = APIRouter(prefix="/agents", tags=["Multi-Agent Swarm"])

@router.get("/runs")
async def get_agent_runs():
    db = get_db()
    if db is None:
        return []
    runs = await db["agent_runs"].find().sort("created_at", -1).to_list(50)
    return clean_docs(runs)

@router.get("/swarm-status")
async def get_swarm_status():
    from agents.orchestrator import orchestrator
    
    agent_list = []
    for name, agent in orchestrator.agents.items():
        agent_list.append({
            "name": name,
            "role": agent.role,
            "description": agent.description,
            "status": "IDLE"
        })
    return {
        "orchestrator_status": "ACTIVE",
        "total_agents": len(agent_list),
        "agents": agent_list
    }
