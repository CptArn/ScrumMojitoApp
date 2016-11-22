angular.module('starter.services', [])

.service('Profile', function($http) {
    this.getProfile = function(id) {
        return $http.get('http://studyfindr.herokuapp.com/user/' + id + '/info');
    };
    this.setProfile = function(id, data) {
        return $http.post('http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update', data);
    };
});
