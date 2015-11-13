create table if not exists users( 
	user_id integer primary key autoincrement,
	username string not null,
	pw_hash string not null
);

create table if not exists profile_pic (
	profile_pic_id integer primary key autoincrement,
	user_id integer not null
);

create table if not exists contents (
	content_id integer primary key autoincrement,
	user_id integer not null,
	text string not null,
	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
	lat float not null,
	lng float not null
);

create table if not exists pictures(
	picture_id integer primary key autoincrement,
	content_id integer not null
);

create table if not exists comments(
	comment_id integer primary key autoincrement,
	content_id integer not null,
	user_id integer not null,
	text string not null,
	timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);



