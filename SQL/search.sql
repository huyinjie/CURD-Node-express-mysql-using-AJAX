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
-- 查找所有社团
SELECT * FROM club_info
-- 查找某个社团
SELECT * FROM club_info WHERE club_id = ?
-- 查找所有活动
SELECT ai.activity_id, ai.activity_name, mi.member_name, ci.club_name FROM activity_member_link aml
    left join member_info mi on mi.member_id = aml.member_id
    left join club_info ci on ci.club_id = aml.club_id
    left join activity_info ai on ai.activity_id = aml.activity_id
-- 查找所有活动 member_name合并
SELECT ai.activity_id, ai.activity_name, group_concat(mi.member_name) member_name, ci.club_name FROM activity_member_link aml
    left join member_info mi on mi.member_id = aml.member_id
    left join club_info ci on ci.club_id = aml.club_id
    left join activity_info ai on ai.activity_id = aml.activity_id