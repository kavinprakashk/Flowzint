from fastapi import APIRouter
from backend.utils.response import success_response, error_response
from backend.core.database import supabase, supabase_admin
from backend.core.logger import logger
import traceback

router = APIRouter()

@router.get("/ping")
async def test_database_connection():
    """
    Tests the connection to Supabase by fetching a generic non-auth row 
    or just executing a light query to verify the instance is reachable.
    """
    logger.info("Received request to /api/v1/db/ping")
    
    if supabase is None:
        logger.error("Supabase client is None. Cannot ping database.")
        return error_response(
            message="Database client not initialized. Check server logs.",
            error_code="DB_INIT_ERROR",
            status_code=500
        )

    try:
        # We test by querying the 'users' table or falling back to a raw health verification.
        logger.info("Executing Supabase query: supabase.table('users').select('id').limit(1)")
        response = supabase.table("users").select("id").limit(1).execute()
        
        logger.info(f"Supabase query successful. Returned data: {response.data}")
        return success_response(
            data={"connected": True, "details": "Successfully contacted Supabase via REST API.", "response_data": response.data},
            message="Database connection successful."
        )
    except Exception as e:
        # Capture the full traceback for debugging
        error_trace = traceback.format_exc()
        logger.error(f"Database connection test failed. Exception: {str(e)}")
        logger.error(f"Full traceback:\n{error_trace}")
        
        return error_response(
            message=f"Database connection failed: {str(e)}",
            error_code="DB_CONN_ERROR",
            status_code=500
        )
