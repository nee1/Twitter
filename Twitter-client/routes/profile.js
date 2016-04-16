var ejs = require("ejs");
var mysql = require('./mysql');
var resGen = require('./commons/responseGenerator');
var Users = require('./models/userModel');
var mq = require('../rpc/client');


exports.user = function(req,res){
	var username1 = req.param("username");
	//var userquery = "select * from users where id = "+userid;
	var msg_payload = {"service":"user", "username":username1, "sid":req.sessionID};
	mq.make_request('user_queue', msg_payload, function(err,results){
		if(err){
			console.log(err);
			//throw err;
		}
		else{
			if(results.length === 1){
				console.log(results);
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("profile",{
					uname1:results[0].username,
					userid1:results[0]._id
				});
			}	else {
				resGen.responseGenerator(401,null);
			}
		}
	});
};


exports.tweetcount = function(req,res){
	var uname = req.param("username");
	//var tweetcq = "select * from tweets left join users on tweets.user_id = users.id where user_id = "+ userid;
	var msg_payload = {"service":"tweetcount", "username":uname, "sid":req.sessionID};
	mq.make_request('count_queue', msg_payload, function(err,results){
		if(err){
			console.log(err);
			res.send(resGen.responseGenerator(401,null));
		}
		else{
			res.send(resGen.responseGenerator(200,results));
		}
	});

};

exports.followingcount = function(req,res){
	var uname = req.param("username");

	//var followingcq = "select * from following right join users on following.follow_uname=users.id where following.user_uname = "+userid;
//	var msg_payload = {"service":"", "username":uname, "sid":req.sessionID};
//	mq.make_request('', msg_payload, function(err,results){
	var msg_payload = {"service":"followingcount", "username":uname, "sid":req.sessionID};
	mq.make_request('count_queue', msg_payload, function(err,following){
			if(err){
				console.log("following count : " + err);
				res.send(resGen.responseGenerator(401,null));
			}
			else{
				//console.log("following count doc : " + results.following);
				res.send(resGen.responseGenerator(200,following));
			}
		});
};

exports.followercount = function(req,res){
	var uname = req.param("username");

	//var followercq = "select distinct * from following left join users on following.user_uname = users.id where following.follow_uname = "+userid;
	var msg_payload = {"service":"followercount", "username":uname, "sid":req.sessionID};
	mq.make_request('count_queue', msg_payload, function(err,followers){
		if(err){
			console.log(err);
			res.send(resGen.responseGenerator(401,null));
		}
		else{
			//console.log(results.followers);
			res.send(resGen.responseGenerator(200,followers));
		}
	});
};

exports.usertweets = function(req,res){
	var uname = req.param("username");
	//var query = "select * from tweets where user_id =" + userid1;
	var msg_payload = {"service":"usertweets", "username":uname, "sid":req.sessionID};
	mq.make_request('count_queue', msg_payload, function(err,tweets){
		if(err){
			console.log(err);
			res.send(resGen.responseGenerator(401,null));
		}
		else{
			res.send(resGen.responseGenerator(200,tweets));
		}
	});
};
