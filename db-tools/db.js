var db_simple = require('./db_simple');
var mysql = require('mysql');
var databaseConfig = require('../mysql.config');

module.exports = {
	dbAddMemberClub: function (data, callback) {
		db_simple.searchClubIdByClubName(data.club_name, function (result, fields) {
			// console.log(result);
			data.club_id = result;
			db_simple.searchMemberIdByMemberUserName(data.member_username, function (result, fields) {
				data.member_id = result;
				// console.log(result);
				// console.log(data);
				db_simple.checkMemberIdWithClub(data, function (result, fields) {
					// console.log(result.length);
					if (result.length != 0) {
						console.log('Field repeated');
					}
					else {
						db_simple.addMemberIdToClub(data, function (result, fields) {
							console.log(result);
						})
						// throw err;
					}
				})
			})
		})
	},
};