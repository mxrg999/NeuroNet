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
        RETURN p, elementId(p) AS id
        """
        result = self.db_handler.execute_query(query, {
            'name': name,
            'description': description,
            'created_at': created_at,
            'updated_at': updated_at,
            'metadata': metadata_json
        })
        if result:
            place = dict(result[0]['p'])
            place['id'] = result[0]['id']
            place['metadata'] = json.loads(place['metadata']) if place.get('metadata') else None
            return place
        return None

    def update_place(self, id, name=None, description=None, metadata=None):
        updated_at = datetime.now().isoformat()
        
        set_clauses = []
        parameters = {'id': id, 'updated_at': updated_at}
        
        if name is not None:
            set_clauses.append("p.name = $name")
            parameters['name'] = name
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
        MATCH (p:Place)
        WHERE elementId(p) = $id
        SET {set_clause}
        RETURN p, elementId(p) AS id
        """
        result = self.db_handler.execute_query(query, parameters)
        if result:
            place = dict(result[0]['p'])
            place['id'] = result[0]['id']
            place['metadata'] = json.loads(place['metadata']) if place.get('metadata') else None
            return place
        return None

    def delete_place(self, id):
        query = """
        MATCH (p:Place)
        WHERE elementId(p) = $id
        WITH p, elementId(p) AS id
        DETACH DELETE p
        RETURN id
        """
        result = self.db_handler.execute_query(query, {'id': id})
        if result:
            return result[0]['id']
        return None

    def get_place_by_id(self, id):
        query = """
        MATCH (p:Place)
        WHERE elementId(p) = $id
        RETURN p, elementId(p) AS id
        """
        result = self.db_handler.execute_query(query, {'id': id})
        if result:
            place = dict(result[0]['p'])
            place['id'] = result[0]['id']
            place['metadata'] = json.loads(place['metadata']) if place.get('metadata') else None
            return place
        return None

    def get_place_by_name(self, name):
        query = """
        MATCH (p:Place {name: $name})
        RETURN p, elementId(p) AS id
        """
        result = self.db_handler.execute_query(query, {'name': name})
        if result:
            place = dict(result[0]['p'])
            place['id'] = result[0]['id']
            place['metadata'] = json.loads(place['metadata']) if place.get('metadata') else None
            return place
        return None

    def get_all_places(self):
        query = """
        MATCH (p:Place)
        RETURN p, elementId(p) AS id
        """
        result = self.db_handler.execute_query(query)
        places = []
        for record in result:
            place = dict(record['p'])
            place['id'] = record['id']
            place['metadata'] = json.loads(place['metadata']) if place.get('metadata') else None
            places.append(place)
        return places
