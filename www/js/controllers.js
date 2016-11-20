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
.controller('ProfileCtrl', function($scope) {
    $scope.checked = true;

    // Dropdown location options
    $scope.locations = [{id: 1, value: "Gent"}, {id: 2, value: "Kortrijk"}, {id: 3, value: "Leuven"}, {id: 4, value: "Brussel"}];

    $scope.$on('$ionicView.beforeEnter', function() {
        // Get profile information

    });
    // User info
    $scope.user = {
        name: "Arne Vlaeminck",
        email: "arne.vlaeminck@student.odisee.be",
        school: "Odisee, Gent",
        about: "fun guy, javascript is life"
    };
    // Gender preferences
    $scope.gender = { male: true, female: false, trans: false };
    // Age slider options
    $scope.ageSlider = {
        value: 18, // Age offset
        min: 18,
        max: 99
    };
    // Distance slider options
    $scope.distanceSlider = {
        value: 0,
        min: 0,
        max: 20
    };
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
