angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal,  $timeout,authFactory ) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.registerData = {};

  // Create the login modal that we will use later
 $ionicModal.fromTemplateUrl('templates/login.html', {
     id:1,
     scope: $scope
  }).then(function(modal) {
    $scope.modalLogin = modal;
  });

    // Create the login modal that we will use later
 $ionicModal.fromTemplateUrl('templates/register.html', {
     id: 2,
     scope: $scope
 }).then(function (modal) {
     $scope.modalRegister = modal;
 });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };

    // Triggered in the login modal to close it
  $scope.closeRegister = function () {
      $scope.modalRegister.hide();
  };


  // Open the login modal
  $scope.login = function() {
      $scope.modalLogin.show();
  };

  $scope.register = function () {
      $scope.modalRegister.show();
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
	console.log('Using authFactory.login', $scope.loginData);
	authFactory.login($scope.loginData);
	$scope.closeLogin();
  };

    // Perform the login action when the user submits the login form
  $scope.doRegister = function () {
	console.log('Doing Registration ' + $scope.registerData);
	authFactory.register($scope.registerData);
	$scope.closeRegister();
	console.log('Registration Finished');
  };

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('AdminCtrl', function () {
}
)
.controller('OrganizationCtrl', ['$scope',  '$localStorage', 'OrgFactory', function ($scope,  $localStorage, OrgFactory) {
	$scope.orgs = {};
	$scope.addNewFormIsVisible = false;
	$scope.processMessage  = '';
	$scope.showProcessMessage = false;
	$scope.newOrg = {organizationName : '', contactName: '',  contactEmail: '', contactPhone: '' };
	OrgFactory.query( 
	function (response){
		$scope.showProcessMessage = false;
		$scope.orgs=response;
	},
	function(response){
		console.log('Error found in controller while retrieving the organizations ');		
		$scope.processMessage = response.data;
		$scope.showProcessMessage = true;
	}
	);
	
	$scope.showAddNewForm = function(isVisible){
		$scope.showProcessMessage = false;
		$scope.addNewFormIsVisible = isVisible;
	}
	
	$scope.addNewOrg = function(){		
		$scope.processMessage  = '';
		$scope.showProcessMessage = false;
		OrgFactory.save($scope.newOrg, 
			function (response){
				console.log('new organization Created id:' + 'response._id');
				OrgFactory.query( 
				function (response){
					$scope.orgs=response;
				},
				function(response){
					console.log('Error found in controller while retrieving the organizations ');
				}
				);
			},
			function (response){
				console.log('failed to create new organization' );
			}
		);
		$scope.addNewFormIsVisible = false;
		$scope.newOrg = {organizationName : '', contactName: '',  contactEmail: '', contactPhone: '' }
	}
	
	$scope.cancelAddNew= function(){
		$scope.processMessage  = '';
		$scope.showProcessMessage = false;
		$scope.addNewFormIsVisible = false;
		$scope.newOrg = {organizationName : '', contactName: '',  contactEmail: '', contactPhone: '' }
	}
}])

;


