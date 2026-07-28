import asyncio
import random
import logging
from datetime import datetime
from database.connection import get_db
from services.websocket_manager import manager as ws_manager
from services.anomaly_detector import anomaly_detector

logger = logging.getLogger("twinsphere.sensor_sim")

class SensorSimulator:
    def __init__(self):
        self.is_running = False

    async def start(self):
        self.is_running = True
        logger.info("Live Sensor Simulator started...")
        while self.is_running:
            try:
                await self.generate_tick()
                await asyncio.sleep(4.0)
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.warning(f"Error in sensor simulator tick: {e}")
                await asyncio.sleep(5.0)

    def stop(self):
        self.is_running = False

    async def generate_tick(self):
        db = get_db()
        if db is None:
            return

        cursor = db["buildings"].find()
        buildings = await cursor.to_list(100)
        if not buildings:
            return

        # Pick 2-3 random buildings to update telemetry
        sample_bldgs = random.sample(buildings, min(3, len(buildings)))
        for b in sample_bldgs:
            b_id = b["id"]
            # Small realistic drift
            p_kw = round(max(5.0, b.get("power_kw", 25.0) + random.uniform(-1.5, 1.5)), 1)
            w_lpm = round(max(0.0, b.get("water_flow_lpm", 15.0) + random.uniform(-0.5, 0.5)), 1)
            temp = round(max(18.0, min(38.0, b.get("temperature_c", 22.5) + random.uniform(-0.3, 0.3))), 1)

            # Keep building doc up to date
            await db["buildings"].update_one(
                {"id": b_id},
                {"$set": {
                    "power_kw": p_kw,
                    "water_flow_lpm": w_lpm,
                    "temperature_c": temp,
                    "last_updated": datetime.utcnow().isoformat()
                }}
            )

            # Broadcast building update over WebSocket
            await ws_manager.broadcast({
                "type": "BUILDING_TELEMETRY_UPDATE",
                "data": {
                    "id": b_id,
                    "name": b.get("name"),
                    "power_kw": p_kw,
                    "water_flow_lpm": w_lpm,
                    "temperature_c": temp,
                    "status": b.get("status", "GREEN")
                }
            })

sensor_simulator = SensorSimulator()
