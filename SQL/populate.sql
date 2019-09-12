-- Populate club_info
INSERT INTO club_management.club_info(club_id, club_name, club_intro)
VALUES (null, '火箭','篮球社');
INSERT INTO club_management.club_info(club_id, club_name, club_intro)
VALUES (null, '马刺','篮球社2');
-- Populate member_info
INSERT INTO club_management.member_info(member_id, member_name, member_username, member_password)
VALUES (null, '张三','user1','123456');
INSERT INTO club_management.member_info(member_id, member_name, member_username, member_password)
VALUES (null, '王二','user2','1234567');
INSERT INTO club_management.member_info(member_id, member_name, member_username, member_password, member_type)
VALUES (null, 'Admin-HJ','admin-hj','1','admin');
-- Populate club_member_link
INSERT INTO club_management.club_member_link(club_member_link_id, member_id, club_id)
VALUES (null, 1, 1);
INSERT INTO club_management.club_member_link(club_member_link_id, member_id, club_id)
VALUES (null, 2, 2);
-- Populate activity_info
INSERT INTO club_management.activity_info(activity_id, club_id, activity_name, activity_location, activity_detail, activity_time)
VALUES (null, 1, '篮球活动1');
INSERT INTO club_management.activity_info(activity_id, club_id, activity_name, activity_location, activity_detail, activity_time)
VALUES (null, 2, '篮球活动2');
-- Populate activity_member_link
INSERT INTO club_management.activity_member_link(activity_member_link_id, club_id, member_id, activity_id)
VALUES (null, 1, 1, 1);
INSERT INTO club_management.activity_member_link(activity_member_link_id, club_id, member_id, activity_id)
VALUES (null, 1, 2, 1);