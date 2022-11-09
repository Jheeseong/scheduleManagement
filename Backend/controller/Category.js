const { Category } = require('../models/Category')
const TagController = require('../controller/Tag')
const LogController = require('../controller/Log')

const CategoryController = {
    /**
    * 담당자 : 정희성
    * 함수 내용 : 카테고리를 저장하는 함수
    * 주요 기능 : request에서 받은 태그들의 정보를 map 메서드를 이용하여 각각의 정보를 얻어 category.tagInfo에 저장하는 기능
     *          request에서 받은 title, creator 정보와 공유한 유저 정보를 category안에 저장하는 기능
     *          입력받은 category 정보를  DB에 저장하는 기능
     *          저장 후 log에 category와 save한 정보를 저장하는 기능
    **/
    saveCategory: async (req, res) => {
        try {
            const findTag = [];
            /*request로 받은 tag 정보의 id 값을 얻어오는 기능*/
            await Promise.all(req.body.tagName.map(async (result) => {
                findTag.push(await TagController.findTagByContent(result))
            }))

            const category = new Category({
                title: req.body.title,
                creator: req.user._id,
                tagInfo: findTag,
                userInfo: req.body.userName
            })

            await category.save();

            /*공유 유저 list에 로그인 유저 정보도 push*/
            req.body.userName.push(req.user._id)
            const log = {
                type: "카테고리",
                content: "생성",
                beforeName: req.body.title,
                afterName: req.body.title,
                creator: req.user._id,
                userInfo: req.body.userName
            }
            /*log에 저장하여 기록*/
            await LogController.saveLog(log)
            res.json({categorySuccess: true, message:"카테고리등록이 되었습니다."})
        } catch (err) {
            return res.status(400).json({categorySuccess: false, message:"카테고리등록에 실패하였습니다.", err: err})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 카테고리를 수정하는 함수
    * 주요 기능 : request에서 받은 태그들의 정보를 map 메서드를 이용하여 각각의 정보를 얻어 category.tagInfo에 저장하는 기능
     *          request에서 받은 title, creator 정보와 공유한 유저 정보를 category안에 저장하는 기능
     *          입력받은 category 정보를  DB에 수정하는 기능
     *          저장 후 log에 category와 update한 정보를 저장하는 기능
    **/
    updateCategory: async (req, res) => {
        try {
          let findCategory = await Category.findOne({_id: req.params.id})
              .exec();
            if (findCategory) {
                const findTag = [];
                /*request로 받은 tag 정보의 id 값을 얻어오는 기능*/
                await Promise.all(req.body.tagName.map(async (result) => {
                    findTag.push(await TagController.findTagByContent(result))

                }))
                let shareUserName;
                /*공유 유저 정보가 없을 시 빈 값으로 지정*/
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

                /*공유 유저 list에 로그인 유저 정보도 push*/
                shareUserName.push(req.user._id)

                const log = {
                    type: "카테고리",
                    content: "수정",
                    beforeName: findCategory.title,
                    afterName: result.title,
                    creator: req.user._id,
                    userInfo: shareUserName
                }

                /*log에 저장하여 기록*/
                await LogController.saveLog(log)

                res.json({categoryUpdate: true, message: "카테고리편집이 되었습니다."});
            } else {
                res.json({categoryUpdate: false, message: "카테고리를 찾지봇하였습니다."})
            }
        } catch (err) {
            return res.status(400).json({categoryUpdate: false, message: "카테고리편집을 실패하였습니다.", err: err})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 카테고리를 삭제하는 함수
    * 주요 기능 :request 받은 category id를 찾아 DB에서 삭제하는 기능
     *          저장 후 log에 category와 delete한 정보를 저장하는 기
    **/
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : 조건에 맞는 카테고리 하나를 찾는 함수
    * 주요 기능 : request에서 받은 id로 카테고리를 찾는 기능
     *          맵핑된 tag와 user 정보를 함께 가져오는 기능
    **/
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : 내가 만든 카테고리들을 찾는 함수
    * 주요 기능 : request에서 받은 로그인 유저 정보를 통해 내가 만든 카테고리를 찾는 기능
    **/
    findMyCategory: async (req,res) => {
        try {
            let myCategories = await Category.find({creator: req.user._id})
                .exec();
            res.json({categories: myCategories, categoryFind: true, message: "카테고리를 찾았습니다."})
        } catch (err) {
            return res.status(400).json({categoryFind: false, message: "카테고리를 찾지 못하였습니다.", err: err})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 공유 받은 카테고리를 찾는 함수
    * 주요 기능 : request에서 받은 공유 유저 id를 통해 공유받은 카테고리를 찾는 기능
     *          맵핑되어 있는 tag와 그 안의 일정의 정보를 가져오는 기능
    **/
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : 내가 만든 카테고리 중 내가 만든 일정들과 함께 찾는 함수
    * 주요 기능 : request에서 받은 로그인 유저 정보로 나의 카테고리를 찾는 기능
     *          pupulate 매서드인 match를 통해 내가 만든 일정도 함께 찾는 기능
     *          찾은 일정들을 중복검사 하는 기능
    **/
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
            /*내가 만든 일정들을 중복검사하는 기능*/
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
    /**
    * 담당자 : 정희성
    * 함수 내용 : 내가 만든 카테고리 혹은 공유 받은 카테고리 전체를 불러오는 함수
    * 주요 기능 : - request에서 받은 로그인 유저 id 및 공유 유저 id를 통해
     *          내가 만들거나 혹은 공유 받은 카테고리를 불러오는 기능
     *          - 내가 만든 카테고리 혹은 공유 받은 카테고리에 매핑되어 있는 일정들을 불러오는 기능
     *          - 일정들을 중복체크 하는 기능
     *          - 카테고리들을 이름 기준으로 정렬하는 기능
    **/
    findAllCategory: async (req, res) => {
        try {
            let categories = await Category.find({$or: [{userInfo: req.user._id}, {creator: req.user._id}]})
                /*.select("creator")*/
                /*.distinct('creator')*/
                .exec();

            let schedules = []

            let allCategory = []

            /*찾은 카테고리 안에 포함된 일정들을 불러오는 기능*/
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
                /*let colorCode = "#" + Math.round(Math.random() * 0xffffff).toString(16)*/
                    findCategory.tagInfo.map((tag) => {
                        tag.scheduleInfo.map((result) => {
                            let schedule = result
                            schedules.push(schedule)
                            /*if (!schedules.includes(schedule)) {
                                schedules.push(schedule);
                            }*/
                        })
                    })
            }))

            /*불러온 일정들을 중복체크*/
            const filteredArr = schedules.reduce((acc, current) => {
                const x = acc.find(item => item.id === current.id);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);

            /*카테고리들을 이름 순으로 정렬*/
            allCategory.sort(function (a,b) {
                return(a.title < b.title) ? -1 : (a.title> b.title) ? 1: 0
            })
            res.json({schedules: filteredArr, categories: allCategory, scheduleFind: true, message: "일정을 찾았습니다."})
        } catch (err) {
            console.log(err)
            return res.status(400).json({scheduleFind: false, message: "스케줄을 찾지 못하였습니다.", err: err})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 카테고리 중 오늘 일정을 가져오는 함수
    * 주요 기능 : request로 받은 공유 유저 id를 통해 공유 카테고리를 찾는 기능
     *          $lt $gte를 통해 오늘 일정을 불러오는 기능
     *          중복 체크 해주는 기능
    **/
    findCategoryDate: async (req, res) => {
        try{
            let date = new Date()

            /*오늘 일정에 포함 되었는지 비교해주는 변수들*/
            const endDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDate(),9 ,0,0).toISOString()
            const startDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1,9,0,0).toISOString()

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
            /*중복 검사*/
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
            return res.status(400).json({categoryFind: false, message: "카테고리를 찾지 못하였습니다.", err: err})
        }
    },
    /**
    * 담당자 : 정희성
    * 함수 내용 : 공유받은 카테고리 중 오늘 일정이 포함되어 있는 카테고리리스트를 불러오는 함수
    * 주요 기능 : request로 받은 공유 유저 id를 통해 공유 카테고리를 찾는 기능
     *          $lt $gte를 통해 오늘 일정이 포함된 카테고리를 불러오는 기능
     *          중복 체크 해주는 기능
    **/
    findTodayCategoryList: async (req, res) => {
        try {
            const date = new Date()

            const endDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDate(),9 ,0,0).toISOString()
            const startDateValue = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1,9,0,0).toISOString()

            let todayCategory = []

            let shareCategories = await Category.find({userInfo: req.user._id})
                .exec();
            /*공유받은 카테고리 중 오늘 일정이 포함되어있는 카테고리를 불러오는 기능*/
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

                /*오늘 일정이 없는 카테고리는 제거*/
                category.tagInfo.map((tag) => {
                    if (tag.scheduleInfo.length != 0) {
                        todayCategory.push(category)
                    }
                })
            }))
            /*중복 검사*/
            const filteredArr = todayCategory.reduce((acc, current) => {
                const x = acc.find(item => item.id === current.id);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);


            res.json({categories: filteredArr, scheduleFind: true, message: "카테고리를 찾았습니다."})
        } catch (err) {
            console.log(err)
            return res.status(400).json({categoryFind: false, message: "카테고리를 찾지 못하였습니다.", err: err})
        }
    }
}

module.exports = CategoryController;