const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    userId: {
        type: String,
        trim: true,
    },
    nickName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    image: {
        type: String
    },
    token: {
        type: String
    },
    provider: {
        type: String
    }
})

const User = mongoose.model('User', userSchema);

module.exports = { User };