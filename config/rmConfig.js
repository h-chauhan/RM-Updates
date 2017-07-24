require('dotenv').config();

module.exports = {
    loginUrl: "http://tnp.dtu.ac.in/rm_2016-17/login/",
    username: process.env.RM_LOGIN_USERNAME,
    password: process.env.RM_LOGIN_PASSWORD
};