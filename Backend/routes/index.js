/**
* 담당자 : 정희성, 배도훈
* 함수 내용 : 각 페이지 라우터
* 주요 기능 : 각 페이지 url 생성 및 로그인 유저 정보 프론트에 전달
 *          checkLogin 함수를 통해 로그인 여부 판단 기능
**/
const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { user: req.user });
});

router.get('/home', checkLogIn, function(req, res, next) {
  res.render('home', { user: req.user });
});

router.get('/calendar', checkLogIn, function(req, res){
  res.render('calendar', {user: req.user});
});

router.get('/tagStatistics', checkLogIn, function(req, res, next) {
  res.render('tagStatistics', { user: req.user });
});


module.exports = router;
