var express  = require('express'),
	session = require('express-session');
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
	expressValidator = require('express-validator');
	databaseConfig = require('./mysql.config'); 


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(
	connection(mysql, databaseConfig, 'request')
);

// Login Page
// app.get('/',function(req,res){
//     res.send('Welcome');
// });
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/views/login.html'));
});

// var connection = mysql.createConnection(databaseConfig);

app.post('/auth', function (req, res) {
	var member_username = req.body.member_username;
	var member_password = req.body.member_password;
	if (member_username && member_password) {
		req.getConnection(function (err,conn){
			conn.query('SELECT * FROM member_info WHERE member_username = ? AND member_password = ?', [member_username, member_password], function (error, results, fields) {
				// console.log(results[0].member_type);
				// console.log(results[0].club_id);
				if (results.length > 0) {
					req.session.loggedin = true;
					req.session.member_username = member_username;
					// res.render('home', { title: "Edit member_page", data: rows });
					console.log("Successfully Logined")
					if (results[0].member_type == 'admin') {
						// res.redirect('api/member_page');
						res.redirect('/home');
					}
					if (results[0].member_type == 'guest') {
						// res.redirect('api/member_page');
						res.redirect('/home');
					}
				} else {
					res.send('Incorrect Username and/or Password!');
				}
				res.end();
			});
		})
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.get('/home', function (req, res) {
	if (req.session.loggedin) {
		// res.send('Welcome back, ' + request.session.member_username + '!');
		// res.render('home', { title: "Edit member_page", data: rows });
		res.render('home');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
});

app.get('/blank', function (req, res) {
	res.render('blank');
	res.end();
});

// 🎉 member_page
const member_page = require('./router/member_page');
app.use('/', member_page);

// 🎉 member_edit
const member_edit = require('./router/member_edit');
app.use('/', member_edit);

// 🎉 login_page
const login_page = require('./router/login_page');
app.use('/', login_page);

// 🎉 login_page
const login_edit = require('./router/login_edit');
app.use('/', login_edit);

// 🎉 member_search
const member_search = require('./router/member_search');
app.use('/', member_search);

// 🎉 club_search
const club_search = require('./router/club_search');
app.use('/', club_search);

// 🎉 club_page
const club_page = require('./router/club_page');
app.use('/', club_page);

// 🎉 club_edit
const club_edit = require('./router/club_edit');
app.use('/', club_edit);

// 🎉 test
const test = require('./router/test');
app.use('/', test);

//now we need to apply our router here
var router = require('express').Router();
app.use('/', router);

//start Server
var server = app.listen(3000,function(){
   console.log("Listening to port %s",server.address().port);
});
