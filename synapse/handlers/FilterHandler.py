import json
from typing import Optional

class FilterHandler:
    def __init__(self, db_handler):
        self.db_handler = db_handler

    def search_elements(self, username: Optional[str] = None, place_name: Optional[str] = None, thing_name: Optional[str] = None):
        match_clauses = []
        where_clauses = []
        parameters = {}

        if username:
            match_clauses.append("(u:User)-[r]->(e)")
            where_clauses.append("u.username = $username")
            parameters['username'] = username

        if place_name:
            match_clauses.append("(p:Place)-[r]->(e)")
            where_clauses.append("p.name = $place_name")
            parameters['place_name'] = place_name

        if thing_name:
            match_clauses.append("(t:Thing)")
            where_clauses.append("t.name = $thing_name")
            parameters['thing_name'] = thing_name

        match_clause = " MATCH " + ", ".join(match_clauses) if match_clauses else ""
        where_clause = " WHERE " + " AND ".join(where_clauses) if where_clauses else ""
        
        query = f"""
        {match_clause}
        {where_clause}
        RETURN e, labels(e) AS labels, elementId(e) AS id
        """
        result = self.db_handler.execute_query(query, parameters)
        
        elements = []
        for record in result:
            element = dict(record['e'])
            element['id'] = record['id']
            element['labels'] = record['labels']
            elements.append(element)
        
        return elements
