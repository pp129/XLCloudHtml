/**
 * Created by lin on 2017/10/18.
 */
let _ = require("lodash");
// let a = {
//     name:1
// };
// let b= {
//     cc:1
// };
// // let b = _.clone(a);
// // b.name = 2;
// // console.log(a.name);
// // console.log(b.name);
// _.merge(a , b);
// console.log(a , b)
let streetList = [
    {
        name:1
    },
    {
        name:2
    },
    {
        name:3
    },
];
let streetList2 = [
    {
        name:2
    },
    {
        name:4
    },
];
let result = _.intersectionWith(streetList, streetList2, _.isEqual);
