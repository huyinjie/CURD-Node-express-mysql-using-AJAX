var router = require('express').Router();

// router.use(function (req, res, next) {
// 	console.log(req.method, req.url);
// 	next();
// });

//now for Single route (GET,DELETE,PUT)
// var curut2 = router.route('/club_page/:club_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/club_page/:club_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
// curut2.all('/club_page/:club_id', function (req, res, next) {
// 	console.log("You need to smth about curut2 Route ? Do it here");
// 	console.log(req.params);
// 	next();
// });

//get data to update
router.get('/club_page/:club_id', function (req, res, next) {
	if (req.session.loggedin) {
		// console.log(req.params);
		var club_id = req.params.club_id;
		console.log(club_id);
		req.getConnection(function (err, conn) {
			if (err) return next("Cannot Connect");
			// sql = "SELECT * FROM member_info WHERE club_id = ? ";
			sql = "SELECT * FROM club_info WHERE club_id = ?"
			var query = conn.query(sql, [club_id], function (err, result) {
				if (err) {
					console.log(err);
					return next("Mysql error, check your query");
				}
				//if club_page not found
				if (result.length < 1)
					return res.send("User Not found");
				res.render('club_edit', { title: "Edit club_page", data: result });
			});
		});
	}
});

//update data
router.put('/club_page/:club_id', function (req, res, next) {
	// console.log(req.params);
	var club_id = req.params.club_id;

	// Validation
	req.assert('club_name', 'club_name is required').notEmpty();
	req.assert('club_intro', 'club_intro is required').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.status(422).json(errors);
		return;
	}

	//get data
	var data = {
		club_name: req.body.club_name,
		club_intro: req.body.club_intro
	};

	//inserting into mysql
	req.getConnection(function (err, conn) {
		if (err) return next("Cannot Connect");
		var query = conn.query("UPDATE club_info set ? WHERE club_id = ? ", [data, club_id], function (err, result) {
			if (err) {
				console.log(err);
				return next("Mysql error, check your query");
			}
			res.sendStatus(200);
		});
	});
});

//delete data
router.delete('/club_page/:club_id', function (req, res, next) {
	console.log(req.params)
	var club_id = req.params.club_id;
	req.getConnection(function (err, conn) {
		if (err) return next("Cannot Connect");
		var query = conn.query("DELETE FROM club_info WHERE club_id = ? ", [club_id], function (err, result) {
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