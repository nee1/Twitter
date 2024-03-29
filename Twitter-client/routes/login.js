/**
 * Routes file for Login
 */

var ejs = require("ejs");
var mq = require('../rpc/client');
var bcrypt = require('./bCrypt.js')
var resGen = require('./commons/responseGenerator');

//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs

exports.checkLogin = function(req,res)
{

	var username1 = req.param("username");
	var password1 = req.param("password");
	//"sessionId":req.sessionID console.log(password1 +" is the password");

	var msg_payload = {"service":"checkLogin","username":username1,"password":password1};
	mq.make_request('login_queue', msg_payload, function(err, valid){
		if(err){
			console.log("error at username password" + err);
			//throw err;
		}
		else
		{
			valid = JSON.parse(valid);
			if(valid.status == 200){
				console.log("users :"+valid);
				req.session.username = username1;
				res.render("homepage",{
					username:req.session.username
				});
				res.send(resGen.responseGenerator(200,valid));
//				res.send(resGen.responseGenerator(200,valid));
			}
			else {
						res.send(resGen.responseGenerator(401,valid));
					}
		}
	});
	//var json_responses;
};


//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username});

	}
	else
	{
		res.redirect('/');
	}
};


//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};


exports.checkSignUp = function(req,res){

	var username1 = req.param("username");
	var password1 = req.param("password");
	var first1 = req.param("firstname");
	var last1 = req.param("lastname");
	var email1 = req.param("email");
	var birthdate1 = req.param("birthdate");
	var location1 = req.param("location");

	console.log("in checkssignup");
	var msg_payload = {"service":"checkSignUp", "username":username1, "password":password1, "firstname":first1, "lastname":last1, "email":email1, "birthdate":birthdate1, "location":location1};

	mq.make_request('login_queue', msg_payload, function(err, users){
		if(err){
			console.log(err);
			//throw err;
		}
		else
		{
			req.session.username = username1;
			res.send(JSON.parse( users ));
		}
	})
}
