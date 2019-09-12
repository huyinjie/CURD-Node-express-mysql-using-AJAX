var router = require('express').Router();

// router.use(function (req, res, next) {
// 	console.log(req.method, req.url);
// 	next();
// });

//now for Single route (GET,DELETE,PUT)
// var curut2 = router.route('/club_page/:member_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/club_page/:member_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
// curut2.all('/club_page/:member_id', function (req, res, next) {
// 	console.log("You need to smth about curut2 Route ? Do it here");
// 	console.log(req.params);
// 	next();
// });

//get data to update
router.get('/club_page/:member_id', function (req, res, next) {
	if (req.session.loggedin) {
		// console.log(req.params);
		var member_id = req.params.member_id;
		console.log(member_id);
		req.getConnection(function (err, conn) {
			if (err) return next("Cannot Connect");
			// sql = "SELECT * FROM member_info WHERE member_id = ? ";
			sql = "SELECT mi.*,ci.* FROM member_info mi \
				left join club_member_link cml on mi.member_id = cml.member_id \
				left join club_info ci on ci.club_id = cml.club_id \
				WHERE mi.member_id = ?"
			var query = conn.query(sql, [member_id], function (err, result) {
				if (err) {
					console.log(err);
					return next("Mysql error, check your query");
				}
				//if club_page not found
				if (result.length < 1)
					return res.send("User Not found");
				res.render('member_edit', { title: "Edit club_page", data: result });
			});
		});
	}
});

//update data
router.put('/club_page/:member_id', function (req, res, next) {
	// console.log(req.params);
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
		var query = conn.query("UPDATE member_info set ? WHERE member_id = ? ", [data, member_id], function (err, result) {
			if (err) {
				console.log(err);
				return next("Mysql error, check your query");
			}
			res.sendStatus(200);
		});
	});
});

//delete data
router.delete('/club_page/:club_member_link_id', function (req, res, next) {
	console.log(req.params)
	var club_member_link_id = req.params.club_member_link_id;
	req.getConnection(function (err, conn) {
		if (err) return next("Cannot Connect");
		var query = conn.query("DELETE FROM club_member_link WHERE club_member_link_id = ? ", [club_member_link_id], function (err, result) {
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