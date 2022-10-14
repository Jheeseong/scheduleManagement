const { User } = require("../../models/User");

const UserController = {
    findAllUser: async (req, res) => {
        try {
            let users = await User.find()
                .exec();
            res.json({user: users, finduser: true})
        } catch (err) {
            res.json({finduser: false, err: err})
        }
    },
    findUserByName: async (req, res) => {
        try {
            const keyword = req.params.keyword
            let users = await User.find({$or : [{name: {$regex: keyword}}, {email: {$regex: keyword}}]})
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
    }
}

module.exports = UserController;