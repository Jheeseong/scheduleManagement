/**
* 담당자 : 정희성, 배도훈
* 파일 내용 : 서버를 싱행시켜주는 파일
* 주요 기능 : express를 통해 서버를 실행시켜주는 기능
**/
const express = require('express'); // express 임포트
const app = express(); // app생성
const port = 3000;
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./Backend/config/MongoDB/key');
const bodyParser = require("body-parser"); //body-parser 사용
const session = require('express-session')

app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded 로 된 데이터를 분석해서 가져올 수 있게 한다
app.use(bodyParser.json()); //application/json 타입으로 된 데이터를 분석해서 가져올 수 있게 한다 -> json형식으로 파싱
app.use('/', express.static("./Frontend/public"))
app.use(cookieParser())

/**
* 담당자 : 정희성
* 함수 내용 : 세션 정보 설정해주는 함수
* 주요 기능 : 로그인 유저 정보를 session MySecret123에 저장하는 기능
**/
app.use(session({
    secret:'MySecret123',
    resave: false,
    saveUninitialized:true}))

const passport = require('passport')

app.use(passport.initialize())
app.use(passport.session())

/**
* 담당자 : 정희성
* 함수 내용 :middleware를 통해 페이지 이동 떄 마다 serializeUser 메서드와 deserializeUser
 *          메서드가 항상 실행
* 주요 기능 : 해당 메서드를 매번 실행시켜주는 기능
**/
const middleware = require('./Backend/config/passport/Middleware')
middleware.serializeUser()
middleware.deserializeUser()
const APILogin = require('./Backend/config/passport/Passport')
APILogin.naver();
APILogin.kakao();

app.listen(port, () => console.log(`${port}포트입니다.`));

app.set('views', path.join('Frontend', 'views'));
app.set('view engine', 'ejs');

/**
* 담당자 : 정희성
* 함수 내용 : mongoose를 통해 해당 URI에 연결해주는 함수
* 주요 기능 : 해당 URI에 mongoose로 DB 연결하는 기능
**/
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    dbName:'scheduleManagement',
    authMechanism:'DEFAULT',
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.log(err);
    });

const indexRouter = require('./Backend/routes/index')
const loginRouter = require('./Backend/routes/login')
const scheduleRouter = require('./Backend/routes/Schedule')
const userRouter = require('./Backend/routes/User');
const categoryRouter = require('./Backend/routes/Category')
const logRouter = require('./Backend/routes/Log')
const memoRouter = require('./Backend/routes/Memo')

app.use("/", indexRouter);
app.use("/schedule", scheduleRouter);
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/log", logRouter);
app.use("/memo", memoRouter);

