from fastapi import APIRouter, HTTPException, Depends, Query, Path
from pydantic import BaseModel
from typing import Optional, Dict, Any
from deps import get_db_handler
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class CreateRelationRequest(BaseModel):
    source_id: str
    target_id: str
    relation_type: str
    properties: Optional[Dict[str, Any]] = None

class UpdateRelationRequest(BaseModel):
    properties: Optional[Dict[str, Any]] = None

@router.post("/relations/")
def create_relation(request: CreateRelationRequest, db_handler=Depends(get_db_handler)):
    properties = request.properties or {}

    if 'metadata' in properties:
        properties['metadata'] = json.dumps(properties['metadata'])  # Serialize metadata to JSON string
    
    properties_str = ', '.join([f'{k}: ${k}' for k in properties.keys()])
    
    query = f"""
    MATCH (source), (target)
    WHERE elementId(source) = $source_id AND elementId(target) = $target_id
    CREATE (source)-[r:{request.relation_type} {{{properties_str}}}]->(target)
    RETURN elementId(r) AS relation_id
    """
    
    parameters = {**properties, 'source_id': request.source_id, 'target_id': request.target_id}
    
    try:
        result = db_handler.execute_query(query, parameters)
        if result:
            return {"relation_id": result[0]['relation_id']}
        else:
            raise HTTPException(status_code=404, detail="Source or target not found")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/relations/{relation_id}")
def delete_relation(relation_id: str, db_handler=Depends(get_db_handler)):
    query = """
    MATCH ()-[r]->() WHERE elementId(r) = $relation_id
    WITH r, elementId(r) AS relation_id
    DELETE r
    RETURN relation_id
    """
    
    parameters = {'relation_id': relation_id}
    
    try:
        result = db_handler.execute_query(query, parameters)
        if result:
            return {"message": "Relation deleted successfully", "relation_id": result[0]['relation_id']}
        else:
            raise HTTPException(status_code=404, detail="Relation not found")
    except Exception as e:
        error_message = str(e)
        if "Relation not found" in error_message:
            logger.error(f"Relation not found: {error_message}")
            raise HTTPException(status_code=404, detail="Relation not found")
        else:
            logger.error(f"Unexpected error: {error_message}")
            raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/relations/")
def get_relations(
    source_id: Optional[str] = Query(None),
    target_id: Optional[str] = Query(None),
    relation_type: Optional[str] = Query(None),
    db_handler=Depends(get_db_handler)
):
    match_clause = ""
    where_clause = ""
    parameters = {}

    if source_id and target_id:
        match_clause = "(source)-[r]->(target)"
        where_clause = "elementId(source) = $source_id AND elementId(target) = $target_id"
        parameters['source_id'] = source_id
        parameters['target_id'] = target_id
    elif source_id:
        match_clause = "(source)-[r]->()"
        where_clause = "elementId(source) = $source_id"
        parameters['source_id'] = source_id
    elif target_id:
        match_clause = "()-[r]->(target)"
        where_clause = "elementId(target) = $target_id"
        parameters['target_id'] = target_id
    elif relation_type:
        match_clause = f"()-[r:{relation_type}]->()"
        where_clause = "true"
    else:
        raise HTTPException(status_code=400, detail="Either source_id, target_id, or relation_type must be provided")

    if relation_type and (source_id or target_id):
        match_clause = match_clause.replace("[r]->", f"[r:{relation_type}]->")

    query = f"""
    MATCH {match_clause}
    WHERE {where_clause}
    RETURN r, elementId(r) AS relation_id
    """

    try:
        result = db_handler.execute_query(query, parameters)
        relations = [{"relation_id": record['relation_id'], "properties": dict(record['r'])} for record in result]
        return relations
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/relations/all")
def get_all_relations(db_handler=Depends(get_db_handler)):
    query = """
    MATCH (source)-[r]->(target)
    RETURN elementId(source) AS source_id, source.name AS source_name, labels(source) AS source_labels, 
           elementId(target) AS target_id, target.name AS target_name, labels(target) AS target_labels, 
           type(r) AS relation_type, r, elementId(r) AS relation_id
    """

    try:
        result = db_handler.execute_query(query)
        relations = []
        for record in result:
            relation = {
                "relation_id": record['relation_id'],
                "source_id": record['source_id'],
                "source_name": record['source_name'],
                "source_labels": record['source_labels'],
                "target_id": record['target_id'],
                "target_name": record['target_name'],
                "target_labels": record['target_labels'],
                "relation_type": record['relation_type'],
                "properties": dict(record['r'])
            }
            relations.append(relation)
        return relations
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.put("/relations/{relation_id}")
def update_relation(relation_id: str, request: UpdateRelationRequest, db_handler=Depends(get_db_handler)):
    properties = request.properties or {}

    if 'metadata' in properties:
        properties['metadata'] = json.dumps(properties['metadata'])  # Serialize metadata to JSON string

    # Prepare the SET clause for the properties
    set_clauses = ', '.join([f'r.{key} = ${key}' for key in properties.keys()])

    # Prepare the REMOVE clause for the properties that need to be removed
    remove_clauses = ', '.join([f'r.{key}' for key in properties.keys() if properties[key] is None])

    query = f"""
    MATCH ()-[r]->()
    WHERE elementId(r) = $relation_id
    SET {set_clauses}
    {f"REMOVE {remove_clauses}" if remove_clauses else ""}
    RETURN elementId(r) AS relation_id
    """

    parameters = {**properties, 'relation_id': relation_id}

    try:
        result = db_handler.execute_query(query, parameters)
        if result:
            return {"relation_id": result[0]['relation_id']}
        else:
            raise HTTPException(status_code=404, detail="Relation not found")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
