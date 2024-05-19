# Synapse

Synapse is an API designed to act as a connection between your Neo4j database, frontend, and other components. It provides endpoints for managing users, to-dos, events, and consumables, with flexible metadata support and various filtering options.

## Features

- **User Management**: Create, retrieve, and update users with metadata.
- **To-Do Management**: Create, retrieve, and complete to-dos with dynamic intervals and metadata.
- **Event Logging**: Create and update events for to-dos and other entities.
- **Consumable Management**: Create, retrieve, and update consumables with expiry dates and quantities.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/synapse.git
    cd synapse
    ```

2. **Install dependencies**:
    ```bash
    pip install fastapi uvicorn pydantic neo4j
    ```

3. **Setup Neo4j**:
    - Ensure Neo4j is running and accessible.
    - Update the connection parameters (`uri`, `user`, `password`) in the `DatabaseHandler` initialization.

## Running the API

1. **Start the FastAPI server**:
    ```bash
    uvicorn main:app --reload
    ```

2. **Access the API** at `http://localhost:8000`.

## API Endpoints

### User Endpoints

- **Create a User**: `POST /users/`
    - Request Body:
      ```json
      {
          "username": "max",
          "email": "max@example.com",
          "created_at": "2024-05-17T10:00:00Z",
          "metadata": {"preferences": {"theme": "dark", "notifications": true}}
      }
      ```
- **Get a User**: `GET /users/{username}`
- **Update a User**: `PUT /users/{username}`
    - Request Body:
      ```json
      {
          "email": "new-email@example.com",
          "metadata": {"preferences": {"theme": "light", "notifications": false}}
      }
      ```

### To-Do Endpoints

- **Create a To-Do**: `POST /todos/`
    - Request Body:
      ```json
      {
          "username": "max",
          "title": "Take out trash",
          "description": "Take out the trash every month",
          "due_date": "2024-06-01T10:00:00Z",
          "interval_value": 30,
          "interval_unit": "days",
          "priority": "high",
          "status": "pending",
          "created_by": "max",
          "source_interface": "web",
          "metadata": {"category": "household"}
      }
      ```
- **Get To-Dos**: `GET /todos/`
    - Query Parameters:
      - `due_date` (optional): Filter by due date.
      - `username` (optional): Filter by username.
      - `completed` (optional): Filter by completion status.
- **Complete a To-Do**: `POST /todos/{todo_title}/complete`
    - Request Body:
      ```json
      {
          "username": "max",
          "completed_by": "max",
          "source_interface": "web",
          "metadata": {"notes": "Completed on time"}
      }
      ```

### Event Endpoints

- **Create an Event**: `POST /events/`
    - Request Body:
      ```json
      {
          "username": "max",
          "event_type": "COMPLETED",
          "timestamp": "2024-05-10T14:00:00Z",
          "metadata": {"notes": "Completed on time"},
          "related_node_id": "some_node_id",
          "related_node_label": "Todo",
          "created_by": "max",
          "source_interface": "web"
      }
      ```
- **Update an Event**: `PUT /events/{event_id}`
    - Request Body:
      ```json
      {
          "event_type": "UPDATED_TYPE",
          "timestamp": "2024-05-10T14:00:00Z",
          "metadata": {"notes": "Updated completion notes"},
          "updated_by": "admin",
          "source_interface": "mobile"
      }
      ```

### Consumable Endpoints

- **Create a Consumable**: `POST /consumables/`
    - Request Body:
      ```json
      {
          "username": "max",
          "name": "Milk",
          "quantity": 2,
          "expiry_date": "2024-05-20T10:00:00Z",
          "category": "dairy",
          "metadata": {"brand": "Brand A"}
      }
      ```
- **Get Consumables**: `GET /consumables/`
    - Query Parameters:
      - `expiry_date` (optional): Filter by expiry date.
      - `quantity` (optional): Filter by quantity.
      - `username` (optional): Filter by username.
- **Update a Consumable**: `PUT /consumables/{consumable_id}`
    - Request Body:
      ```json
      {
          "name": "Milk",
          "quantity": 3,
          "expiry_date": "2024-06-01T10:00:00Z",
          "category": "dairy",
          "updated_by": "max"
      }
      ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.
