const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const menuColor = require("../controller/User/menuColor");

router.post('/menuColor', menuColor.changeMenuColor)

module.exports = router;