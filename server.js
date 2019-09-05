var express  = require('express'),
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

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(
	connection(mysql, databaseConfig,'request')
);

app.get('/',function(req,res){
    res.send('Welcome');
});


//RESTful route
var router = express.Router();

/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var curut = router.route('/user');


//🎉show the CRUD interface | GET
curut.get(function(req,res,next){
    req.getConnection(function(err,conn){
        if (err) return next("Cannot Connect");
        var query = conn.query('SELECT * FROM member_info', function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
			res.render('user', { title:"Member_Info Page", data:rows});
         });
    });
});

//🎉Fast post data to DB | POST
curut.post(function(req,res,next){
    //validation
    req.assert('name','UserName is required').notEmpty();
    // req.assert('email','A valid email is required').isEmail();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
		member_username:req.body.name,
        // email:req.body.email,
		member_password:req.body.password
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO member_info set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }
          res.sendStatus(200);
        });
     });
});


//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/user/:member_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:member_id it hit.

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

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM member_info WHERE member_id = ? ",[member_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('edit',{title:"Edit user",data:rows});
        });

    });

});

//update data
curut2.put(function(req,res,next){
    var member_id = req.params.member_id;

    //validation
    req.assert('name','Name is required').notEmpty();
    // req.assert('email','A valid email is required').isEmail();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
		member_username:req.body.name,
        // email:req.body.email,
		member_password:req.body.password
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
