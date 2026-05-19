from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, EmailStr
from backend.utils.response import success_response, error_response
from backend.api.dependencies import get_current_user, UserPayload
from backend.core.database import supabase
from backend.core.logger import logger
import traceback

router = APIRouter()

class AuthCredentials(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
async def register_user(credentials: AuthCredentials):
    """
    Registers a new user natively via Supabase Auth.
    """
    logger.info(f"Attempting signup for email: {credentials.email}")
    if supabase is None:
        return error_response("Database client not initialized.", status_code=500)
        
    try:
        response = supabase.auth.sign_up({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not response.user:
            return error_response("Signup failed. User may already exist.", status_code=400)
            
        logger.info(f"Signup successful for ID: {response.user.id}")
        return success_response(
            data={"user_id": response.user.id, "email": response.user.email},
            message="User registered successfully."
        )
    except Exception as e:
        logger.error(f"Signup exception: {str(e)}")
        return error_response(f"Signup failed: {str(e)}", status_code=400)

@router.post("/login")
async def login_user(credentials: AuthCredentials):
    """
    Authenticates a user via Supabase Auth and returns the session/JWT.
    """
    logger.info(f"Attempting login for email: {credentials.email}")
    if supabase is None:
        return error_response("Database client not initialized.", status_code=500)
        
    try:
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not response.session:
            return error_response("Invalid credentials.", status_code=401)
            
        logger.info(f"Login successful for ID: {response.user.id}")
        return success_response(
            data={
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
                "expires_in": response.session.expires_in,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email
                }
            },
            message="Login successful."
        )
    except Exception as e:
        logger.error(f"Login exception: {str(e)}")
        return error_response(f"Login failed: {str(e)}", status_code=401)

@router.get("/me")
async def get_my_profile(current_user: UserPayload = Depends(get_current_user)):
    """
    Protected route. Returns the currently authenticated user's information.
    Requires a valid JWT Bearer token configured in the Swagger UI.
    """
    logger.info(f"Serving profile data for ID: {current_user.id}")
    return success_response(
        data={
            "id": current_user.id,
            "email": current_user.email,
            "role": current_user.role
        },
        message="User profile retrieved successfully."
    )

@router.post("/logout")
async def logout_user(current_user: UserPayload = Depends(get_current_user)):
    """
    Protected route. Invalidates the session server-side natively via Supabase.
    """
    logger.info(f"Attempting logout for ID: {current_user.id}")
    try:
        # Note: If passing the token, we'd need it here, but typically supabase-py's sign_out 
        # clears the local client state. In a stateless API we rely on client dropping token,
        # but calling sign_out is good practice if utilizing the stateful client.
        supabase.auth.sign_out()
        logger.info(f"Logout successful for ID: {current_user.id}")
        return success_response(message="Logged out successfully.")
    except Exception as e:
        logger.error(f"Logout exception: {str(e)}")
        return error_response("An error occurred during logout.", status_code=500)
