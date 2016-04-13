
/*
 * GET users listing.
 */

var ejs = require("ejs");
//var mysql = require('./mysql');
var resGen = require('./commons/responseGenerator');
var Users = require('./models/userModel');


exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.getuser = function(req,res){
	var username1 = req.param("username");

	Users.findOne( {username:username1} ,function(err,results)
	{	
		if(err)
		{
			res.send(resGen.responseGenerator(401, null));
			throw err;
		}
		else
		{
			if(results){
				console.log("valid user found");
				res.send(resGen.responseGenerator(200, results));
			}
			else
			{
				res.send(resGen.responseGenerator(401, null));
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
				//console.log(results[1]);
				res.send(resGen.responseGenerator(200, results));
			}
			else
			{
				res.send(resGen.responseGenerator(401, null));
			}					
		}  
	});	
};

exports.hashtag = function(req,res){
	var keyword = req.param("keyword");
	var tweets = [];
	Users.find({ "tweets.tags" : new RegExp('^#'+keyword+'$',"i")},function(err,results){
		if(err)
		{
			console.log("hashtag error : " + err);
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{
			//console.log("hashtag results : " + results);
			results.forEach(function(user){
				user.tweets.forEach(function(tweet){
					if(keyword in tweet.tags){
						tweets.push({
								"first":user.first,
								"last":user.last,
								"username":user.username,
								"tweetdata":tweet});
					}		
				});
			});
			//console.log(tweets);
			res.send(resGen.responseGenerator(200,tweets));
		}
	});
};

exports.searchuser =function(req, res){
	var keyword = req.param("searchkey");
	//var searchquery = "select * from users where (username LIKE '%"+ searchkey +"%' or first_name like '%"+searchkey+"%' or last_name like '%"+searchkey+"%');";
	Users.find({$or: [
				{first: new RegExp('^'+keyword+'$', "i")},
				{last : new RegExp('^'+keyword+'$',"i")},
				{username: new RegExp('^'+keyword+'$',"i")}
	]}, 
	function(err,results){
		if(err){
			throw err;
		}
		else{
			//console.log(results);
			if(results){
				res.send(resGen.responseGenerator(200,results));	
			}
			else{
				res.send(resGen.responseGenerator(200,"Not found"));
			}
		}
	});
};

exports.postweet = function(req,res){
	var tweetquery;
	var username1 = req.session.username;
	var tweetbody = req.param("tweetbody");
	var temp = new Object();
	temp["body"] = tweetbody;
	temp["tags"] = tweetbody.match(/#\w+/g);
	temp["isRetweet"] = false;

	console.log("hashtags :" + tweetbody.match(/#\w+/g));
	//console.log(temp);
	//tweetquery = "insert into tweets (`user_id`,`content`) values ('" + username + "','" + tweet + "')";

	Users.findOne({username:username1}, function(err,user){
		if(err){
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{
			user.tweets.push(temp);
			user.save(function(err,result){
				if(err){
					res.send(resGen.responseGenerator(401,null));
				}
				else
				{
					res.send(resGen.responseGenerator(200,temp));
				}
			});
		}
	});
};

exports.retweet = function(req,res){

	var username1 = req.session.username;
	var tweetid = req.param("tweet_id");
	console.log("tweetid for retweet : " + tweetid );
	//var tweetquery = "insert into retweets (`user_id`,`tweet_id`) values ('" + userid + "','" + tweetid + "')";
	var tempTweet = [], retweetSuccess = false,i;

	//var temp = new Object();
	//temp["body"] = tweet;
	//temp["tags"] = tweet.match(/#\w+/g).toString();
	//temp["isRetweet"] = false;

	Users.findOne({'tweets._id' : tweetid }, function(err,user){
		if(err){
			console.log("tweetid :" + tweetid +" not found");
			res.send(resGen.responseGenerator(401,null));
		}
		else{
			//console.log("user for retweet : "+ user);
			console.log("tweets length :" + user.tweets.length );
			for(i=0; i<user.tweets.length; i++){
			//	console.log("tweet ["+ i +"]: " + user.tweets[i]._id);
				//console.log(user.tweets[i]._id);
				if(user.tweets[i]._id == tweetid){
					//i = user.tweets.indexOf(tweetid);
					//console.log("index " + i);
					tempTweet = {
					'body' : user.tweets[i].body,
					'isRetweet' : true,
					'originTweetBy' : user.username,
					'originTweetId': tweetid,
					'retweetedAt' : Date.now(),
					'createdAt' : user.tweets[i].createdAt
					};
				}
			}
			console.log("for retweet"+tempTweet);

			Users.findOne({'username':username1},function(err,result){
				if(err){
						res.send(resGen.responseGenerator(401,null));
				}
				else{
					//console.log("in user for retweet");
					//console.log(result);
					console.log("indexOf tweetid: " + result.tweets.indexOf(tweetid));
					var ind = -1;;
					for(i=0; i<result.tweets.length; i++){
						if(result.tweets[i].originTweetId == tweetid){
							ind=i;
						}
					}

					if( ind != -1 ){
						console.log("indexOf tweetid for undo: " + ind);
						result.tweets.splice(result.tweets.indexOf(tweetid),1);
						retweetSuccess = false;
						console.log("undo retweet");
					} else {	
						//console.log("indexOf tweetid : " + result.tweets.indexOf(tweetid));
						result.tweets.push(tempTweet);
						retweetSuccess = true;
						console.log("retweet pushed");
					}
					//console.log(result);
					
					result.save(function(err,data){
						if(err){
							console.log(err);
							
							res.send(resGen.responseGenerator(401,err));
						}
						else
						{
							//var doc = {'data':data, 'undoRetweet':retweetSuccess};
							//console.log("retweet save log: "+ doc);
							res.send(resGen.responseGenerator(200,retweetSuccess));
						}
					});					
				}
			});
		}
	});
};


exports.getweets = function(req,res){
	var username1 = req.session.username;
	//var userid = req.session.userid;

	//var tweetsquery = "select * from tweets left join users on tweets.user_id = users.id where tweets.user_id in ( select follow_uname from following where following.user_uname= " + userid + ");";
	var followingData = [], tweets = [];
	
	Users.findOne({username:username1},function(err,results){
		if(err)
		{
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{	
			followingData.push(results.following);
			followingData.push(results.username);
			console.log("following data : " + followingData);
			Users.find({username:{$in : followingData}}, function(err,followings){
				if(err)
				{
					res.send(resGen.responseGenerator(401,null));
				}
				else
				{
					followings.forEach(function(user){
						user.tweets.forEach(function(tweet){
							tweets.push({
								"first":user.first,
								"last":user.last,
								"username":user.username,
								"tweetdata":tweet});
						});
						//tweets.push("tweets":user.tweets);
					});
					console.log(tweets);
					res.send(resGen.responseGenerator(200,tweets));
				}
			});
		}
	});
};


exports.follow = function(req,res){
	var username1 = req.session.username;
	var follow_uname = req.param("follow_uname");
	//var followquery = "insert into following (`user_uname`,`follow_uname`) values ('" + userid + "','" + followid + "')";

	Users.findOne({username:username1},function(err, user){
		if(err)
		{
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{
			Users.findOne({username:follow_uname},function(err, follower){
				if(err)
				{
					res.send(resGen.responseGenerator(401,null));
				}
				else
				{
					if(user){
						if (user.following.indexOf(follow_uname) === -1) {
							user.following.push(follow_uname);
							user.save(function(err,res1){
				           		if(err){
				           			res.send(resGen.responseGenerator(401,null));
				           		}
				           	});
				        }
				        /*else {
				          this.following.splice(this.following.indexOf(id), 1);
				        }*/
					}	
					if(follower){
						if (follower.followers.indexOf(username1) === -1) {
				        	follower.followers.push(username1);
				        	follower.save(function(err,res2){
				           		if(err){
				           			res.send(resGen.responseGenerator(401,null));
				           		}
				           	});
				        } /*else {
				            this.followers.splice(this.followers.indexOf(id),1);
				        }*/
					}
					console.log("follow follower success");
					res.send(resGen.responseGenerator(200,follow_uname));
				}
			});
		}
	});
};