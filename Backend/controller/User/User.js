const {User} = require("../../models/User");

const UserController = {
    findAllUser: async (req, res) => {
        try {
            let users = await User.find({_id: {$ne: req.user._id}})
                .exec();
            console.log(users)
            res.json({user: users, finduser: true})
        } catch (err) {
            res.json({finduser: false, err: err})
        }
    },
    findUserByName: async (req, res) => {
        try {
            const keyword = req.params.keyword
            let users = await User.find({$or: [{name: {$regex: keyword}}, {email: {$regex: keyword}}]})
                .exec();
            res.json({user: users, finduser: true})
        } catch (err) {
            console.log(err)
            res.json({finduser: false, err: err})
        }
    },
    findUserById: async (req, res) => {
        try {
            const id = req.params.id;
            let user = await User.findOne({_id: id})
                .exec();
            res.json({user: user, finduser: true})
        } catch (err) {
            console.log(err)
            res.json({finduser: false, err: err})
        }
    },
    saveNavSize: async (req, res) => {
        try {
            const navSize = req.body.navSize
            console.log(navSize);
            await User.updateOne({userId: req.user.userId}, {$set: {navSize: navSize}})
            res.json({finduser: true})
        } catch (err) {
            console.log(err);
            res.json({finduser: false})
        }
    }
}

module.exports = UserController;