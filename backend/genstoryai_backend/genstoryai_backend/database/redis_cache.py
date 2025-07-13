import redis
import json
from typing import Optional, Any

class RedisCache:
    def __init__(self, url: str = "redis://localhost:6379/0"):
        self.client = redis.Redis.from_url(url, decode_responses=True)

    def cache_session(self, session_id: str, session_data: dict, ttl: int = 3600):
        key = f"session:{session_id}"
        self.client.setex(key, ttl, json.dumps(session_data))

    def get_session(self, session_id: str) -> Optional[dict]:
        key = f"session:{session_id}"
        data = self.client.get(key)
        return json.loads(str(data)) if data else None

    def cache_session_messages(self, session_id: str, messages: list, ttl: int = 3600):
        key = f"session:{session_id}:messages"
        self.client.setex(key, ttl, json.dumps(messages))

    def get_session_messages(self, session_id: str) -> Optional[list]:
        key = f"session:{session_id}:messages"
        data = self.client.get(key)
        return json.loads(str(data)) if data else None

    def invalidate_session(self, session_id: str):
        self.client.delete(f"session:{session_id}")
        self.client.delete(f"session:{session_id}:messages") 