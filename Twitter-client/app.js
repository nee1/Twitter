var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , user = require('./routes/user')
  , login = require('./routes/login')
  , profile = require('./routes/profile')
  //Importing the 'client-sessions' module
  , session = require('client-sessions')
  , mongoose = require('mongoose');

var mongoSessionConnectURL = "mongodb://localhost:27017/twitter";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);


var app = express();

// all environments
//configure the sessions with our application
app.use(expressSession({
  secret: 'cmpe273_teststring',
  resave: false,  //don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  store: new mongoStore({
    url: mongoSessionConnectURL
  })
}));

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname , 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//GET
app.get('/', routes.index);

app.post('/user/login',login.checkLogin);
app.get('/home',login.redirectToHomepage);
app.post('/user/logout',login.logout);
app.post('/user/signup',login.checkSignUp);


app.get('/user/get', user.getuser);
app.get('/search/user',user.searchUser);
app.get('/search/tag',user.searchTag);
app.post('/user/follow',user.follow);

app.get('/user/suggest', user.allusers);
app.get('/user/tweets/get',profile.usertweets);
app.get('/user/tweets/count',profile.tweetcount);
app.get('/user/followings/count',profile.followingcount);
app.get('/user/followers/count',profile.followercount);

app.get('/tweet/getfeed', user.getweets);
app.post('/tweet/post',user.postweet);
app.post('/tweet/retweet',user.retweet);
app.get('/hashtag',user.hashtag);

app.get('/user',profile.user);

//app.get('/user/:username',profile.prof);
//app.get('/signup',signup);


//POST


// connect to the mongo collection session and then createServer
mongoose.connect(mongoSessionConnectURL, function() {
  console.log('Connected to mongo at: ' + mongoSessionConnectURL);
  http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
});
