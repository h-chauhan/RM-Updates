const express = require('express');
const router = express.Router();
const login = require("../lib/login");
const getDiff = require("../lib/getDiff");

/* GET home page. */
router.get('/', function(req, res, next) {
    login().then(function(html){
       res.send(html);
    });
    // let oldString = "<div><ul><li>1</li><li>2</li><li>3</li><li>4</li></ul></div>";
    // let newString = "<div><ul><li>7</li><li>1</li><li>2</li><li>6</li></li><li>3</li><li>4</li></ul></div>";
    // let diff = getDiff(oldString, newString);
    // res.send(diff);

});

module.exports = router;