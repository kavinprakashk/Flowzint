from typing import TypeVar, Generic, Optional, List, Dict, Any
from backend.core.database import get_supabase_client
from backend.core.logger import logger

T = TypeVar("T")

class BaseService(Generic[T]):
    """
    A generic repository/service class to interact with Supabase tables.
    """
    def __init__(self, table_name: str):
        self.table_name = table_name
        self.client = get_supabase_client()

    def get_by_id(self, item_id: str) -> Optional[Dict[str, Any]]:
        try:
            response = self.client.table(self.table_name).select("*").eq("id", item_id).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            logger.error(f"Error fetching {self.table_name} by id {item_id}: {str(e)}")
            raise

    def get_all(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        try:
            response = self.client.table(self.table_name).select("*").range(offset, offset + limit - 1).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching all from {self.table_name}: {str(e)}")
            raise
            
    def create(self, obj_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = self.client.table(self.table_name).insert(obj_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error creating record in {self.table_name}: {str(e)}")
            raise

    def update(self, item_id: str, obj_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = self.client.table(self.table_name).update(obj_data).eq("id", item_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error updating record {item_id} in {self.table_name}: {str(e)}")
            raise

    def delete(self, item_id: str) -> bool:
        try:
            response = self.client.table(self.table_name).delete().eq("id", item_id).execute()
            return len(response.data) > 0
        except Exception as e:
            logger.error(f"Error deleting record {item_id} from {self.table_name}: {str(e)}")
            raise
