from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from backend.core.logger import logger
from backend.utils.response import error_response

class FlowzintException(Exception):
    """Base exception for Flowzint AI backend."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(FlowzintException)
    async def flowzint_exception_handler(request: Request, exc: FlowzintException):
        logger.warning(f"FlowzintException: {exc.message}")
        return error_response(message=exc.message, status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled Exception: {str(exc)}", exc_info=True)
        return error_response(message="An unexpected server error occurred.", status_code=500)
