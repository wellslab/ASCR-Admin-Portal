from fastapi import WebSocket
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)


class ConnectionManager:

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        if self.active_connections:
            logger.info(f"Broadcasting to {len(self.active_connections)} clients: {message}")
            for connection in self.active_connections.copy():
                try:
                    await connection.send_json(message)
                except Exception:
                    self.active_connections.remove(connection)


websocket_manager = ConnectionManager()


async def broadcast_task_completion(notification_data: Dict[str, Any]):
    await websocket_manager.broadcast({
        "type": notification_data["type"],
        "task_id": notification_data["task_id"],
        "filename": notification_data["filename"],
        "result": notification_data["result"],
        "timestamp": notification_data["timestamp"],
    })


async def broadcast_task_progress(progress_data: Dict[str, Any]):
    await websocket_manager.broadcast({
        "type": progress_data["type"],
        "task_id": progress_data["task_id"],
        "stage": progress_data["stage"],
        "status": progress_data["status"],
        "message": progress_data["message"],
        "data": progress_data.get("data", {}),
        "timestamp": progress_data["timestamp"],
    })
