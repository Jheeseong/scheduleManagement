const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    title: {
        type: String
    },
    creator: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    tagInfo: [{type: mongoose.Schema.Types.ObjectId, ref:"Tag"}],
    userInfo: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
})
const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category }