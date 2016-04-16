var ejs = require("ejs");
var mysql = require('./mysql');
var requestGen = require('./commons/responseGenerator');
var Users = require('./models/userModel');


exports.user = function(req,res){
	var username1 = req.param("username");
	//var userquery = "select * from users where id = "+userid;

	Users.find({username:username1},function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length === 1){
				console.log(results);
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("profile",{
					uname1:results[0].username,
					userid1:results[0]._id
				});
			}
			else{
				requestGen.responseGenerator(401,null);
			}
		}
	});
};

exports.tweetcount = function(req,res){
	var uname = req.param("username");
	//var tweetcq = "select * from tweets left join users on tweets.user_id = users.id where user_id = "+ userid;

	Users.findOne({username:uname},function(err,result){
		if(err){
			console.log(err);
			res.send(requestGen.responseGenerator(401,null));
		}
		else{
			console.log("tweet count");
			//console.log(result.tweets);
			var tweets = [];
			result.tweets.forEach(function(tweet){
				tweets.push({
					"first":result.first,
					"last":result.last,
					"username":result.username,
					"createdAt":tweet.createdAt,
					"tweetdata":tweet});
			});
			res.send(requestGen.responseGenerator(200,tweets));
		}
	});

};

exports.followingcount = function(req,res){
	var uname = req.param("username");

	//var followingcq = "select * from following right join users on following.follow_uname=users.id where following.user_uname = "+userid;


	Users.findOne({username:uname})
		.populate('following')
		.exec(function(err,results){
			if(err){
				console.log("following count : " + err);
				res.send(requestGen.responseGenerator(401,null));
			}
			else{
				//console.log("following count doc : " + results.following);
				res.send(requestGen.responseGenerator(200,results.following));
			}
		});
};

exports.followercount = function(req,res){
	var uname = req.param("username");

	//var followercq = "select distinct * from following left join users on following.user_uname = users.id where following.follow_uname = "+userid;

	Users.findOne({username:uname})
		.populate('followers')
		.exec(function(err,results){
			if(err){
				res.send(requestGen.responseGenerator(401,null));
			}
			else{
				//console.log(results.followers);
				res.send(requestGen.responseGenerator(200,results.followers));
			}
		});
};

exports.usertweets = function(req,res){
	var uname = req.param("username");
	//var query = "select * from tweets where user_id =" + userid1;

	Users.findOne({username:uname},function(err,result){
		if(err){
			res.send(requestGen.responseGenerator(401,null));
		}
		else{
			//console.log(results);
			var tweets = [];
			result.tweets.forEach(function(tweet){
				tweets.push({
					"first":user.first,
					"last":user.last,
					"username":user.username,
					"createdAt":tweet.createdAt,
					"tweetdata":tweet});
			});
			res.send(requestGen.responseGenerator(200,tweets));
		}
	});
};