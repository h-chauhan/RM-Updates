require('dotenv').config();

module.exports = {
    loginUrl: "http://tnp.dtu.ac.in/rm_2016-17/login/",
    newsFeedUrl: "http://tnp.dtu.ac.in/rm_2016-17/student/",
    jobsUrl: "http://tnp.dtu.ac.in/rm_2016-17/student/job_openings/",
    username: process.env.RM_LOGIN_USERNAME,
    password: process.env.RM_LOGIN_PASSWORD,
    internLoginUrl: "http://tnp.dtu.ac.in/rm_2016-17/intern/intern_login",
    internNewsFeedUrl: "http://tnp.dtu.ac.in/rm_2016-17/intern/intern_student",
    internUsername: process.env.RM_INTERN_USERNAME,
    internPassword: process.env.RM_INTERN_PASSWORD
};