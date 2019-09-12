var router = require('express').Router();
var db_simple = require('../db-tools/db_simple')
var db = require('../db-tools/db')

// router.use(function (req, res, next) {
// 	console.log(req.method, req.url);
// 	next();
// });

// var curut = router.route('/member_search');

// 🎉 show the CRUD interface | GET
router.get('/member_search', function (req, res, next) {
	if (req.session.loggedin) {
		req.getConnection(function (err, conn) {
			if (err) return next("Cannot Connect");
			sql = "SELECT mi.*,ci.*,cml.club_member_link_id FROM member_info mi \
				left join club_member_link cml on mi.member_id = cml.member_id \
				left join club_info ci on ci.club_id = cml.club_id"
			var query = conn.query(sql, function (err, rows) {
				if (err) {
					console.log(err);
					return next("Mysql error, check your query");
				}
				res.render('member_search', { title: "Member_Info Page", data: rows });
			});
		});
	}
});

// 🎉 Post data to DB
router.post('/member_search', function (req, res, next) {
	// Validation
	// req.assert('member_name', 'member_name is required').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.status(422).json(errors);
		return;
	}

	//get data
	member_name = req.body.member_name;
	var data = {
		member_name: req.body.member_name,
	};

	console.log(member_name);
	
	req.getConnection(function (err, conn) {
		if (err) return next("Cannot Connect");
		sql = "SELECT mi.*,ci.* FROM member_info mi \
			left join club_member_link cml on mi.member_id = cml.member_id \
			left join club_info ci on ci.club_id = cml.club_id \
			WHERE member_name LIKE ? \
			OR member_username LIKE ? "
		var query = conn.query(sql, ['%' + member_name + '%', '%' + member_name + '%'], function (err, rows) {
			if (err) {
				console.log(err);
				return next("Mysql error, check your query");
			}
			// res.sendStatus(200);
			res.render('member_search', { title: "Member Search Page", data: rows });
		});
	});
});

module.exports = router;

