var router = require('express').Router();
var db_simple = require('../db-tools/db_simple')
var db = require('../db-tools/db')

// router.use(function (req, res, next) {
// 	console.log(req.method, req.url);
// 	next();
// });

// var curut = router.route('/club_page');

// 🎉 show the CRUD interface | GET
router.get('/club_page', function (req, res, next) {
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
				res.render('club_page', { title: "Member_Info Page", data: rows });
			});
		});
	}
});

// 🎉 Post data to DB
router.post('/club_page', function (req, res, next) {
	// Validation
	req.assert('member_username', 'UserName is required').notEmpty();
	req.assert('club_name', 'Club Name is required').notEmpty();
	// isEmail();
	// req.assert('member_password', 'Enter a password 6 - 20').len(6, 20);

	var errors = req.validationErrors();
	if (errors) {
		res.status(422).json(errors);
		return;
	}

	//get data
	var data = {
		member_username: req.body.member_username,
		club_name: req.body.club_name
	};
	
	//inserting into mysql
	req.getConnection(function (err, conn) {
		if (err) return next("Cannot Connect");
		// console.log(data);
		db.dbAddMemberClub(data, function (result, fields) {
			console.log(result);
		})
		res.sendStatus(200);
	});
});

module.exports = router;

