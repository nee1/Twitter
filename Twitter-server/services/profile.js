var ejs = require("ejs");
var resGen = require('./commons/responseGenerator');
var Users = require('./models/userModel');


exports.tweetcount = function(req,res){
	var uname = req.username;
	//var tweetcq = "select * from tweets left join users on tweets.user_id = users.id where user_id = "+ userid;

	Users.findOne({username:uname},{first:1,last:1,username:1,tweets:1},function(err,result){
		if(err){
			console.log(err);
			res(null,JSON.stringify(resGen.responseGenerator(401,null)));
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
			res(null,JSON.stringify(resGen.responseGenerator(200,tweets)));
		}
	});

};

exports.followingcount = function(req,res){
	var uname = req.username;

	//var followingcq = "select * from following right join users on following.follow_uname=users.id where following.user_uname = "+userid;


	Users.findOne({username:uname})
		.populate('following')
		.exec(function(err,results){
			if(err){
				console.log("following count : " + err);
				res(null,JSON.stringify(resGen.responseGenerator(401,null)));
			}
			else{
				//console.log("following count doc : " + results.following);
				res(null,JSON.stringify(resGen.responseGenerator(200,results.following)));
			}
		});
};

exports.followercount = function(req,res){
	var uname = req.username;

	//var followercq = "select distinct * from following left join users on following.user_uname = users.id where following.follow_uname = "+userid;

	Users.findOne({username:uname})
		.populate('followers')
		.exec(function(err,results){
			if(err){
				res(null,JSON.stringify(resGen.responseGenerator(401,null)));
			}
			else{
				//console.log(results.followers);
				res(null,JSON.stringify(resGen.responseGenerator(200,results.followers)));
			}
		});
};

exports.usertweets = function(req,res){
	var uname = req.username;
	//var query = "select * from tweets where user_id =" + userid1;

	Users.findOne({username:uname},{first:1,last:1,username:1,tweets:1},function(err,result){
		if(err){
			res(null,JSON.stringify(resGen.responseGenerator(401,null)));
		}
		else{
			//console.log(results);
			var tweets = [];
			result.tweets.forEach(function(tweet){
				tweets.push({
					"first":result.first,
					"last":result.last,
					"username":result.username,
					"createdAt":tweet.createdAt,
					"tweetdata":tweet});
			});
			res(null,JSON.stringify(resGen.responseGenerator(200,tweets)));
		}
	});
};
