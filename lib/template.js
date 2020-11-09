module.exports = {
    // html 템플릿 글내용, 수정화면 , 홈페이지 마다 주는 파라미터가 다르기때문에 출력값도 다르다. 
    htmL : (title, list, body, control) =>{
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB2</a></h1>
        <a href="/author">author</a>
        ${list}
        ${control}
        ${body}
        </body>
        </html>
        `;
    },
    // 글 이동 링크
    list : (topics)=>{
        let list = '<ul>';
            for(let val of topics){
                list += `<li><a href="/?id=${val.id}">${val.title}</a></li>`
            }
            list += '</ul>';
        return list;
    },
    authorSelect : (authors, author_id)=>{
        let selected = '';
        let tag = '';
        for(let a of authors){
            if(a.id === author_id){
                selected = ' selected';
            }
            tag += `<option value=${a.id}${selected}>${a.name}</option>`;
        } 
        return `<select name="author">
                    ${tag}
                </select>`
    },
    authorList : (authors)=>{
        let tag = '<table border="1">';
            for(let a of authors){
                tag += `
                        <tr>
                            <td>${a.name}</td>
                            <td>${a.profile}</td>
                            <td><a href="/author/update?id=${a.id}>update</td>
                            <td>delete</td>
                        </tr>
                        `
            }
        tag += `</table>`;
        return tag;
    }
}

