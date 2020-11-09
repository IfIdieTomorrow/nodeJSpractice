const mysql = require("mysql");
const connection = mysql.createConnection({
    //DB주소
    host : "localhost",
    //아이디
    user : "root",
    //비밀번호
    password : "sqladmin",
    //스키마명
    database : "node_tutorial"
});

connection.connect();

//query메서드를 호출하여 sql문을 실행시킬 수 있다.
connection.query("SELECT * FROM topic", (err, result, fields)=>{
    if(err) {
        console.log(err);
    }
    console.log(result);
});

connection.end();