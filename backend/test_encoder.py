import asyncio
from fastapi.encoders import jsonable_encoder
from database.connection import init_db
from routers.digital_twin import get_buildings

async def main():
    await init_db()
    bldgs = await get_buildings()
    try:
        json_data = jsonable_encoder(bldgs)
        print("Encoder SUCCESS!")
    except Exception as e:
        print("Encoder FAILED with Exception:", e)

if __name__ == "__main__":
    asyncio.run(main())
