describe('Facebook Service test', function(){
    var facebookService, $httpBackend, scope;

    beforeEach(function() {
        module('starter.services');
    });

    beforeEach(inject(function(_$rootScope_, _$httpBackend_, _facebookService_){
        scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;

        facebookService = _facebookService_;
	}));

    var user = {
                    id: 10210995798960326,
                };
    // Test get profile info
    it('should return profile', function() {
        $httpBackend.when('GET', '/me').respond(200, user);
        facebookService.getUserInfo().success(function(data) {
            expect(data.id).toEqual(10210995798960326);
        });
        $httpBackend.flush();
    });
});
