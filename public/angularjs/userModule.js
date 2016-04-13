var user = angular.module('userModule',[]);
user.controller('userController',['$scope','$http','$sce', function($scope,$http,$sce){
	$scope.user_id = window.x;
	$scope.uname1 = window.uname;
	var user_id = window.x;
	var uname1 = window.uname;

	console.log("in user controller")
	console.log(user_id);

	$scope.user = null;
	$scope.user1 = null;
	
	$scope.toTrustedHTML = function (html) {
    return $sce.trustAsHtml(html);
  	};

	$scope.getuser = function(un1){
		var username = un1;
		$http({
			method : "GET",
			url : '/user/get',
			params : {
				"username" : username
			}
		}).success(function(response){
			if (response.status == 200) {
				console.log("success on getuser" + response.data);
				$scope.userInfo = response.data;
			}
		});
	}
	
	$http.get('/user/suggest').success(function(response){
		if (response.status == 200) {		
			$scope.allusers = response.data.slice(0,5);
			console.log("success at rusers" + $scope.allusers);
			$scope.updateFeed();
		}
	});

	$scope.search = function(){
		var keyword = $scope.searchkey;
		if(keyword == ""){
			$scope.userSearch = "";
		}
		$http({
			method: "GET",
			url: '/search/user',
			params: {
				searchkey : keyword
			}
		}).success(function(response){
			if(response.status == 200){
				$scope.userSearch = response.data;
			}
			else{
				$scope.userSearch = "";
			}
		});
	};

	$scope.updateFeed = function(){
		$http.get('/tweet/getfeed').success(function(response){
			if(response.status == 200){
				console.log(response.data);
				for(tweet in response.data)
				{	
					var temp = response.data[tweet].tweetdata.body.match(/#\w+/g);	
					for(t in temp){
						response.data[tweet].tweetdata.body = response.data[tweet].tweetdata.body.replace(temp[t], "<a href='/hashtag?keyword="+temp[t].substr(1)+"'>"+temp[t]+"</a>");
					}
				};
				$scope.tweets = response.data.reverse();
				console.log($scope.tweets);
			}
		});		
		
	};


	$scope.getinfo = function(un1){
		var username = un1;
		$http({
			method : "GET",
			url : '/user/get',
			params : {
				"username" : username
			}
		}).success(function(res){
			if(res.status == 200){
				console.log(res.data[0].username);
				return res.data[0];
			}
		});
	};


	$scope.postTweet = function(){

		$http({
			method : "POST",
			url : '/tweet/post',
			data : {
				"tweetbody" : $scope.tweetData
			}
		}).success(function(response){
			$scope.tweetData = "";
			$scope.updateFeed();
		});
	};

	
	$scope.retweet = function(){
	
		angular.element(jQuery('#retweetid1')).triggerHandler('input');
		//$scope.retweetSuccess = false;
		$http({
			method : "POST",
			url : '/tweet/retweet',
			data : {
				"tweet_id" : $scope.retweet_id1
			}
		}).success(function(response){
			if(response.data == true){
				$scope.retweet_undo = true;
				$scope.retweetSuccess = true;
				//$scope.retweet_again="Already retweeted";
			}else{
				$scope.retweet_undo = false;
				$scope.retweetSuccess = false;
			}
			$scope.updateFeed();
		});
	};

	$scope.follow = function(fu1){
		var follow_uname = fu1;
		$http({
			method : "POST",
			url : '/user/follow',
			data : {
				"follow_uname" : follow_uname
			}
		}).success(function(response){
			if(response.status == 200){
				console.log("followed : " + JSON.stringify(response.data));
				$scope.followhide = true;
			}
		});
	};

	$scope.tweetCount = function(un1){
		var username = un1;
		$http({
			method : "GET",
			url : "user/tweets/count",
			params : {
				"username" : username 
			}
		}).success(function(response){
			if(response.status == 200){
				$scope.tweetCount = response.data.length ? response.data.length : 0;
				//why
				$scope.usertweets = response.data;
			}
		});
	};

	$scope.getweet = function(tweetid){

		for (tweet in $scope.tweets){
			if(tweet.tweet_id == tweetid){
				return tweet;
			}
		}
	};


	$scope.followingCount = function(un1){
		var username = un1;
		$http({
			method : "GET",
			url : "/user/followings/count",
			params : {
				"username" : username 
			}
		}).success(function(response){
			if(response.status == 200){
				$scope.followingCount = response.data.length;
				$scope.followings = response.data;
			}
		});
	};


	$scope.followerCount = function(un1){
		var username = un1;
		$http({
			method : "GET",
			url : "/user/followers/count",
			params : {
				"username" : username 
			}
		}).success(function(response){
			if(response.status == 200){
				$scope.followerCount = response.data.length;
				$scope.followers = response.data;
			}
		});
	};	

}]);