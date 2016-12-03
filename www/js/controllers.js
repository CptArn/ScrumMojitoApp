angular.module('starter.controllers', [])
// String to int
.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    $scope.loggedIn = localStorage.getItem('ID') !== '';
})

.controller('DashboardCtrl', function($scope, $http) {
        console.log('user: ' + localStorage.getItem('ID'));
        // $scope.$on('$ionicView.beforeEnter', function() {
            $http.get('http://studyfindr.herokuapp.com/user/getmyqueue?accessToken=testtoken&id=' + localStorage.getItem('ID')).success(function(data) {
              $scope.users = data;

            }).error(function(error) {
              $scope.users = "Sorry, something went wrong with our server";
              console.log(error);
            });
        // });

        $scope.judge = function(favorite_id, like) {
            var url = 'http://studyfindr.herokuapp.com/user/' + favorite_id + '/like';
            var $accessToken = 'testtoken';
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
                data: {id_to_like: favorite_id, accessToken: $accessToken, id: $id, like: like}
            }).success(function () {
                console.log('You said ' + like + ' to liking user: ' + favorite_id);
            }).error(function(error) {
              console.log(error);
            });
        };

        // Check slider value to delete or like user
        $scope.checkAction = function(value, user) {
            console.log(user.id);
            if(value == 100) {
                $scope.judge(user.id, true);
                $scope.users.splice($scope.users.indexOf(user), 1);
            } else if(value == -100) {
                $scope.judge(user.id, false);
                $scope.users.splice($scope.users.indexOf(user), 1);
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
    // // Age slider options
    // $scope.ageSlider = {
    //     min: 18,
    //     max: 75,
    //     options: {
    //         floor: 18,
    //         ceil: 100
    //     }
    // };
    // // Distance slider options
    // $scope.distanceSlider = {
    //     value: 10,
    //     options: {
    //         floor: 0,
    //         ceil: 40
    //     }
    // };

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
            age: data.age,
            id: data.id,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            prefMale: data.prefMale,
            prefFemale: data.prefFemale,
            prefTrans: data.prefTrans,
            prefAge: data.prefAge,
            prefDistance: data.prefDistance,
            prefLocation: data.prefLocation,
            location: data.location
        };

        // Age slider options
           $scope.ageSlider = {
               value: data.prefAge, // Age offset
               min: 16,
               max: 99
           };
           // Distance slider options
           $scope.distanceSlider = {
               value: data.prefDistance,
               min: 0,
               max: 40
           };
        // Location preference
        $scope.selectedLocation = data.prefLocation;
    };

    // Save all profile settings
    $scope.saveProfile = function() {
        // Post to API
        $scope.user.prefLocation = 2;
        $scope.user.prefAge = parseInt($scope.user.prefAge);
        $scope.user.prefDistance = parseInt($scope.user.prefDistance);
        console.log($scope.user);
        // $http.post('http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update', $scope.user).success(function(data) {
        //  console.log('data: ');
        //     console.log(data);
        // }).error(function(error) {
        //   console.log(error);
        // });

    };

    // Save location when option is changed
    $scope.changed = function(id) {
        $scope.locationId = id;
    };
})

.controller('MatchesCtrl', function($scope, $stateParams, $http) {
    $http.get('http://studyfindr.herokuapp.com/user/getmatches?accessToken=testtoken&id=' + localStorage.getItem('ID')).success(function(data) {
        console.log(data);
        $scope.matches = data;
    }).error(function() {

    });

})
.controller('ChatCtrl', function($scope, $stateParams, $http, $ionicScrollDelegate, Profile) {
    var match_id = $stateParams.id;
    $scope.hideTime = true;
    $scope.$on('$ionicView.beforeEnter', function() {
        Profile.getUserInfo(match_id).success(function(data) {
            $scope.match = data;
            console.log($scope.match.firstname);
        }).error(function(error) {
            console.log(error);
        });
    });

    var alternate;
    $scope.sendMessage = function() {
       alternate = !alternate;

       var d = new Date();
       d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

       $scope.messages.push({
         userId: alternate ? localStorage.getItem('ID') : match_id,
         text: $scope.data.message,
         time: d
       });

    //    delete $scope.data.message;
       $ionicScrollDelegate.scrollBottom(true);
     };


    //  $scope.inputUp = function() {
    //    if (isIOS) $scope.data.keyboardHeight = 216;
    //    $timeout(function() {
    //      $ionicScrollDelegate.scrollBottom(true);
    //    }, 300);
    //  };

    //  $scope.inputDown = function() {
    //    if (isIOS) $scope.data.keyboardHeight = 0;
    //    $ionicScrollDelegate.resize();
    //  };

     $scope.closeKeyboard = function() {
       // cordova.plugins.Keyboard.close();
     };


     $scope.data = {};
     $scope.myId = localStorage.getItem('ID');
     $scope.messages = [];
})

.controller('LoginCtrl', function($scope, $stateParams, $state, $http, Account) {
    $scope.login = function() {
        if(localStorage.getItem('ID')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('ID');
        }
        else {
            FB.getLoginStatus(function(response) {
              console.log(response);
              // If login status = connected, user is already logged in, get user information
              if (response.status === 'connected') {
                    console.log(response);
                    Account.login(response);
                    $state.go('app.dashboard');
              }
              else { // Log in user
                FB.login();
                FB.getLoginStatus(function(response) {
                  console.log(response);
                  // If login status = connected, user is already logged in, get user information
                  if (response.status === 'connected') {
                        Account.login(response);
                        $state.go('app.profile');
                    }
                });
              }
            });
        }
    };
})

.controller('LogoutCtrl', function($scope, $stateParams, $state, $http, Account) {
    $scope.logout = function() {
        if(localStorage.getItem('ID')) {
            Account.logout();
        }
    };
});
