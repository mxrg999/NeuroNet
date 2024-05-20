from fastapi import APIRouter, HTTPException, File, UploadFile, Depends
from pydantic import BaseModel
from typing import List, Optional
import requests
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Configuration for Ollama API
OLLAMA_API_URL = "http://cortex:11434"

# Pydantic models
class OllamaRequest(BaseModel):
    model: str
    prompt: str
    options: Optional[dict] = None

class OllamaChatRequest(BaseModel):
    model: str
    messages: List[dict]
    stream: bool = True

class OllamaResponse(BaseModel):
    response: str
    model: str
    context: Optional[List[int]] = None
    duration: Optional[int] = None

class ModelStatus(BaseModel):
    model: str
    status: str
    loaded: bool

class PullModelRequest(BaseModel):
    model_name: str

class EmbeddingRequest(BaseModel):
    model: str
    text: str

class EmbeddingResponse(BaseModel):
    embeddings: List[float]
    model: str

@router.post("/cortex/generate", response_model=OllamaResponse)
def generate_response(ollama_request: OllamaRequest):
    try:
        response = requests.post(f"{OLLAMA_API_URL}/api/generate", json=ollama_request.dict())
        response.raise_for_status()
        data = response.json()
        return OllamaResponse(
            response=data['response'],
            model=data['model'],
            context=data.get('context', []),
            duration=data.get('total_duration')
        )
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate response from Ollama")

@router.post("/cortex/chat", response_model=OllamaResponse)
def chat_with_model(chat_request: OllamaChatRequest):
    try:
        response = requests.post(f"{OLLAMA_API_URL}/api/chat", json=chat_request.dict())
        response.raise_for_status()
        data = response.json()
        return OllamaResponse(
            response=data['message']['content'],
            model=data['model'],
            context=data.get('context', []),
            duration=data.get('total_duration')
        )
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to chat with Ollama model")

@router.get("/cortex/status", response_model=List[ModelStatus])
def get_status():
    try:
        response = requests.get(f"{OLLAMA_API_URL}/api/status")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get status from Ollama")

@router.get("/cortex/models", response_model=List[str])
def list_models():
    try:
        response = requests.get(f"{OLLAMA_API_URL}/api/models")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list models from Ollama")

@router.delete("/cortex/models/{model_name}")
def delete_model(model_name: str):
    try:
        response = requests.delete(f"{OLLAMA_API_URL}/api/models/{model_name}")
        response.raise_for_status()
        return {"message": f"Model {model_name} deleted successfully"}
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete model {model_name} from Ollama")

@router.post("/cortex/models/pull")
def pull_model(pull_model_request: PullModelRequest):
    try:
        response = requests.post(f"{OLLAMA_API_URL}/api/models/pull", json={"model": pull_model_request.model_name})
        response.raise_for_status()
        return {"message": f"Model {pull_model_request.model_name} pulled successfully"}
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to pull model {pull_model_request.model_name} from Ollama")

@router.post("/cortex/analyze-image", response_model=OllamaResponse)
def analyze_image(model: str, file: UploadFile = File(...)):
    try:
        files = {"file": (file.filename, file.file, file.content_type)}
        data = {"model": model}
        response = requests.post(f"{OLLAMA_API_URL}/api/analyze-image", files=files, data=data)
        response.raise_for_status()
        data = response.json()
        return OllamaResponse(
            response=data['response'],
            model=data['model'],
            context=data.get('context', []),
            duration=data.get('total_duration')
        )
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze image with Ollama")

@router.post("/cortex/embeddings", response_model=EmbeddingResponse)
def generate_embeddings(embedding_request: EmbeddingRequest):
    try:
        response = requests.post(f"{OLLAMA_API_URL}/api/embeddings", json=embedding_request.dict())
        response.raise_for_status()
        data = response.json()
        return EmbeddingResponse(
            embeddings=data['embeddings'],
            model=data['model']
        )
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate embeddings from Ollama")
