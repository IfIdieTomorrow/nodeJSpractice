// 글 추가 화면
const express = require("express");
const router = express.Router();
const template = require('../lib/template');
const flash = require("connect-flash");
const db = require("../lib/db");
db.defaults({users : []}).write();
const shortid = require("shortid");

module.exports = function(passport){
    router.get("/login", (request, response)=>{
        let info = request.flash();
        let feedback = '';
        if(info.error){
            feedback = info.error[0];
        }
        let title = "Login";
        let list = template.list(request.list);
        let html = template.htmL(title, list, `
            <div style='color:red; '>${feedback}</div>
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
    
    router.post('/login', passport.authenticate('local', 
            {    
                successRedirect: '/',
                failureRedirect: '/auth/login',
                failureFlash : true,
                successFlash : true
            }
        )
    );
    
    router.get("/logout", (request, response)=>{
        request.logOut();
        request.session.destroy((err)=>{
            if (err) throw err
            response.redirect("/");
        });
    });

    router.get("/register", (request, response)=>{
        let info = request.flash();
        let feedback = '';
        if(info.error){
            feedback = info.error[0];
        }
        let title = "Register";
        let list = template.list(request.list);
        let html = template.htmL(title, list, `
            <div style='color:red; '>${feedback}</div>
            <form action="/auth/register" method="post">
                <p>
                    <input type="text" name="email" placeholder="email">
                </p>
                <p>
                    <input type="password" name="password" placeholder="password">
                </p>
                <p>
                    <input type="password" name="password2" placeholder="password">
                </p>
                <p>
                    <input type="text" name="displayName" placeholder="nickname">
                </p>
                <p>
                    <input type="submit" value="register">
                </p>
            </form
        `,"");
        response.send(html);
    });

    router.post("/register", (request, response)=>{
        let email = request.body.email;
        let password = request.body.password;
        let password2 = request.body.password2;
        let displayName = request.body.displayName;
        if(password !== password2){
            request.flash("error", "Password must same");
            response.redirect("/auth/register");   
        } else {
            const user = {
                id : shortid.generate(),
                email : email,
                password : password,
                displayName : displayName
            }
            db.get('users').push(user).write();
            //passport를 사용하여 회원가입과 동시에 로그인
            request.login(user, (err)=>{
                return response.redirect("/")
            });
        }
    });
    return router;
}





