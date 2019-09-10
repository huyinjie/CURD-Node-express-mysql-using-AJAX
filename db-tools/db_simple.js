let mysql = require('mysql');
var databaseConfig = require('../mysql.config');

module.exports = {
	searchClubIdByClubName: function (clubName, callback) {
		var connection = mysql.createConnection(databaseConfig);
		connection.connect(function (err) {
			if (err) {
				console.log('MySQL Connection Failed');
				throw err;
			}
			sql = 'SELECT club_id FROM club_info WHERE club_name = ?'
			connection.query(sql, clubName, function (err, results, fields) {
				if (err) {
					console.log('SQL Execute Failed');
					throw err;
				}
				// console.log(results[0].club_id);
				callback && callback(results[0].club_id, fields);
				connection.end(function (err) {
					if (err) {
						console.log('MySQL Connection Close Failed');
						throw err;
					}
				});
			});
		});
	},
	searchMemberIdByMemberUserName: function (memberUsername, callback) {
		var connection = mysql.createConnection(databaseConfig);
		connection.connect(function (err) {
			if (err) {
				console.log('MySQL Connection Failed');
				throw err;
			}
			sql = 'SELECT member_id FROM member_info WHERE member_username = ?'
			connection.query(sql, memberUsername, function (err, results, fields) {
				if (err) {
					console.log('SQL Execute Failed');
					throw err;
				}
				// console.log(results[0].member_id);
				callback && callback(results[0].member_id, fields);
				connection.end(function (err) {
					if (err) {
						console.log('MySQL Connection Close Failed');
						throw err;
					}
				});
			});
		});
	},
	addMemberIdToClub: function (data, callback) {
		member_id = data.member_id;
		club_id = data.club_id;
		param = [club_id, member_id];
		var connection = mysql.createConnection(databaseConfig);
		connection.connect(function (err) {
			if (err) {
				console.log('MySQL Connection Failed');
				throw err;
			}
			sql = 'INSERT INTO `club_management`.`club_member_link` (`club_id`, `member_id`) VALUES (?, ?)'
			connection.query(sql, param, function (err, results, fields) {
				if (err) {
					console.log('SQL Execute Failed');
					throw err;
				}
				console.log(results);
				// callback && callback(results[0].member_id, fields);
				connection.end(function (err) {
					if (err) {
						console.log('MySQL Connection Close Failed');
						throw err;
					}
				});
			});
		});
	},
	// checkMemberIdWithClub - Get: member_id,club_id To: check if exist in club_member_link
	checkMemberIdWithClub: function (data, callback) {
		member_id = data.member_id;
		club_id = data.club_id;
		param = [club_id, member_id];
		var connection = mysql.createConnection(databaseConfig);
		connection.connect(function (err) {
			if (err) {
				console.log('MySQL Connection Failed');
				throw err;
			}
			sql = 'SELECT * FROM club_member_link WHERE club_id = ? AND member_id = ?'
			connection.query(sql, param, function (err, results, fields) {
				if (err) {
					console.log('SQL Execute Failed');
					throw err;
				}
				// console.log(results);
				// console.log(results.length!=0);
				callback && callback(results, fields);
				connection.end(function (err) {
					if (err) {
						console.log('MySQL Connection Close Failed');
						throw err;
					}
				});
			});
		});
	},
};