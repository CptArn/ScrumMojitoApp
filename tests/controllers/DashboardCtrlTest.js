
describe('DashboardCtrl', function() {
	var $scope, $controller, $httpBackend;

	beforeEach(module('starter'));

	beforeEach(inject(function(_$rootScope_, _$controller_, _$httpBackend_){

		$scope = _$rootScope_.$new();
		$controller = _$controller_;
		$httpBackend = _$httpBackend_;


		ctrl = $controller('DashboardCtrl', {$scope: $scope});
	}));


	// it('should receive name', function() {
	// 	// HTTP unit test
	// });


});
