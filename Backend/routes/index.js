const express = require('express');
const scheduleController = require("../controller/Schedule");
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/home', checkLogIn, function(req, res, next) {
  res.render('home', { user: req.user });
});

router.get('/calendar', checkLogIn, scheduleController.findScheduleByUserInfo);

router.get('/tagStatistics', checkLogIn, function(req, res, next) {
  res.render('tagStatistics', { user: req.user });
});


module.exports = router;
