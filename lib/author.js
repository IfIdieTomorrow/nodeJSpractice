const template = require('./template');
const db = require("./db");
const qs = require("querystring");
const url = require("url");
const sanitize = require("sanitize-html");

exports.home = (request, response)=>{
    db.query("SELECT * FROM topic", (error, topics)=>{
        if(error) throw error;
        db.query("SELECT * FROM author", (error2, authors)=>{
            if(error2) throw error2;
            let title = "Author";
            let list = template.list(topics);
            let html = template.htmL(title, list,
                `
                ${template.authorList(authors)}
                <style>
                    table {
                        border-collapse : collapse;
                    }
                    td{
                        border : 1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>   
                        <textarea name="profile" placeholder="profile"></textarea>
                    </p>
                    <p>
                        <input type="submit" value="확인" >
                    </p>
                </form
                `,
                ``
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = (request, response)=>{
    //POST방식으로 전달된 데이터를 받아서 새로운 파일을 생성하고 내용을 추가하는 방법.
    //POST방식으로 전송된 데이터를 가져오는 방법
    let body = "";
    request.on('data', (data) =>{
        body += data;
    });
    request.on('end',()=>{
        let post = qs.parse(body);
        db.query("insert into author(name, profile) values(?,?)", 
        [post.name, post.profile], (err, result)=>{
            if(err) throw err;
            response.writeHead(302, {
                //insertId는 약속된 표현
                Location : `/author` 
            });
            response.end();
        });
    });
}

exports.update = (request, response)=>{
    db.query("SELECT * FROM topic", (error, topics)=>{
        if(error) throw error;
        db.query("SELECT * FROM author", (error2, authors)=>{
            if(error2) throw error2
            let _url = request.url;
            let queryData = url.parse(_url, true).query;
            db.query("SELECT * FROM author where id=?",[queryData.id] ,(error3, author)=>{
                if(error3) throw error3;
                let title = "Author";
                let list = template.list(topics);
                let html = template.htmL(title, list,
                    `
                    ${template.authorList(authors)}
                    <style>
                        table {
                            border-collapse : collapse;
                        }
                        td{
                            border : 1px solid black;
                        }
                    </style>
                    <form action="/author/update_process" method="post">
                        <p>
                            <input type="hidden" name="id" value="${queryData.id}">
                        </p>
                        <p>
                            <input type="text" name="name" value="${author[0].name}" placeholder="name">
                        </p>
                        <p>   
                            <textarea name="profile" placeholder="profile">${author[0].profile}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="확인" >
                        </p>
                    </form
                    `,
                    ``
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}