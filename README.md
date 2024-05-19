# NeuroNet

NeuroNet: A system designed to automate and optimize everyday tasks and decision-making.

## Frontend

**Impulse**: The frontend interface for interacting with the Synapse backend API, built using React.js.

## Backend API

**Synapse**: An API designed to act as a connection between your Neo4j database, frontend, and other components. It is built using FastAPI.

## Database

Neo4j database setup using Docker, with DozerDB and Graph Data Science plugins.

### Neo4j Setup Script
```bash
#!/bin/bash

# Set environment variables
NEO4J_CONTAINER_NAME="neo4j-container"
NEO4J_PASSWORD="password"
DATA_DIR="/var/lib/neo4j/data"
LOGS_DIR="/var/lib/neo4j/logs"
IMPORT_DIR="/var/lib/neo4j/import"
PLUGINS_DIR="/var/lib/neo4j/plugins"
CONF_DIR="/var/lib/neo4j/conf"

echo "Starting Neo4j container with DozerDB and Graph Data Science plugins"

# Run the Neo4j Docker container with DozerDB and GDS plugins
docker run -d \
    --name $NEO4J_CONTAINER_NAME \
    -p 7474:7474 -p 7687:7687 \
    -v $DATA_DIR:/data \
    -v $LOGS_DIR:/logs \
    -v $IMPORT_DIR:/var/lib/neo4j/import \
    -v $PLUGINS_DIR:/plugins \
    -v $CONF_DIR:/conf \
    --env NEO4J_AUTH=neo4j/$NEO4J_PASSWORD \
    --env NEO4JLABS_PLUGINS='["apoc", "graph-data-science"]' \
    --env NEO4J_apoc_export_file_enabled=true \
    --env NEO4J_apoc_import_file_enabled=true \
    --env NEO4J_dbms_security_procedures_unrestricted='*' \
    --restart always \
    graphstack/dozerdb:5.19.0.0-alpha.1

echo "Neo4j container with DozerDB and Graph Data Science plugins is running."
```
You might need to create and set the correct user for the directories.
```bash
sudo mkdir -p /var/lib/neo4j/data
sudo mkdir -p /var/lib/neo4j/logs
sudo mkdir -p /var/lib/neo4j/import
sudo mkdir -p /var/lib/neo4j/conf
sudo mkdir -p /var/lib/neo4j/plugins
sudo chown -R 7474:7474 /var/lib/neo4j  # Setting owner to Neo4j's user ID in Docker
```
