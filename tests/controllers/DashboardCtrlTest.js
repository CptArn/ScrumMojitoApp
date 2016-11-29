
describe('DashboardCtrl', function() {
	var $scope, $controller, $httpBackend;

	beforeEach(module('starter'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_){

		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$httpBackend = _$httpBackend_;


		ctrl = $controller('DashboardCtrl', {$scope: $scope});
	}));

	// Test deletion of user
	it('checking delete action', function() {
		$scope.users = [{id: 1}, {id: 123413}, {id: 743295}];
		$scope.checkAction(-100, {id: 1});
		expect($scope.users.length).toEqual(2);
	});
	// Test liking of user
	it('checking like action', function() {
		$scope.users = [{id: 1}, {id: 123413}, {id: 743295}];
		$scope.checkAction(100, {id: 1});
		expect($scope.users.length).toEqual(2);
	});
});
