var ejs = require("ejs");
var mysql = require('./mysql');
var requestGen = require('./commons/responseGenerator');

exports.user = function(req,res){
	var userid;
	userid = req.param("userid");
	
	var userquery = "select * from users where id = "+userid;

	mysql.fetchData(userquery,function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length === 1){
				console.log(results);
				res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
				res.render("profile",{
					username:results[0].username,
					userid:results[0].id
				});
			}
			else{
				requestGen.responseGenerator(401,null);
			}
		}
	});
};

exports.tweetcount = function(req,res){
	var userid = req.param("userid1");
	
	var tweetcq = "select * from tweets left join users on tweets.user_id = users.id where user_id = "+ userid;
	
	mysql.fetchData(tweetcq,function(err,results1){
		if(err){
			throw err;
		}
		else{
			console.log(results1);
			res.send(requestGen.responseGenerator(200,results1));
		}
	});
	
};

exports.followingcount = function(req,res){
	var userid = req.param("userid2");
	
	var followingcq = "select * from following right join users on following.follow_uname=users.id where following.user_uname = "+userid;

	mysql.fetchData(followingcq,function(err,results2){
		if(err){
			throw err;
		}
		else{
			console.log(results2);
			res.send(requestGen.responseGenerator(200,results2));
		}
	});

};

exports.followercount = function(req,res){
	var userid = req.param("userid3");
	
	var followercq = "select distinct * from following left join users on following.user_uname = users.id where following.follow_uname = "+userid;

	mysql.fetchData(followercq,function(err,results3){
		if(err){
			throw err;
		}
		else{
			console.log(results3);
			res.send(requestGen.responseGenerator(200,results3));
		}
	});
};

exports.usertweets = function(req,res){
	var userid1 = req.param("userid1");
	var query = "select * from tweets where user_id =" + userid1;

	mysql.fetchData(query,function(err,results){
		if(err){
			throw err;
		}
		else{
			requestGen.responseGenerator(200,results);
		}
	});
};