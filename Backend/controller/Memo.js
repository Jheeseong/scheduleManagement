const { Memo } = require("../models/Memo");
const {Schedule} = require("../models/Schedule");
const TagController = require("./Tag");
const LogController = require("./Log");

const memoController = {
    /**
    * 담당자 : 배도훈
    * 함수 내용 : 메모 목록 조회 함수
    * 주요 기능 : 메모 목록 조회
    **/
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
    /**
    * 담당자 : 배도훈
    * 함수 내용 : 메모 저장 함수
    * 주요 기능 : 사용자 id와 메모 내용을 저장
    **/
    saveMemo: async (req, res) => {
        try {
            const memo = new Memo({
                user: req.user._id,
                content: req.body.content,
                scheduleInfo: req.body.scheduleInfo
            });

            await memo.save();

            res.json({memoSuccess: true, message: "메모 등록 완료"});
        } catch (err) {
            console.log(err)
            return res.status(400).json({memoSuccess: false, message:"메모 등록 실패",err: err})
        }
    },
    /**
    * 담당자 : 배도훈
    * 함수 내용 : 메모 상세 조회 함수
    * 주요 기능 : 메모 상세 조회
    **/
    findMemoDetail: async (req, res) => {
        try {
            let memo = await Memo.findOne({_id: req.params.id})
                .exec();
            res.json({memo: memo, findmemo: true})
        } catch (err) {
            console.log(err)
            res.json({findmemo: false, err: err})
        }
    },
    /**
    * 담당자 : 배도훈
    * 함수 내용 : 메모 수정 함수
    * 주요 기능 : 메모 id로 메모를 찾고 내용과 수정일을 업데이트
    **/
    updateMemo: async (req, res) => {
        try {
            let memo = await Memo.findOne({_id: req.params.id})
                .exec();
            if (memo) {

                let result = await Memo.findOneAndUpdate({_id: req.params.id},
                    {
                        $set: {
                            content: req.body.content,
                            updateDate: Date.now() + 3*6*1000
                        }
                    }, {new: true});

                res.json({memoUpdate: true, message: "메모 편집 완료"});
            } else {
                res.json({memoUpdate: false, message: "메모를 찾을 수 없습니다."});
            }
        } catch (err) {
            console.log(err)
            return res.status(400).json({memoSuccess: false, message:"메모 등록 실패",err: err})
        }
    },
    /**
    * 담당자 : 배도훈
    * 함수 내용 : 메모 삭제 함수
    * 주요 기능 : 메모 id로 메모를 찾고 삭제
    **/
    deleteMemo: async (req, res) => {
        try {
            let memo = await Memo.findOne({_id: req.params.id})
                .exec();

            await Memo.deleteOne({_id: req.params.id});

            res.json({memoDelete: true, message: "메모 삭제 완료"})
        } catch (err) {
            return res.status(400).json({memoDelete: false, message: "메모 삭제를 실패하였습니다.", err: err})
        }
    },
}

module.exports = memoController;