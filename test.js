/*function func(params){
console.log(params);
func1({params});
console.log(params);
}

function func1(params1){
    params1.id="123";
}
func({a:"haritha"});*/


function add(){
    let a=x+5;
    console.log(a);
}

add(x=29);
let obj1={abc:"123",bcd:"234"};
let obj2={cde:"345",def:"456"};
let obj3={obj1,obj2};
//console.log(obj3);
obj1.abc="567";
console.log(obj1);