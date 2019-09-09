var router = require('express').Router();

// router.use(function (req, res, next) {
// 	console.log(req.method, req.url);
// 	next();
// });

//now for Single route (GET,DELETE,PUT)
// var curut2 = router.route('/member_page/:member_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/member_page/:member_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
// curut2.all('/member_page/:member_id', function (req, res, next) {
// 	console.log("You need to smth about curut2 Route ? Do it here");
// 	console.log(req.params);
// 	next();
// });

//get data to update
router.get('/member_page/:member_id', function (req, res, next) {
	if (req.session.loggedin) {
		var member_id = req.params.member_id;
		console.log(member_id);
		req.getConnection(function (err, conn) {
			if (err) return next("Cannot Connect");
			var query = conn.query("SELECT * FROM member_info WHERE member_id = ? ", [member_id], function (err, rows) {
				if (err) {
					console.log(err);
					return next("Mysql error, check your query");
				}
				//if member_page not found
				if (rows.length < 1)
					return res.send("User Not found");
				res.render('member_edit', { title: "Edit member_page", data: rows });
			});
		});
	}
});

//update data
router.put('/member_page/:member_id', function (req, res, next) {
	var member_id = req.params.member_id;

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
		var query = conn.query("UPDATE member_info set ? WHERE member_id = ? ", [data, member_id], function (err, rows) {
			if (err) {
				console.log(err);
				return next("Mysql error, check your query");
			}
			res.sendStatus(200);
		});
	});
});

//delete data
router.delete('/member_page/:member_id', function (req, res, next) {
	var member_id = req.params.member_id;
	req.getConnection(function (err, conn) {
		if (err) return next("Cannot Connect");
		var query = conn.query("DELETE FROM member_info WHERE member_id = ? ", [member_id], function (err, rows) {
			if (err) {
				console.log(err);
				return next("Mysql error, check your query");
			}
			res.sendStatus(200);
		});
		//console.log(query.sql);
	});
});

module.exports = router;