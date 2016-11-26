describe('Profile Service test', function(){
    var ProfileService, $httpBackend, scope;

    beforeEach(function() {
        module('starter.services');
    });

    beforeEach(inject(function(_$rootScope_, _$httpBackend_, _Profile_){
        scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;

        ProfileService = _Profile_;
	}));

    var user = {    age: 21,
                    email: "arne.vlaeminck@student.odisee.be",
                    firstname: "Arne",
                    id: 10210995798960326,
                    lastname: "Vlaeminck",
                    location: 1,
                    prefAge: 18,
                    prefDistance: 10,
                    prefFemale: true,
                    prefLocation: 1,
                    prefMale: false,
                    prefTrans: false
                };
    // Test get of profile
    it('should return profile', function() {
        $httpBackend.when('GET', 'http://studyfindr.herokuapp.com/user/0/info').respond(200, user);
        ProfileService.getProfile(0).success(function(data) {
            expect(data).toEqual({        age: 21,
                                email: "arne.vlaeminck@student.odisee.be",
                                firstname: "Arne",
                                id: 10210995798960326,
                                lastname: "Vlaeminck",
                                location: 1,
                                prefAge: 18,
                                prefDistance: 10,
                                prefFemale: true,
                                prefLocation: 1,
                                prefMale: false,
                                prefTrans: false
                            });
        });
        $httpBackend.flush();
    });

    // Post test
    // it('should post to profile', function() {
    //     $httpBackend.when('POST', 'http://studyfindr.herokuapp.com/user/0/update').respond(function(method, url, data) {
    //         console.log(data);
    //         user.firstname = "Test";
    //         return [200, user, {}];
    //     });
    //
    //     ProfileService.setProfile(0, JSON.stringify({name: 'OtherName'})).success(function(data) {
    //         // expect(data.firstname).toEqual('Test');
    //     });
    //     // $httpBackend.flush();
    //
    // });
});
