const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    title: {
        type: String
    },
    tag: {
        type: String
    },
    userInfo: {type: mongoose.Schema.Types.ObjectId, ref:"User"}
})
const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category }