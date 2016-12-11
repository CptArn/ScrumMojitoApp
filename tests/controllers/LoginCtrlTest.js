describe('LoginCtrl', function() {
	var $scope, $controller;

	beforeEach(module('starter'));

	beforeEach(inject(function(_$rootScope_, _$controller_){
		$scope = _$rootScope_.$new();
		$controller = _$controller_;

		ctrl = $controller('LoginCtrl', {$scope: $scope});
	}));

    // Test for Facebook login
	// it('test logging in', function() {
    // $scope.loggedIn = true;
	// 	localStorage.setItem('ID', '1234');
	// 	localStorage.setItem('accessToken', 'abcd');
	//
	// 	expect(localStorage.getItem('ID')).toEqual('1234');
	// 	expect(localStorage.getItem('accessToken')).toEqual('abcd');
	// 	expect($scope.loggedIn).toEqual(true);
	// });
});
