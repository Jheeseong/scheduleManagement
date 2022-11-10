/**
* 담당자 : 배도훈
* 함수 내용 : 메모 스키마
* 주요 기능 : 메모 스키마에 일정, 유저 매핑
**/
const mongoose = require('mongoose')

const MemoSchema = mongoose.Schema({
    content: {
        type: String
    },
    scheduleInfo: [{
        type: mongoose.Schema.Types.ObjectId, ref:"Schedule"
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId, ref:"User"
    },
    createDate: {
        type: Date,
        default: () => Date.now() + 3*6*1000
    },
    updateDate: {
        type: Date
    }
})

const Memo = mongoose.model('Memo', MemoSchema);

module.exports ={ Memo };