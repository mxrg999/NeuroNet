import json
from datetime import datetime

class UserHandler:
    def __init__(self, db_handler):
        self.db_handler = db_handler
        
    def create_user(self, username, email, metadata=None):
        # Check if a user with the same username already exists
        existing_user = self.get_user_by_username(username)
        if existing_user:
            raise ValueError(f"User with username '{username}' already exists.")
        
        created_at = datetime.now().isoformat()
        updated_at = created_at
        metadata_json = json.dumps(metadata) if metadata else None
        
        query = """
        CREATE (u:User {
            username: $username,
            email: $email,
            created_at: $created_at,
            updated_at: $updated_at,
            metadata: $metadata
        })
        RETURN elementId(u) AS id
        """
        result = self.db_handler.execute_query(query, {
            'username': username,
            'email': email,
            'created_at': created_at,
            'updated_at': updated_at,
            'metadata': metadata_json
        })

        if result:
            return result[0]['id']
        return None

    def get_all_users(self):
        query = """
        MATCH (u:User)
        RETURN u, elementId(u) AS id
        """
        results = self.db_handler.execute_query(query)
        users = []
        for result in results:
            user = dict(result['u'])
            user['id'] = result['id']
            user['metadata'] = json.loads(user['metadata']) if user.get('metadata') else None
            users.append(user)
        return users

    def get_user_by_username(self, username):
        query = """
        MATCH (u:User {username: $username})
        RETURN u, elementId(u) AS id
        """
        result = self.db_handler.execute_query(query, {'username': username})
        if result:
            user = dict(result[0]['u'])
            user['id'] = result[0]['id']
            user['metadata'] = json.loads(user['metadata']) if user.get('metadata') else None
            return user
        return None

    def get_user_by_id(self, user_id):
        query = """
        MATCH (u:User)
        WHERE elementId(u) = $user_id
        RETURN u, elementId(u) AS id
        """
        result = self.db_handler.execute_query(query, {'user_id': user_id})
        if result:
            user = dict(result[0]['u'])
            user['id'] = result[0]['id']
            user['metadata'] = json.loads(user['metadata']) if user.get('metadata') else None
            return user
        return None

    def update_user(self, user_id, email=None, metadata=None):
        updated_at = datetime.now().isoformat()
        
        set_clauses = []
        parameters = {'user_id': user_id, 'updated_at': updated_at}
        
        if email is not None:
            set_clauses.append("u.email = $email")
            parameters['email'] = email
        if metadata is not None:
            metadata_json = json.dumps(metadata)
            set_clauses.append("u.metadata = $metadata")
            parameters['metadata'] = metadata_json
        
        set_clauses.append("u.updated_at = $updated_at")
        set_clause = ", ".join(set_clauses)
        
        query = f"""
        MATCH (u:User)
        WHERE elementId(u) = $user_id
        SET {set_clause}
        RETURN u, elementId(u) AS id
        """
        result = self.db_handler.execute_query(query, parameters)
        if result:
            user = dict(result[0]['u'])
            user['id'] = result[0]['id']
            user['metadata'] = json.loads(user['metadata']) if user.get('metadata') else None
            return user
        return None

    def delete_user(self, user_id):
        query = """
        MATCH (u:User)
        WHERE elementId(u) = $user_id
        DETACH DELETE u
        RETURN elementId(u) AS id
        """
        result = self.db_handler.execute_query(query, {'user_id': user_id})
        return result[0]['id'] if result else None
