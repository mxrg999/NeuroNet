from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import List, Optional
from deps import get_task_handler
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models
class Task(BaseModel):
    title: str
    description: str
    metadata: dict = None
    vector: List[float] = None

class TaskUpdate(BaseModel):
    title: str = None
    description: str = None
    metadata: dict = None

class SimilarityRequest(BaseModel):
    vector: List[float]
    top_n: int = 5

@router.post("/tasks/")
def create_task(task: Task, task_handler=Depends(get_task_handler)):
    try:
        created_task = task_handler.create_task(task.title, task.description, task.metadata, task.vector)
        return {
            "message": "Task created successfully",
            "id": created_task['id'],
            "title": created_task['title'],
            "description": created_task['description'],
            "metadata": created_task['metadata'],
            "link": f"/tasks/{created_task['id']}"
        }
    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/tasks/{id}")
def get_task_by_id(id: str, task_handler=Depends(get_task_handler)):
    task = task_handler.get_task_by_id(id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.get("/tasks/title/{title}")
def get_task_by_title(title: str, task_handler=Depends(get_task_handler)):
    task = task_handler.get_task_by_title(title)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/tasks/{id}")
def update_task(id: str, task_update: TaskUpdate, task_handler=Depends(get_task_handler)):
    task = task_handler.update_task(id, task_update.title, task_update.description, task_update.metadata)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {
        "message": "Task updated successfully",
        "id": task['id'],
        "title": task['title'],
        "description": task['description'],
        "metadata": task['metadata']
    }

@router.delete("/tasks/{id}")
def delete_task(id: str, task_handler=Depends(get_task_handler)):
    deleted_id = task_handler.delete_task(id)
    if not deleted_id:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully", "id": deleted_id}

@router.get("/tasks/search")
def search_tasks(
    title: Optional[str] = Query(None),
    description: Optional[str] = Query(None),
    metadata: Optional[str] = Query(None),
    task_handler=Depends(get_task_handler)
):
    try:
        metadata_dict = json.loads(metadata) if metadata else None
        tasks = task_handler.search_tasks(title, description, metadata_dict)
        return tasks
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/tasks/similar")
def find_similar_tasks(similarity_request: SimilarityRequest, task_handler=Depends(get_task_handler)):
    try:
        vector = similarity_request.vector
        top_n = similarity_request.top_n
        similar_tasks = task_handler.find_similar_tasks(vector, top_n)
        return similar_tasks
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
