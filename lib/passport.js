const db = require("../lib/db");
// passport.js
module.exports = function (app) {
    let authData = {
        email : "chuck46@naver.com",
        password : "january46",
        nickname : "egoing"
    }

    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy;

    // Express에 passport를 설치
    app.use(passport.initialize());
    // passport는 session을 사용
    app.use(passport.session());

    // session을 처리하는 방법
    passport.serializeUser(function(user, done)  {
        console.log("serializeUser ", user);
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id , done)  {
        const user = db.get('users').find({id:id});
        console.log("deserializeUser", id, user);
        done(null, user);
    });

    // 세션이 활성화 된 후 passport를 사용해야 한다.
    passport.use(new LocalStrategy({
            usernameField : "email",
            passwordField : "password"
        },
        function(username, password, done) {
            console.log("LocalStrategy ", username. password)
            if(username === authData.email){
                if(password === authData.password){
                    return done(null, authData);
                }else {
                    return done(null, false, { message: 'Incorrect password.' })
                }
            } else {
                return done(null, false, { message: 'Incorrect username.' })
            }
        }
    ));
    return passport;
}
