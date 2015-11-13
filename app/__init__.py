from flask import Flask
from flask.ext.socketio import SocketIO, emit
app = Flask(__name__)
socketio = SocketIO(app)

from app import views
views.init_db()
