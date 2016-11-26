angular.module('starter.services', [])

.service('Profile', function($http) {
    this.getProfile = function(id) {
        return $http.get('http://studyfindr.herokuapp.com/user/' + id + '/info');
    };
    this.setProfile = function(id, data) {
        return $http.post('http://studyfindr.herokuapp.com/user/' + $scope.user.id + '/update', data);
    };
})
.factory('facebookService', function($q) {
    return {
        getUserInfo: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'first_name, gender, last_name, id'
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    };
});
