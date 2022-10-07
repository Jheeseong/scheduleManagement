const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const scheduleController = require('../controller/Schedule')

/* GET home page. */
router.post('/create'/*,checkLogIn*/, scheduleController.saveSchedule);

router.post('/update/:id'/*,checkLogIn*/, scheduleController.updateSchedule);

router.post('/delete/:id', scheduleController.deleteSchedule);

module.exports = router;