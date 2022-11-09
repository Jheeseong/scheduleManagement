const passport = require('passport')
const { User } = require('../../models/User')

module.exports = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : user.id를 serializeUser 메서드를 통해 Session에 저장하는 함수
    * 주요 기능 : 로그인 유저의 id를 Session에 저장
    **/
    serializeUser: () => {
        passport.serializeUser(function(user, done) {
            done(null, user.id);
        });
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : Session에 담긴 id를 deserializeUser메서드를 통해 가지고 온 후
     *          findById 하여 정보를 찾아 return 하는 함수
    * 주요 기능 :  Session 정보를 찾아온 후 return하는 기능
    **/
    deserializeUser: () => {
        passport.deserializeUser(function(id, done) {
            User.findById(id)
                .then(user => done(null, user))
                .catch(err => done(err))
        });
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 로그인 상태를 req.isAuthenticated 메서드로 확인 후 로그인 상태일 경우
     *          홈화면으로 return 해주는 함수
    * 주요 기능 : 로그인 상태 여부 판단 후 홈 화면으로 이동해주는 기능
    **/
    //로그인 한 상태로 로그인 페이지 접근 시 홈으로 이동
    isLoggedIn: (req, res, next) => {
        if(!req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/home');
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 로그인 상태를 req.isAuthenticated 메서드로 판단 후 로그인하지 않았을 경우
     *          로그인 화면으로 return 하고 alert를 띄어주는 함수
    * 주요 기능 : 로그인 상태 여부 판단 후 홈 화면으로 이동시켜주는 기능
    **/
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