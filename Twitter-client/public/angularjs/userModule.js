var user = angular.module('userModule',[]);
user.controller('userController',['$scope','$http','$sce', function($scope,$http,$sce){
	$scope.user_id = window.x;
	$scope.uname1 = window.uname;
	$scope.uname3 = window.uname3;
	//var user_id = window.x;
	//var uname1 = window.uname;

	console.log("in user controller");
	//console.log(user_id);

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
			if (response.status === 200) {
				console.log("success on getuser" + response.data);
				$scope.userInfo = response.data;
			}
		});
	};

	$http.get('/user/suggest').success(function(response){
		if (response.status === 200) {
			$scope.allusers = response.data.slice(0,5);
			console.log("success at rusers" + $scope.allusers);
			//$scope.updateFeed();
		}
	});

	$scope.search = function(){
		var keyword = $scope.searchkey;
		$scope.userSearch = [];
		$scope.tagSearch = [];
		if(keyword === ""){
			$scope.userSearch = [];
			$scope.tagSearch = [];
		}
		console.log(keyword);
		if(keyword && keyword.length>2){
			//console.log("keyword at 0");
			//console.log(keyword.charAt(0));
			if(keyword.charAt(0) == "#"){
				console.log("in tag search");
				$http({
					method: "GET",
					url: '/search/tag',
					params: {
						searchkey : keyword.substr(1)
					}
				}).success(function(response){
					console.log(response.data);
					$scope.tagSearch = response.data;
				});
			}
			else {
				$http({
					method: "GET",
					url: '/search/user',
					params: {
						searchkey : keyword
					}
				}).success(function(response){
					if(response.data){
						console.log("search data: ");
						$scope.userSearch = response.data;
						console.log($scope.userSearch);
					}
					else{
						$scope.userSearch = "";
					}
				});
			}
		}
	};


	$scope.updateFeed = function(){
		$http.get('/tweet/getfeed').success(function(response){
			if(response.status === 200){
				console.log(response.data);
				for(var tweet in response.data){
						var temp = response.data[tweet].tweetdata.body.match(/#\w+/g);
						for(var t in temp){
								response.data[tweet].tweetdata.body = response.data[tweet].tweetdata.body.replace(temp[t], "<a href='/hashtag?keyword="+temp[t].substr(1)+"'>"+temp[t]+"</a>");
						}
				}

				$scope.tweets = response.data.sort(function compareDate(a, b){
					return new Date(b.createdAt) - new Date(a.createdAt);
				});
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
			if(res.status === 200){
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
			if(response.status == 401){
				$scope.selfRetweet = response.data;
			} else {
				if(response.data === true){
					$scope.retweet_undo = true;
					$scope.retweetSuccess = true;
					//$scope.retweet_again="Already retweeted";
				}else{
					$scope.retweet_undo = false;
					$scope.retweetSuccess = false;
				}
				$scope.updateFeed();
			}
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
			if(response.status === 200){
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
			if(response.status === 200){
				$scope.tweetCount = response.data.length ? response.data.length : 0;

				//console.log(response.data);
				for(tweet in response.data)
				{
					var temp = response.data[tweet]['tweetdata']['body'].match(/#\w+/g);

					for(t in temp){
						response.data[tweet]['tweetdata']['body'] = response.data[tweet]['tweetdata']['body'].replace(temp[t], "<a href='/hashtag?keyword="+temp[t].substr(1)+"'>"+temp[t]+"</a>");
					}

				}
				//console.log(response.data);
				$scope.usrtweets = response.data;

//				$scope.usertweets = response.data;
			}
		});
	};

	$scope.getweet = function(tweetid){

		for (var tweet in $scope.tweets){
			if(tweet.tweet_id === tweetid){
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
			if(response.status === 200){
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
			if(response.status === 200){
				$scope.followerCount = response.data.length;
				$scope.followers = response.data;
			}
		});
	};

}]);
