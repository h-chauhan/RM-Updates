module.exports = {
    NotificationToString: function (notification) {
        return "Notification Update:\n" +
            notification.date + " " + notification.time + "\n\n" +
            notification.heading + "\n" +
            (notification.body.length > 1800 ? notification.body.substring(0, 1800) + "..." : notification.body)  + "\n\n" +
            "Posted By: " + notification.poster;
    },

    JobToString: function (job) {
        return "Job Opening Update:\n\n" +
            job.name + "\n\n" +
            "Application Deadline: " + job.appDeadline + "\n\n" +
            "Date of Visit: " + job.dateOfVisit + "\n\n" +
            "Apply: " + job.link;
    }
};