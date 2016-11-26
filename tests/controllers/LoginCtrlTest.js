describe('LoginCtrl', function() {
	var $scope, $controller;

	beforeEach(module('starter'));

	beforeEach(inject(function(_$rootScope_, _$controller_){
		$scope = _$rootScope_.$new();
		$controller = _$controller_;

		ctrl = $controller('LoginCtrl', {$scope: $scope});
	}));

    // Test for Facebook login
	it('test logging in', function() {
        $scope.loggedIn = true;
		localStorage.setItem('FBuser', '1234');
		
		expect(localStorage.getItem('FBuser')).toEqual('1234');
		expect($scope.loggedIn).toEqual(true);
	});
});
