// a = () =>{
//     console.log('A');
// }
// a();

let a = function(){
    console.log('A');
}

function slowFunc(callback){
    callback();
}

slowFunc(a);