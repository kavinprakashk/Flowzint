from fastapi import APIRouter, Depends
from core.database import get_db

router = APIRouter()

@router.get("/status")
def health_check():
    return {"status": "ok", "service": "Flowzint AI Ecosystem"}

@router.get("/db-check")
def db_check(db = Depends(get_db)):
    if db is None:
        return {"status": "error", "message": "Database connection failed"}
    return {"status": "ok", "message": "Database connection successful"}
