const http = require('http');
const url = require('url');
const { authorSelect } = require('./lib/template');
const topic = require("./lib/topic");
const author = require("./lib/author");
//----------------------------------------------------------------------------------------
/*
모든 node 웹 서버 Application은 웹 서버 객체를 만들어야 하는데.
이 때 createServer()를 사용한다.
*/
const app = http.createServer( (request, response) => {
    // 요청받은 url주소
    let _url = request.url;
    // 파라미터값 객체
    let queryData = url.parse(_url, true).query;
    // 경로
    let pathName = url.parse(_url, true).pathname;
    // 홈페이지로 들어온 경우
    if(pathName === "/"){
        // 글의  id값을 찾을 수 없는경우 홈페이지를 보여준다.
        if(queryData.id === undefined){
            topic.home(request, response);
        } else {
        //글의 id가 있는 경우 해당 id에 맞는 글의 내용을 보여준다.
           topic.page(request, response);
        }
    } else if(pathName === "/create"){
        //글 작성화면
       topic.create(request, response);
    } else if(pathName === "/create_process"){
        //글 작성 로직
        topic.create_process(request, response);
    } else if(pathName === "/update"){
        //업데이트 화면
        topic.update(request, response);
    } else if(pathName === "/update_process"){
        //업데이트 로직
        topic.update_process(request, response);
    } else if(pathName === "/delete_process"){
        topic.delete_process(request, response);
    } else if(pathName === "/author"){
        author.home(request, response);
    } else if(pathName === "/author/create_process"){
        author.create_process(request, response);
    } else if(pathName === "/author/update"){
        author.update(request, response);
    } else {
        //아무 링크도 찾지 못한 경우.
        response.writeHead(404);
        response.end("Not found");
    }
});

app.listen(8090);

//-------------------------------------------------------------------------------------------------------