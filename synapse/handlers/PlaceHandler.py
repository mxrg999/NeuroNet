import json
from datetime import datetime

class PlaceHandler:
    def __init__(self, db_handler):
        self.db_handler = db_handler

    def create_place(self, name, description, metadata=None):
        created_at = datetime.now().isoformat()
        updated_at = created_at
        metadata_json = json.dumps(metadata) if metadata else None
        
        query = """
        CREATE (p:Place {
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

    def update_place(self, name, description=None, metadata=None):
        updated_at = datetime.now().isoformat()
        
        set_clauses = []
        parameters = {'name': name, 'updated_at': updated_at}
        
        if description is not None:
            set_clauses.append("p.description = $description")
            parameters['description'] = description
        if metadata is not None:
            metadata_json = json.dumps(metadata)
            set_clauses.append("p.metadata = $metadata")
            parameters['metadata'] = metadata_json
        
        set_clauses.append("p.updated_at = $updated_at")
        set_clause = ", ".join(set_clauses)
        
        query = f"""
        MATCH (p:Place {{name: $name}})
        SET {set_clause}
        RETURN p
        """
        result = self.db_handler.execute_query(query, parameters)
        if result:
            place = dict(result[0]['p'])
            place['metadata'] = json.loads(place['metadata']) if place.get('metadata') else None
            return place
        return None

    def delete_place(self, name):
        query = """
        MATCH (p:Place {name: $name})
        DETACH DELETE p
        """
        self.db_handler.execute_query(query, {'name': name})

    def interact_with_place(self, username, place_name, priority=None, status=None, due_date=None, metadata=None):
        interaction_time = datetime.now().isoformat()
        metadata_json = json.dumps(metadata) if metadata else None

        query = """
        MATCH (u:User {username: $username}), (p:Place {name: $place_name})
        CREATE (u)-[:INTERACTED_WITH {
            priority: $priority,
            status: $status,
            due_date: $due_date,
            timestamp: $interaction_time,
            metadata: $metadata
        }]->(p)
        """
        self.db_handler.execute_query(query, {
            'username': username,
            'place_name': place_name,
            'priority': priority,
            'status': status,
            'due_date': due_date.isoformat() if due_date else None,
            'interaction_time': interaction_time,
            'metadata': metadata_json
        })
