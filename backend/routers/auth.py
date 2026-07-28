from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
from config import settings
from database.connection import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(req: LoginRequest):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database unavailable")

    user = await db["users"].find_one({"username": req.username})
    if not user:
        # Default demo fallback user if not found
        user = {
            "id": "USR-DEMO",
            "username": req.username,
            "email": f"{req.username}@twinsphere.edu",
            "full_name": req.username.capitalize() + " Admin",
            "role": "Super Admin",
            "department": "Campus Operations Command",
            "created_at": datetime.utcnow().isoformat()
        }

    payload = {
        "sub": user["username"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "department": user.get("department", "Operations"),
            "created_at": user.get("created_at", datetime.utcnow().isoformat())
        }
    }

@router.get("/me")
async def get_me():
    return {
        "id": "USR-01",
        "username": "admin",
        "email": "admin@twinsphere.edu",
        "full_name": "Dr. Aris Thorne",
        "role": "Super Admin",
        "department": "Campus Operations Command"
    }
