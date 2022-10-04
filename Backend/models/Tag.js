const mongoose = require('mongoose')

const tagSchema = mongoose.Schema({
    content: {
        type: String
    }
})

const Tag = mongoose.model('Tag', tagSchema);

module.exports ={ Tag };