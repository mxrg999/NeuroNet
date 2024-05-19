import json
from datetime import datetime

class DataHandler:
    def __init__(self, db_handler):
        self.db_handler = db_handler

    def create_data(self, name, description, metadata=None):
        created_at = datetime.now().isoformat()
        updated_at = created_at
        metadata_json = json.dumps(metadata) if metadata else None
        
        query = """
        CREATE (d:Data {
            name: $name,
            description: $description,
            created_at: $created_at,
            updated_at: $updated_at,
            metadata: $metadata
        })
        """
        self.db_handler.execute_query(query, {
            'name': name,
            'description': description,
            'created_at': created_at,
            'updated_at': updated_at,
            'metadata': metadata_json
        })

    def interact_with_data(self, username, data_name, priority=None, status=None, due_date=None, metadata=None):
        interaction_time = datetime.now().isoformat()
        metadata_json = json.dumps(metadata) if metadata else None

        query = """
        MATCH (u:User {username: $username}), (d:Data {name: $data_name})
        CREATE (u)-[:INTERACTED_WITH {
            priority: $priority,
            status: $status,
            due_date: $due_date,
            timestamp: $interaction_time,
            metadata: $metadata
        }]->(d)
        """
        self.db_handler.execute_query(query, {
            'username': username,
            'data_name': data_name,
            'priority': priority,
            'status': status,
            'due_date': due_date.isoformat() if due_date else None,
            'interaction_time': interaction_time,
            'metadata': metadata_json
        })
