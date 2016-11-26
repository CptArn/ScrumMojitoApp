angular.module('starter.controllers', [])
// String to int
.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    $scope.loggedIn = localStorage.getItem('FBuser');
    console.log('app: ' + $scope.loggedIn);
})

.controller('DashboardCtrl', function($scope, $http) {

        $http.get('https://student-dating-test.herokuapp.com/greeting?name=Arne').success(function(data) {
          $scope.helloWorld = data;
          console.log('data: ' + data.content);
        }).error(function(error) {
          $scope.helloWorld = "Sorry, something went wrong with our server";
          console.log(error);
      });


})

// Controller for user profile page
.controller('ProfileCtrl', function($scope, $http, Profile) {
    $scope.user = [];
    $scope.gender = [];
    $scope.ageSlider = [];
    $scope.distanceSlider = [];
    $scope.selectedLocation = [];

    $scope.user.id = localStorage.getItem('FBuser');
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
        Profile.getProfile(10210995798960326).success(function(data) { //localStorage.getItem('user')
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

.controller('MatchesCtrl', function($scope, $stateParams) {
})

.controller('LoginCtrl', function($scope, $stateParams, facebookService, $state) {
    $scope.login = function() {
        if(localStorage.getItem('FBuser')) {
            localStorage.removeItem('FBuser');
        }
        else {
            FB.getLoginStatus(function(response) {
                // If login status = connected, user is already logged in, get user information
              if (response.status === 'connected') {
                console.log('Logged in.');
                // Should be removed
                facebookService.getUserInfo()
                     .then(function(response) {
                       console.log(response);
                       localStorage.setItem('FBuser', response.id );
                       $scope.loggedIn = response.id;
                     }
                );
                $state.go('app.dashboard');
              }
              else { // Log in user
                FB.login();
                facebookService.getUserInfo()
                     .then(function(response) {
                    //    console.log(response);
                       localStorage.setItem('FBuser', response.id );
                       $state.go('/app/dashboard');
                     }
                );
              }
            });
        }
    };
});
