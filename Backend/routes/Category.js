/**
* 담당자 : 정희성
* 함수 내용 : 카테고리 라우터
* 주요 기능 : 카테고리 controller 기능과 url 연결 기능
 *          checkLogin 함수를 통해 로그인 여부 판단 기능
**/
const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const categoryController = require('../controller/Category')

router.post('/create', checkLogIn, categoryController.saveCategory)

router.post('/update/:id', checkLogIn, categoryController.updateCategory)

router.post('/delete/:id', checkLogIn, categoryController.deleteCategory)

router.post('/myCategory', checkLogIn, categoryController.findMyCategory)

router.post('/shareCategory', checkLogIn, categoryController.findShareCategory)

router.post('/findById/:id', checkLogIn, categoryController.findCategoryById)

router.post('/myCategory/mySchedule', checkLogIn, categoryController.findMyCategoryByCreator)

router.post('/findAllCategory', checkLogIn, categoryController.findAllCategory)

router.post('/findDate', checkLogIn, categoryController.findCategoryDate)

router.post('/find/todayCategoryList', checkLogIn, categoryController.findTodayCategoryList)

module.exports = router;