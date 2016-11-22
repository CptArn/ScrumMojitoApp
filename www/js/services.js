angular.module('starter.services', [])

.service('Profile', function($http) {
    this.getProfile = function(id) {
        return $http.get('http://studyfindr.herokuapp.com/user/' + id + '/info');
    };
});
