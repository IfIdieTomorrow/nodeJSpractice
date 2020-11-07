const fs = require('fs');

/*
//readFileSync
console.log("A");
const result = fs.readFileSync("nodejs/sample",'utf-8');
console.log(result);
console.log("C");
결과는 A B C
*/

//readFile
console.log("A");
fs.readFile("nodejs/sample", 'utf-8', (err, data) => {
    console.log(data);
});
console.log("C");
// 결과는 A C B

