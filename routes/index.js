const express = require("express");
const router = express.Router();
const template = require("../lib/template");
const auth = require("../lib/auth");


//1번째 인자로 경로를 받으며 2번째 인자값은 1번째 인자값으로 받은 경로로 요청이 들어왔을때
//실행되는 callback함수
//홈페이지
router.get('/', (request, response) => {
    let title = "Welcome";
    let description = "Hello, Node.js";
    let list = template.list(request.list);
    let html = template.htmL(title, list, 
        `
        <h2>${title}</h2><p>${description}</p>
        <img src="/images/hello.jpg" style="width: 500px; display:blick; margin-top : 10px;">
        `,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(request, response));
        response.send(html);
})

module.exports = router;