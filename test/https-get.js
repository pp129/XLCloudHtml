let url = require("url");//解析参数的库
let s = "http://api.yizhen.cn/amol-back/oauth/token?client_id=amol_client_tpp&client_secret=amol_secret_tpp&grant_type=password&username=clinicalAPI&password=clinical@yizhen";
let obj = url.parse(s);
console.log(obj)
