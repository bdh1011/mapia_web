#!/usr/bin/python
from app import app,socketio
from flask import Flask
from gevent import monkey; monkey.patch_all()
from flask import Flask, request, send_file,render_template
from socketio import socketio_manage
from socketio.namespace import BaseNamespace
from socketio.mixins import RoomsMixin, BroadcastMixin

# The socket.io namespace
class ChatNamespace(BaseNamespace, RoomsMixin, BroadcastMixin):
    def on_nickname(self, nickname):
	print 'on nickname ',nickname
        self.environ.setdefault('nicknames', []).append(nickname)
        self.socket.session['nickname'] = nickname
        self.broadcast_event('announcement', '%s has connected' % nickname)
        self.broadcast_event('nicknames', self.environ['nicknames'])
        # Just have them join a default-named room
        self.join('main_room')

    def on_user_message(self, msg):
	print 'emit to room :',msg
        self.emit_to_room('main_room', 'msg_to_room', self.socket.session['nickname'], msg)

    def recv_message(self, message):
        print "PING!!!", message

# Flask routes
app = Flask(__name__)
@app.route('/')
def index():
    return send_file('./app/templates/chat.html')

@app.route("/socket.io/<path:path>")
def run_socketio(path):
    print 'socketio!'
    print path
    socketio_manage(request.environ, {'': ChatNamespace})


# Flask routes
if __name__ == '__main__':
    print 'Listening on http://localhost:8080'
    app.debug = True
    import os
    from werkzeug.wsgi import SharedDataMiddleware
    app = SharedDataMiddleware(app, {
        '/': os.path.join(os.path.dirname(__file__), 'static')
        })
    from socketio.server import SocketIOServer
    SocketIOServer(('0.0.0.0', 8080), app,
        namespace="socket.io", policy_server=False).serve_forever()

