const {User} = require("../../models/User");

const UserController = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : $ne 를 통해 로그인 유저를 제외한 모든 유저 정보를 가져오는 함수
    * 주요 기능 : 로그인 유저를 제외한 모든 유저를 찾아온 후 response 해주는 기능
    **/
    findAllUser: async (req, res) => {
        try {
            let users = await User.find({_id: {$ne: req.user._id}})
                .exec();
            res.json({user: users, finduser: true})
        } catch (err) {
            res.json({finduser: false, err: err})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : regex를 통해 유저 이름 혹은 이메일으로 유저를 검색하여 정보를 가져오는 함수
    * 주요 기능 : 이름 혹은 이메일을 통해 유저 검색 후 response 해주는 기능
    **/
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : id르 유저 검색하여 정보를 가져오는 함수
    * 주요 기능 : id와 일치하는 유저를 response해주는 기능
    **/
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
    /**
    * 담당자 : 배도훈
    * 함수 내용 : 내브바 사이즈 저장 함수
    * 주요 기능 : 유저가 설정한 내브바의 사이즈를 저장
    **/
    saveNavSize: async (req, res) => {
        try {
            const navSize = req.body.navSize
            await User.updateOne({userId: req.user.userId}, {$set: {navSize: navSize}})
            res.json({finduser: true})
        } catch (err) {
            console.log(err);
            res.json({finduser: false})
        }
    }
}

module.exports = UserController;