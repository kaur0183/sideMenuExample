angular.module('starter.controllers', ['ngCordovaOauth', 'LocalStorageModule'])
	.config(function (localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('PrabhFBApp')
			.setNotify(true, true);
	})
	.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $cordovaOauth, $http, $ionicPopover, localStorageService, $rootScope) {

		// Form data for the login modal
		$scope.loginData = {};

		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/login.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modal = modal;

		});

		// Triggered in the login modal to close it
		$scope.closeLogin = function () {
			$scope.modal.hide();

		};

		// Open the login modal
		$scope.login = function () {
			$scope.modal.show();

		};
		// Perform the login action when the user submits the login form
		$scope.doLogin = function () {
			console.log('Doing login', $scope.loginData);
			$cordovaOauth.facebook("905698146234170", ["email", "public_profile"], {
				redirect_uri: "http://localhost/callback"
			}).then(function (result) {
				console.log(result.access_token);
				localStorageService.set('FacebookToken', result.access_token);
				$timeout(function () {
					$scope.closeLogin();
				}, 1000);
				$scope.displayData($http, result.access_token);
			}, function (error) {
				console.log("Error -> " + error);
			});
		};

		$scope.displayData = function ($http, access_token) {
			$http.get("https://graph.facebook.com/v2.8/me", {
				params: {
					access_token: access_token,
					fields: "name",
					format: "json"
				}
			}).then(function (result) {
				$rootScope.FacebookName = result.data.name;
			}, function (error) {
				alert("Error: " + error);
			});
		};
		if (localStorageService.get('FacebookToken') != null) {
			//Already Logged in
			$scope.displayData($http, localStorageService.get('FacebookToken'));
		} else {
			//Not logged in
			$timeout(function () {
				$scope.login();
			}, 1000);
		}

		$scope.Logout = function () {
			localStorageService.remove('FacebookToken');
			$timeout(function () {
				$scope.login();
			}, 1000);
		}
	})

.controller('PlaylistsCtrl', function ($scope) {})

.controller('PlaylistCtrl', function ($scope, $stateParams) {});