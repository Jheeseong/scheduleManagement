const mongoose = require('mongoose')

const TagSchema = mongoose.Schema({
    content: {
        type: String
    },
    scheduleInfo: [{type: mongoose.Schema.Types.ObjectId, ref:"Schedule"}]
})

const Tag = mongoose.model('Tag', TagSchema);

module.exports ={ Tag };