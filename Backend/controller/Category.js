const { Category } = require('../models/Category')
const TagController = require('../controller/Tag')
const LogController = require('../controller/Log')

const CategoryController = {
    saveCategory: async (req, res) => {
        try {
            const findTag = [];
            await Promise.all(req.body.tagName.map(async (result) => {
                findTag.push(await TagController.findTagByContent(result))
            }))
            console.log(req.body.userName)

            const category = new Category({
                title: req.body.title,
                creator: req.user._id,
                tagInfo: findTag,
                userInfo: req.body.userName
            })

            await category.save();

            req.body.userName.push(req.user._id)
            const log = {
                type: "카테고리",
                content: "생성",
                beforeName: req.body.title,
                afterName: req.body.title,
                creator: req.user._id,
                userInfo: req.body.userName
            }
            await LogController.saveLog(log)
            res.json({categorySuccess: true, message:"카테고리등록이 되었습니다."})
        } catch (err) {
            return res.status(400).json({categorySuccess: false, message:"카테고리등록에 실패하였습니다.", err: err})
        }
    },
    updateCategory: async (req, res) => {
        try {
          let findCategory = await Category.findOne({_id: req.params.id})
              .exec();
            if (findCategory) {
                const findTag = [];
                await Promise.all(req.body.tagName.map(async (result) => {
                    findTag.push(await TagController.findTagByContent(result))

                }))
                let shareUserName;
                if (req.body.userName === undefined) {
                    shareUserName = [];
                } else {
                    shareUserName = req.body.userName;
                }

                let result = await Category.findOneAndUpdate({_id: req.params.id},
                    {
                        $set: {
                            title: req.body.title,
                            creator: req.user._id,
                            tagInfo: findTag,
                            userInfo: shareUserName
                        }
                    }, {new: true});

                shareUserName.push(req.user._id)

                const log = {
                    type: "카테고리",
                    content: "수정",
                    beforeName: findCategory.title,
                    afterName: result.title,
                    creator: req.user._id,
                    userInfo: shareUserName
                }

                await LogController.saveLog(log)

                res.json({categoryUpdate: true, message: "카테고리편집이 되었습니다."});
            } else {
                res.json({categoryUpdate: false, message: "카테고리를 찾지봇하였습니다."})
            }
        } catch (err) {
            return res.status(400).json({categoryUpdate: false, message: "카테고리편집을 실패하였습니다.", err: err})
        }
    },
    deleteCategory: async (req, res) => {
      try {
          let category = await Category.findOne({_id: req.params.id})
              .exec();

          await Category.deleteOne({_id: req.params.id})

          const log = {
              type: "카테고리",
              content: "삭제",
              beforeName: category.title,
              afterName: category.title,
              creator: req.user._id,
              userInfo: category.userInfo
          }

        await LogController.saveLog(log)

        res.json({categoryDelete: true, message: "카테고리 삭제를 완료하였습니다."})
      } catch (err) {
          return res.status(400).json({categoryDelete: false, message: "카테고리 삭제를 실패하였습니다.", err: err})
      }
    },
    findCategoryById: async (req, res) => {
      try {
          let findCategory = await Category.findOne({_id: req.params.id})
              .populate("tagInfo")
              .populate("userInfo")
              .exec();
          res.json({category: findCategory, categoryFind: true, message: "카테고리를 찾았습니다."})
      } catch (err) {
          return res.status(400).json({categoryFind: false, message: "카테고리를 찾지 못하였습니다."})
      }
    },
    findMyCategory: async (req,res) => {
        try {
            let myCategories = await Category.find({creator: req.user._id})
                .exec();
            res.json({categories: myCategories, categoryFind: true, message: "카테고리를 찾았습니다."})
        } catch (err) {
            return res.status(400).json({categoryFind: false, message: "카테고리를 찾지 못하였습니다.", err: err})
        }
    },
    findShareCategory: async (req, res) => {
        try {
            let shareCategories = await Category.find({userInfo: req.user._id})
                .populate("creator")
                .populate({
                    path: "tagInfo",
                    populate: {path: "scheduleInfo"},
                })
                .exec();
            res.json({categories: shareCategories, categoryFind: true, message: "카테고리를 찾았습니다." })
        } catch (err) {
            console.log(err)
            return res.status(400).json({categoryFind: false, message: "카테고리를 찾지 못하였습니다.", err: err})
        }
    },
    findMyCategoryByCreator: async (req,res) => {
        try {
            let mySchedule = await Category.findOne({_id: req.body.id})
                .populate({
                    path: "tagInfo",
                    populate: {path: "scheduleInfo",
                                match: {userInfo: req.body.creator}}
                })
                .exec();

            let schedules = []
            mySchedule.tagInfo.map((res) => {
                res.scheduleInfo.map((result) => {
                    if (!schedules.includes(result)) {
                        schedules.push(result)
                    }
                })
            })

            res.json({schedules: schedules, category: mySchedule, scheduleFind: true, message: "일정을 찾았습니다."})
        } catch (err) {
            console.log(err)
            return res.status(400).json({scheduleFind: false, message: "스케줄을 찾지 못하였습니다.", err: err})
        }
    },
    findAllCategory: async (req, res) => {
        try {
            let categories = await Category.find({$or: [{userInfo: req.user._id}, {creator: req.user._id}]})
                /*.select("creator")*/
                /*.distinct('creator')*/
                .exec();

            let schedules = []

            let allCategory = []

            await Promise.all(categories.map(async (res) => {
                /*let colorCode = "#" + Math.round(Math.random() * 0xffffff).toString(16)
                res.color = colorCode*/
                let findCategory = await Category.findOne({_id: res._id})
                    .populate('creator')
                    .populate({
                        path: "tagInfo",
                        populate: { path: "scheduleInfo",
                            match: {userInfo: res.creator}}
                    })
                    .exec();
                allCategory.push(findCategory)
                let colorCode = "#" + Math.round(Math.random() * 0xffffff).toString(16)
                    findCategory.tagInfo.map((tag) => {
                        tag.scheduleInfo.map((result) => {
                            let schedule = result
                            schedule.color = colorCode
                            if (!schedules.includes(schedule)) {
                                schedules.push(schedule);
                            }
                        })
                    })
            }))
            allCategory.sort(function (a,b) {
                return(a.title < b.title) ? -1 : (a.title> b.title) ? 1: 0
            })
            res.json({schedules: schedules, categories: allCategory, scheduleFind: true, message: "일정을 찾았습니다."})
        } catch (err) {
            console.log(err)
        }
    },
    findCategoryDate: async (req, res) => {
        try{
            const date = new Date(req.body.year, req.body.month, req.body.day, 0,0,0)

            const startDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1,0 ,0 ,0)
            const endDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDay(),0 ,0 ,0)

            let mySchedule = await Category.findOne({_id: req.body.id})
                .populate({
                    path: "tagInfo",
                    populate: {path: "scheduleInfo",
                        match: {$and: [{userInfo: req.body.creator},
                                {'startDate':{$lt: startDateValue}},
                                {'endDate':{$gte: endDateValue}}]}}
                })
                .exec();

            let schedules = []
            mySchedule.tagInfo.map((res) => {
                res.scheduleInfo.map((result) => {
                    if (!schedules.includes(result)) {
                        schedules.push(result)
                    }
                })
            })

            res.json({schedules: schedules, category: mySchedule, scheduleFind: true, message: "일정을 찾았습니다."})
        } catch (err) {
            console.log(err)
        }
    },
    findTodayCategoryList: async (req, res) => {
        try {
            const date = new Date(req.body.year, req.body.month, req.body.day, 0,0,0)

            const startDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1,0 ,0 ,0)
            const endDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDay(),0 ,0 ,0)

            let todayCategory = []

            let shareCategories = await Category.find({userInfo: req.user._id})
                .exec();

            await Promise.all(shareCategories.map(async (shareCategory) => {
                let category = await Category.findOne({_id: shareCategory._id})
                    .populate('creator')
                    .populate({
                        path: 'tagInfo',
                        populate: {
                            path: 'scheduleInfo',
                            match: {
                                $and: [{userInfo: shareCategory.creator},
                                    {'startDate': {$lt: startDateValue}},
                                    {'endDate': {$gte: endDateValue}}]
                            }
                        }
                    })
                    .exec()

                category.tagInfo.map((tag) => {
                    if (tag.scheduleInfo.length != 0) {
                        todayCategory.push(category)
                        return;
                    }
                })
            }))


            res.json({categories: todayCategory, scheduleFind: true, message: "카테고리를 찾았습니다."})
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = CategoryController;