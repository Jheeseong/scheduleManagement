const { Schedule } = require('../models/Schedule')
const TagController = require('../controller/Tag')
const LogController = require('../controller/Log')

const ScheduleController = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : 스케줄을 DB에 저장해주는 함수
    * 주요 기능 : request에서 받은 일정 정보를 저장하는 기능
     *          request에 담긴 태그를 함께 저장하는 기능
     *          태그를 스케줄에 맵핑해주는 기능
     *          일정 생성 시 활동 로그에 저장하는 기능
    **/
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
            /*입력받는 태그를 저장*/
            await Promise.all(req.body.tagInfo.map(async (result) => {
                let tags = await TagController.saveTag(result, schedule._id);
                if (tags.tagSuccess === false) {
                    throw Error;
                }
                /*스케줄스키마에 태그를 맵핑*/
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : 스케줄을 변경해주는 함수
    * 주요 기능 : request에서 받은 스케줄 id를 통해 해당 일정을 불러오는 기능
     *          일정에 연결되어 있는 태그 정보를 끊어주는 기능
     *          새로운 태그를 자동 저장하고 새로 매핑해주는 기능
     *          스케줄 변경 로그를 저장하는 기능
    **/
    updateSchedule: async (req, res) => {
        try {
            const findSchedule = await Schedule.findOne({_id: req.params.id})
                .exec();

            if (findSchedule) {
                /*기존의 연결된 태그의 매핑을 끊어줌*/
                await TagController.disconnectSchedule(findSchedule.tagInfo, findSchedule._id);
                /*새로운 태그들을 연결*/
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
                            status: req.body.status,
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : id를 통해 일정을 찾는 함수
    * 주요 기능 : id를 통해 일정을 찾고 매핑되어 있는 tag와 user 정보를 가져오는 기능
    **/
    findScheduleById: async (req, res) => {
        try {
            let findSchedule = await Schedule.findOne({_id: req.params.id})
                .populate('tagInfo')
                .populate('userInfo')
                .exec();

            res.json({schedule: findSchedule, findScheduleSuccess: true})
        } catch (err) {
            console.log(err)
            res.status(400).json({findScheduleSuccess: false, err: err, message: "일정을 찾지 못하였습니다."})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 내가 만든 일정을 찾는 함수
    * 주요 기능 : 내가 만든 일정을 찾고 매핑되어 있는 tag 정보를 함께 불러오는 기능
    **/
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : 내가 만든 일정 중 오늘이 포함된 일정을 불러오는 함수
    * 주요 기능 : 내가 만든 일정을 찾는 기능
     *          그 일정 중 오늘이 포함된 일정리스트를 불러오는 기능
    **/
    findScheduleDate: async (req, res) => {
        try {
            let date = new Date()
            /*오늘 일정을 찾기 위한 변수*/
            const endDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDate(),9 ,0,0).toISOString()
            const startDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1,9,0,0).toISOString()

            let schedules = await Schedule
                .find({$and: [{userInfo: req.user._id},
                        {'startDate':{$lt: startDateValue}},
                        {'endDate':{$gte: endDateValue}}]})
                .exec();

            res.json({schedule: schedules, findScheduleSuccess: true, message: '일정을 찾았습니다.'})
        } catch (err) {
            console.log(err)
            res.status(400).json({findScheduleSuccess: false, err: err, message: "일정을 찾지 못하였습니다."})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 해당 일정을 삭제하는 함수
    * 주요 기능 : 해당 일정을 삭제해주는 기능
     *          일정 삭제 로그를 저장하는 기능
    **/
    deleteSchedule: async (req, res) => {
        try {
            let schedule = await Schedule.findOne({_id: req.params.id})
                .exec();

            await Schedule.deleteOne({_id: req.params.id});


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
    /**
    * 담당자 : 정희성
    * 함수 내용 : 내가 만든 일정과 그 일정의 태그 갯수를 보여주는 함수
    * 주요 기능 : 내가 만든 일정을 찾는 기능
     *          그 일정에 포함되어 있는 태그 갯수를 보여주는 기능
     *          태그 갯수가 많은 순으로 정렬
    **/
    findScheduleCnt: async (req, res) => {
        try {
            let allScheduleTag = []
            let selectScheduleTag = []
            let schedules = await Schedule.find({userInfo: req.user._id})
                .populate("tagInfo")
                .exec();
            /*일정에 포함되어 있는 태그 검색*/
            schedules.map((res) => {
                res.tagInfo.map((result) => {
                    allScheduleTag.push(result.content)

                    let tags = new Object();
                    /*태그를 배열에 담아 카운트체크*/
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
            /*태그를 갯수 별로 정렬*/
            selectScheduleTag.sort((a, b) => {
                return b.count - a.count;
            })

            let scheduleCnt = await Schedule.find({userInfo: req.user._id}).count().exec();
            res.json({allScheduleTag: allScheduleTag, selectScheduleTag: selectScheduleTag, scheduleCnt: scheduleCnt, findScheduleSuccess: true})
        } catch (err) {
            console.log(err)
            return res.status(400).json({findScheduleSuccess: false, message: "총 일정 개수를 찾을 수 없습니다.", err: err})
        }
    },
    /**
    * 담당자 : 배도훈
    * 함수 내용 : 일정 상태 수정 함수
    * 주요 기능 : 일정 id로 일정을 찾아 상태를 수정
    **/
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