var ejs = require("ejs");
var resGen = require('./commons/responseGenerator');
var mq = require('../rpc/client');


exports.user = function(req,res){
	var username1 = req.param("username");
	//var userquery = "select * from users where id = "+userid;
	var msg_payload = {"service":"getuser", "username":username1, "sid":req.sessionID};
	mq.make_request('user_queue', msg_payload, function(err,results){
		if(err){
			console.log(err);
			//throw err;
		}
		else{
			results = JSON.parse( results );
			console.log("profile user success");
			console.log(results);
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render("profile",{
				uname1:results.username,
				userid1:results._id
			});
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
			results = JSON.parse( results );
			res.send(results);
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
				following = JSON.parse( following );
				//console.log("following count doc : " + results.following);
				res.send(following);
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
			followers  = JSON.parse(followers);
			//console.log("followers");
			//console.log(followers);
			res.send(followers);
		}
	});
};

exports.usertweets = function(req,res){
	var uname = req.param("username");
	//var query = "select * from tweets where user_id =" + userid1;
	var msg_payload = {"service":"usertweets", "username":uname, "sid":req.sessionID};
	mq.make_request('tweet_queue', msg_payload, function(err,tweets){
		if(err){
			console.log(err);
			res.send(resGen.responseGenerator(401,null));
		}
		else{
			tweets = JSON.parse( tweets );
			res.send(tweets);
		}
	});
};
