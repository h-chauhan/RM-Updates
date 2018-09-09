var expect = require('chai').expect;
var service = require('../libs/service');

describe('Service', function() {
    this.timeout(15000);

    it('Get Placement Notifications', (done) => {
        this.timeout(15000);
        service.getPlacementNotifications().then((result) => {
            expect(result).to.not.empty;
            done();
        })
    });

    it('Get Internship Notifications', (done) => {
        this.timeout(15000);
        service.getPlacementNotifications().then((result) => {
            expect(result).to.not.empty;
            done();
        })
    });

    it('Get Placement Jobs', (done) => {
        this.timeout(15000);
        service.getPlacementNotifications().then((result) => {
            expect(result).to.not.empty;
            done();
        })
    });

    it('Get Internship Jobs', (done) => {
        this.timeout(15000);
        service.getPlacementNotifications().then((result) => {
            expect(result).to.not.empty;
            done();
        })
    });
});