const mongoose = require('mongoose')

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
    tag: {
        type: String
    },
    address: {
        type: String
    }
})

const Schedule = mongoose.model('Schedule', ScheduleSchema);

module.exports = { Schedule }