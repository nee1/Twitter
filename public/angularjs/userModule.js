var user = angular.module('userModule',["angucomplete-alt"]);
user.controller('userController',['$scope','$http','$sce', function($scope,$http,$sce){
	$scope.user_id = window.x;
	var user_id = window.x;

	console.log("in user controller")
	console.log(user_id);

	$scope.user = null;
	$scope.user1 = null;
	
	$scope.toTrustedHTML = function (html) {
    return $sce.trustAsHtml(html);
  	};
	$scope.getuser = function(user_id2){
		var usrid = user_id2
		$http({
			method : "GET",
			url : '/getuser',
			params : {
				"userid1" : usrid
			}
		}).success(function(response){
			if (response.status == 200) {
				console.log("success on getuser")
				$scope.userInfo = response.data[0];
			}
		});
	}
	
	$http.get('/rusers').success(function(response){
		if (response.status == 200) {		
			console.log("success at rusers");
			$scope.allusers = response.data.slice(0,5);
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
			url: '/searchuser',
			params: {
				searchkey1 : keyword
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
		$http.get('/getweets').success(function(response){
			if(response.status == 200){
				for(tweet in response.data)
				{	
					var temp = response.data[tweet]['content'].match(/#\w+/g);
					
					for(t in temp){
						response.data[tweet]['content'] = response.data[tweet]['content'].replace(temp[t], "<a href='/hashtag?"+temp[t]+"'>"+temp[t]+"</a>");
					}
				}
			
				$scope.tweets = response.data.reverse();
				console.log($scope.tweets);
			}
		});
		$http.get('/getretweets').success(function(response){
			if(response.status == 200){
				for(retweet in response.data)
				{	console.log(retweet);

					var temp = response.data[retweet]['content'].match(/#\w+/g);
					
					for(t in temp){
						response.data[retweet]['content'] = response.data[retweet]['content'].replace(temp[t], "<a href='/hashtag?"+temp[t]+"'>"+temp[t]+"</a>");
					}
				}
				$scope.retweets = response.data.reverse(); 
			}
		});
		console.log($scope.retweets);
		
		
	};


	$scope.getinfo = function(user_id1){
		var user_id11 = user_id1;
		$http({
			method : "GET",
			url : '/getuser',
			params : {
				"userid1" : user_id11
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
			url : '/postweet',
			data : {
				"tweetdata" : $scope.tweetData
			}
		}).success(function(response){
			$scope.tweetData = "";
			$scope.updateFeed();
		});


	};

	
	$scope.retweet = function(){
	
		angular.element(jQuery('#retweetid1')).triggerHandler('input');
		$http({
			method : "POST",
			url : '/retweet',
			data : {
				"tweet_id" : $scope.retweet_id1
			}
		}).success(function(response){
			if(response.status == 401){
				$scope.retweet_hide = false;
				$scope.retweet_again="Already retweeted";
			}else{
				$scope.updateFeed();	
				$scope.retweet_hide = true;
			}
		});
	};

	$scope.follow = function(follow_id){
		var followid = follow_id;
		$http({
			method : "POST",
			url : '/follow',
			data : {
				"followid" : followid
			}
		}).success(function(response){
			if(response.status == 200){
				console.log("followed" + JSON.stringify(response.data));
				$scope.followhide = true;
			}
		});
	};

	$scope.tweetCount = function(user_id3){
		var userid3 = user_id3;
		$http({
			method : "GET",
			url : "/tweetcount",
			params : {
				"userid1" : userid3 
			}
		}).success(function(response){
			if(response.status == 200){
				$scope.tweetCount = response.data.length;
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


	$scope.followingCount = function(user_id4){
		var userid4 = user_id4;
		$http({
			method : "GET",
			url : "/followingcount",
			params : {
				"userid2" : userid4 
			}
		}).success(function(response){
			if(response.status == 200){
				$scope.followingCount = response.data.length;
				$scope.followings = response.data;
			}
		});
	};


	$scope.followerCount = function(user_id5){
		var userid5 = user_id5;
		$http({
			method : "GET",
			url : "/followercount",
			params : {
				"userid3" : userid5 
			}
		}).success(function(response){
			if(response.status == 200){
				$scope.followerCount = response.data.length;
				$scope.followers = response.data;
			}
		});
	};	

}]);