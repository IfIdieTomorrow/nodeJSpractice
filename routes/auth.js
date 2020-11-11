// 글 추가 화면
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const sanitizeHtml = require("sanitize-html");
const template = require('../lib/template');
const url = require("url");
const bodyParser = require("body-parser");
const session = require("express-session");
const { request } = require("express");

let authData = {
    email : "chuck46@naver.com",
    password : "january46",
    nickname : "egoing"
}

router.get("/login", (request, response)=>{
    let title = "Login";
    let list = template.list(request.list);
    let html = template.htmL(title, list, `
        <form action="/auth/login" method="post">
            <p>
                <input type="text" name="email" placeholder="email">
             </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit" value="login">
            </p>
        </form
    `,"");
    response.send(html);
});

router.post("/login", (request, response)=>{
    console.log(request.body);
    let email = request.body.email;
    let password = request.body.password;
    if(email === authData.email && password === authData.password){
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;
        request.session.save(()=>{
            response.redirect("/");
        });
    } else {
        response.send("Who?");
    }
    
});

router.get("/logout", (request, response)=>{
    request.session.destroy((err)=>{
        if(err) throw err;
        response.redirect('/');
    });
});

module.exports = router;


