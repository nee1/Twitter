/**
 * Routes file for Login
 */
 
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('./bCrypt.js')
var Users = require('./models/userModel');

//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs
exports.checkLogin = function(req,res)
{
	
	var username1 = req.param("username");
	var password1 = req.param("password");
	console.log(password1 +" is the password");
	var json_responses;
	console.log(username1 +" username in checkLogin ");
	Users.findOne( {username:username1,password:password1} ,function(err,users){
		if(err){
			console.log("error at username password");
			throw err;
		}
		else
		{
			console.log("users :"+users);
			req.session.username = username1;
			res.send(users);
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
		res.render("homepage",{
			username:req.session.username,
			userid:JSON.stringify(req.session.userid)
		});
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
	
	var json_responses;
	console.log("in checkssignup");
	if(username1!== ''  && password1!== '')
	{
		console.log(username1+" "+password1);
		var user = Users({
			username:username1,
			password:password1,
			first:first1,
			last:last1,
			email:email1,
			birthdate:birthdate1,
			location:location1});

		user.save(function(err,results){
			if(err){
				console.log(err);
				throw err;
			}
			else
			{			
				console.log("valid signup");
				req.session.username = username1;
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
			}
		});
	}
	else
	{
		json_responses = {"statusCode" : 401};
		res.send(json_responses);
	}
};

