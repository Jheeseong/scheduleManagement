/**
* 담당자 : 정희성, 배도훈
* 함수 내용 : 태그 스키마
* 주요 기능 : 태그 일정에 일정 스키마 매핑
**/
const mongoose = require('mongoose')

const TagSchema = mongoose.Schema({
    content: {
        type: String
    },
    scheduleInfo: [{type: mongoose.Schema.Types.ObjectId, ref:"Schedule"}]
})

const Tag = mongoose.model('Tag', TagSchema);

module.exports ={ Tag };