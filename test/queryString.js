/**
 * Created by lin on 2017/10/19.
 */
let querystring = require("querystring");//解析参数的库
let url = require("url");//解析参数的库
let s = "http://localhost:6002/cms.html?token=1#/patient/list";
let obj = url.parse(s);
//把参数转换成键值对，再从中拿值
console.log(obj)
// let q = querystring.parse(obj.query)
// // console.log(q.token)
// let o = {
//     name : 1,
//     age:2
// }
// // console.log(querystring.stringify(o))
// let u = "https://www.kayicloud.com/Viewer/Index?dataid=MS4yLjg0MC4xMTM2MTkuMi4yNS40LjIxNDc0ODM2NDcuMTUyMTQyNzQ2NS42NDE=&ds=rest&serverAddr=local@pacs.kayicloud.com/wujiquery&vendorCode=kayi&code=b&expires=1521520337&signature=41135de949ccd79915b24a3e0dc1a042&targetApp=viewer&seriesUIStyle=fixed&lossless=1#/view";
// let params = {
//     "kayiView":u
// }
// console.log(querystring.stringify(params));
