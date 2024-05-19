from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import List, Optional
from deps import get_thing_handler
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models
class Thing(BaseModel):
    name: str
    description: str
    metadata: dict = None
    vector: List[float] = None

class ThingUpdate(BaseModel):
    name: str = None
    description: str = None
    metadata: dict = None

class SimilarityRequest(BaseModel):
    vector: List[float]
    top_n: int = 5

@router.post("/things/")
def create_thing(thing: Thing, thing_handler=Depends(get_thing_handler)):
    try:
        created_thing = thing_handler.create_thing(thing.name, thing.description, thing.metadata, thing.vector)
        return {
            "message": "Thing created successfully",
            "id": created_thing['id'],
            "name": created_thing['name'],
            "description": created_thing['description'],
            "metadata": created_thing['metadata'],
            "link": f"/things/{created_thing['id']}"
        }
    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/things/{id}")
def get_thing_by_id(id: str, thing_handler=Depends(get_thing_handler)):
    thing = thing_handler.get_thing_by_id(id)
    if thing is None:
        raise HTTPException(status_code=404, detail="Thing not found")
    return thing

@router.get("/things/name/{name}")
def get_thing_by_name(name: str, thing_handler=Depends(get_thing_handler)):
    thing = thing_handler.get_thing_by_name(name)
    if thing is None:
        raise HTTPException(status_code=404, detail="Thing not found")
    return thing

@router.put("/things/{id}")
def update_thing(id: str, thing_update: ThingUpdate, thing_handler=Depends(get_thing_handler)):
    thing = thing_handler.update_thing(id, thing_update.name, thing_update.description, thing_update.metadata)
    if not thing:
        raise HTTPException(status_code=404, detail="Thing not found")
    return {
        "message": "Thing updated successfully",
        "id": thing['id'],
        "name": thing['name'],
        "description": thing['description'],
        "metadata": thing['metadata']
    }

@router.delete("/things/{id}")
def delete_thing(id: str, thing_handler=Depends(get_thing_handler)):
    deleted_id = thing_handler.delete_thing(id)
    if not deleted_id:
        raise HTTPException(status_code=404, detail="Thing not found")
    return {"message": "Thing deleted successfully", "id": deleted_id}

@router.get("/things/search")
def search_things(
    name: Optional[str] = Query(None),
    description: Optional[str] = Query(None),
    metadata: Optional[str] = Query(None),
    thing_handler=Depends(get_thing_handler)
):
    try:
        metadata_dict = json.loads(metadata) if metadata else None
        things = thing_handler.search_things(name, description, metadata_dict)
        return things
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/things/similar")
def find_similar_things(similarity_request: SimilarityRequest, thing_handler=Depends(get_thing_handler)):
    try:
        vector = similarity_request.vector
        top_n = similarity_request.top_n
        similar_things = thing_handler.find_similar_things(vector, top_n)
        return similar_things
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
