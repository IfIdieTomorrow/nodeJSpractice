// 모듈을 불러오는 방법
const http = require('http');
const fs = require('fs');
const url = require('url');

let app = http.createServer((request, response) => {
    // 요청받은 url주소
    let _url = request.url;
    // 파라미터값 객체
    let queryData = url.parse(_url, true).query;
    // 경로
    let pathName = url.parse(_url, true).pathname;

    templateHTML = (title, list, body) =>{
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${body}
        </body>
        </html>
        `;
    }

    templateList = (result)=>{
        let list = '<ul>';
            for(let val of result){
                list += `<li><a href="/?id=${val}">${val}</a></li>`
            }
            list += '</ul>';
        return list;
    }
    
    if(pathName === "/"){
        if(queryData.id === undefined){
            //readFile메서드는 첫 번째 인자값으로 파일의 경로, 인코딩 타입을 받고.
            //콜백함수로는 에러의 타입과 파일의 값을 받아온다.
            fs.readdir("./data/",(err, result)=>{
                let title = "Welcome";
                let description = "Hello, Node.js";
                let list = templateList(result);
                let template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                response.writeHead(200);
                response.end(template);
            });
        } else {
            fs.readdir("./data/",(err, result)=>{
                fs.readFile(`./data/${queryData.id}`, 'utf-8', (err, description)=>{
                    // 파라미터 이름이 id인 파라미터 값
                    let title = queryData.id;
                    let list = templateList(result);
                    let template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    } else {
        response.writeHead(404);
        response.end("Not found");
    }
});

app.listen(8090);