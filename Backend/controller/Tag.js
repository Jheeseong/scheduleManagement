const { Tag } = require('../models/Tag')
const { Schedule } = require('../models/Schedule')
const {throws} = require("assert");

const TagController = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : 태그를 저장하는 함수
    * 주요 기능 : 중복되는 태그가 없을 시 저장하는 기능
     *          중복되는 태그 존재 시 받아온 스케줄을 매핑
    **/
    saveTag: async (result,scheduleId) => {
        try{
            let tag = new Tag({content: result, scheduleInfo: scheduleId})
            const TagInfo = await Tag.findOne({content: result})
                .exec();
            if (!TagInfo) {
                await tag.save()
                return tag;
            }
            else {
                let result = Tag.findOneAndUpdate({_id: TagInfo._id}, {$push:{scheduleInfo: scheduleId}});
                return result;
            }}
        catch (err) {
            return {tagSuccess:false, err: err};
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 태그에 매핑되어 있는 일정을 끊어주는 함수
    * 주요 기능 : 태그에 매핑된 일정을 끊어주는 기능
    **/
    disconnectSchedule: async (tagId, scheduleId) => {
        try{
            tagId.map(async (res) => {
                await Tag.updateOne({_id: res}, {$pull : {scheduleInfo : scheduleId}});
            })
            }
        catch (err) {
            return {tagSuccess:false, err: err};
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 모든 태그를 찾는 함수
    * 주요 기능 : 태그 전체를 찾는 기능
    **/
    findTag: async (req, res) => {
        try {
            let findTag = await Tag.find()
                .exec();

            res.json({tags: findTag})

        }catch (err) {
            res.json({message: "findTag err", err: err})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 태그 이름을 통해 태그를 찾는 함수
    * 주요 기능 : request에서 받은 태그 이름을 통해 태그 정보를 찾는 기능
    **/
    findTagByContent: async (result) => {
        try {
            let tags = await Tag.findOne({content: result})
                .exec();
            return tags;
        } catch (err) {
            throw new Error(err)
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 해당 태그에 연결된 일정 중 로그인 유저가 만든 일정을 찾는 함수
    * 주요 기능 : 이름을 통해 태그를 찾는 기능
     *          태그에 연결된 일정 중 match를 통해 로그인 유저가 만든 일정을 찾는 기능
    **/
    findTagScheduleByContent: async (req, res) => {
        try {
            let tags = await Tag.findOne({content: req.body.content})
                .populate({
                    path: "scheduleInfo",
                    match: {userInfo: req.user._id}
                })
                .exec();
            res.json({selectTag: tags, findTagSuccess: true, message: "태그를 찾았습니다."});
        } catch (err) {
            console.log(err)
            res.status(400).json({findTagSuccess: false, message: "태그를 찾지 못하였습니다.", error: err})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 태그 통계 페이지에서 기타에 들어가 있는 태그 정보를 찾는 함수
    * 주요 기능 : 기타에 있는 태그의 이름을 통해 태그 정보를 찾는 기능
     *          태그에 매핑된 일정을 불러오는 기능
    **/
    findEtcTagScheduleByContent: async (req, res) => {
        let tagArr = []
        await Promise.all(req.body.content.map(async (tag) => {
            let tags = await Tag.findOne({content: tag})
                .populate({
                    path: "scheduleInfo",
                    match: {userInfo: req.user._id}
                })
                .exec();
            tagArr.push(tags)
        }))
        res.json({selectTag: tagArr, findTagSuccess: true, message: "태그를 찾았습니다."})

    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 태그 id를 통해 해당 태그를 찾는 함수
    * 주요 기능 : request의 params에 있는 id를 통해 태그의 정보를 찾는 기능
    **/
    findTagById: async (req, res) => {
        try {
             let findTag = await Tag.findOne({_id: req.params.id})
                 .populate({
                     path: "scheduleInfo",
                    match: {userInfo: req.user._id}})
                 .exec();
             res.json({selectTag: findTag, findTagSuccess: true, message: "태그를 찾았습니다."})
        } catch (err) {
            console.log(err)
            res.status(400).json({findTagSuccess: false, message: "태그를 찾지 못하였습니다.", error: err})
        }

    }
}

module.exports = TagController