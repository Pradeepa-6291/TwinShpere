from fastapi import APIRouter
from database.connection import get_db

from database.utils import clean_docs

router = APIRouter(prefix="/resources", tags=["Resource Allocation"])

@router.get("")
async def get_resources():
    db = get_db()
    if db is None:
        return []
    res = await db["resources"].find().to_list(50)
    return clean_docs(res)
