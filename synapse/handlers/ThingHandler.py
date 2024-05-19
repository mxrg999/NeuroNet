import json
from datetime import datetime
from typing import List

class ThingHandler:
    def __init__(self, db_handler):
        self.db_handler = db_handler

    def create_thing(self, name, description, metadata=None, vector=None):
        created_at = datetime.now().isoformat()
        updated_at = created_at
        metadata_json = json.dumps(metadata) if metadata else None
        
        query = """
        CREATE (t:Thing {
            name: $name,
            description: $description,
            created_at: $created_at,
            updated_at: $updated_at,
            metadata: $metadata,
            vector: $vector
        })
        RETURN t, elementId(t) AS id
        """
        result = self.db_handler.execute_query(query, {
            'name': name,
            'description': description,
            'created_at': created_at,
            'updated_at': updated_at,
            'metadata': metadata_json,
            'vector': vector
        })
        if result:
            thing = dict(result[0]['t'])
            thing['id'] = result[0]['id']
            thing['metadata'] = json.loads(thing['metadata']) if thing.get('metadata') else None
            return thing
        return None

    def get_thing_by_id(self, id):
        query = """
        MATCH (t:Thing)
        WHERE elementId(t) = $id
        RETURN t, elementId(t) AS id
        """
        result = self.db_handler.execute_query(query, {'id': id})
        if result:
            thing = dict(result[0]['t'])
            thing['id'] = result[0]['id']
            thing['metadata'] = json.loads(thing['metadata']) if thing.get('metadata') else None
            return thing
        return None

    def get_thing_by_name(self, name):
        query = """
        MATCH (t:Thing {name: $name})
        RETURN t, elementId(t) AS id
        """
        result = self.db_handler.execute_query(query, {'name': name})
        if result:
            thing = dict(result[0]['t'])
            thing['id'] = result[0]['id']
            thing['metadata'] = json.loads(thing['metadata']) if thing.get('metadata') else None
            return thing
        return None

    def update_thing(self, id, name=None, description=None, metadata=None):
        updated_at = datetime.now().isoformat()
        
        set_clauses = []
        parameters = {'id': id, 'updated_at': updated_at}
        
        if name is not None:
            set_clauses.append("t.name = $name")
            parameters['name'] = name
        if description is not None:
            set_clauses.append("t.description = $description")
            parameters['description'] = description
        if metadata is not None:
            metadata_json = json.dumps(metadata)
            set_clauses.append("t.metadata = $metadata")
            parameters['metadata'] = metadata_json
        
        set_clauses.append("t.updated_at = $updated_at")
        set_clause = ", ".join(set_clauses)
        
        query = f"""
        MATCH (t:Thing)
        WHERE elementId(t) = $id
        SET {set_clause}
        RETURN t, elementId(t) AS id
        """
        result = self.db_handler.execute_query(query, parameters)
        if result:
            thing = dict(result[0]['t'])
            thing['id'] = result[0]['id']
            thing['metadata'] = json.loads(thing['metadata']) if thing.get('metadata') else None
            return thing
        return None

    def delete_thing(self, id):
        query = """
        MATCH (t:Thing)
        WHERE elementId(t) = $id
        WITH t, elementId(t) AS id
        DETACH DELETE t
        RETURN id
        """
        result = self.db_handler.execute_query(query, {'id': id})
        if result:
            return result[0]['id']
        return None

    def search_things(self, name=None, description=None, metadata=None):
        conditions = []
        parameters = {}
        
        if name:
            conditions.append("t.name CONTAINS $name")
            parameters['name'] = name
        if description:
            conditions.append("t.description CONTAINS $description")
            parameters['description'] = description
        if metadata:
            conditions.append("t.metadata CONTAINS $metadata")
            parameters['metadata'] = json.dumps(metadata)
        
        where_clause = " AND ".join(conditions) if conditions else "1=1"
        
        query = f"""
        MATCH (t:Thing)
        WHERE {where_clause}
        RETURN t, elementId(t) AS id
        """
        result = self.db_handler.execute_query(query, parameters)
        things = []
        for record in result:
            thing = dict(record['t'])
            thing['id'] = record['id']
            thing['metadata'] = json.loads(thing['metadata']) if thing.get(['metadata']) else None
            things.append(thing)
        return things

    def find_similar_things(self, vector: List[float], top_n=5):
        run_similarity_query = """
        WITH $vector AS target_vector
        MATCH (t:Thing)
        WHERE t.vector IS NOT NULL
        WITH t, gds.similarity.cosine(t.vector, target_vector) AS similarity
        RETURN t, elementId(t) AS id, similarity
        ORDER BY similarity DESC
        LIMIT $top_n
        """
        
        parameters = {
            'vector': vector,
            'top_n': top_n
        }
        result = self.db_handler.execute_query(run_similarity_query, parameters)

        similar_things = []
        for record in result:
            thing = dict(record['t'])
            thing['id'] = record['id']
            thing['similarity'] = record['similarity']
            similar_things.append(thing)
        
        return similar_things
