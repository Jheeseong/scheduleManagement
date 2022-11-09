const { Tag } = require('../models/Tag')
const { Schedule } = require('../models/Schedule')
const {throws} = require("assert");

const TagController = {
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
    findTag: async (req, res) => {
        try {
            let findTag = await Tag.find()
                .exec();

            res.json({tags: findTag})

        }catch (err) {
            res.json({message: "findTag err", err: err})
        }
    },
    findTagByContent: async (result) => {
        try {
            let tags = await Tag.findOne({content: result})
                .exec();
            return tags;
        } catch (err) {
            throw new Error(err)
        }
    },
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