-- Populate club_info
INSERT INTO club_management.club_info(club_id, club_name)
VALUES (null, '发士大夫-社团');
-- Populate member_info
INSERT INTO club_management.member_info(member_id, member_name, member_username, member_password)
VALUES (null, '张三','test1','123456');
INSERT INTO club_management.member_info(member_id, member_name, member_username, member_password)
VALUES (null, '王二','test2','1234567');
INSERT INTO club_management.member_info(member_id, member_name, member_username, member_password, member_type)
VALUES (null, 'Admin','admin','123456','admin');
-- Populate club_member_link
INSERT INTO club_management.club_member_link(club_member_link_id, club_id, member_id)
VALUES (null, 1, 2);
-- Populate activity_info
INSERT INTO club_management.activity_info(activity_id, club_id, activity_name)
VALUES (null, 1, '既无奈无奈-活动');
-- Populate activity_member_link
INSERT INTO club_management.activity_member_link(activity_member_link_id, activity_id, member_id)
VALUES (null, 1, 2);