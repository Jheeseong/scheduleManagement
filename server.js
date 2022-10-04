const express = require('express'); // express 임포트
const app = express(); // app생성
const port = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');

const config = require('./Backend/config/MongoDB/key');
const bodyParser = require("body-parser"); //body-parser 사용
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 로 된 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.json()); //application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 한다 -> json형식으로 파싱
app.use('/', express.static("./Frontend/public"))
app.use(cookieParser())

app.listen(port, () => console.log(`${port}포트입니다.`));

app.set('views', path.join('Frontend', 'views'));
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    dbName:'scheduleManagement',
    authMechanism:'DEFAULT',
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.log(err);
    });

const indexRouter = require('./Backend/routes/index');


app.use("/", indexRouter);
