require('dotenv').config();

module.exports = {
    loginUrl: "http://tnp.dtu.ac.in/rm_2016-17/intern/intern_login",
    newsFeedUrl: "http://tnp.dtu.ac.in/rm_2016-17/intern/intern_student",
    username: process.env.RM_LOGIN_USERNAME,
    password: process.env.RM_LOGIN_PASSWORD
};