from neo4j import GraphDatabase

class DatabaseHandler:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def execute_query(self, query, parameters=None):
        with self.driver.session() as session:
            result = session.run(query, parameters)
            return [record for record in result]

    def remove_all(self):
        query = """
        MATCH (n)
        DETACH DELETE n
        """
        self.execute_query(query)
