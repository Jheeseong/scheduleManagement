const mongoose = require('mongoose')

const LogSchema = mongoose.Schema({
    type: {
        type: String
    },
    content: {
        type: String
    },
    beforeName: {
        type: String
    },
    afterName: {
        type: String
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