const express = require('express');
const router = express.Router();
const isLoggedIn = require('../config/passport/middleware').isLoggedIn;
const passport = require('passport')
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