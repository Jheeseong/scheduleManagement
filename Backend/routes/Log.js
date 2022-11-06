const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const LogController = require('../controller/Log')

/* GET home page. */

router.post('/findLog/:page',checkLogIn, LogController.findMyLog);

module.exports = router;
