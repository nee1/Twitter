var login = require('./services/login')
  , profile = require('./services/profile')
  , user = require('./services/user')
  //Importing the 'client-sessions' module
  , mongoose = require('mongoose')
  , util = require('util')
  , amqp = require('amqp');

//var routes = require('./services')
var mongoSessionConnectURL = "mongodb://localhost:27017/twitter?poolSize=8";
var cnn = amqp.createConnection({host:'127.0.0.1'});


// connect to the mongo collection session and then createServer
mongoose.connect(mongoSessionConnectURL, function() {
  console.log('Connected to mongo at: ' + mongoSessionConnectURL);
});

cnn.on('ready', function(){

	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			//util.log(util.format( deliveryInfo.routingKey, message));
			//util.log("Message: "+JSON.stringify(message));
			//util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

      switch (message.service) {
        case "checkLogin":
          login.checkLogin(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
						// return index sent
						cnn.publish(m.replyTo, JSON.stringify(res), {
							contentType: 'application/json',
							contentEncoding: 'utf-8',
							correlationId: m.correlationId
            });
          });
          break;
        case "checkSignUp":
          login.checkSignUp(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
      }
    });
	});

  console.log("listening on user_queue");

  cnn.queue('user_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      //util.log(util.format( deliveryInfo.routingKey, message));
      //util.log("Message: "+JSON.stringify(message));
      //util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

      switch (message.service) {
        case "getuser":
          user.getuser(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            util.log("getuser success");
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;

        case "allusers":
          user.allusers(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;

        case "follow":
          user.follow(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
      }
    });
  });

  console.log("listening on tweet_queue");
  cnn.queue('tweet_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      //util.log(util.format( deliveryInfo.routingKey, message));
      //util.log("Message: "+JSON.stringify(message));
      //util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

      switch (message.service) {
        case "postweet":
          user.postweet(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
        case "retweet":
          user.retweet(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
        case "getweets":
          user.getweets(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            //util.log("in get tweets");
            //util.log(err);
            //util.log(res);
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
        case "usertweets":
          profile.usertweets(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
      }
    });
  });

  console.log("listening on count_queue");
  cnn.queue('count_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      //util.log(util.format( deliveryInfo.routingKey, message));
      //util.log("Message: "+JSON.stringify(message));
      //util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

      switch (message.service) {
        case "tweetcount":
          profile.tweetcount(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
        case "followingcount":
          profile.followingcount(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;

        case "followercount":
          profile.followercount(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
      }
    });
  });

  console.log("listening on search_queue");
  cnn.queue('search_queue', function(q){
    q.subscribe(function(message, headers, deliveryInfo, m){
      //util.log(util.format( deliveryInfo.routingKey, message));
      //util.log("Message: "+JSON.stringify(message));
      //util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));

      switch (message.service) {
        case "hashtag":
          user.hashtag(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
        case "searchUser":
          user.searchUser(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
        case "searchTag":
          user.searchTag(message, function(err,res){
            //util.log("Correlation ID: " + m.correlationId);
            // return index sent
            util.log("in search tag res :::: "+res);
            cnn.publish(m.replyTo, JSON.stringify(res), {
              contentType: 'application/json',
              contentEncoding: 'utf-8',
              correlationId: m.correlationId
            });
          });
          break;
      }
    });
  });
});
