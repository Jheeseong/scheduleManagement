const passport = require('passport')
const NaverStrategy = require("passport-naver").Strategy;
const {User} = require("../../models/User");
const KakaoStrategy = require("passport-kakao").Strategy;
const APILogin = {
    naver: () => {
        passport.use('naver', new NaverStrategy({
                clientID: 'BVv6U8x0QoAKfDCQ7oEd',
                clientSecret: 'glzBGj6Nb2',
                callbackURL: 'http://localhost:3000/login/auth/naver/callback'
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
    kakao: () => {
        passport.use('kakao', new KakaoStrategy({
                clientID: '941ab44d8d5922a8de9febca39bd28f2',
                callbackURL: 'http://localhost:3000/login/auth/kakao/callback'
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