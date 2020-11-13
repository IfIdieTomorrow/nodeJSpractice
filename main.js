const express = require('express')
const app = express()
const port = 8090
const fs = require("fs");
// 압축 모듈 npm install compression --save
const compression = require("compression");
// post데이터를 쉽게 변환해주는 모듈 npm install body-parser --save 
// 보안 모듈
const helmet = require("helmet");
const bodyParser = require('body-parser');
// 세션
const session = require("express-session");
// passport.js
const flash = require("connect-flash");
app.use(flash());

//public폴더 안에서 static파일을 찾겠다.
app.use(express.static('public'));
//post데이터
app.use(bodyParser.urlencoded({extended : false}));
//업츅 미들웨어
app.use(compression());
//보안 미들웨어
app.use(helmet());
//세션 미들웨어
app.use(session({
    secret : "sadfsdaflkjsl@#21",
    resave : false,
    saveUninitialized : true,
    cookie : {
        secure : false
    }
}));

//---------------------------------------------------------------------------------------------------------------------
const passport = require("./lib/passport")(app);
//--------------------------------------------------------------------------------------------------------------

// 파일 목록을 띄워주는 직접 작성한 미들웨어, get방식으로 요청하는 모든 요청에대해서만
// 파일 목록을 제공해주겠다.
app.get('*',(request, response, next)=>{
    fs.readdir("./data", (err, fileList)=>{
        if(err) throw err;
        request.list = fileList;
        next();
    });
});

// router's
const topicRouter = require("./routes/topic");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth")(passport);

// 라우터
app.use("/", indexRouter);
// /topic으로 시작하는 주소에 topicRouter라는 미들웨어를 적용하겠다.
// topicRouter 모듈에 담겨있는 주소에 /topic을 추가해준다.
app.use('/topic', topicRouter);
app.use('/auth',authRouter);

app.use((request, response, next)=>{
    response.status(404).send('Sorry cant find that!');
});

app.use((err, request, response, next)=>{
    console.error(err.stack);
    response.status(500).send("Something broke");
});

//listen이라는 함수가 실행될때 웹서버가 시작이 되며, 1번째 인자로 포트번호를 받고,
//두번째는 웹서버 실행시 실행될 callback함수를 받는다.
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
