-- Populate member_info
SELECT mi.*,ci.* FROM member_info mi
    left join club_member_link cml on mi.member_id = cml.member_id
    left join club_info ci on ci.club_id = cml.club_id

-- Populate member_info
SELECT * FROM member_info
	left join club_info

-- Populate member_info
a=SELECT member_id FROM member_info WHERE member_username = 'admin-hj'
b=SELECT club_id FROM club_info WHERE club_name = '火箭'
INSERT INTO club_management.club_member_link(club_id, member_id)
VALUES (null, a,b)



