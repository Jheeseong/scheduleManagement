const { Memo } = require("../models/Memo");
const {Schedule} = require("../models/Schedule");
const TagController = require("./Tag");
const LogController = require("./Log");

const memoController = {
    findMemoList: async (req, res) => {
        try {
            const userId = req.user._id;
            let memo = await Memo.find({user: userId})
                .exec();
            res.json({memo: memo, findmemo: true})
        } catch (err) {
            console.log(err)
            res.json({findmemo: false, err: err})
        }
    },
    saveMemo: async (req, res) => {
        try {
            const memo = new Memo({
                user: req.user._id,
                content: req.body.content,
                scheduleInfo: req.body.scheduleInfo
            });

            await memo.save();

            /*const log = {
                type: "일정",
                content: "생성",
                beforeName: req.body.title,
                afterName: req.body.title,
                creator: req.user._id,
                userInfo: req.user._id
            }

            await LogController.saveLog(log)*/

            res.json({memoSuccess: true, message: "메모 등록 완료"});
        } catch (err) {
            console.log(err)
            return res.status(400).json({memoSuccess: false, message:"메모 등록 실패",err: err})
        }
    },
    /*findMemoDetail: async (req, res) => {
        try {
            const id = req.params.id;
            let user = await User.findOne({_id: id})
                .exec();
            res.json({user: user, finduser: true})
        } catch (err) {
            console.log(err)
            res.json({finduser: false, err: err})
        }
    },*/
    /*updateMemo: async (req, res) => {
        try {
            const id = req.params._id;
            const userId = req.user._id;
            let user = await User.findOne({_id: userId, memo:{_id: id}})
                .exec();
            res.json({memo: user.memo, finduser: true})
        } catch (err) {
            console.log(err)
            res.json({memo: false, err: err})
        }
    },*/
}

module.exports = memoController;