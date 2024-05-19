from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from deps import get_db_handler
from routers.user_router import router as user_router
from routers.thing_router import router as thing_router
from routers.relations_router import router as relations_router
from routers.place_router import router as place_router
from routers.filter_router import router as filter_router

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # Add your frontend URL here
    "http://127.0.0.1:3000",  # Add your frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(user_router)
app.include_router(thing_router)
app.include_router(relations_router)
app.include_router(place_router)
app.include_router(filter_router)  # Include the filter router

# Ensure the database connection is closed gracefully on shutdown
def close_db_handler():
    db_handler = get_db_handler()
    db_handler.close()

import atexit
atexit.register(close_db_handler)

# Run the app with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
