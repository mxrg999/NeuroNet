from handlers.DatabaseHandler import DatabaseHandler
from handlers.UserHandler import UserHandler
from handlers.ThingHandler import ThingHandler

# Initialize the db_handler
db_handler = DatabaseHandler(uri="bolt://neuron:7687", user="neo4j", password="mxrg@neuron")

# Initialize the handlers
user_handler = UserHandler(db_handler)
thing_handler = ThingHandler(db_handler)

def get_db_handler():
    return db_handler

def get_user_handler():
    return user_handler

def get_thing_handler():
    return thing_handler