angular.module('starter.controllers', [])

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
.controller('ProfileCtrl', function($scope, $http) {


    // Dropdown location options
    $scope.locations = [{id: 1, value: "Gent"}, {id: 2, value: "Kortrijk"}, {id: 3, value: "Leuven"}, {id: 4, value: "Brussel"}];

    $scope.$on('$ionicView.beforeEnter', function() {
        // Get profile information
        
        $http.get('http://studyfindr.herokuapp.com/user/10210995798960326/info').success(function(data) {
          console.log(data);
          // User info
          $scope.user = {
              name: data.firstname + " " + data.lastname, // Could be nickname?
              email: data.email,
              school: "Odisee, Gent",
              about: "fun guy, javascript is life"
          };

          // Gender preferences
          $scope.gender = { male: data.prefMale, female: data.prefFemale, trans: data.prefTrans };

           // Age slider options
          $scope.ageSlider = {
              value: data.prefAge, // Age offset
              min: 16,
              max: 99
          };

          $scope.selectedLocation = data.prefLocation;
 
          // Distance slider options
          $scope.distanceSlider = {
              value: data.prefDistance,
              min: 0,
              max: 40
          };

        }).error(function(error) {
          $scope.helloWorld = "Sorry, something went wrong with our server";
          console.log(error);
        });
    });


  
    // Save all profile settings
    $scope.saveProfile = function() {
        // Post to API
        // console.log('saving profile changes');
        $scope.user = $scope.user;
        $scope.ageSlider.value = $scope.ageSlider.value;
        $scope.distanceSlider.value = $scope.distanceSlider.value;
        $scope.locationId = $scope.locationId;
        $scope.gender = $scope.gender;
        // console.log($scope.user);
        // console.log($scope.ageSlider.value);
        // console.log($scope.distanceSlider.value);
        // console.log($scope.locationId);
        // console.log($scope.gender);
    };

    // Save location when option is changed
    $scope.changed = function(id) {
        $scope.locationId = id;
    };
})

.controller('MatchesCtrl', function($scope, $stateParams) {
});
