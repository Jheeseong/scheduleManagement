const passport = require('passport')
const NaverStrategy = require("passport-naver").Strategy;
const {User} = require("../../models/User");
const KakaoStrategy = require("passport-kakao").Strategy;
const APILogin = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : 네이버 API를 이용하여 회원가입 및 로그인이 가능하도록 해주는 기능
    * 주요 기능 : NaverStrategy 메서드를 통해 API에 접근하는 기능
     *          DB에 유저 정보 판단 후 회원가입하거나 로그인해주는 기능
    **/
    naver: () => {
        passport.use('naver', new NaverStrategy({
                clientID: 'BVv6U8x0QoAKfDCQ7oEd',
                clientSecret: 'glzBGj6Nb2',
                callbackURL: '/login/auth/naver/callback'
            },
            function(accessToken, refreshToken, profile, done) {
                User.findOne({
                    'userId': profile.id
                }, function(err, user) {
                    if (!user) {
                        user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            userId: profile.id,
                            image: profile._json.profile_image,
                            provider: 'naver',
                            token: accessToken
                        });
                        user.save(function(err) {
                            if (err) console.log(err);
                            return done(err, user);
                        });
                    } else {
                        User.findByIdAndUpdate(user._id, {
                            $set: {
                                name: profile.displayName,
                                email: profile.emails[0].value,
                                userId: profile.id,
                                image: profile._json.profile_image,
                                provider: 'naver',
                                token: accessToken
                            }
                            }, function (err, user) {
                            if (err) {
                                window.alert("오류 발생")
                                console.log(err);
                            }
                        });
                        return done(err, user);
                    }
                });
            }
        ))
    },
    /**
     * 담당자 : 정희성
     * 함수 내용 : 카카오 API를 이용하여 회원가입 및 로그인이 가능하도록 해주는 기능
     * 주요 기능 : kakaoStrategy 메서드를 통해 API에 접근하는 기능
     *          DB에 유저 정보 판단 후 회원가입하거나 로그인해주는 기능
     **/
    kakao: () => {
        passport.use('kakao', new KakaoStrategy({
                clientID: '941ab44d8d5922a8de9febca39bd28f2',
                callbackURL: '/login/auth/kakao/callback'
            },
            function(accessToken, refreshToken, profile, done) {
                User.findOne({
                    'userId': profile.id
                }, function(err, user) {
                    if (!user) {
                        user = new User({
                            name: profile.displayName,
                            email: profile._json && profile._json.kakao_account.email,
                            userId: profile.id,
                            image: profile._json.properties.thumbnail_image,
                            provider: 'kakao',
                            token: accessToken
                        });
                        user.save(function(err) {
                            if (err) console.log(err);
                            return done(err, user);
                        });
                    } else {
                        User.findByIdAndUpdate(user._id,{
                            $set: {
                                name: profile.displayName,
                                email: profile._json && profile._json.kakao_account.email,
                                userId: profile.id,
                                image: profile._json.properties.thumbnail_image,
                                provider: 'kakao',
                                token: accessToken
                            }
                            }, function (err, user) {
                                if (err) {
                                    window.alert("오류 발생")
                                    console.log(err);
                                }
                            })
                        return done(err, user);
                    }
                });
            }
        ))
    }
}

module.exports = APILogin;