# Synapse

Synapse is an API designed to act as a connection between your Neo4j database, front end, and other components.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/mxrg999/NeuroNet.git
    cd NeuroNet
    cd synapse
    ```

2. **Install dependencies**:
    ```bash
    pip install fastapi uvicorn pydantic neo4j
    ```

3. **Setup Neo4j**:
    - Ensure Neo4j is running and accessible.
    - Update the connection parameters (`uri`, `user`, `password`) in the `DatabaseHandler` initialization in `deps.py`.

## Running the API

1. **Start the FastAPI server**:
    ```bash
    uvicorn main:app --reload
    ```

2. **Access the API** at `http://localhost:8000`.
