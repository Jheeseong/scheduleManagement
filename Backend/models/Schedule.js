/**
* 담당자 : 정희성, 배도훈
* 함수 내용 : 일정 스키마
* 주요 기능 : 생성자에 유저 스키마 매핑
 *           일정 태그에 태그 스키마 매핑
 *           일정 삭제 시 태그에 매핑되어 있는 일정을 삭제해주는 미들웨어 기능
**/
const mongoose = require('mongoose')
const { Tag } = require('./Tag')

const ScheduleSchema = mongoose.Schema({
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    priority: {
        type: Number
    },
    address: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    tagInfo:[{type: mongoose.Schema.Types.ObjectId, ref:"Tag"}],
    userInfo: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    color: {
        type: String
    }
})

ScheduleSchema.pre('deleteOne', { document: false, query: true}, async function(next) {
    //지워지는 자신을 서치
    const { _id } = this.getFilter()
    console.log(_id)
    //링크가 되어 있는 키를 맵핑해서 삭제
    await Tag.updateMany({scheduleInfo: _id}, {$pull : {scheduleInfo : _id}});
    next();
})

const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = { Schedule }