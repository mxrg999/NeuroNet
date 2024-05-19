import json
from datetime import datetime
from typing import List

class TaskHandler:
    def __init__(self, db_handler):
        self.db_handler = db_handler

    def create_task(self, title, description, metadata=None, vector=None):
        created_at = datetime.now().isoformat()
        updated_at = created_at
        metadata_json = json.dumps(metadata) if metadata else None
        
        query = """
        CREATE (task:Task {
            title: $title,
            description: $description,
            created_at: $created_at,
            updated_at: $updated_at,
            metadata: $metadata,
            vector: $vector
        })
        RETURN task, elementId(task) AS id
        """
        result = self.db_handler.execute_query(query, {
            'title': title,
            'description': description,
            'created_at': created_at,
            'updated_at': updated_at,
            'metadata': metadata_json,
            'vector': vector
        })
        if result:
            task = dict(result[0]['task'])
            task['id'] = result[0]['id']
            task['metadata'] = json.loads(task['metadata']) if task.get('metadata') else None
            return task
        return None

    def get_task_by_id(self, id):
        query = """
        MATCH (task:Task)
        WHERE elementId(task) = $id
        RETURN task, elementId(task) AS id
        """
        result = self.db_handler.execute_query(query, {'id': id})
        if result:
            task = dict(result[0]['task'])
            task['id'] = result[0]['id']
            task['metadata'] = json.loads(task['metadata']) if task.get('metadata') else None
            return task
        return None

    def get_task_by_title(self, title):
        query = """
        MATCH (task:Task {title: $title})
        RETURN task, elementId(task) AS id
        """
        result = self.db_handler.execute_query(query, {'title': title})
        if result:
            task = dict(result[0]['task'])
            task['id'] = result[0]['id']
            task['metadata'] = json.loads(task['metadata']) if task.get('metadata') else None
            return task
        return None

    def update_task(self, id, title=None, description=None, metadata=None):
        updated_at = datetime.now().isoformat()
        
        set_clauses = []
        parameters = {'id': id, 'updated_at': updated_at}
        
        if title is not None:
            set_clauses.append("task.title = $title")
            parameters['title'] = title
        if description is not None:
            set_clauses.append("task.description = $description")
            parameters['description'] = description
        if metadata is not None:
            metadata_json = json.dumps(metadata)
            set_clauses.append("task.metadata = $metadata")
            parameters['metadata'] = metadata_json
        
        set_clauses.append("task.updated_at = $updated_at")
        set_clause = ", ".join(set_clauses)
        
        query = f"""
        MATCH (task:Task)
        WHERE elementId(task) = $id
        SET {set_clause}
        RETURN task, elementId(task) AS id
        """
        result = self.db_handler.execute_query(query, parameters)
        if result:
            task = dict(result[0]['task'])
            task['id'] = result[0]['id']
            task['metadata'] = json.loads(task['metadata']) if task.get('metadata') else None
            return task
        return None

    def delete_task(self, id):
        query = """
        MATCH (task:Task)
        WHERE elementId(task) = $id
        WITH task, elementId(task) AS id
        DETACH DELETE task
        RETURN id
        """
        result = self.db_handler.execute_query(query, {'id': id})
        if result:
            return result[0]['id']
        return None

    def search_tasks(self, title=None, description=None, metadata=None):
        conditions = []
        parameters = {}
        
        if title:
            conditions.append("task.title CONTAINS $title")
            parameters['title'] = title
        if description:
            conditions.append("task.description CONTAINS $description")
            parameters['description'] = description
        if metadata:
            conditions.append("task.metadata CONTAINS $metadata")
            parameters['metadata'] = json.dumps(metadata)
        
        where_clause = " AND ".join(conditions) if conditions else "1=1"
        
        query = f"""
        MATCH (task:Task)
        WHERE {where_clause}
        RETURN task, elementId(task) AS id
        """
        result = self.db_handler.execute_query(query, parameters)
        tasks = []
        for record in result:
            task = dict(record['task'])
            task['id'] = record['id']
            task['metadata'] = json.loads(task['metadata']) if task.get('metadata') else None
            tasks.append(task)
        return tasks

    def find_similar_tasks(self, vector: List[float], top_n=5):
        run_similarity_query = """
        WITH $vector AS target_vector
        MATCH (task:Task)
        WHERE task.vector IS NOT NULL
        WITH task, gds.similarity.cosine(task.vector, target_vector) AS similarity
        RETURN task, elementId(task) AS id, similarity
        ORDER BY similarity DESC
        LIMIT $top_n
        """
        
        parameters = {
            'vector': vector,
            'top_n': top_n
        }
        result = self.db_handler.execute_query(run_similarity_query, parameters)

        similar_tasks = []
        for record in result:
            task = dict(record['task'])
            task['id'] = record['id']
            task['similarity'] = record['similarity']
            similar_tasks.append(task)
        
        return similar_tasks
