/**
* 담당자 : 정희성
* 함수 내용 : 로그인 라우터
* 주요 기능 : naver 혹은 kakao로 로그인하는 passport 함수와 url 연결 기능
 *          isLoggedIn 함수를 통해 이미 로그인 하였는지 여부를 판단하는 기능
 *          authenticate 메서드를 통해 해달 API에 로그인하는 기능
**/
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../config/passport/Middleware').isLoggedIn;
const passport = require('passport')
const login = require("../controller/User/login");

router.get('/', isLoggedIn, function(req, res, next) {
    res.render('login', { title: '로그인' });
});

router.get('/logout', login.logouts)

router.get('/auth/naver',isLoggedIn, passport.authenticate('naver',{
    successRedirect : '/home',
    failureRedirect: '/login'
}))
router.get('/auth/naver/callback', passport.authenticate('naver', {
    successRedirect : '/home',
    failureRedirect: '/login'
}))

router.get('/auth/kakao',isLoggedIn, passport.authenticate('kakao', {
    successRedirect : '/home',
    failureRedirect : '/login'
}))

router.get('/auth/kakao/callback', passport.authenticate('kakao', {
    successRedirect : '/home',
    failureRedirect: '/login'
}))


module.exports = router;