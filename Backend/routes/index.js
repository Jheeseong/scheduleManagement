const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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


module.exports = router;
