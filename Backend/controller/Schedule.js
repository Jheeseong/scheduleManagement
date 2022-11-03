const { Schedule } = require('../models/Schedule')
const TagController = require('../controller/Tag')
const LogController = require('../controller/Log')

const ScheduleController = {
    saveSchedule: async (req, res) => {
        try {
            const schedule = new Schedule({
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                title: req.body.title,
                content: req.body.content,
                priority: req.body.priority,
                address: req.body.address,
                userInfo: req.user._id,
                tagInfo: [],
            });

            await schedule.save();

            await Promise.all(req.body.tagInfo.map(async (result) => {
                let tags = await TagController.saveTag(result, schedule._id);
                if (tags.tagSuccess === false) {
                    throw Error;
                }

                await Schedule.updateOne({_id: schedule._id}, {$push: {tagInfo: tags._id}});

            }));

            const log = {
                type: "일정",
                content: "생성",
                beforeName: req.body.title,
                afterName: req.body.title,
                creator: req.user._id,
                userInfo: req.user._id
            }

            await LogController.saveLog(log)

            res.json({scheduleSuccess: true, message: "일정등록이 되었습니다."});
        } catch (err) {
            console.log(err)
            return res.status(400).json({scheduleSuccess: false, message:"일정등록이 실패하였습니다.",err: err})
        }
    },
    updateSchedule: async (req, res) => {
        try {
            const findSchedule = await Schedule.findOne({_id: req.params.id})
                .exec();

            if (findSchedule) {
                console.log(findSchedule.tagInfo)
                await TagController.disconnectSchedule(findSchedule.tagInfo, findSchedule._id);

                const promiseTag = await Promise.all(req.body.tagInfo.map(async (result) => {
                    let tags = await TagController.saveTag(result, req.params.id);
                    if (tags.tagSuccess === false) {
                        throw Error(tags.err);
                    }
                    return tags._id;
                }));

                let result = await Schedule.findOneAndUpdate({_id: req.params.id},
                    {
                        $set: {
                            startDate: req.body.startDate,
                            endDate: req.body.endDate,
                            title: req.body.title,
                            content: req.body.content,
                            priority: req.body.priority,
                            address: req.body.address,
                            // userInfo: req.body.userInfo,
                            tagInfo: promiseTag,
                        }
                    }, {new: true});

                const log = {
                    type: "일정",
                    content: "수정",
                    beforeName: findSchedule.title,
                    afterName: result.title,
                    creator: req.user._id,
                    userInfo: req.user._id
                }

                await LogController.saveLog(log);

                res.json({scheduleUpdate: true, message: "일정편집이 되었습니다."});
            } else {
                res.json({scheduleUpdate: false, message: "일정을 찾지못하였습니다."});
            }

        } catch (err) {
            return res.status(400).json({scheduleUpdate: false, err: err})
        }
    },
    findScheduleById: async (req, res) => {
        try {
            let findSchedule = await Schedule.findOne({_id: req.params.id})
                .populate('tagInfo')
                .exec();

            res.json({schedule: findSchedule, findScheduleSuccess: true})
        } catch (err) {
            console.log(err)
            res.status(400).json({findScheduleSuccess: false, err: err, message: "일정을 찾지 못하였습니다."})
        }
    },
    findScheduleByUserInfo: async (req, res) => {
        try {
            let findSchedules = await Schedule.find({userInfo: req.user._id})
                .populate("tagInfo")
                .exec();
            res.json({schedule: findSchedules, findScheduleSuccess: true, message: '일정을 찾았습니다.'})
        } catch (err) {
            console.log(err)
            res.status(400).json({findScheduleSuccess: false, err: err, message: "일정을 찾지 못하였습니다."})
        }
    },
    findScheduleDate: async (req, res) => {
        try {
            const date = new Date(req.body.year, req.body.month, req.body.day, 0,0,0)

            const startDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1,0 ,0 ,0)
            const endDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDay(),0 ,0 ,0)

            let schedules = await Schedule
                .find({$and: [{userInfo: req.user._id},
                        {'startDate':{$lt: startDateValue}},
                        {'endDate':{$gte: endDateValue}}]})
                .exec();

            res.json({schedule: schedules, findScheduleSuccess: true, message: '일정을 찾았습니다.'})
        } catch (err) {
            res.status(400).json({findScheduleSuccess: false, err: err, message: "일정을 찾지 못하였습니다."})
        }
    },
    deleteSchedule: async (req, res) => {
        try {
            let schedule = await Schedule.findOne({_id: req.params.id})
                .exec();

            await Schedule.deleteOne({_id: req.params.id});

            console.log(schedule)

            const log = {
                type: "일정",
                content: "삭제",
                beforeName: schedule.title,
                afterName: schedule.title,
                creator: req.user._id,
                userInfo: req.user._id
            }

            await LogController.saveLog(log)
            res.json({scheduleDelete: true, message: "일정 삭제를 완료하였습니다."})
        } catch (err) {
            return res.status(400).json({scheduleDelete: false, message: "일정 삭제를 실패하였습니다.", err: err})
        }
    },
    findScheduleCnt: async (req, res) => {
        try {
            let allScheduleTag = []
            let selectScheduleTag = []
            let schedules = await Schedule.find({userInfo: req.user._id})
                .populate("tagInfo")
                .exec();
            schedules.map((res) => {
                res.tagInfo.map((result) => {
                    allScheduleTag.push(result.content)

                    let tags = new Object();

                    let find = selectScheduleTag.find(v => v.content === result.content)
                    if (find === undefined) {
                        tags.id = result._id
                        tags.content = result.content;
                        tags.count = 1;

                        tags = JSON.stringify(tags)
                        selectScheduleTag.push(JSON.parse(tags))
                    } else {
                        find.count += 1;
                    }

                })
            })
            selectScheduleTag.sort((a, b) => {
                return a[1] - b[1];
            })
            console.log(selectScheduleTag)
            let scheduleCnt = await Schedule.find({userInfo: req.user._id}).count().exec();
            res.json({allScheduleTag: allScheduleTag, selectScheduleTag: selectScheduleTag, scheduleCnt: scheduleCnt, findScheduleSuccess: true})
        } catch (err) {
            console.log(err)
            return res.status(400).json({findScheduleSuccess: false, message: "총 일정 개수를 찾을 수 없습니다.", err: err})
        }
    },

    updateStatus: async (req, res) => {
        try {
            const findSchedule = await Schedule.findOne({_id: req.params.id})
                .exec();

            if (findSchedule) {

                let result = await Schedule.findOneAndUpdate({_id: req.params.id},
                    {
                        $set: {
                            status: req.body.status,
                        }
                    }, {new: true});

                const log = {
                    type: "일정",
                    content: "수정",
                    beforeName: findSchedule.title,
                    afterName: result.title,
                    creator: req.user._id,
                    userInfo: req.user._id
                }

                await LogController.saveLog(log);

                res.json({schedule: result, scheduleUpdate: true, message: "일정편집이 되었습니다."});
            } else {
                res.json({scheduleUpdate: false, message: "일정을 찾지못하였습니다."});
            }

        } catch (err) {
            console.log('err : ' + err)
            return res.status(400).json({scheduleUpdate: false, err: err})
        }
    },

}

module.exports = ScheduleController;