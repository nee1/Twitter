/*
 * GET users listing.
 */

var ejs = require("ejs");
var mq = require('../rpc/client');

//var mysql = require('./mysql');
var resGen = require('./commons/responseGenerator');
var Users = require('./models/userModel');
var Hashtags = require('./models/hashtagModel');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.getuser = function(req,res){
	var username1 = req.param("username");
  var msg_payload = {"service":"getuser", "username":username1, "sid":req.sessionID};
  mq.make_request('user_queue', msg_payload, function(err,results){
	{
		if(err)
		{
      console.log(err);
			res.send(resGen.responseGenerator(401, null));
		}
		else
		{
			if(results){
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
	//var getUsers="select * from users";
  var msg_payload = {"service":"allusers", "sid":req.sessionID};
  mq.make_request('user_queue', msg_payload, function(err,results){
		if(err)
		{
      console.log(err);
			res.send(resGen.responseGenerator(401,null));
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
	var msg_payload = {"service":"hashtag", "keyword":keyword, "sid":req.sessionID};
	mq.make_request('search_queue', msg_payload, function(err,tweets){
		if(err)
		{
			console.log("hashtag error : " + err);
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{
			res.send(resGen.responseGenerator(200,tweets));
		}
	});
};

exports.searchUser =function(req, res){
	var keyword = req.param("searchkey");
  var msg_payload = {"service":"searchUser", "searchkey":keyword, "sid":req.sessionID};
	mq.make_request('search_queue', msg_payload, function(err,userSearchData){
		if(err){
			throw err;
		}
		else{
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
  var msg_payload = {"service":"searchTag", "searchkey":keyword, "sid":req.sessionID};
  mq.make_request('count_queue', msg_payload, function(err,searchTagData){
      if(err){
        console.log("err in hashtag result");
        console.log(err);
        res.send(resGen.responseGenerator(401,null));
      }
      else {
        res.send(resGen.responseGenerator(200,searchTagData));
      }
    });
}

exports.postweet = function(req,res){
	var username1 = req.session.username;
	var tweetbody = req.param("tweetbody");
  var msg_payload = {"service":"postweet", "username":username1, "tweetbody":tweetbody, "sid":req.sessionID};
  mq.make_request('tweet_queue', msg_payload, function(err,data){
		if(err){
      console.log(err);
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{
			res.send(resGen.responseGenerator(200,data));
	  }
	});
}

exports.retweet = function(req,res){
	var username1 = req.session.username;
	var tweetid = req.param("tweet_id");

  var msg_payload = {"service":"retweet", "username":username1, "tweet_id":tweet_id, "sid":req.sessionID};
  mq.make_request('tweet_queue', msg_payload, function(err,retweetSuccess){
		if(err){
      console.log(err);
      res.send(resGen.responseGenerator(401,null));
		}
		else{
      res.send(resGen.responseGenerator(200,retweetSuccess));
		}
	});
};


exports.getweets = function(req,res){
	var username1 = req.session.username;
  var msg_payload = {"service":"getweets", "username":username1, "sid":req.sessionID};
  mq.make_request('tweet_queue', msg_payload, function(err,tweets){
		if(err)
		{
			console.log("getweets err : " + err);
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{
			res.send(resGen.responseGenerator(200,tweets));
		}
	});
};


exports.follow = function(req,res){
	var username1 = req.session.username;
	var follow_uname = req.param("follow_uname");
	//var followquery = "insert into following (`user_uname`,`follow_uname`) values ('" + userid + "','" + followid + "')";
  console.log(username1);
  console.log(follow_uname);
  if(username1 == follow_uname){
    console.log("same user");
    res.send(resGen.responseGenerator(400,null));
  }
  else{
    var msg_payload = {"service":"follow", "username":username1, "follow_uname":follow_uname, "sid":req.sessionID};
    mq.make_request('user_queue', msg_payload, function(err,follow_name){
      if(err)
      {
        res.send(resGen.responseGenerator(401,null));
      }
      else
      {
        console.log("follow follower success");
        res.send(resGen.responseGenerator(200,follow_name));
      }
    });
  }
};
