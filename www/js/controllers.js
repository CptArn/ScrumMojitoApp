angular.module('starter.controllers', [])
// String to int
.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
})
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

.controller('DashboardCtrl', function($scope, $http, $ionicSideMenuDelegate, $ionicScrollDelegate) {
    $scope.users = [{
            id: 1234,
            email: "ik@hotmail.com",
            firstname: "jef",
            lastname: "jef",
            location: 1,
            age: 21,
            prefMale: false,
            prefFemale: true,
            prefTrans: false,
            prefDistance: 3,
            prefLocation: 1,
            prefAgeMin: 23,
            prefAgeMax: 24
        }, {
                id: 4,
                email: "ik@hotmail.com",
                firstname: "jef",
                lastname: "jef",
                location: 1,
                age: 21,
                prefMale: false,
                prefFemale: true,
                prefTrans: false,
                prefDistance: 3,
                prefLocation: 1,
                prefAgeMin: 23,
                prefAgeMax: 24
            }];

    $scope.model = {};

    $ionicSideMenuDelegate.canDragContent(false);
        console.log('user: ' + localStorage.getItem('ID'));
        $scope.$on('$ionicView.enter', function() {
           $ionicScrollDelegate.scrollTop(true);
            $http.get('http://studyfindr.herokuapp.com/user/getmyqueue?accessToken=' + localStorage.getItem('accessToken') + '&id=' + localStorage.getItem('ID')).success(function(data) {
              $scope.users = data;
            //   console.log('data: ');
            //   console.log(data);
            }).error(function(error) {
              $scope.users = "Sorry, something went wrong with our server";
              console.log(error);
            });
        });

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
                console.log('You said ' + like + ' to liking user: ' + favorite_id);
            }).error(function(error) {
              console.log(error);
            });
        };

        // Check slider value to delete or like user
        $scope.checkAction = function(value, user) {
            if(value == 100) {
                $scope.judge(user.id, true);
                $scope.users.splice($scope.users.indexOf(user), 1);
                $scope.model.action = 0;
            } else if(value == -100) {
                $scope.judge(user.id, false);
                $scope.users.splice($scope.users.indexOf(user), 1);
                $scope.model.action = 0;
            }
        };

})

// Controller for user profile page
.controller('ProfileCtrl', function($scope, $http, Profile) {
    $scope.user = [];
    $scope.gender = [];
    $scope.ageSlider = [];
    $scope.distanceSlider = [];
    $scope.selectedLocation = [];
    $scope.id = localStorage.getItem('ID');

    $scope.user.prefAgeMin = 20;
    $scope.user.prefAgeMax = 25;

    // Dropdown location options
    $scope.locations = [{id: 1, value: "Gent"}, {id: 2, value: "Kortrijk"}, {id: 3, value: "Leuven"}, {id: 4, value: "Brussel"}];

    $scope.$on('$ionicView.beforeEnter', function() {

    // Get profile information from user ID
    Profile.getCurrentProfile().success(function(data) { //localStorage.getItem('user')
          console.log(data);
          $scope.setProfile(data);
        }).error(function(error) {
          $scope.helloWorld = "Sorry, something went wrong with our server";
          console.log(error);
        });
    });

    $scope.setProfile = function(data) {
         // User info
        $scope.user = {
            id: data.id,
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            location: data.location,
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
        $scope.user.prefAgeMin = $scope.user.prefAgeMin;
        $scope.user.prefAgeMax = $scope.user.prefAgeMax;
        $scope.user.prefDistance = parseInt($scope.user.prefDistance);
        console.log($scope.user);
        //$http.post('http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update?accessToken=' + localStorage.getItem('accessToken'), $scope.user)
        $http({
            method: 'POST',
            url: 'http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update?accessToken=' + localStorage.getItem('accessToken'),
            headers: {'Content-Type': 'application/json'},
            data: $scope.user
        })
        .success(function(data) {
         console.log('data: ');
            console.log(data);
        }).error(function(error) {
          console.log(error);
        });

    };

    // Save location when option is changed
    $scope.changed = function(id) {
        $scope.locationId = id;
    };
})

.controller('MatchesCtrl', function($scope, $stateParams, $http, $ionicPopup) {
    // Pull page to refresh matches
    $scope.refreshMatches = function() {
        $http.get('http://studyfindr.herokuapp.com/user/getmatches?accessToken=' + localStorage.getItem('accessToken') + '&id=' + localStorage.getItem('ID')).success(function(data) { //+ localStorage.getItem('ID')
            console.log('matches: ');
            console.log(data);
            $scope.matches = data;
        }).error(function() {

        }).finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
        });
    };

    // Load matches on view enter
    $scope.$on('$ionicView.beforeEnter', function() {
        $http.get('http://studyfindr.herokuapp.com/user/getmatches?accessToken=' + localStorage.getItem('accessToken') + '&id=' + localStorage.getItem('ID')).success(function(data) { //+ localStorage.getItem('ID')
            console.log('matches: ');
            console.log(data);
            $scope.matches = data;
        }).error(function() {

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

        confirmPopup.then(function(res) {
            if(res) {
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
                    data: {id_to_like: match.id, accessToken: localStorage.getItem('accessToken'), id: $id, like: false}
                }).success(function () {

                    console.log('You removed ' + match.id + ' from your matches');
                }).error(function(error) {
                  console.log(error);
                });
            } else {
                console.log('Keep');
            }
        });
    };

})
.controller('ChatCtrl', function($scope, $stateParams, $http, $ionicScrollDelegate, Profile) {
	var prevDate;
	var match_id = $stateParams.id;
    // var match_id = 1; //10210995798960326
    $scope.myId = localStorage.getItem('ID');
    // $scope.myId = 2; //10208094342336332

    $scope.data = {};
    $scope.messages = [];



    var updateFrequency = 2000;
    var updater;


    $scope.$on('$ionicView.beforeEnter', function() {
        Profile.getUserInfo(match_id).success(function(data) {
            $scope.match = data;
            console.log($scope.match.firstname);
        }).error(function(error) {
            console.log(error);
        });


        $scope.getMessages();
        // updater = setInterval(function() {$scope.getMessages();}, updateFrequency);
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

        $http.post('https://studyfindr.herokuapp.com/messages/postmessage?id=' + $scope.myId + '&accessToken=' + localStorage.getItem('accessToken')+ '&matchid=' + match_id, $scope.data.message).success(function(data) {
            console.log(data);
        }).error(function(error) {
            console.log(error);
        });

       delete $scope.data.message;
       $ionicScrollDelegate.scrollBottom(true);
     };


     $scope.inputUp = function() {
       if (isIOS) $scope.data.keyboardHeight = 216;
       $timeout(function() {
         $ionicScrollDelegate.scrollBottom(true);
       }, 300);
     };

     $scope.inputDown = function() {
       if (isIOS) $scope.data.keyboardHeight = 0;
       $ionicScrollDelegate.resize();
     };



    $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
    };


    // Get conversation between two users
    $scope.getMessages = function() {
        $http.get('https://studyfindr.herokuapp.com/messages/getconversation?id=' + $scope.myId + '&accessToken=' + localStorage.getItem('accessToken') + '&matchid=' + match_id).success(function(data) {
            console.log('convo: ');
            console.log(data);
            // $ionicScrollDelegate.scrollBottom(true);
            $scope.messages = data;
        }).error(function() {

        });
    };

    $scope.showTime = false;
    $scope.toggleTime = function(state) {
        if(state === true) $scope.showTime = true;
        else $scope.showTime = false;
    };

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
    console.log('fbLoginError', error);
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
        console.log('getLoginStatus', success.status);

    		// Check if we have our user saved
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);

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

.controller('LogoutCtrl', function($scope, $stateParams, $state, $http, Account, $ionicLoading, $q, $ionicActionSheet, facebookConnectPlugin) {

});
