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
			sql = "SELECT * FROM club_info"
			var query = conn.query(sql, function (err, rows) {
				if (err) {
					console.log(err);
					return next("Mysql error, check your query");
				}
				res.render('club_page', { title: "Club_Info Page", data: rows });
			});
		});
	}
});

// 🎉 Post data to DB
router.post('/club_page', function (req, res, next) {
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
		// console.log(data);
		//inserting into mysql
		req.getConnection(function (err, conn) {
			if (err) return next("Cannot Connect");

			var query = conn.query("INSERT INTO club_info set ?", data, function (err, rows) {
				if (err) {
					console.log(err);
					return next("Mysql error, check your query");
				}
				res.sendStatus(200);
			});
		});
	});
});

module.exports = router;

