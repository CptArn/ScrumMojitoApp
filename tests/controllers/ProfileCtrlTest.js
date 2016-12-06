describe('ProfileCtrl', function() {
	var $scope, $controller;

	beforeEach(module('starter'));

	beforeEach(inject(function(_$rootScope_, _$controller_){
		$scope = _$rootScope_.$new();
		$controller = _$controller_;

		ctrl = $controller('ProfileCtrl', {$scope: $scope});
	}));

	it('user should have all information', function() {
		$scope.setProfile({age: 21,
							email: "arne.vlaeminck@student.odisee.be",
							firstname: "Arne",
							id: 10210995798960326,
							lastname: "Vlaeminck",
							location: 1,
							prefAgeMin: 20,
							prefAgeMax: 50,
							prefDistance: 10,
							prefFemale: true,
							prefLocation: 1,
							prefMale: false,
							prefTrans: false
						});

		expect($scope.user).toEqual({age: 21,
							email: "arne.vlaeminck@student.odisee.be",
							firstname: "Arne",
							id: 10210995798960326,
							lastname: "Vlaeminck",
							location: 1,
							prefAgeMin: 20,
							prefAgeMax: 50,
							prefDistance: 10,
							prefFemale: true,
							prefLocation: 1,
							prefMale: false,
							prefTrans: false
						});
	});

	it('updating of user information', function() {
		$scope.user.prefMale = true;

		$scope.saveProfile();
		expect($scope.user.prefMale).toEqual(true);
	});

	it('change location id', function() {
		$scope.changed(3);
		expect($scope.locationId).toEqual(3);
	});


});
