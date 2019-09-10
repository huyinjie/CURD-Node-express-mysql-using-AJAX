-- 查找社员所加的社团 无club_member_link_id
SELECT mi.*,ci.* FROM member_info mi
    left join club_member_link cml on mi.member_id = cml.member_id
    left join club_info ci on ci.club_id = cml.club_id
-- 查找社员所加的社团 有club_member_link_id
SELECT mi.*,ci.*,cml.club_member_link_id FROM member_info mi
    left join club_member_link cml on mi.member_id = cml.member_id
    left join club_info ci on ci.club_id = cml.club_id
-- 查找某社员所加的社团
SELECT mi.*,ci.* FROM member_info mi
    left join club_member_link cml on mi.member_id = cml.member_id
    left join club_info ci on ci.club_id = cml.club_id
	WHERE mi.member_id = '1'

