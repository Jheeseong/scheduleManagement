const { Log } = require('../models/Log')

const LogController = {
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
    findMyLog: async (req, res) => {
        try {
          let logs = await Log.find({userInfo: req.user._id})
              .populate('creator')
              .exec();

          res.json({logs: logs, findLogSuccess: true, message: "로그를 찾았습니다."})
        } catch (err) {
            console.log(err)
            res.status(400).json({findLogSuccess: false, err: err, message: "로그를 찾지 못하였습니다."})
        }
    }
}

module.exports = LogController