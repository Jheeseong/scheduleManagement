const { Category } = require('../models/Category')
const { Schedule } = require("../models/Schedule");
const TagController = require('../controller/Tag')

const CategoryController = {
    saveCategory: async (req, res) => {
        try {
            const findTag = [];
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

            res.json({categorySuccess: true, message:"카테고리등록이 되었습니다."})
        } catch (err) {
            return res.status(400).json({categorySuccess: false, message:"카테고리등록에 실패하였습니다.", err: err})
        }
    },
    updateCategory: async (req, res) => {
        try {
          let findCategory = Category.findOne({_id: req.params.id})
              .exec();
            if (findCategory) {
                await Schedule.updateOne({_id: req.params.id},
                    {
                        $set: {
                            title: req.body.title,
                            tagInfo: req.body.tagInfo,
                            userInfo: req.body.userInfo
                        }
                    });
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
        await Category.deleteOne({_id: req.params.id});
        res.json({categoryDelete: true, message: "카테고리 삭제를 완료하였습니다."})
      } catch (err) {
          return res.status(400).json({categoryDelete: false, message: "카테고리 삭제를 실패하였습니다.", err: err})
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
    }
}

module.exports = CategoryController;