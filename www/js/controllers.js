angular.module('starter.controllers', [])
// String to int
.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
})
// Convert epoch time to readable datetime string
.filter('toDate', function() {
    return function(input) {
      return new Date(input).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicActionSheet, $ionicLoading, Account) {
    $scope.loggedIn = localStorage.getItem('ID') !== '';
    $scope.showLogOutMenu = function() {
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Logout',
        titleText: 'Are you sure you want to logout? This app is awesome so I recommend you to stay.',
        cancelText: 'Cancel',
        cancel: function() {},
        buttonClicked: function(index) {
          return true;
        },
        destructiveButtonClicked: function(){
          $ionicLoading.show({
            template: 'Logging out...'
          });

          // Facebook logout
          facebookConnectPlugin.logout(function(){
            Account.logout();
            $ionicLoading.hide();
          },
          function(fail){
            $ionicLoading.hide();
          });
        }
      });
    };
})

.controller('DashboardCtrl', function($scope, $http, $ionicSideMenuDelegate, $ionicScrollDelegate, $timeout, Profile) {
    $scope.users = [];

    $ionicSideMenuDelegate.canDragContent(false);

    $scope.$on('$ionicView.enter', function() {
        $ionicScrollDelegate.scrollTop(true);
        Profile.getQueue.success(function(data) {
          $scope.users = data;
        }).error(function(error) {
          $scope.users = "Sorry, something went wrong with our server";
        });
    });

    // Like or dislike the user
    $scope.judge = function(favorite_id, like) {
        var url = 'http://studyfindr.herokuapp.com/user/' + favorite_id + '/like';
        var $id = localStorage.getItem('ID');
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
            data: {accessToken: localStorage.getItem('accessToken'), id: $id, like: like}
        }).success(function () {
        }).error(function(error) {
            window.alert("Sorry, something went wrong with our server");
        });
    };

    $scope.disabled = false; // Disable all input fields to prevent liking/disliking of multiple users
    // Check slider value to delete or like user
    $scope.checkAction = function(value, user) {
        if(value == 100) {
            $scope.judge(user.id, true);
            $scope.disabled = true;
            $scope.users.splice($scope.users.indexOf(user), 1);
            $timeout(function() {$scope.disabled = false;}, 500);
            user.action = 0;
        } else if(value == -100) {
            $scope.judge(user.id, false);
            $scope.disabled = true;
            $scope.users.splice($scope.users.indexOf(user), 1);
            $timeout(function() {$scope.disabled = false;}, 500);
            user.action = 0;
        }
    };
})

// Controller for user profile page
.controller('ProfileCtrl', function($scope, $http, Profile, $state, Location) {
    $scope.user = [];
    $scope.gender = [];
    $scope.ageSlider = [];
    $scope.distanceSlider = [];
    $scope.selectedLocation = [];
    $scope.id = localStorage.getItem('ID');

    $scope.user.prefAgeMin = 20;
    $scope.user.prefAgeMax = 25;

    $scope.$on('$ionicView.beforeEnter', function() {
        // Get profile information from user ID
        Profile.getCurrentProfile().success(function(data) {
          $scope.setProfile(data);
        }).error(function(error) {
          $scope.helloWorld = "Sorry, something went wrong with our server";
        });
    });

    $scope.setProfile = function(data) {
         // User info
        $scope.user = {
            id: data.id,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            age: data.age,
            prefMale: data.prefMale,
            prefFemale: data.prefFemale,
            prefTrans: data.prefTrans,
            prefDistance: data.prefDistance,
            prefLocation: data.prefLocation,
            prefAgeMin: data.prefAgeMin,
            prefAgeMax: data.prefAgeMax
        };

        // Location preference
        $scope.selectedLocation = data.prefLocation;
    };

    // Save all profile settings
    $scope.saveProfile = function() {
        // Post to API
        $scope.user.prefLocation = 2;
        $scope.user.prefAgeMin = parseInt($scope.user.prefAgeMin);
        $scope.user.prefAgeMax = parseInt($scope.user.prefAgeMax);
        $scope.user.prefDistance = parseInt($scope.user.prefDistance);
        // Get location
        var location = Location.getCurrentLocation();
        $scope.user.lat = location.lat;
        $scope.user.lon = location.lon;

        // POST user-data to the server
        $http({
            method: 'POST',
            url: 'http://studyfindr.herokuapp.com/user/' + localStorage.getItem('ID') + '/update?accessToken=' + localStorage.getItem('accessToken'),
            headers: {'Content-Type': 'application/json'},
            data: $scope.user
        })
        .success(function(data) {
           $state.go('app.dashboard');
        }).error(function(error) {
            window.alert("Sorry, something went wrong with our server");
        });

    };
})

.controller('MatchesCtrl', function($scope, $stateParams, $http, $ionicPopup) {
    // Pull page to refresh matches
    $scope.refreshMatches = function() {
        $http.get('http://studyfindr.herokuapp.com/user/getmatches?accessToken=' + localStorage.getItem('accessToken') + '&id=' + localStorage.getItem('ID')).success(function(data) {
            $scope.matches = data;
        }).error(function() {
            window.alert("Sorry, something went wrong with our server");
        }).finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
        });
    };

    // Load matches on view enter
    $scope.$on('$ionicView.beforeEnter', function() {
        $http.get('http://studyfindr.herokuapp.com/user/getmatches?accessToken=' + localStorage.getItem('accessToken') + '&id=' + localStorage.getItem('ID')).success(function(data) { //+ localStorage.getItem('ID')
            $scope.matches = data;
        }).error(function() {
            window.alert("Sorry, something went wrong with our server");
        });
    });

    // Delete match from matches
    $scope.delete = function(match) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete ' + match.firstname,
            template: "Don't cry when you don't find love",
            okText: 'Remove',
            cancelText: 'Keep'
        });

        // POST a like to the server
        confirmPopup.then(function(res) {
            if(res) {
                var url = 'http://studyfindr.herokuapp.com/user/' + match.id + '/like';
                var $id = localStorage.getItem('ID');
                $scope.matches.splice($scope.matches.indexOf(match), 1);
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
                    data: {accessToken: localStorage.getItem('accessToken'), id: $id, like: false}
                }).success(function () {
                }).error(function(error) {
                  window.alert("Sorry, something went wrong with our server");
                });
            } else {

            }
        });
    };

})
.controller('ChatCtrl', function($scope, $stateParams, $http, $ionicScrollDelegate, Profile) {
	var prevDate;
	var match_id = $stateParams.id;
    $scope.myId = localStorage.getItem('ID');

    $scope.data = {};
    $scope.messages = [];

    // Message update interval
    var updateFrequency = 2000;
    var updater;

    // Get messages before entering
    $scope.$on('$ionicView.beforeEnter', function() {
        Profile.getUserInfo(match_id).success(function(data) {
            $scope.match = data;
        }).error(function(error) {
            window.alert("Sorry, something went wrong with our server");
        });

        $scope.getMessages();
        updater = setInterval(function() {$scope.getMessages();}, updateFrequency);
    });
    // Stop messages from refreshing
    $scope.$on('$ionicView.leave', function() {
        clearInterval(updater);
    });
    var alternate;
    $scope.sendMessage = function() {
        alternate = !alternate;

        $scope.messages.unshift({
            message: $scope.data.message,
            sender_Id: $scope.myId,
            receiver_Id: match_id,
            date: Date.now()
        });

        // POST a chatmessage
        $http.post('https://studyfindr.herokuapp.com/messages/postmessage?id=' + $scope.myId + '&accessToken=' + localStorage.getItem('accessToken')+ '&matchid=' + match_id, $scope.data.message).success(function(data) {
        }).error(function(error) {
            window.alert("Sorry, something went wrong with our server");
        });

       delete $scope.data.message;
       $ionicScrollDelegate.scrollBottom(true);
     };

    $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
    };

    // Get conversation between two users
    $scope.getMessages = function() {
        $http.get('https://studyfindr.herokuapp.com/messages/getconversation?id=' + $scope.myId + '&accessToken=' + localStorage.getItem('accessToken') + '&matchid=' + match_id).success(function(data) {
            // $ionicScrollDelegate.scrollBottom(true);
            $scope.messages = data;
        }).error(function() {

        });
    };

    // Toggle time on the right side
    $scope.showTime = false;
    $scope.toggleTime = function(state) {
        if(state === true) $scope.showTime = true;
        else $scope.showTime = false;
    };

    // Check if the date is today
    $scope.checkDate = function(date) {
		var currentDate = new Date(date).toDateString();
        if (currentDate < prevDate) {
            prevDate = currentDate;
            $scope.date = currentDate;
            return true;
        } else {
            if (currentDate == prevDate) {
                return false;
            } else {
                prevDate = currentDate;
                return true;
            }
        }
    };
})

.controller('LoginCtrl', function($scope, $stateParams, $state, $http, Account, $ionicLoading, $q) {
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }
    Account.login(response);
  };
  // This is the fail callback from the login method
  var fbLoginError = function(error){
    $ionicLoading.hide();
  };
  $scope.facebookSignIn = function() {
    if(localStorage.getItem('ID')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('ID');
    }
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        Account.login(success).success(function() {
          $state.go('app.dashboard');
        });
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire

    		// Check if we have our user saved
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.
				$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };
})
