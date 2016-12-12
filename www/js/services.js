angular.module('starter.services', [])

.service('Profile', function($http) {
    this.getCurrentProfile = function() {
        return $http.get('http://studyfindr.herokuapp.com/user/getmyinfo?accessToken=' + localStorage.getItem('accessToken') +'&id=' + localStorage.getItem('ID'));
    };
    this.setProfile = function(id, data) {
        // Y U DO DIS? ($scope.user.id???)
        return $http.post('http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update', data);
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
        console.log('data: ');
        console.log($locationdata);
      }).error(function(error) {
        console.log(error);
      });
      console.log(position.coords);
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        console.log('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }
})

.service('Account', function($http, $state, $stateParams, $ionicLoading, Location){
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
        Location.getLocation();
        $ionicLoading.hide();
        $state.go('app.dashboard');
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
            Location.getLocation();
          }
      }, function(err) {
          alert("Could not get access token: " + err);
      });
    };
});
