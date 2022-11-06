const express = require('express');
const router = express.Router();
const checkLogIn = require('../config/passport/Middleware').checkLogIn
const memoController = require("../controller/memo")

router.post('/findMemoList', checkLogIn, memoController.findMemoList)

router.post('/saveMemo', checkLogIn, memoController.saveMemo)

router.post('/findMemoDetail/:id', checkLogIn, memoController.findMemoDetail)

router.post('/updateMemo/:id', checkLogIn, memoController.updateMemo)

router.post('/deleteMemo/:id', checkLogIn, memoController.deleteMemo)

module.exports = router;