const express = require('express');
const {isLoggedIn} = require("../config/passport/middleware");
const login = require("../controller/login");
const router = express.Router();
const checkLogIn = require('../config/passport/middleware').checkLogIn
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: '로그인' });
});

router.get('/home', checkLogIn, function(req, res, next) {
  res.render('home', { title: '대쉬보드' });
});

router.get('/calendar', checkLogIn, function(req, res, next) {
  res.render('calendar', { title: '캘린더' });
});
router.get('/tagStatistics', checkLogIn, function(req, res, next) {
  res.render('tagStatistics', { title: '태그 통계' });
});
router.get('/logout', login.logouts)

module.exports = router;
