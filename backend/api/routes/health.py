from fastapi import APIRouter
from backend.utils.response import success_response
from backend.core.config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "success",
        "service": "Flowzint AI Backend",
        "project": "PARASITIC AI SOCIAL MEDIA INFRASTRUCTURE"
    }