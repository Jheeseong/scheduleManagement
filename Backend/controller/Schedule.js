const { Schedule } = require('../models/Schedule')
const { Tag } = require('../models/Tag')
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
            if (findSchedule) {
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
    deleteSchedule: async (req, res) => {
        try {
            console.log(req.params.id)
            await Schedule.deleteOne({_id: req.params.id});
            res.json({scheduleDelete: true, message: "일정삭제를 완료하였습니다."})
        } catch (err) {
            return res.status(400).json({scheduleDelete: false, err: err})
        }
    }
}

module.exports = ScheduleController