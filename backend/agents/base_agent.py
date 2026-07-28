import logging
from typing import Dict, Any, List
from datetime import datetime
from services.llm_service import llm_service

logger = logging.getLogger("twinsphere.agent")

class BaseAgent:
    def __init__(self, name: str, role: str, description: str):
        self.name = name
        self.role = role
        self.description = description

    async def run(self, task_type: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Base execution wrapper logging timestamp, context, and LLM/fallback output."""
        timestamp = datetime.utcnow().strftime("%H:%M:%S")
        logger.info(f"[{timestamp}] Agent '{self.name}' activated for task '{task_type}'")
        
        reasoning = await llm_service.generate_agent_reasoning(self.name, task_type, context)
        
        result = {
            "timestamp": timestamp,
            "agent_name": self.name,
            "role": self.role,
            "task_type": task_type,
            "output": reasoning,
            "status": "SUCCESS"
        }
        return result
