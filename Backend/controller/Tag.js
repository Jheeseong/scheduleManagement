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
                console.log("Tag DB 저장 완료")
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
                console.log("스케줄인포:", res)
                await Tag.updateOne({_id: res}, {$pull : {scheduleInfo : scheduleId}});
            })

            console.log("Tag에 연결된 스케줄 끊기")
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
    }
}

module.exports = TagController