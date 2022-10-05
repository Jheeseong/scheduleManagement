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