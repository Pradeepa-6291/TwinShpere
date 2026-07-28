from fastapi import APIRouter
from pydantic import BaseModel
from services.simulation_engine import simulation_engine
from database.connection import get_db

from database.utils import clean_doc, clean_docs

router = APIRouter(prefix="/simulations", tags=["What-If Simulations"])

class SimulationRequest(BaseModel):
    query: str

@router.post("/run")
async def run_what_if_simulation(req: SimulationRequest):
    result = await simulation_engine.run_simulation(req.query)
    db = get_db()
    if db is not None:
        await db["simulations"].insert_one(result)
    return clean_doc(result)

@router.get("/history")
async def get_simulation_history():
    db = get_db()
    if db is None:
        return []
    sims = await db["simulations"].find().sort("created_at", -1).to_list(20)
    return clean_docs(sims)
