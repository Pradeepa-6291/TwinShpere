import logging
import asyncio
from typing import Dict, Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

logger = logging.getLogger("twinsphere.db")

class MemoryCollection:
    """In-memory MongoDB collection mock for zero-friction fallback when MongoDB is unreachable."""
    def __init__(self, name: str):
        self.name = name
        self._data: List[Dict[str, Any]] = []

    async def insert_one(self, document: Dict[str, Any]):
        doc_copy = dict(document)
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(len(self._data) + 1)
        self._data.append(doc_copy)
        class InsertResult:
            inserted_id = doc_copy["_id"]
        return InsertResult()

    async def insert_many(self, documents: List[Dict[str, Any]]):
        ids = []
        for doc in documents:
            res = await self.insert_one(doc)
            ids.append(res.inserted_id)
        class InsertManyResult:
            inserted_ids = ids
        return InsertManyResult()

    async def find_one(self, filter_dict: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        filter_dict = filter_dict or {}
        for doc in self._data:
            match = True
            for k, v in filter_dict.items():
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                return dict(doc)
        return None

    def find(self, filter_dict: Dict[str, Any] = None):
        filter_dict = filter_dict or {}
        matched = []
        for doc in self._data:
            match = True
            for k, v in filter_dict.items():
                if k.startswith("$"):
                    continue
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                matched.append(dict(doc))
        
        class Cursor:
            def __init__(self, data):
                self.data = data
            def sort(self, key, direction=-1):
                reverse = direction == -1
                self.data.sort(key=lambda x: x.get(key, ""), reverse=reverse)
                return self
            def limit(self, l):
                self.data = self.data[:l]
                return self
            async def to_list(self, length=1000):
                return self.data[:length]
            def __aiter__(self):
                self._iter = iter(self.data)
                return self
            async def __anext__(self):
                try:
                    return next(self._iter)
                except StopIteration:
                    raise StopAsyncIteration

        return Cursor(matched)

    async def update_one(self, filter_dict: Dict[str, Any], update_dict: Dict[str, Any]):
        doc = await self.find_one(filter_dict)
        if doc:
            for item in self._data:
                if item["_id"] == doc["_id"]:
                    if "$set" in update_dict:
                        item.update(update_dict["$set"])
                    if "$push" in update_dict:
                        for k, v in update_dict["$push"].items():
                            if k not in item:
                                item[k] = []
                            item[k].append(v)
                    break
        class UpdateResult:
            modified_count = 1 if doc else 0
        return UpdateResult()

    async def delete_many(self, filter_dict: Dict[str, Any] = None):
        if not filter_dict:
            count = len(self._data)
            self._data.clear()
            class DeleteResult:
                deleted_count = count
            return DeleteResult()
        initial = len(self._data)
        self._data = [doc for doc in self._data if not all(doc.get(k) == v for k, v in filter_dict.items())]
        class DeleteResult:
            deleted_count = initial - len(self._data)
        return DeleteResult()

    async def count_documents(self, filter_dict: Dict[str, Any] = None) -> int:
        if not filter_dict:
            return len(self._data)
        count = 0
        for doc in self._data:
            if all(doc.get(k) == v for k, v in filter_dict.items()):
                count += 1
        return count

class MemoryDatabase:
    def __init__(self):
        self.collections: Dict[str, MemoryCollection] = {}

    def __getitem__(self, name: str) -> MemoryCollection:
        if name not in self.collections:
            self.collections[name] = MemoryCollection(name)
        return self.collections[name]

    def get_collection(self, name: str) -> MemoryCollection:
        return self[name]


db = None
is_mongo_connected = False

async def init_db():
    global db, is_mongo_connected
    try:
        logger.info(f"Attempting MongoDB connection to: {settings.MONGODB_URL[:25]}...")
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=8000)
        # Try pinging database
        await client.admin.command('ping')
        db = client[settings.DATABASE_NAME]
        is_mongo_connected = True
        logger.info(f"Connected successfully to MongoDB Atlas database: {settings.DATABASE_NAME}")
    except Exception as e:
        logger.warning(f"MongoDB Atlas connection failed: {e}. Falling back to high-performance in-memory database store.")
        db = MemoryDatabase()
        is_mongo_connected = False

def get_db():
    return db
