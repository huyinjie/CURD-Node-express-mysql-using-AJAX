var router = require('express').Router();
var db_simple = require('../db-tools/db_simple')
var db = require('../db-tools/db')

// router.use(function (req, res, next) {
// 	console.log(req.method, req.url);
// 	next();
// });

// var curut = router.route('/club_search');

// 🎉 show the CRUD interface | GET
router.get('/club_search', function (req, res, next) {
	if (req.session.loggedin) {
		req.getConnection(function (err, conn) {
			if (err) return next("Cannot Connect");
			sql = "SELECT * FROM club_info"
			var query = conn.query(sql, function (err, rows) {
				if (err) {
					console.log(err);
					return next("Mysql error, check your query");
				}
				res.render('club_search', { title: "Club_Info Page", data: rows });
			});
		});
	}
});

// 🎉 Post data to DB
router.post('/club_search', function (req, res, next) {
	// Validation
	// req.assert('club_search_msg', 'club_search_msg is required').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.status(422).json(errors);
		return;
	}

	//get data
	club_search_msg = req.body.club_search_msg;
	var data = {
		club_search_msg: req.body.club_search_msg,
	};

	console.log(club_search_msg);
	
	req.getConnection(function (err, conn) {
		if (err) return next("Cannot Connect");
		sql = "SELECT * FROM club_info \
			WHERE club_name LIKE ? \
			OR  club_name LIke ?"
		var query = conn.query(sql, ['%' + club_search_msg + '%', '%' + club_search_msg + '%'], function (err, rows) {
			if (err) {
				console.log(err);
				return next("Mysql error, check your query");
			}
			// res.sendStatus(200);
			res.render('club_search', { title: "Member Search Page", data: rows });
		});
	});
});

module.exports = router;

