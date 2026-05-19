from supabase import create_client, Client
from backend.core.config import settings
from backend.core.logger import logger

def get_supabase_client() -> Client:
    """
    Returns the default Supabase client using the ANON key.
    Useful for operations mimicking regular users.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        logger.error("Failed to initialize Supabase ANON client: Missing URL or ANON key.")
        raise ValueError("Supabase environment variables not set.")
    
    logger.info(f"Initializing Supabase client with URL: {settings.SUPABASE_URL}")
    try:
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    except Exception as e:
        logger.error(f"Exception during Supabase ANON client creation: {str(e)}")
        raise

def get_supabase_service_client() -> Client:
    """
    Returns a Supabase client initialized with the SERVICE ROLE key.
    Use ONLY for backend/admin tasks that require bypassing RLS.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        logger.error("Failed to initialize Supabase SERVICE client: Missing URL or SERVICE ROLE key.")
        raise ValueError("Supabase service role environment variables not set.")
        
    logger.info(f"Initializing Supabase admin client with URL: {settings.SUPABASE_URL}")
    try:
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        logger.error(f"Exception during Supabase SERVICE client creation: {str(e)}")
        raise

# Initialize globally but handle errors gracefully
try:
    supabase: Client = get_supabase_client()
    logger.info("Supabase ANON client successfully initialized.")
except Exception as e:
    logger.error("Supabase ANON client initialization bypassed due to errors.")
    supabase = None

try:
    supabase_admin: Client = get_supabase_service_client()
    logger.info("Supabase SERVICE client successfully initialized.")
except Exception as e:
    logger.error("Supabase SERVICE client initialization bypassed due to errors.")
    supabase_admin = None
