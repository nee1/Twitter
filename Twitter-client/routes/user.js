/*
 * GET users listing.
 */

var ejs = require("ejs");
var mq = require('../rpc/client');

//var mysql = require('./mysql');
var resGen = require('./commons/responseGenerator');

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.getuser = function(req,res){
	var username1 = req.param("username");
  var msg_payload = {"service":"getuser", "username":username1, "sid":req.sessionID};
  mq.make_request('user_queue', msg_payload, function(err,results){
		if(err)
		{
      console.log(err);
			res.send(resGen.responseGenerator(401, null));
		}
		else
		{

			if(results){
        results = JSON.parse( results );
				res.send(resGen.responseGenerator(200,results));
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
        results = JSON.parse( results );
				console.log("all users found");
				//console.log(results[1]);
				res.send(results);
			}
			else
			{
				res.send(resGen.responseGenerator(401, null));
			}
		}
	});
};

exports.hashtag = function(req,res){
	var keyword1 = req.param("keyword");
	var msg_payload = {"service":"hashtag", "keyword":keyword1, "sid":req.sessionID};
	mq.make_request('search_queue', msg_payload, function(err,tweets){
		if(err)
		{
			console.log("hashtag error : " + err);
			res.send(resGen.responseGenerator(401,null));
		}
		else
		{
      tweets = JSON.parse( tweets );
      res.send(tweets);
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
        userSearchData = JSON.parse( userSearchData );
        res.send(userSearchData);
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
  mq.make_request('search_queue', msg_payload, function(err,searchTagData){
    if(err){
      console.log("err in hashtag result");
      console.log(err);
      res.send(resGen.responseGenerator(401,null));
    }
    else {
      searchTagData = JSON.parse(searchTagData);
      res.send(searchTagData);
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
      data = JSON.parse( data );
			res.send(data);
	  }
	});
}

exports.retweet = function(req,res){
	var username1 = req.session.username;
	var tweetid = req.param("tweet_id");

  var msg_payload = {"service":"retweet", "username":username1, "tweet_id":tweetid, "sid":req.sessionID};
  mq.make_request('tweet_queue', msg_payload, function(err,retweetSuccess){
		if(err){
      console.log(err);
      res.send(resGen.responseGenerator(401,null));
		}
		else{
      retweetSuccess = JSON.parse( retweetSuccess );
      res.send(retweetSuccess);
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
      tweets = JSON.parse( tweets );
			res.send(tweets);
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
        follow_name = JSON.parse( follow_name );
        console.log("follow follower success");
        res.send(follow_name);
      }
    });
  }
};
