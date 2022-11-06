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