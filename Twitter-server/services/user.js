/*
 * GET users listing.
 */

var ejs = require("ejs");
//var mysql = require('./mysql');
var resGen = require('./commons/responseGenerator');
var Users = require('./models/userModel');
var Hashtags = require('./models/hashtagModel');

exports.list = function(req, res){
  res(null,"respond with a resource");
};

exports.getuser = function(req,res){
	var username1 = req.username;

	Users.findOne({username:username1},{first:1,last:1,username:1,location:1,birthdate:1} ,function(err,results)
	{
		if(err)
		{
			res(null,JSON.stringify(resGen.responseGenerator(401, null)));
			throw err;
		}
		else
		{
				console.log("valid user found");
				res(null,JSON.stringify(results));
		}
	});
};

exports.allusers = function(req,res){

	//var getUsers="select * from users";

	Users.find({},{first:1,last:1,username:1},function(err,results){
		if(err)
		{
			throw err;
		}
		else
		{
			if(results.length > 0){
				console.log("all users found");
				//console.log(results[1]);
				res(null,JSON.stringify(resGen.responseGenerator(200, results)));
			}
			else
			{
				res(null,JSON.stringify(resGen.responseGenerator(401, null)));
			}
		}
	});
};

exports.hashtag = function(req,res){
	var keyword = req.keyword;
	var tweets = [];
	Users.find(
    { "tweets.tags" : new RegExp('.*'+keyword+'.*',"i")},
    {following:0,followers:0,password:0,email:0,updatedAt:0,createdAt:0},
    function(err,results){
  		if(err)
  		{
  			console.log("hashtag error : " + err);
  			res(null,JSON.stringify(resGen.responseGenerator(401,null)));
  		}
  		else
  		{
  			console.log("hashtag results : " + results);
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
  			res(null,JSON.stringify(resGen.responseGenerator(200,tweets)));
  		}
	});
};

exports.searchUser =function(req, res){
	var keyword = req.searchkey;
  var userSearchData = [];
	//var searchquery = "select * from users where (username LIKE '%"+ searchkey +"%' or first_name like '%"+searchkey+"%' or last_name like '%"+searchkey+"%');";
	Users.find({$or: [
				{first: new RegExp('.*'+keyword+'.*', "i")},
				{last : new RegExp('.*'+keyword+'.*',"i")},
				{username: new RegExp('.*'+keyword+'.*',"i")},
	]},{username:1,first:1,last:1},
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
        res(null,JSON.stringify(resGen.responseGenerator(200,userSearchData)));
      }
      else{
        res(null,JSON.stringify(resGen.responseGenerator(202,null)));
      }
		}
	});
};

exports.searchTag = function(req,res){

  var keyword = req.searchkey;
  console.log("in tag search for" + keyword);
  Hashtags.find({tags: new RegExp('.*'+keyword+'.*',"i")},function(err,results){
      if(err){
        console.log("err in hashtag result");
        console.log(err);
      }
      else {
        console.log("results in hashtag for : "+keyword+" :");
        console.log(results);
        var doc = [];
        results.forEach(function(res){
          if(doc.indexOf(res.tags) == -1){
            doc.push(res.tags);
          }
        });
        console.log("logged all tags");
        //console.log(doc);
        res(null,JSON.stringify(resGen.responseGenerator(200,doc)));
        //tweetSearchData = results;
      }
    });
}

exports.postweet = function(req,res){
	var tweetquery;
	var username1 = req.username;
	var tweetbody = req.tweetbody;
	var temp = {};
	temp.body = tweetbody;
	temp.tags = tweetbody.match(/#\w+/g);
	temp.isRetweet = false;

	//console.log("hashtags :" + tweetbody.match(/#\w+/g));
	//console.log(temp);
	//tweetquery = "insert into tweets (`user_id`,`content`) values ('" + username + "','" + tweet + "')";

	Users.findOne({username:username1},function(err,user){
		if(err){
      console.log(err);
			res(null,JSON.stringify(resGen.responseGenerator(401,null)));
		}
		else
		{
			user.tweets.push(temp);
			user.save(function(err,result){
				if(err){
          console.log("user save err");
          console.log(err);
          res(null,JSON.stringify(resGen.responseGenerator(401,null)));
				}
				else
				{
          var tempid;
          console.log("tweet save for id");
          //console.log(result);
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
          /**/
          for(tag in temp.tags){
            var htag = Hashtags({
              tags: temp.tags[tag],
              tweet: tempid
            });
            htag.save(function(err,data){
              if(err){
                console.log("htag save error");
                console.log(err);
                //res(null,JSON.stringify(resGen.responseGenerator(401,null));
              }
            });
          }
          console.log("tags stored like this");
          //console.log(htag);
					res(null,JSON.stringify(resGen.responseGenerator(200,temp)));
				}
			});
    }
	});
}

exports.retweet = function(req,res){

	var username1 = req.username;
	var tweetid = req.tweet_id;
	//console.log("tweetid for retweet : " + tweetid );
	//var tweetquery = "insert into retweets (`user_id`,`tweet_id`) values ('" + userid + "','" + tweetid + "')";
	var tempTweet = [], retweetSuccess = false,i;

	//var temp = new Object();
	//temp["body"] = tweet;
	//temp["tags"] = tweet.match(/#\w+/g).toString();
	//temp["isRetweet"] = false;

	Users.findOne({'tweets._id' : tweetid },function(err,tuser){
		if(err){
			console.log("tweetid :" + tweetid +" not found");
			res(null,JSON.stringify(resGen.responseGenerator(401,null)));
		}
		else{
			//console.log("user for retweet : "+ user);

			//console.log("for retweet"+tempTweet);
      if(tuser.username == username1){
        res(null,JSON.stringify(resGen.responseGenerator(401,"Can't retweet your own tweets")));
      }
      else {
        Users.findOne({'username':username1},function(err,ruser){
          if(err){
              res(null,JSON.stringify(resGen.responseGenerator(401,null)));
          }
          else{
            //console.log("in user for retweet");
            //console.log(ruser);
            //console.log("indexOf tweetid: " + ruser.tweets.indexOf(tweetid));
            var i,retweet_exists = -1,rcount_id;
            for(i=0; i<ruser.tweets.length; i++){
              if(ruser.tweets[i].originTweetId == tweetid){
                retweet_exists=i;
              }
            }
            console.log("tweetid");
            console.log(tweetid);
            for(i=0; i<tuser.tweets.length; i++){
            //	console.log("tweet ["+ i +"]: " + tuser.tweets[i]._id);
              //console.log(tuser.tweets[i]._id);
              if(tuser.tweets[i]._id == tweetid){
                //i = tuser.tweets.indexOf(tweetid);
                //console.log("index " + i);
                tempTweet = {
                'body' : tuser.tweets[i].body,
                'isRetweet' : true,
                'originTweetBy' : tuser.username,
                'originTweetId': tweetid,
                'originTweetAt' : tuser.tweets[i].createdAt,
                'createdAt': Date.now()
                };
                rcount_id = i;
                console.log("rcount_id");
                console.log(rcount_id);
              }
            }
            console.log(tempTweet);
            console.log("retwee count before");
            console.log(tuser.tweets[rcount_id].retweetCount);
            if( retweet_exists > -1 ){
              console.log("index of tid at exists");
              console.log(ruser.tweets[retweet_exists]);
              ruser.tweets.splice(ruser.tweets[retweet_exists],1);
              retweetSuccess = false;
              //console.log("tuser tweets indexof");
              //console.log(tuser.tweets.indexOf(rcount_id));
              tuser.tweets[rcount_id].retweetCount = tuser.tweets[rcount_id].retweetCount - 1;
              console.log("undo retweet");
            } else {
              //console.log("tweets length :" + user.tweets.length );
              ruser.tweets.push(tempTweet);
              retweetSuccess = true;
              //console.log(tuser.tweets);
              //console.log("tuser tweets indexof 0");
              //console.log(tuser.tweets[0]);
              tuser.tweets[rcount_id].retweetCount = tuser.tweets[rcount_id].retweetCount + 1;
              console.log("retweet pushed");
            }
            //console.log(result);
            console.log("retweet count after");
            console.log(tuser.tweets[rcount_id].retweetCount);
            tuser.save(function(err,data){
              if(err){
                console.log(err);
                res(null,JSON.stringify(resGen.responseGenerator(401,null)));
              }
            });

            ruser.save(function(err,data){
              if(err){
                console.log(err);
                res(null,JSON.stringify(resGen.responseGenerator(401,null)));
              }
              else
              {
                //var doc = {'data':data, 'undoRetweet':retweetSuccess};
                //console.log("retweet save log: "+ doc);
                res(null,JSON.stringify(resGen.responseGenerator(200,retweetSuccess)));
              }
            });
          }
        });
      }
		}
	});
};


exports.getweets = function(req,res){
	var username1 = req.username;
	//var userid = req.userid;

	//var tweetsquery = "select * from tweets left join users on tweets.user_id = users.id where tweets.user_id in ( select follow_uname from following where following.user_uname= " + userid + ");";
	var followingData = [], tweets = [];

	Users.findOne({username:username1}, {following:1,username:1,_id:1}, function(err,results){
		if(err)
		{
			console.log("getweets err : " + err);
			res(null,JSON.stringify(resGen.responseGenerator(401,null)));
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
			Users.find({_id:{$in : followingData}}, {username:1,first:1,last:1,tweets:1}, function(err,followings){
				if(err)
				{
					res(null,JSON.stringify(resGen.responseGenerator(401,null)));
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
					res(null,JSON.stringify(resGen.responseGenerator(200,tweets)));
				}
			});
		}
	});
};


exports.follow = function(req,res){
	var username1 = req.username;
	var follow_uname = req.follow_uname;
	//var followquery = "insert into following (`user_uname`,`follow_uname`) values ('" + userid + "','" + followid + "')";
  console.log(username1);
  console.log(follow_uname);
  if(username1 == follow_uname){
    console.log("same user");
    res(null,JSON.stringify(resGen.responseGenerator(400,null)));
  }
  else{
    Users.findOne({username:username1},function(err, user){
      if(err)
      {
        res(null,JSON.stringify(resGen.responseGenerator(401,null)));
      }
      else
      {
        Users.findOne({username:follow_uname},function(err, follower){
          if(err)
          {
            res(null,JSON.stringify(resGen.responseGenerator(401,null)));
          }
          else
          {
            if(user){
              if (user.following.indexOf(follower._id) == -1) {
                user.following.push(follower._id);
              }
              else {
                user.following.splice(user.following.indexOf(user._id), 1);
              }
              user.save(function(err,res1){
                  if(err){
                    res(null,JSON.stringify(resGen.responseGenerator(401,null)));
                  }
              });
            }
            if(follower){
              if (follower.followers.indexOf(user._id) == -1) {
                    follower.followers.push(user._id);
              } else {
                  follower.followers.splice(follower.followers.indexOf(user._id),1);
              }
              follower.save(function(err,res2){
                  if(err){
                    res(null,JSON.stringify(resGen.responseGenerator(401,null)));
                  }
              });
            }
            console.log("follow follower success");
            res(null,JSON.stringify(resGen.responseGenerator(200,follow_uname)));
          }
        });
      }
    });
  }
};
