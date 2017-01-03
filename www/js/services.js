'use strict';
//Assignment 3
angular.module('conFusion.services', ['ngResource'])
        .constant("baseURL", "http://192.168.1.20:3022/")
        .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

             return $resource(baseURL + "dishes/:id", null, {
                 'update': {
                     method: 'PUT'
                 }
             });

         }])

        .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
            return $resource(baseURL + "promotions/:id");

        }])

        .factory('corporateFactory', ['$resource', 'baseURL', function ($resource, baseURL) {


            return $resource(baseURL + "leadership/:id");

        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {


            return $resource(baseURL + "feedback/:id");

        }])

        .factory('favoriteFactory', ['$resource', '$window', 'baseURL', function ($resource, $window, baseURL) {
            var favFac = {};
            var favKey = 'favorites';
            var favorites = [];

            favorites = JSON.parse($window.localStorage[favKey]|| '[]');

            favFac.addToFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index)
                        return;
                }
                favorites.push({ id: index });
                // Adding favorites to the local storage
                $window.localStorage[favKey] = JSON.stringify(favorites);
            };

            favFac.deleteFromFavorites = function (index) {
                for (var i = 0; i < favorites.length; i++) {
                    if (favorites[i].id == index) {
                        favorites.splice(i, 1);
                    }
                }
                //Updating the local storage
                $window.localStorage[favKey] = JSON.stringify(favorites);
            }

            favFac.getFavorites = function () {
                return favorites;
            };

            return favFac;
        }])

        .factory('$localStorage', ['$window', function ($window) {
            return {
                store: function (key, value) {
                    $window.localStorage[key] = value;
                },
                get: function (key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                },
                storeObject: function (key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function (key, defaultValue) {
                    return JSON.parse($window.localStorage[key] || defaultValue);
                }
            }
        }])
		
		.factory('authFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', function($resource, $http, $localStorage, $rootScope, $window, baseURL){
			
			var authFac = {};
			var TOKEN_KEY = 'Token';
			var isAuthenticated = false;
			var username = '';
			var isAdmin = false;
			var authToken;
			

		  function loadUserCredentials() {
			var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
			if (credentials.username !== undefined) {
			  useCredentials(credentials);
			}
		  }
		 
		  function storeUserCredentials(credentials) {
			$localStorage.storeObject(TOKEN_KEY, credentials);
			useCredentials(credentials);
		  }
		 
		  function useCredentials(credentials) {
			isAuthenticated = true;
			username = credentials.username;
			authToken = credentials.token;
			isAdmin = credentials.admin;
		 
			// Set the token as header for your requests!
			$http.defaults.headers.common['x-access-token'] = authToken;
		  }
		 
		  function destroyUserCredentials() {
			authToken = undefined;
			username = '';
			isAuthenticated = false;
			isAdmin = false;
			$http.defaults.headers.common['x-access-token'] = authToken;
			$localStorage.remove(TOKEN_KEY);
		  }
			 
			authFac.login = function(loginData) {
				
				$resource(baseURL + "users/login")
				.save(loginData,
				   function(response) {
					  storeUserCredentials({username:loginData.username, token: response.token, admin: response.admin});
					  $rootScope.$broadcast('login:Successful');
				   },
				   function(response){
					  isAuthenticated = false;
					
				   }
				
				);

			};
			
			authFac.logout = function() {
				$resource(baseURL + "users/logout").get(function(response){
				});
				destroyUserCredentials();
			};
			
			authFac.register = function(registerData) {
				
				$resource(baseURL + "users/register")
				.save(registerData,
				   function(response) {
					  authFac.login({username:registerData.username, password:registerData.password, admin: admin});
					if (registerData.rememberMe) {
						$localStorage.storeObject('userinfo',
							{username:registerData.username, password:registerData.password});
					}
				   
					  $rootScope.$broadcast('registration:Successful');
				   },
				   function(response){
					


				   }
				
				);
			};
			
			authFac.isAuthenticated = function() {
				return isAuthenticated;
			};
			
			authFac.getUsername = function() {
				return username;  
			};

			authFac.isAdmin = function() {
				return isAdmin;  
			};

			loadUserCredentials();
			
			return authFac;
			
		}])
		
;
