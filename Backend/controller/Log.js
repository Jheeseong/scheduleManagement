const { Log } = require('../models/Log')

const LogController = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : 일정 혹은 카테고리가 생성, 수정, 삭제 시 로그를 저장하는 함수
    * 주요 기능 : 일정 혹은 카테고리의 활동 로그를 저장하는 기능
    **/
    saveLog: async (param) => {
        try {
            const log = new Log({
                type: param.type,
                content: param.content,
                "name.beforeName": param.beforeName,
                "name.afterName": param.afterName,
                createDate: new Date(),
                creator: param.creator,
                userInfo: param.userInfo,
            })

            await log.save();
        } catch (err) {
            throw new Error(err)
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 활동 로그들을 불러오는 함수
    * 주요 기능 : 일정 혹은 카테고리의 생성, 변경, 삭제 로그를 불러오는 기능
     *          카테고리 공유 중인 유저들에게도 로그를 보여주는 기능
     *          페이징을 통해 한번 당 20개씩 보이도록 하는 기능
    **/
    findMyLog: async (req, res) => {
        try {
            let page = req.params.page

            let skipCnt = (page - 1) * 20;
            let logs = await Log.find({userInfo: req.user._id})
                  .populate('creator')
                  .sort({createDate: -1})
                  .skip(skipCnt)
                  .limit(20)
                  .exec();

              res.json({logs: logs, findLogSuccess: true, message: "로그를 찾았습니다."})
            } catch (err) {
                console.log(err)
                res.status(400).json({findLogSuccess: false, err: err, message: "로그를 찾지 못하였습니다."})
            }
    }
}

module.exports = LogController