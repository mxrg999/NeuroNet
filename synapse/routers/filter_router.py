from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, Dict, Any
from deps import get_db_handler
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/search")
def search_elements(
    username: Optional[str] = Query(None),
    place_name: Optional[str] = Query(None),
    thing_name: Optional[str] = Query(None),
    db_handler=Depends(get_db_handler)
):
    try:
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
        RETURN e, elementId(e) AS id
        """
        result = db_handler.execute_query(query, parameters)
        
        elements = []
        for record in result:
            element = dict(record['e'])
            element['id'] = record['id']
            elements.append(element)
        
        return elements
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
