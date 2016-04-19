var login = angular.module('loginModule', []);
login.controller('loginController', function($scope,$filter ,$http) {
	$scope.invalid_login = true;
	$scope.unexpected_error = true;

	$scope.invalid_signup = true;
	$scope.unexpected_err = true;

	$scope.submitLogin = function(isValid) {
		if(isValid){
			$http({
				method : "POST",
				url : '/user/login',
				data : {
					"username" : $scope.username,
					"password" : $scope.password
				}
			}).success(function(data) {
				if (data.statusCode === 401) {
					$scope.invalid_login = false;
					$scope.unexpected_error = true;
				}
				else
				{
					window.location.assign("/home");
				}
			}).error(function(error) {
				$scope.unexpected_error = false;
				$scope.invalid_login = true;
			})
		};
	};

	$scope.submitSignUp = function(isValid){
		if(isValid){
			$http({
				method : "POST",
				url	: '/user/signup',
				data : {
					"username" : $scope.username1,
					"password" : $scope.password1,
					"email" : $scope.email,
					"firstname" : $scope.firstname,
					"lastname" : $scope.lastname,
					"birthdate" : $filter('date')($scope.birthdate, 'yyyy-MM-dd'),
					"location" : $scope.location
				}
			}).success(function(data){
				if(data.statusCode === 401){
					$scope.invalid_signup = false;
					$scope.unexpected_err = true;
				}
				else
				{
					window.location.assign("/home");
				}
			}).error(function(error){
				$scope.unexpected_err = false;
				$scope.invalid_signup = true;
			});
		}
	};
});
