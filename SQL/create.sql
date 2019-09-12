CREATE DATABASE club_management;
use club_management;

CREATE TABLE club_info
(
	club_id INT PRIMARY KEY AUTO_INCREMENT,
	club_name VARCHAR(20),
	club_intro VARCHAR(50)
);

CREATE TABLE member_info
(
	member_id INT PRIMARY KEY AUTO_INCREMENT,
	member_name VARCHAR(10),
	member_username VARCHAR(10) UNIQUE,
	member_password VARCHAR(20),
	member_type VARCHAR(20) DEFAULT 'guest'
);

CREATE TABLE club_member_link
(
	club_member_link_id INT PRIMARY KEY AUTO_INCREMENT,
	club_id INT,
	member_id INT,
	FOREIGN KEY(club_id) REFERENCES club_info(club_id),
	FOREIGN KEY(member_id) REFERENCES member_info(member_id)
);

CREATE TABLE activity_info
(
	activity_id INT PRIMARY KEY AUTO_INCREMENT,
	activity_name VARCHAR(20),
	activity_location VARCHAR(20),
	activity_detail VARCHAR(100),
	activity_time DATETIME
);

CREATE TABLE activity_club_link
(
	activity_link_id INT PRIMARY KEY AUTO_INCREMENT,
	activity_id INT UNIQUE,
	club_id INT,
	FOREIGN KEY(activity_id) REFERENCES activity_info(activity_id),
	FOREIGN KEY(club_id) REFERENCES club_info(club_id)
);
