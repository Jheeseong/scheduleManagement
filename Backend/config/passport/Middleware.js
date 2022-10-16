const passport = require('passport')
const { User } = require('../../models/User')

module.exports = {
    serializeUser: () => {
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
    },
    deserializeUser: () => {
        passport.deserializeUser(function(id, done) {
            User.findById(id)
                .then(user => done(null, user))
                .catch(err => done(err))
        });
    },
    //로그인 한 상태로 로그인 페이지 접근 시 홈으로 이동
    isLoggedIn: (req, res, next) => {
        if(!req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/home');
        }
    },
    //로그인 하지 않은 상태로 페이지 접근 시 로그인 페이지 이동
    checkLogIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'})
                .write("<script>window.alert('로그인을 해주세요')</script>"
                + "<script>location.replace('/login')</script>");
        }
    }
}