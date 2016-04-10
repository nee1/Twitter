
/*
 * GET users listing.
 */

var ejs = require("ejs");
var mysql = require('./mysql');
var requestGen = require('./commons/responseGenerator');
var Users = require('./models/userModel');


exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.getuser = function(req,res){
	var username1 = req.param("userid1");

	Users.findOne( {username:username1} ,function(err,results)
	{	
		if(err)
		{
			res.send(requestGen.responseGenerator(401, null));
			throw err;
		}
		else
		{
			if(results.length == 1){
				console.log("valid user found");
				res.send(requestGen.responseGenerator(200, results));
			}
			else
			{
				res.send(requestGen.responseGenerator(401, null));
			}					
		}  
	});
};

exports.allusers = function(req,res){
	
	var getUsers="select * from users";

	Users.find({},function(err,results){
		if(err)
		{
			throw err;
		}
		else
		{
			if(results.length > 0){
				console.log("all users found");
				console.log(results[1]);
				res.send(requestGen.responseGenerator(200, results));
			}
			else
			{
				res.send(requestGen.responseGenerator(401, null));
			}					
		}  
	});	
};

exports.hashtag = function(req,res){
	
};

exports.searchuser =function(req, res){
	var searchkey = req.param("searchkey1");
	var searchquery = "select * from users where (username LIKE '%"+ searchkey +"%' or first_name like '%"+searchkey+"%' or last_name like '%"+searchkey+"%');";
	Users.findOne({name: new RegExp('^'+searchkey+'$', "i")}, function(err,results){
		if(err){
			throw err;
		}
		else{
			console.log(results);
			res.send(requestGen.responseGenerator(200,results));
		}
	});
};

exports.postweet = function(req,res){
	var tweetquery;
	var username1 = req.session.userid;
	var tweet = req.param("tweetdata");
	var temp = new Object();
	temp["body"] = tweet;
	temp["tags"] = tweet.match(/#\w+/g).toString();
	temp["isRetweet"] = false;


	tweetquery = "insert into tweets (`user_id`,`content`) values ('" + username + "','" + tweet + "')";

	Users.findOne({username:username1}, function(err,results){
		if(err){
			res.send(requestGen.responseGenerator(401,null));
		}
		else
		{
			results.tweets.push(temp);
			results.save(function(err,result){
				if(err){
					res.send(requestGen.responseGenerator(401,null));
				}
				else
				{
					res.send(requestGen.responseGenerator(200,result));
				}
			});
		}
	});
};

exports.retweet = function(req,res){
	var username1 = req.session.userid;
	var tweetid = req.param("tweet_id");
	//var tweetquery = "insert into retweets (`user_id`,`tweet_id`) values ('" + userid + "','" + tweetid + "')";

	//var temp = new Object();
	//temp["body"] = tweet;
	//temp["tags"] = tweet.match(/#\w+/g).toString();
	//temp["isRetweet"] = false;

	Users.findOne({'tweets._id' : tweetid },function(err,user){
		var tempTweet ;
		for(var i=0; i<user.tweets.length; i++){
			if(user.tweets._id == tweetid){
				tempTweet.push({
					'body' : user.tweets[tweetid].body,
					'isRetweet' : true,
					'retweetBy' : username1,
					'retweetedAt' : Date.now,
					'createdAt' : user.tweets[tweetid].createdAt;
				});
			}
		}
		console.log("for retweet"+tempTweet);

		Users.findOne({'username':username1},function(err,result){
			if(err){
					res.send(requestGen.responseGenerator(401,null));
			}
			else{
				result.tweets.push(tempTweet);
				result.save(function(err,data){
					if(err){
						res.send(requestGen.responseGenerator(401,null));
					}
					else
					{
						res.send(requestGen.responseGenerator(200,data));
					}
				});					
			}
		});
	});
};


exports.getweets = function(req,res){
	var username1 = req.session.username;
	var userid = req.session.userid;

	var tweetsquery = "select * from tweets left join users on tweets.user_id = users.id where tweets.user_id in ( select follow_uname from following where following.user_uname= " + userid + ");";
	


	mysql.fetchData(tweetsquery,function(err,results){
		if(err){
			res.send(requestGen.responseGenerator(401,null));
		}
		else{
			res.send(requestGen.responseGenerator(200,results));					
		}
	});
};


exports.follow = function(req,res){
	var userid,followid;
	userid = req.session.userid;
	followid = req.param("followid");
	var followquery = "insert into following (`user_uname`,`follow_uname`) values ('" + userid + "','" + followid + "')";

	mysql.storeData(followquery,function(err,result){
		if(!err){
			console.log("success follow query");
			res.send(requestGen.responseGenerator(200, followid));
		}
		else{
			console.log("err in followquery");
			res.send(requestGen.responseGenerator(401, followid));
		}
	});

};