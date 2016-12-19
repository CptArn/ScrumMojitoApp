angular.module('starter.services', [])

.service('Profile', function($http) {
    this.getCurrentProfile = function() {
        return $http.get('http://studyfindr.herokuapp.com/user/getmyinfo?accessToken=' + localStorage.getItem('accessToken') +'&id=' + localStorage.getItem('ID'));
    };
    this.setProfile = function(id, data) {
        // Y U DO DIS? ($scope.user.id???)
        return $http.post('http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update', data);
    };
    this.getQueue = function() {
        return $http.get('http://studyfindr.herokuapp.com/user/getmyqueue?accessToken=' + localStorage.getItem('accessToken') + '&id=' + localStorage.getItem('ID'));
    };
    this.getUserInfo = function(id) {
        return $http.get('http://studyfindr.herokuapp.com/user/' + id + '/info?accessToken='+ localStorage.getItem('accessToken') +'&id=' + localStorage.getItem('ID'));
    };
})

.service('Location', function($http) {
  this.getLocation = function() {
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    var onSuccess = function(position) {
      $locationdata = {
        id: localStorage.getItem('ID'),
        accessToken: localStorage.getItem('accessToken'),
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
	  if(position.coords.latitude !== 0 && position.coord.longitude !== 0) {
		  $http({
	          method: 'POST',
	          url: 'http://studyfindr.herokuapp.com/user/updatemylocation',
	          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
	          transformRequest: function(obj) {
	              var str = [];
	              for(var p in obj)
	              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	              return str.join("&");
	          },
	          data: $locationdata
	      }).success(function () {
	      }).error(function(error) {
          window.alert("Sorry, something went wrong with our server");
	      });
	  }
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        window.alert("GPS is not enabled or the app doesn't have the rights to use it");
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    };

    this.getCurrentLocation = function() {
        var onSuccess = function(position) {
            return {lat: position.coords.latitude, lon: position.coords.longitude };
        };

        var onError = function() {
            window.alert("GPS is not enabled or the app doesn't have the rights to use it");
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    };
})

.service('Account', function($http, $state, $stateParams, $ionicLoading, Location){
    this.login = function(response) {
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
        localStorage.setItem('ID', response.authResponse.userID);
        localStorage.setItem('accessToken', response.authResponse.accessToken);
        Location.getLocation();
        $ionicLoading.hide();
        $state.go('app.dashboard');
      }).error(function(error) {
          window.alert("Something went wrong");
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
          window.alert("Sorry, something went wrong with the server");
        });
    };
    this.refreshToken = function() {
      facebookConnectPlugin.getAccessToken(function(token) {
          if(localStorage.getItem('accessToken') == token) {
          }
          else {
            localStorage.setItem('accessToken', token);
            Location.getLocation();
          }
      }, function(err) {
          alert("Could not get access token: " + err);
      });
    };
});
