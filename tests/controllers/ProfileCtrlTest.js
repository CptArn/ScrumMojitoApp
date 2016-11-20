describe('ProfileCtrl', function() {
	var $scope, $controller;

	beforeEach(module('starter'));

	beforeEach(inject(function(_$rootScope_, _$controller_){

		$scope = _$rootScope_.$new();
		$controller = _$controller_;

		ctrl = $controller('ProfileCtrl', {$scope: $scope});
	}));

	it('checked schould be set to true', function() {
		expect($scope.checked).toEqual(true);
	});
});
