from fastapi import APIRouter

router = APIRouter()

@router.get("/emails")
def get_emails():
    # Placeholder for integrating the existing Gmail Agent module
    return {"emails": []}
