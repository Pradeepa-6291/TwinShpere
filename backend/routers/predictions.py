from fastapi import APIRouter
from database.connection import get_db

from database.utils import clean_docs

router = APIRouter(prefix="/predictions", tags=["Predictive Intelligence"])

@router.get("")
async def get_predictions():
    db = get_db()
    if db is None:
        return []
    predictions = await db["predictions"].find().sort("probability_pct", -1).to_list(50)
    return clean_docs(predictions)
