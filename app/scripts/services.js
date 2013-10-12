'use strict';

var app = angular.module('atadosApp');

app.factory('Site', function() {
  return {
    name : 'Atados - Juntando gente Boa',
    copyright: '',
    termsOfService: '',
    privacy: '',
    team: [{ name: 'Marjori Pomarole', email: 'marjori@atados.com.br', photo: 'URL here', description: 'Hi I am the programmer', facebook: 'marjoripomarole'}]
  };
});

app.factory('Auth', function($http, $resource) {

  var apiUrl = constants.apiServerAddress;
  var currentUser;

  return {
    isUsernameUsed: function (username, success, error) {
      $http.get(apiUrl + 'check_username/?username=' + username)
        .success(function (response) {success(response);}).error(error);
    },
    isEmailUsed: function (email, success, error) {
      $http.get(apiUrl + 'check_email/?email=' + email)
        .success(function (response) {success(response);}).error(error);
    },
    getCurrentUser: function (success, error) {
     if (currentUser) return currentUser;

     var token = $.cookie('access_token');

     if (token) {
       $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
       
       $http.get(apiUrl + 'current_user/')
        .success(function (response) {
          currentUser = response;
          success(currentUser);
        }).error(error);
      }
    },
    isLoggedIn: function(user) {
      return currentUser ? true : false;
    },
    signup: function(user, success, error) {
      $http.post(apiUrl + 'signup/', user).success( function(res) {
        success();
      }).error(error);
    },
    login: function(user, success, error) {
      user.client_id = constants.clientId;
      user.client_secret = constants.clientSecret;
      user.grant_type = constants.grantType;
      $http({
        method: 'POST',
        url: apiUrl + 'oauth2/access_token/',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: $.param(user)
      }).success( function(response){
         $http.defaults.headers.common['Authorization'] = 'Bearer ' + response.access_token;
         if (user.remember) {
           $.cookie('access_token', response.access_token);
         }
         success();
       }).error(error);
     },
    logout: function() {
      $.removeCookie('access_token');
      currentUser = null;
      $http.post(apiUrl + 'logout/');
    },
    user: currentUser
  };
});