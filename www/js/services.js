angular.module('starter.services', [])

.service('Profile', function($http) {
    this.getCurrentProfile = function() {
        return $http.get('http://studyfindr.herokuapp.com/user/getmyinfo?accessToken=' + localStorage.getItem('accessToken') + '&id=' + localStorage.getItem('ID'));
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
