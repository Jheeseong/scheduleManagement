const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const scheduleController = require('../controller/Schedule')
const tagController = require('../controller/Tag')

/* GET home page. */

router.post('/create',checkLogIn, scheduleController.saveSchedule);

router.post('/update/:id',checkLogIn, scheduleController.updateSchedule);

router.post('/delete/:id',checkLogIn, scheduleController.deleteSchedule);

router.post('/find/:id',checkLogIn, scheduleController.findScheduleById);

router.post('/tagsearch',checkLogIn, tagController.findTag);

router.post('/findByUser', checkLogIn, scheduleController.findScheduleByUserInfo);

module.exports = router;