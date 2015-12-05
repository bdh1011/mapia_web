# -*- coding: utf-8 -*-
from app import app
from flask import render_template, request, session, url_for, redirect, g, abort, flash, jsonify
import time
from sqlite3 import dbapi2 as sqlite3
from hashlib import md5
from datetime import datetime
from contextlib import closing
from werkzeug.security import check_password_hash, generate_password_hash
import logging
import json

@app.route('/', methods=['GET'])
def enter():
    return render_template('enter.html')


@app.route('/login', methods=['GET'])
def login():
	return render_template('login.html')


@app.route('/read', methods=['GET'])
def read():
	return render_template('read.html')


@app.route('/tmp', methods=['GET'])
def tmp():
	return render_template('tmp.html')


@app.route('/register', methods=['GET'])
def register():
	return render_template('register.html')


@app.route('/comment', methods=['GET'])
def comment():
	return render_template('comment.html')

@app.route('/map', methods=['GET'])
def map():
	return render_template('map.html')
