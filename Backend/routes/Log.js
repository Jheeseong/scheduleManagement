/**
* 담당자 : 정희성
* 함수 내용 : 활동 로그 라우터
* 주요 기능 : 활동 로그를 찾는 controller와 url 연결
 *          checkLogin 함수를 통해 로그인 여부 판단 기능
 **/
const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const LogController = require('../controller/Log')

/* GET home page. */

router.post('/findLog/:page',checkLogIn, LogController.findMyLog);

module.exports = router;
