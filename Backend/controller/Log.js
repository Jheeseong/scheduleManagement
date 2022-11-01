const { Log } = require('../models/Log')

const LogController = {
    saveLog: async (str, share) => {
        try {
            const log = new Log({
                content: str,
                createDate: new Date(),
                userInfo: share,
            })

            await log.save();
        } catch (err) {
            throw new Error(err)
        }
    }
}

module.exports = LogController