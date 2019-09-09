var router = require('express').Router();

// router.use(function (req, res, next) {
// 	console.log(req.method, req.url);
// 	next();
// });

// var curut = router.route('/member_page');

//🎉show the CRUD interface | GET
router.get('/member_page', function (req, res, next) {
	if (req.session.loggedin) {
		req.getConnection(function (err, conn) {
			if (err) return next("Cannot Connect");
			sql = "SELECT mi.*,ci.* FROM member_info mi \
				left join club_member_link cml on mi.member_id = cml.member_id \
				left join club_info ci on ci.club_id = cml.club_id"
			var query = conn.query(sql, function (err, rows) {
				if (err) {
					console.log(err);
					return next("Mysql error, check your query");
				}
				res.render('member_page', { title: "Member_Info Page", data: rows });
			});
		});
	}
});

//🎉Fast post data to DB | POST
router.post('/member_page', function (req, res, next) {
	//validation
	req.assert('member_username', 'UserName is required').notEmpty();
	req.assert('member_name', 'Name is required').notEmpty();
	// req.assert('member_name','A valid email is required').isEmail();
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

