/**
 * Routes file for Login
 */

var ejs = require("ejs");
var bcrypt = require('./bCrypt.js')
var Users = require('./models/userModel');

//Check login - called when '/checklogin' POST call given from AngularJS module in login.ejs
exports.checkLogin = function(req,res)
{

	var username1 = req.username;
	var password1 = req.password;
	console.log(password1 +" is the password");
	var json_responses;
	console.log(username1 +" username in checkLogin ");
	Users.findOne( {username:username1,password:password1} ,function(err,users){
		if(err){
			console.log("error at username password" + err);
			//throw err;
		}
		else
		{
			console.log("users :"+users);
			//req.session.username = username1;
			res(null,JSON.stringify(users));
		}
	});
	//var json_responses;

};

exports.checkSignUp = function(req,res){

	var username1 = req.username;
	var password1 = req.password;
	var first1 = req.firstname;
	var last1 = req.lastname;
	var email1 = req.email;
	var birthdate1 = req.birthdate;
	var location1 = req.location;

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
				//throw err;
			}
			else
			{
				console.log("valid signup");
				//req.session.username = username1;
				//json_responses = {"statusCode" : 200};
				res(null,JSON.stringify(resGen.responseGenerator(200,null)));
			}
		});
	}
	else
	{
		//json_responses = {"statusCode" : 401};
		res(null,JSON.stringify(resGen.responseGenerator(401,null)));
	}
};
