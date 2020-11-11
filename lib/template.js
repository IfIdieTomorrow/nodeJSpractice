module.exports = {
    // html 템플릿 글내용, 수정화면 , 홈페이지 마다 주는 파라미터가 다르기때문에 출력값도 다르다. 
    htmL : (title, list, body, control, authStatusUI = "<a href='/auth/login/'>login</a> | <a href='/auth/register'>Register</a>") =>{
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB2 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            ${authStatusUI}
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    },
    // 글 이동 링크
    list : (result)=>{
        let list = '<ul>';
            for(let val of result){
                list += `<li><a href="/topic/${val}">${val}</a></li>`
            }
            list += '</ul>';
        return list;
    }
}

