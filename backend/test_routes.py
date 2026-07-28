import asyncio
import traceback
from database.connection import init_db, get_db
from routers.command_center import get_command_center_summary
from routers.digital_twin import get_buildings
from routers.incidents import get_incidents

async def main():
    await init_db()
    print("Testing get_command_center_summary()...")
    try:
        res = await get_command_center_summary()
        print("Summary SUCCESS:", res)
    except Exception as e:
        print("Summary FAILED:")
        traceback.print_exc()

    print("Testing get_buildings()...")
    try:
        bldgs = await get_buildings()
        print("Buildings SUCCESS:", len(bldgs))
    except Exception as e:
        print("Buildings FAILED:")
        traceback.print_exc()

    print("Testing get_incidents()...")
    try:
        inc = await get_incidents()
        print("Incidents SUCCESS:", len(inc))
    except Exception as e:
        print("Incidents FAILED:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
