from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from deps import get_user_handler
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models
class User(BaseModel):
    username: str
    email: str
    metadata: dict = None

class UserUpdate(BaseModel):
    email: str = None
    metadata: dict = None

@router.post("/users/")
def create_user(user: User, user_handler=Depends(get_user_handler)):
    try:
        user_id = user_handler.create_user(user.username, user.email, user.metadata)
        if user_id is None:
            raise HTTPException(status_code=500, detail="User creation failed")
        return {
            "message": "User created successfully",
            "user_id": user_id,
            "username": user.username,
            "email": user.email,
            "metadata": user.metadata
        }
    except ValueError as e:
        logger.error(f"ValueError: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/users/username/{username}")
def get_user_by_username(username: str, user_handler=Depends(get_user_handler)):
    user = user_handler.get_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/users/id/{user_id}")
def get_user_by_id(user_id: str, user_handler=Depends(get_user_handler)):
    user = user_handler.get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}")
def update_user(user_id: str, user_update: UserUpdate, user_handler=Depends(get_user_handler)):
    user = user_handler.update_user(user_id, user_update.email, user_update.metadata)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "message": "User updated successfully",
        "user_id": user['id'],
        "username": user['username'],
        "email": user['email'],
        "metadata": user['metadata']
    }

@router.delete("/users/{user_id}")
def delete_user(user_id: str, user_handler=Depends(get_user_handler)):
    user_id = user_handler.delete_user(user_id)
    if user_id is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully", "user_id": user_id}
