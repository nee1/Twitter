var routes = require('./services')
  , login = require('./routes/login')
  , profile = require('./routes/profile')
  , user = require('./routes/user')
  //Importing the 'client-sessions' module
  , mongoose = require('mongoose')
  , util = require('util')
  , amqp = require('amqp');

var mongoSessionConnectURL = "mongodb://localhost:27017/twitter";
var cnn = amqp.createConnection({host:'127.0.0.1'});


// connect to the mongo collection session and then createServer
mongoose.connect(mongoSessionConnectURL, function() {
  console.log('Connected to mongo at: ' + mongoSessionConnectURL);
});

cnn.on('ready', function(){
	console.log("listening on login_queue");

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
});
