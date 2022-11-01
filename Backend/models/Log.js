const mongoose = require('mongoose')

const LogSchema = mongoose.Schema({
    content: {
        type: String
    },
    check: {
        type: Boolean,
        default: false
    },
    createDate: {
        type: Date
    },
    userInfo: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
})

const Log = mongoose.model('Log', LogSchema);

module.exports = { Log };