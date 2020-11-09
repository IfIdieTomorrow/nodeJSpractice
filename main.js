// 모듈을 불러오는 방법
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
// 페이지를 나타낼 템플릿이 들어있는 모듈
const template = require('./lib/template.js');
const path = require('path');
// 오염된 값을 소독해주는 기능을 제공하는 모듈
const sanitizeHtml = require('sanitize-html');
// mysql과  node.js를 연동해주는 모듈
const mysql = require("mysql");
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "sqladmin",
    database : "node_tutorial"
});
db.connect();


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
            //readFile메서드는 첫 번째 인자값으로 파일의 경로, 인코딩 타입을 받고.
            //콜백함수로는 에러의 타입과 파일의 값을 받아온다.
            fs.readdir("./data/",(err, result)=>{
                let title = "Welcome";
                let description = "Hello, Node.js";
                let list = template.list(result);
                let html = template.htmL(title, list, 
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>`);
                // response.writeHead()메서드는 인자값로 http 상태코드를 전달하여야 하고.
                // response.end()메서드는 인자값으로 웹에 표현할 값을 전달한다.
                response.writeHead(200);
                response.end(html);
            });
        } else {
        //글의 id가 있는 경우 해당 id에 맞는 글의 내용을 보여준다.
            fs.readdir("./data/",(err, result)=>{
                let filteredId = path.parse(queryData.id).base;
                fs.readFile(`./data/${filteredId}`, 'utf-8', (err, description)=>{
                    // 파라미터 이름이 id인 파라미터 값
                    let title = queryData.id;
                    let sanitizedTitle = sanitizeHtml(title);
                    //sanitizedHtml메서드는 인자값으로 받은 값을 소독해주고,
                    //두번째 인자값으로는 옵션이 들어간다. allowedTags같은 경우는 허용해주는 태그를 지정한다.
                    let sanitizedDescription = sanitizeHtml(description,{
                        allowedTags : ["h1"]
                    });
                    let list = template.list(result);
                    let html = template.htmL(title, list,
                        `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                        `<a href="/create">create</a> 
                        <a href="/update?id=${sanitizedTitle}">update</a>
                        <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete" style='border : none; background : #fff;'>
                        </form>
                        `);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if(pathName === "/create"){
        //글 작성화면
        fs.readdir("./data/",(err, result)=>{
            let title = "WEB - CREATE";
            let list = template.list(result);
            let html = template.htmL(title, list, `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form
            `,"");
            // response.writeHead()메서드는 인자값로 http 상태코드를 전달하여야 하고.
            // response.end()메서드는 인자값으로 웹에 표현할 값을 전달한다.
            response.writeHead(200);
            response.end(html);
        });
    } else if(pathName === "/create_process"){
        //POST방식으로 전달된 데이터를 받아서 새로운 파일을 생성하고 내용을 추가하는 방법.
        //POST방식으로 전송된 데이터를 가져오는 방법
        let body = "";
        request.on('data', (data) =>{
            body += data;
        });
        request.on('end',()=>{
            let post = qs.parse(body);
            let title = post.title;
            let description = post.description;
            fs.writeFile(`data/${title}`,description, (err)=>{
                if(err) throw err;
                console.log("파일 저장 성공.")
                //리다이렉션 하는 방법
                //상태코드 302는 페이지를 딴 곳으로 이동시키겠다는 표현
                response.writeHead(302,
                    {Location : "/?id="+title});
                response.end();
            });
        });
    } else if(pathName === "/update"){
        //글 수정 화면
        fs.readdir("./data/",(err, result)=>{
            let filteredId = path.parse(queryData.id).base;
            fs.readFile(`./data/${filteredId}`, 'utf-8', (err, description)=>{
                // 파라미터 이름이 id인 파라미터 값
                let title = queryData.id;
                let list = template.list(result);
                let html = template.htmL(title, list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" value="${title}" name="id">
                        <p><input type="text" name="title" placeholder="title" value=${title}></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if(pathName === "/update_process"){
        //POST로 전달된 데이터를 받아서 파일 이름과 내용을 수정
        let body = "";
        request.on("data", (data) => {
            body += data;
        });
        request.on("end", () => {
            let post = qs.parse(body);
            let id = post.id;
            let title = post.title;
            let description = post.description;
            //파일의 이름 변경. 첫 번째 인자값은 원래이름 ,두 번째는 새로운 이름, 세 번째는 callback
            fs.rename("data/"+id, "data/"+title, (err)=>{
                if(err) throw err;
                fs.writeFile("data/"+title, description, (err)=>{
                    response.writeHead(302,
                        {Location : "/?id="+title}
                    );
                    response.end();
                });
            });
        });
    } else if(pathName === "/delete_process"){
        //글 삭제 로직
        let body = "";
        request.on("data", (data)=>{
            body += data;
        });
        request.on("end", ()=>{
            let post = qs.parse(body);
            let id = post.id;
            let filteredId = path.parse(id).base;
            fs.unlink("data/"+filteredId, (err)=>{
                response.writeHead(302,{
                    Location : "/"
                });
                response.end();
            });
        });
    } else {
        //아무 링크도 찾지 못한 경우.
        response.writeHead(404);
        response.end("Not found");
    }
});

app.listen(8090);