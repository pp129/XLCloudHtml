let list = [
    {
        "2018-10" :3
    },
    {
        "2018-11" :5
    },
];
let x = [];
let y = [];
for(let item of list){
    for(let key in item){
        x.push(key);;
        y.push(item[key]);
    }
}
console.log(x , y)
