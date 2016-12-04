angular.module('starter.services', [])

.service('Profile', function($http) {
    this.getCurrentProfile = function() {
        return $http.get('http://studyfindr.herokuapp.com/user/getmyinfo?accessToken=testtoken&id=' + localStorage.getItem('ID'));
    };
    this.setProfile = function(id, data) {
        // Y U DO DIS? ($scope.user.id???)
        return $http.post('http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update', data);
    };
    this.getUserInfo = function(id) {
        return $http.get('http://studyfindr.herokuapp.com/user/' + id + '/info?accessToken=testtoken&id=' + localStorage.getItem('ID'));
    };
})

.service('Account', function($http, $state, $stateParams){
    this.login = function(response) {
      console.log(response);
      var url = 'http://studyfindr.herokuapp.com/facebook/login';
      var $uid = response.authResponse.userID;
      var $accessToken = response.authResponse.accessToken;
      $http({
          method: 'POST',
          url: url,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
          },
          data: {accessToken: $accessToken, id: $uid}
      }).success(function () {
        console.log(localStorage);
        localStorage.setItem('ID', response.authResponse.userID);
        localStorage.setItem('accessToken', response.authResponse.accessToken);
      }).error(function(error) {
        console.log(error);
      });
    };
    this.logout = function() {
      var url = 'https://studyfindr.herokuapp.com/facebook/logout';
      var data = {
        accessToken: localStorage.getItem('accessToken'),
        id: localStorage.getItem('ID')
      };
      $http({
          method: 'POST',
          url: url,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          transformRequest: function(obj) {
              var str = [];
              for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
              return str.join("&");
          },
          data: {accessToken: data.accessToken, id: data.id}
      }).success(function() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('ID');
        $state.go('login');
      }).error( function(error) {
        console.log(error);
        });
    };
    this.refreshToken = function() {
      facebookConnectPlugin.getAccessToken(function(token) {
          if(localStorage.getItem('accessToken') == token) {
            console.log("No new token needed");
          }
          else {
            localStorage.setItem('accessToken', token);
          }
      }, function(err) {
          alert("Could not get access token: " + err);
      });
    };
});
