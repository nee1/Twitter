/*
 * GET users listing.
 */

var ejs = require("ejs");
//var mysql = require('./mysql');
var resGen = require('./commons/responseGenerator');
var Users = require('./models/userModel');
var Hashtags = require('./models/hashtagModel');

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
	Users.find({ "tweets.tags" : new RegExp('.*'+keyword+'.*',"i")},function(err,results){
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
					if(tweet.tags.toString().indexOf(keyword)>=0){
						tweets.push({
								"first":user.first,
								"last":user.last,
								"username":user.username,
                "createdAt":tweet.createdAt,
								"tweetdata":tweet});
						//console.log(tweet.tags);
					}
					//console.log(tweet);
				});
			});
			//console.log(tweets);
			res.send(resGen.responseGenerator(200,tweets));
		}
	});
};

exports.searchUser =function(req, res){
	var keyword = req.param("searchkey");
  var userSearchData = [];
	//var searchquery = "select * from users where (username LIKE '%"+ searchkey +"%' or first_name like '%"+searchkey+"%' or last_name like '%"+searchkey+"%');";
	Users.find({$or: [
				{first: new RegExp('.*'+keyword+'.*', "i")},
				{last : new RegExp('.*'+keyword+'.*',"i")},
				{username: new RegExp('.*'+keyword+'.*',"i")},
	]},
	function(err,results){
		if(err){
			throw err;
		}
		else{
			//console.log("search results : "+results);
			for(var result in results){
         //console.log("result in searchuser");
         //console.log(results[result].username);
         userSearchData.push( {
           username : results[result].username,
           first : results[result].first,
           last : results[result].last
         });
      }
      console.log("userSearchData");
      console.log(userSearchData);

      if(userSearchData){
        res.send(resGen.responseGenerator(201,userSearchData));
      }
      else{
        res.send(resGen.responseGenerator(202,null));
      }
		}
	});
};

exports.searchTag = function(req,res){

  var keyword = req.param("searchkey");
  console.log("in tag search for" + keyword);
  Hashtags.find({tags: new RegExp('.*'+keyword+'.*',"i")})
    //.populate('tweet')
    .exec(function(err,results){
      if(err){
        console.log("err in hashtag result");
        console.log(err);
      }
      else {
        console.log("results in hashtag");
        console.log(results);
        var doc = [];
        results.forEach(function(res){
          if(doc.indexOf(res.tags) === -1){
            doc.push(res.tags);
          }
        });
        console.log("logged all tags");
        console.log(doc);
        res.send(resGen.responseGenerator(200,doc));
        //tweetSearchData = results;
      }
    });
}

exports.postweet = function(req,res){
	var tweetquery;
	var username1 = req.session.username;
	var tweetbody = req.param("tweetbody");
	var temp = {};
	temp.body = tweetbody;
	temp.tags = tweetbody.match(/#\w+/g);
	temp.isRetweet = false;

	console.log("hashtags :" + tweetbody.match(/#\w+/g));
	//console.log(temp);
	//tweetquery = "insert into tweets (`user_id`,`content`) values ('" + username + "','" + tweet + "')";

	Users.findOne({username:username1}, function(err,user){
		if(err){
      console.log(err);
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{
			user.tweets.push(temp);
			user.save(function(err,result){
				if(err){
          console.log("user save err");
          console.log(err);
          res.send(resGen.responseGenerator(401,null));
				}
				else
				{
          var tempid;
          console.log("tweet save for id");
          console.log(result);
          for(tw in result.tweets){
            if(tw.body == tweetbody){
              tempid = tw._id;
            }
          }

          /*
          var flag=false;
          Hashtags.find(function(err,data){
        		for(tag in temp.tags){
        		   for(doc in data){
        		    if(temp.tags[tag] !== data[doc].tags){
                  flag=true;
                }
        		  }
              if(flag){
                data.push({
                  tags: temp.tags,
                  tweet: tempid
                });
                flag=false;
              }
        		}
          });
          }*/
          for(tag in temp.tags){
            var htag = Hashtags({
              tags: temp.tags[tag],
              tweet: tempid
            });
            htag.save(function(err,data){
              if(err){
                console.log("htag save error");
                console.log(err);
                //res.send(resGen.responseGenerator(401,null));
              }
            });
          }
        }
          console.log("tags stored like this");
          console.log(htag);
					res.send(resGen.responseGenerator(200,temp));
				}
			});
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

			//console.log("for retweet"+tempTweet);

			Users.findOne({'username':username1},function(err,result){
				if(err){
						res.send(resGen.responseGenerator(401,null));
				}
				else{
					//console.log("in user for retweet");
					//console.log(result);
					console.log("indexOf tweetid: " + result.tweets.indexOf(tweetid));
					var ind = -1,tc;
					for(i=0; i<result.tweets.length; i++){
						if(result.tweets[i].originTweetId === tweetid){
							ind=i;
						}
					}
					for(i=0; i<user.tweets.length; i++){
					//	console.log("tweet ["+ i +"]: " + user.tweets[i]._id);
						//console.log(user.tweets[i]._id);
						if(user.tweets[i]._id === tweetid){
							//i = user.tweets.indexOf(tweetid);
							//console.log("index " + i);
							tempTweet = {
							'body' : user.tweets[i].body,
							'isRetweet' : true,
							'originTweetBy' : user.username,
							'originTweetId': tweetid,
							'originTweetAt' : user.tweets[i].createdAt,
							'createdAt': Date.now()
							};
							tc = i;
						}
					}

					if( ind !== -1 ){
						console.log("indexOf tweetid for undo: " + ind);
						result.tweets.splice(result.tweets.indexOf(tweetid),1);
						retweetSuccess = false;
						user.tweets[tc].retweetCount = user.tweets[tc].retweetCount - 1;
						console.log("undo retweet");
					} else {
						console.log("tweets length :" + user.tweets.length );
						//console.log("indexOf tweetid : " + result.tweets.indexOf(tweetid));
						result.tweets.push(tempTweet);
						retweetSuccess = true;
						user.tweets[tc].retweetCount = user.tweets[tc].retweetCount + 1;
						console.log("retweet pushed");

					}
					//console.log(result);

					user.save(function(err,data){
						if(err){
							console.log(err);
							res.send(resGen.responseGenerator(401,null));
						}
					});

					result.save(function(err,data){
						if(err){
							console.log(err);
							res.send(resGen.responseGenerator(401,null));
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
			console.log("getweets err : " + err);
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{
			if(results.following.length > 0){
				followingData.push(results.following);
			}
			if(results._id){
				followingData.push(results._id);
			}

			//console.log("following data in getweets: " + followingData);
			Users.find({_id:{$in : followingData}}, function(err,followings){
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
                "createdAt":tweet.createdAt,
								"tweetdata":tweet});
						});
						//tweets.push("tweets":user.tweets);
					});
					//console.log(tweets);
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
						if (user.following.indexOf(follower._id) === -1) {
							user.following.push(follower._id);
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
						if (follower.followers.indexOf(user._id) === -1) {
				        	follower.followers.push(user._id);
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
