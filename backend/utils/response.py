from fastapi.responses import JSONResponse
from typing import Any, Dict, Optional

def success_response(data: Any = None, message: str = "Success", status_code: int = 200) -> JSONResponse:
    """Standardized success response format."""
    content: Dict[str, Any] = {
        "status": "success",
        "message": message,
    }
    if data is not None:
        content["data"] = data
        
    return JSONResponse(status_code=status_code, content=content)

def error_response(message: str, error_code: Optional[str] = None, status_code: int = 400) -> JSONResponse:
    """Standardized error response format."""
    content: Dict[str, Any] = {
        "status": "error",
        "message": message,
    }
    if error_code is not None:
        content["error_code"] = error_code
        
    return JSONResponse(status_code=status_code, content=content)
