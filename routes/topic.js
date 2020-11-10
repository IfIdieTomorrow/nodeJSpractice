// 글 추가 화면
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");
const template = require('../lib/template');
const url = require("url");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({extended:false}));

router.get("/create", (request, response)=>{
    let title = "WEB - CREATE";
    let list = template.list(request.list);
    let html = template.htmL(title, list, `
        <form action="/topic/create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form
    `,"");
    response.send(html);
});

// 글 추가하기
router.post("/create", (request, response)=>{
    let title = request.body.title;
    let description = request.body.description;
    fs.writeFile(`data/${title}`,description, (err)=>{
        if(err) throw err;
        //Express에서 Redirect 하는 방법
        response.redirect(url.format({
            pathname : `/topic/${title}`,
            query : request.query
        }));
    });
});

// 글 수정 화면
router.get("/update/:pageId", (request, response)=>{
    let filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, 'utf-8', (err, description)=>{
        if(err) throw err;
        let title = request.params.pageId;
        let sanitizedTitle = sanitizeHtml(title);
        let sanitizedDescription = sanitizeHtml(description);
        let list = template.list(request.list);
        let html = template.htmL(sanitizedTitle, list,
            `<form action="/topic/update" method="post">
                <input type="hidden" value="${title}" name="id">
                <p>
                    <input type="text" name="title" placeholder="title" value=${sanitizedTitle}></p>
                <p>
                    <textarea name="description" placeholder="description">${sanitizedDescription}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form`,
            `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>
            `);
        response.send(html);
    });
});

// 글 수정하기
router.post("/update", (request, response)=>{
    const id = request.body.id;
    const title = request.body.title;
    const description = request.body.description;
    //파일의 이름 변경. 첫 번째 인자값은 원래이름 ,두 번째는 새로운 이름, 세 번째는 callback
    fs.rename("data/"+id, "data/"+title, (err)=>{
        if(err) throw err;
        fs.writeFile("data/"+title, description, (err2)=>{
            if(err2) throw err2;
            response.redirect(url.format({
                pathname : `/topic/${title}`,
                query : request.query
            }));
        });
    });
});

// 글 삭제
router.post("/delete", (request, response)=>{
    const id = request.body.id;
    fs.unlink(`data/${id}`, (err)=>{
        if(err) throw err;
        response.redirect(url.format({
            pathname : "/",
            query : request.query
        }));
    });
});




// :페이지명 을쓰면 :뒤에 오는 문자열이 변수명이 되고 입력받은 값이 값으로 들어간다.
// ex) /page/:HTML = {"pageId":"HTML"} request.params으로 값을 가져올 수 있다.
// 글 상세보기
router.get("/:pageId", (request, response, next)=>{
    let filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, 'utf-8', (err, description)=>{
        if(err) {
            next(err);
        } else {
            let title = request.params.pageId;
            let sanitizedTitle = sanitizeHtml(title);
            let sanitizedDescription = sanitizeHtml(description,{
                allowedTags : ["h1"]
            });
            let list = template.list(request.list);
            let html = template.htmL(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                `<a href="/topic/create">create</a> 
                <a href="/topic/update/${sanitizedTitle}">update</a>
                <form action="/topic/delete" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete" style='border : none; background : #fff;'>
                </form>
            `);
            response.send(html);
        } 
    });
});

module.exports = router;


