const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: '로그인' });
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: '대쉬보드' });
});

router.get('/calendar', function(req, res, next) {
  res.render('calendar', { title: '캘린더' });
});
router.get('/tagStatistics', function(req, res, next) {
  res.render('tagStatistics', { title: '태그 통계' });
});

module.exports = router;
