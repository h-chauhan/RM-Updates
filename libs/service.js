var serviceConfig = require('../configs/service.config');
var rp = require('request-promise');

module.exports = {
    getPlacementNotifications: function () {
        return rp(serviceConfig.PLACEMENT_NOTIFS_URL);
    },

    getInternshipNotifications: function () {
        return rp(serviceConfig.INTERNSHIP_NOTIFS_URL);
    },

    getPlacementJobs: function () {
        return rp(serviceConfig.PLACEMENT_JOBS_URL);
    },

    getInternshipJobs: function () {
        return rp(serviceConfig.INTERNSHIP_JOBS_URL);
    },
}