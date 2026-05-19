from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
import uuid

class BaseDBModel(BaseModel):
    id: Optional[uuid.UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )
