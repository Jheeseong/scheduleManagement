const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const menuColor = require("../controller/User/menuColor");
const userController = require("../controller/User/User")

router.post('/menuColor', menuColor.changeMenuColor)

router.post('/findAll', userController.findAllUser)

router.post('/find/:keyword', userController.findUserByName)

module.exports = router;