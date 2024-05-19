from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from deps import get_place_handler
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models
class Place(BaseModel):
    name: str
    description: str
    metadata: dict = None

class PlaceUpdate(BaseModel):
    name: str = None
    description: str = None
    metadata: dict = None

@router.post("/places/")
def create_place(place: Place, place_handler=Depends(get_place_handler)):
    try:
        created_place = place_handler.create_place(place.name, place.description, place.metadata)
        return {
            "message": "Place created successfully",
            "id": created_place['id'],
            "name": created_place['name'],
            "description": created_place['description'],
            "metadata": created_place['metadata'],
            "link": f"/places/{created_place['id']}"
        }
    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/places/{id}")
def get_place_by_id(id: str, place_handler=Depends(get_place_handler)):
    place = place_handler.get_place_by_id(id)
    if place is None:
        raise HTTPException(status_code=404, detail="Place not found")
    return place

@router.get("/places/name/{name}")
def get_place_by_name(name: str, place_handler=Depends(get_place_handler)):
    place = place_handler.get_place_by_name(name)
    if place is None:
        raise HTTPException(status_code=404, detail="Place not found")
    return place

@router.get("/places/")
def get_all_places(place_handler=Depends(get_place_handler)):
    try:
        places = place_handler.get_all_places()
        return places
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.put("/places/{id}")
def update_place(id: str, place_update: PlaceUpdate, place_handler=Depends(get_place_handler)):
    place = place_handler.update_place(id, place_update.name, place_update.description, place_update.metadata)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return {
        "message": "Place updated successfully",
        "id": place['id'],
        "name": place['name'],
        "description": place['description'],
        "metadata": place['metadata']
    }

@router.delete("/places/{id}")
def delete_place(id: str, place_handler=Depends(get_place_handler)):
    deleted_id = place_handler.delete_place(id)
    if not deleted_id:
        raise HTTPException(status_code=404, detail="Place not found")
    return {"message": "Place deleted successfully", "id": deleted_id}
