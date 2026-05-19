from fastapi import Depends, HTTPException, status
from pydantic import BaseModel
from backend.core.security import verify_token
from backend.core.logger import logger
from typing import Any

class UserPayload(BaseModel):
    id: str
    email: str
    role: str

def get_current_user(supabase_user: Any = Depends(verify_token)) -> UserPayload:
    """
    Extracts the user details from the natively validated Supabase user object.
    Inject this dependency into any route that requires a valid session.
    """
    try:
        # supabase_user is a User object returned by supabase.auth.get_user()
        user_id = getattr(supabase_user, "id", None)
        email = getattr(supabase_user, "email", "")
        role = getattr(supabase_user, "role", "authenticated")
        
        if not user_id:
            logger.error("Missing ID in verified Supabase user object.")
            raise ValueError("Token resolved but user ID is missing.")
            
        logger.info(f"Current user dependency resolved for: {email}")
        return UserPayload(id=str(user_id), email=email, role=role)
        
    except Exception as e:
        logger.error(f"Error mapping current user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not map user credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
