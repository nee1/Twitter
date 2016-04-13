var user = angular.module('userModule',[]);
user.controller('userController',['$scope','$http', function($scope,$http){
	$scope.user_id = window.x;
	var user_id = window.x;

	$scope.usertweets = function(user_id1){
		$http({
			method : "GET",
			url : '/user/tweets/get',
			params : {
				userid1 : user_id1
			}
		}).success(function(response){
			for(tweet in response.data)
			{	
				var temp = response.data[tweet]['content'].match(/#\w+/g);
				
				for(t in temp){
					response.data[tweet]['content'] = response.data[tweet]['content'].replace(temp[t], "<a href='/hashtag?"+temp[t]+"'>"+temp[t]+"</a>");
				}
			}
			
			$scope.usertweets = response.data;
		});
	};

}]);