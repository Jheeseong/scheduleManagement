/**
* 담당자 : 정희성
* 함수 내용 : 태그 라우터
* 주요 기능 : 태그 controller 기능과 url 연결해주는 기능
 *          checkLogin 함수를 통해 로그인 여부 판단 기능
**/
const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const scheduleController = require('../controller/Schedule')
const tagController = require('../controller/Tag')

/* GET home page. */

router.post('/create',checkLogIn, scheduleController.saveSchedule);

router.post('/update/:id', scheduleController.updateSchedule);

router.post('/delete/:id',checkLogIn, scheduleController.deleteSchedule);

router.post('/find/:id',checkLogIn, scheduleController.findScheduleById);

router.post('/tagsearch',checkLogIn, tagController.findTag);

router.post('/findByUser', checkLogIn, scheduleController.findScheduleByUserInfo);

router.post('/findCnt', checkLogIn, scheduleController.findScheduleCnt);

router.post('/findTag/:id', checkLogIn, tagController.findTagById)

router.post('/findTagByContent', checkLogIn, tagController.findTagScheduleByContent)

router.post('/findEtcTag', checkLogIn, tagController.findEtcTagScheduleByContent)

router.post('/updateStatus/:id', checkLogIn, scheduleController.updateStatus)

router.post('/findDate', checkLogIn, scheduleController.findScheduleDate)

module.exports = router;