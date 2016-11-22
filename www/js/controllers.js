angular.module('starter.controllers', [])
// String to int
.filter('num', function() {
    return function(input) {
      return parseInt(input, 10);
    };
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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

    // Dropdown location options
    $scope.locations = [{id: 1, value: "Gent"}, {id: 2, value: "Kortrijk"}, {id: 3, value: "Leuven"}, {id: 4, value: "Brussel"}];

    $scope.$on('$ionicView.beforeEnter', function() {
        // Get profile information from user ID
        Profile.getProfile(10210995798960326).success(function(data) {
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
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            // school: "Odisee, Gent",
            // about: "fun guy, javascript is life",
            prefMale: data.prefMale,
            prefFemale: data.prefFemale,
            prefTrans: data.prefTrans,
            prefAge: data.prefAge,
            prefDistance: data.prefDistance,
            prefLocation: data.prefLocation
        };

        // Age slider options
        $scope.ageSlider = {
            min: data.prefAge,
            max: 75,
            options: {
                floor: 18,
                ceil: 100
            }
        };
        // Distance slider options
        $scope.distanceSlider = {
            value: 10,
            options: {
                floor: 0,
                ceil: 40
            }
        };

        // Location preference
        $scope.selectedLocation = data.prefLocation;


    };

    // Save all profile settings
    $scope.saveProfile = function() {
        // Post to API
        $scope.user.prefAge = parseInt($scope.ageSlider.min);
        $scope.user.prefDistance = parseInt($scope.distanceSlider.value);
        $scope.user.prefLocation = 2;
        console.log($scope.user);
        // $scope.data = {"id":0,"email":"arne.vlaeminck@student.odisee.be","firstname":"Arne","lastname":"Vlaeminck","location":"Gent","age":20,"prefMale":true,"prefFemale":true,"prefTrans":false,"prefAge":18,"prefDistance":10,"prefLocation":1};

        console.log($scope.ageSlider.min);
        console.log($scope.ageSlider.max);
        console.log($scope.distanceSlider.value);



        // var res = $http.post('http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update', $scope.data);
        //         res.success(function(data, status, headers, config) {
        //           $scope.message = data;
        //         });
        //         res.error(function(data, status, headers, config) {
        //           alert( "failure message: " + JSON.stringify({data: data}));
        //         });

        $http.post('http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update', $scope.user).success(function(data) {
         console.log('data: ');
            console.log(data);
        }).error(function(error) {
          console.log(error);
        });

        // $http({
        //   method: 'POST',
        //   url: 'http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update',
        //   headers: {
        //   'Content-Type': 'application/json'
        //     },
        //     data: { user: $scope.data }
        // }).then(function successCallback(response) {
        //     console.log(response);
        //   }, function errorCallback(response) {
        //     // called asynchronously if an error occurs
        //     // or server returns response with an error status.
        //   });
    };

    // Save location when option is changed
    $scope.changed = function(id) {
        console.log(id);
        $scope.locationId = id;
    };
})

.controller('MatchesCtrl', function($scope, $stateParams) {
});
