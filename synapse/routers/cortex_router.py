from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
from ollama import Client
from typing import List

api_router = APIRouter()

# Define the Ollama client
ollama_client = Client(host='http://cortex:11434')

# Define Pydantic models for request and response bodies
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    content: str

class GenerateRequest(BaseModel):
    model: str
    prompt: str

class GenerateResponse(BaseModel):
    content: str

class EmbeddingRequest(BaseModel):
    model: str
    prompt: str

class EmbeddingResponse(BaseModel):
    embeddings: List[float]

class ImageAnalysisRequest(BaseModel):
    image_base64: str

class ImageAnalysisResponse(BaseModel):
    description: str

# Define the chat endpoint
@api_router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = ollama_client.chat(model=request.model, messages=[message.dict() for message in request.messages])
        return ChatResponse(content=response['message']['content'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define the generate endpoint
@api_router.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    try:
        response = ollama_client.generate(model=request.model, prompt=request.prompt)
        return GenerateResponse(content=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define the embeddings endpoint
@api_router.post("/embeddings", response_model=EmbeddingResponse)
async def embeddings(request: EmbeddingRequest):
    try:
        response = ollama_client.embeddings(model=request.model, prompt=request.prompt)
        return EmbeddingResponse(embeddings=response['embeddings'])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Define the image analysis endpoint
@api_router.post("/image-analysis", response_model=ImageAnalysisResponse)
async def image_analysis(request: ImageAnalysisRequest):
    try:
        # Here, you would include your image analysis logic
        # For demonstration, we return a placeholder response
        description = "This is a placeholder for image analysis result."
        return ImageAnalysisResponse(description=description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

