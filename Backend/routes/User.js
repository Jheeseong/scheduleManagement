const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const menuColor = require("../controller/User/menuColor");
const userController = require("../controller/User/User")
const memoController = require("../controller/Memo")

router.post('/menuColor', checkLogIn, menuColor.changeMenuColor)

router.post('/navSize', checkLogIn, userController.saveNavSize)

router.post('/findAll', checkLogIn, userController.findAllUser)

router.post('/find/:keyword', checkLogIn, userController.findUserByName)

router.post('/findById/:id', checkLogIn, userController.findUserById)


module.exports = router;