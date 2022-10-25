const { Schedule } = require('../models/Schedule')
const TagController = require('../controller/Tag')

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
            res.json({scheduleSuccess: true, message: "일정등록이 되었습니다."});
        } catch (err) {
            return res.status(400).json({scheduleSuccess: false, message:"일정등록이 실패하였습니다.",err: err})
        }
    },
    updateSchedule: async (req, res) => {
        try {
            const findSchedule = await Schedule.findOne({_id: req.params.id})
                .exec();
            console.log(findSchedule);
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

                await Schedule.updateOne({_id: req.params.id},
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
                    });
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
                .exec();
            res.json({schedule: findSchedules, findScheduleSuccess: true, message: '일정을 찾았습니다.'})
        } catch (err) {
            console.log(err)
            res.status(400).json({findScheduleSuccess: false, err: err, message: "일정을 찾지 못하였습니다."})
        }
    },
    deleteSchedule: async (req, res) => {
        try {
            await Schedule.deleteOne({_id: req.params.id});
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
                        tags.content = result.content;
                        tags.count = 1;

                        tags = JSON.stringify(tags)
                        selectScheduleTag.push(JSON.parse(tags))
                    } else {
                        find.count += 1;
                    }
                })
            })
            console.log(selectScheduleTag)
            let scheduleCnt = await Schedule.find({userInfo: req.user._id}).count().exec();
            res.json({allScheduleTag: allScheduleTag, selectScheduleTag: selectScheduleTag, findScheduleSuccess: true})
        } catch (err) {
            console.log(err)
            return res.status(400).json({findScheduleSuccess: false, message: "총 일정 개수를 찾을 수 없습니다.", err: err})
        }
    },

}

module.exports = ScheduleController;