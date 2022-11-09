/**
* 담당자 : 정희성, 배도훈
* 함수 내용 : 유저 라우터
* 주요 기능 : 유저 controller 함수와 url 연결하는 기능
 *          checkLogin 함수를 통해 로그인 여부 판단 기능
**/
const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const menuColor = require("../controller/User/menuColor");
const userController = require("../controller/User/User")

router.post('/menuColor', checkLogIn, menuColor.changeMenuColor)

router.post('/navSize', checkLogIn, userController.saveNavSize)

router.post('/findAll', checkLogIn, userController.findAllUser)

router.post('/find/:keyword', checkLogIn, userController.findUserByName)

router.post('/findById/:id', checkLogIn, userController.findUserById)


module.exports = router;