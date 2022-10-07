const passport = require('passport')
const { User } = require('../../models/User')

module.exports = {
    serializeUser: () => {
        passport.serializeUser(function(user, done) {
            console.log('serialize');
            done(null, user.id);
        });
    },
    deserializeUser: () => {
        passport.deserializeUser(function(id, done) {
            console.log('deserializeUser')
            User.findById(id)
                .then(user => done(null, user))
                .catch(err => done(err))
        });
    },
    isLoggedIn: (req, res, next) => {
        if(!req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/home');
        }
    },
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