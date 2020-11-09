const qs = require('querystring');
const url = require('url');
const template = require('./template');
const db = require("./db");
const { request } = require('http');
exports.home = (request, response)=>{
    db.query("SELECT * FROM topic", (error, topics)=>{
        let title = "Welcome";
        let description = "Hello, Node.js";
        let list = template.list(topics);
        let html = template.htmL(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = (request, response)=>{
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    db.query("SELECT * FROM topic",(err, topics)=>{
        if(err) throw err;
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`,[queryData.id], (error, topic)=>{
            if(error) throw error;
            let title = topic[0].title;
            let description = topic[0].description;
            let list = template.list(topics);
            let html = template.htmL(title, list,
                `
                <h2>${title}</h2>${description}
                <p>by ${topic[0].name}</p>
                `,
                `
                <a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <input type="submit" value="delete" style='border : none; background : #fff;'>
                </form>
                `
            );
            response.writeHead(200);
            response.end(html);
       });
    });
}

exports.create = (request, response)=>{
    db.query("SELECT * FROM topic", (error, topics)=>{
        db.query("SELECT * FROM author", (err, authors)=>{
            let title = "Create";
            let list = template.list(topics);
            let html = template.htmL(title, list,
                `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        ${template.authorSelect(authors)}
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form`,
                `<a href="/create">create</a>`
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
        db.query("insert into topic(title, description, created, author_id) values(?,?,NOW(),?)", 
        [post.title, post.description, post.author], (err, result)=>{
            if(err) throw err;
            response.writeHead(302, {
                //insertId는 약속된 표현
                Location : `/?id=${result.insertId}` 
            });
            response.end();
        });
    });
}

exports.update = (request, response)=>{
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    db.query("SELECT * FROM topic", (err, topics)=>{
        if (err) throw err;
        db.query("SELECT * FROM topic WHERE id=?",[queryData.id],(err2, result)=>{
            if(err2) throw err2;
            db.query("SELECT * FROM author", (err, authors)=>{
                let list = template.list(topics);
                let title = result[0].title;
                let description = result[0].description;
                let html = template.htmL(title, list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" value="${queryData.id}" name="id">
                        <p><input type="text" name="title" placeholder="title" value=${title}></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            ${template.authorSelect(authors, result[0].author_id)}
                        </p> 
                        <p>
                            <input type="submit">
                        </p>
                    </form
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${queryData.id}">update</a>`);
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_process = (request, response) =>{
    //POST로 전달된 데이터를 받아서 수정
    let body = "";
    request.on("data", (data) => {
        body += data;
    });
    request.on("end", () => {
        let post = qs.parse(body);
        //파일의 이름 변경. 첫 번째 인자값은 원래이름 ,두 번째는 새로운 이름, 세 번째는 callback
        db.query("update topic set title=?, description=?, author_id = ? where id=?",[post.title,post.description,post.author,post.id],
        (err, result)=>{
            if(err) throw err;
            response.writeHead(302,{
                Location : `/?id=${post.id}`
            });
            response.end();
        });
    });
}

exports.delete_process = (request, response)=>{
    //글 삭제 로직
    let body = "";
    request.on("data", (data)=>{
        body += data;
    });
    request.on("end", ()=>{
        let post = qs.parse(body);
        db.query("DELETE FROM topic where id = ?",[post.id],(err)=>{
            if(err) throw err;
            response.writeHead(302,{
               Location : "/" 
            });
            response.end();
        });
    });
}