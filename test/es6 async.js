
function a() {
    let promise = new Promise( (resolve,reject) => {
        reject(111);
        console.log(1);
        reject(222);
        console.log(2)
    });
    return promise;
}

function b() {
    let promise = new Promise( (resolve,reject) => {
        setTimeout(()=>{
            resolve("b");
        },1000);
    });
    return promise;
}
async function test() {
    let aResult =  await b().catch((data)=>{
        return false
    });
    return aResult;
}
async function test2() {
    let aResult =  await test().catch((data)=>{
        return false
    });
    console.log(aResult);
}
test2();
