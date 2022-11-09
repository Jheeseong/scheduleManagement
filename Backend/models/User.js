/**
* 담당자 : 정희성, 배도훈
* 함수 내용 : 유저 스키마
* 주요 기능 : 유저 스키마
**/
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    userId: {
        type: String,
        trim: true,
    },
    nickName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    image: {
        type: String
    },
    token: {
        type: String
    },
    provider: {
        type: String
    },
    menuColor: {
        type: String
    },
    navSize: {
        type: String,
        default: 'max'
    }
})

const User = mongoose.model('User', userSchema);

module.exports = { User };