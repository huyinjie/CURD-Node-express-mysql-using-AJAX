var router = require('express').Router();

// router.use(function (req, res, next) {
// 	console.log(req.method, req.url);
// 	next();
// });

// var curut = router.route('/activity_page');

// 🎉 show the CRUD interface | GET
router.get('/activity_page', function (req, res, next) {
	if (req.session.loggedin) {
		req.getConnection(function (err, conn) {
			if (err) return next("Cannot Connect");
			sql = "SELECT ai.activity_id, ai.activity_name, mi.member_name, ci.club_name FROM activity_info ai \
				left join activity_member_link aml on aml.activity_id = ai.activity_id \
				left join member_info mi on mi.member_id = aml.member_id \
				left join club_info ci on ci.club_id = aml.club_id"
			var query = conn.query(sql, function (err, rows) {
				if (err) {
					console.log(err);
					return next("Mysql error, check your query");
				}
				res.render('activity_page', { title: "Member_Info Page", data: rows });
			});
		});
	}
});

// 🎉 Post data to DB
router.post('/activity_page', function (req, res, next) {
	// Validation
	req.assert('member_username', 'UserName is required').notEmpty();
	req.assert('member_name', 'Name is required').notEmpty();
	// isEmail();
	req.assert('member_password', 'Enter a password 6 - 20').len(6, 20);

	var errors = req.validationErrors();
	if (errors) {
		res.status(422).json(errors);
		return;
	}

	//get data
	var data = {
		member_username: req.body.member_username,
		member_name: req.body.member_name,
		member_password: req.body.member_password
	};

	//inserting into mysql
	req.getConnection(function (err, conn) {
		if (err) return next("Cannot Connect");

		var query = conn.query("INSERT INTO member_info set ?", data, function (err, rows) {
			if (err) {
				console.log(err);
				return next("Mysql error, check your query");
			}
			res.sendStatus(200);
		});
	});
});

module.exports = router;

