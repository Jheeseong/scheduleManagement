/**
* 담당자 : 정희성, 배도훈
* 함수 내용 : 활동 로그 스키마
* 주요 기능 : 생성자 및 공유 유저에 유저 스키마 매핑
**/
const mongoose = require('mongoose')

const LogSchema = mongoose.Schema({
    type: {
        type: String
    },
    content: {
        type: String
    },
    name: {
        beforeName: {
            type: String
        },
        afterName: {
            type: String
        }
    },
    check: {
        type: Boolean,
        default: false
    },
    createDate: {
        type: Date
    },
    creator: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    userInfo: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
})

const Log = mongoose.model('Log', LogSchema);

module.exports = { Log };