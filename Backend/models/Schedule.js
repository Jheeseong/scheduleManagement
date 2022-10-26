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