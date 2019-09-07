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

app.use(express.static(path.join(__dirname, 'public')));
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
	connection(mysql, databaseConfig,'request')
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


//RESTful route
var router = express.Router();

/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/member_page , /api/member_page/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/member_page');


//🎉show the CRUD interface | GET
curut.get(function(req,res,next){
    req.getConnection(function(err,conn){
		if (err) return next("Cannot Connect");
		sql = "SELECT mi.*,ci.* FROM member_info mi \
			left join club_member_link cml on mi.member_id = cml.member_id \
			left join club_info ci on ci.club_id = cml.club_id"
        var query = conn.query(sql, function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
			res.render('member_page', { title:"Member_Info Page", data:rows});
        });
    });
});

//🎉Fast post data to DB | POST
curut.post(function(req,res,next){
    //validation
	req.assert('member_username','UserName is required').notEmpty();
	req.assert('member_name', 'Name is required').notEmpty();
    // req.assert('member_name','A valid email is required').isEmail();
	req.assert('member_password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
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
    req.getConnection(function (err, conn){
        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO member_info set ?",data, function(err, rows){
           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }
          res.sendStatus(200);
        });
     });
});


//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/member_page/:member_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/member_page/:member_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
curut2.all(function(req,res,next){
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to update
curut2.get(function(req,res,next){

	var member_id = req.params.member_id;
	console.log(member_id);

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM member_info WHERE member_id = ? ",[member_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if member_page not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('member_edit',{title:"Edit member_page",data:rows});
        });

    });

});

//update data
curut2.put(function(req,res,next){
    var member_id = req.params.member_id;

	//validation
	req.assert('member_username', 'UserName is required').notEmpty();
	req.assert('member_name', 'Name is required').notEmpty();
	// req.assert('member_name','A valid email is required').isEmail();
	req.assert('member_password', 'Enter a password 6 - 20').len(6, 20);

    var errors = req.validationErrors();
    if(errors){
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
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE member_info set ? WHERE member_id = ? ",[data,member_id], function(err, rows){
           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }
          res.sendStatus(200);
        });
     });
});

//delete data
curut2.delete(function(req,res,next){
    var member_id = req.params.member_id;
     req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");
        var query = conn.query("DELETE FROM member_info WHERE member_id = ? ",[member_id], function(err, rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }
            res.sendStatus(200);
        });
        //console.log(query.sql);
     });
});

//now we need to apply our router here
app.use('/api', router);

//start Server
var server = app.listen(3000,function(){
   console.log("Listening to port %s",server.address().port);
});
