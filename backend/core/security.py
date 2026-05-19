from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.core.logger import logger
from backend.core.database import supabase
import traceback

# This enables the "Authorize" button in Swagger UI
security = HTTPBearer(auto_error=True)

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verify the JWT token issued by Supabase Auth using the Supabase-native API.
    This guarantees we are not manually decoding JWTs and rely entirely on Supabase validation.
    """
    token = credentials.credentials
    logger.info("Attempting to verify Bearer token via Supabase-native auth.")

    if supabase is None:
        logger.error("Supabase client is not initialized. Cannot verify token.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication infrastructure is offline."
        )

    try:
        # Use Supabase-native get_user with the provided JWT
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            logger.warning("Token verification failed: Supabase returned no user.")
            raise ValueError("Invalid or expired session.")
            
        logger.info(f"Token successfully validated for user ID: {user_response.user.id}")
        return user_response.user
        
    except Exception as e:
        logger.error(f"Supabase auth verification exception: {str(e)}")
        logger.debug(f"Auth Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
