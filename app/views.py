# -*- coding: utf-8 -*-
from app import app,socketio
from flask import render_template, request, session, url_for, redirect, g, abort, flash
import time
from sqlite3 import dbapi2 as sqlite3
from hashlib import md5
from datetime import datetime
from contextlib import closing
from werkzeug.security import check_password_hash, generate_password_hash
from flask.ext.socketio import SocketIO, emit, send
import simplejson, urllib
from gevent import monkey; monkey.patch_all()
from flask import Flask, request, send_file,render_template

#configuration
DATABASE = 'tmp/goodle.db' 
DEBUG = True
SECRET_KEY = 'secret'

app.config.from_object(__name__)

def connect_db():
	return sqlite3.connect(app.config['DATABASE'])

def init_db():
	with closing(connect_db()) as db:
		with app.open_resource('schema.sql', mode='r') as f:
			db.cursor().executescript(f.read())
		db.commit()

"""Queries the dataase and returns a list of dictionaries"""
def query_db(query, args=(), one=False):
	cur = g.db.execute(query, args)
	rv = [dict((cur.description[idx][0], value)
		for idx, value in enumerate(row)) for row in cur.fetchall()]
	return (rv[0] if rv else None) if one else rv

"""Convenience method to look up the id for a username."""
def get_user_id(username):
	rv = g.db.execute('select user_id from users where username = ?',
			[username]).fetchone()
	return rv[0] if rv else None

def format_datetime(timestamp):
	return datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d @ %H:%M')

@app.before_request
def before_request():
	g.db = connect_db()
	g.user = None
	if 'user_id' in session:
		g.user = query_db('select * from users where user_id = ?',
				[session['user_id']], one=True)
@app.teardown_request
def teardown_request(exception):
	if hasattr(g, 'db'):
		g.db.close()

@app.route('/index')
@app.route('/map')
def map():
	if not g.user:
		return redirect(url_for('login'))
        return render_template('map.html')


@app.route('/login',methods=['GET','POST'])
def login():
	if g.user:
		return redirect(url_for('map'))
	error = None
	if request.method == 'POST':
		user = query_db('''select * from users where username = ?''',
			[request.form['username']], one=True)
		if user is None:
			error = 'Invalid username'
		elif not check_password_hash(user['pw_hash'],
					request.form['password']):
			error = 'Invalid password'
		else:
			flash(u'로그인')
			session['user_id'] = user['user_id']
			return redirect(url_for('map'))
	return render_template('login.html', error=error)

@app.route('/logout')
def logout():
	flash('logout')
	session.pop('user_id',None)
	return redirect(url_for('login'))

@app.route('/register',methods=['GET','POST'])
def register():
	if g.user:
		return redirect(url_for('map'))
	error = None
	if request.method == 'POST':
		if not request.form['username']:
			error = u'이름을 입력하세요'
		elif not request.form['password']:
			error = u'비밀번호를 입력하세요'
		elif request.form['password'] != request.form['password2']:
			error = u'비밀번호 재입력 확인을 해주세요'
		elif get_user_id(request.form['username']) is not None:
			error = u'이미 있는 이름입니다.'
		else:
			g.db.execute('''insert into users (
				username,pw_hash) values (?,?)''',
				[request.form['username'], generate_password_hash(request.form['password'])])
			g.db.commit()
			flash(u'회원가입 완료')
			return redirect(url_for('login'))
	return render_template('register.html',error=error)
 	
@app.route('/write', methods=['POST'])
def write():
    if 'user_id' not in session:
        abort(401)
    if request.form['text']:
        g.db.execute('''insert into 
            contents (user_id, text, lat, lng)
            values (?, ?, ?, ?)''', (session['user_id'], 
                                  request.form['text'],
                                  request.form['lat'],
				  request.form['lng']))
        g.db.commit()
        flash('낙서')
    return redirect(url_for('map'))


@socketio.on('upload_content',namespace='/map')
def upload_content(json):
	print json
	#g.db.execute('''insert into contents(user_id, text, lat, lng) values(?,?,?,?)''',\
	#		(session['user_id], json['text'],json['lat'],json['lng']))
	#g.db.commit()		

@socketio.on('get_content')
def get_content(json):
	print json
	
@socketio.on('hi')
def hi(hi):
	emit('hi')

@socketio.on('connect')
def connect(json):
	send(json)
