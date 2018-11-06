/**
 * Created by lin on 2017/7/28.
 */
let urlUtil = require("url");
let qs = require("querystring");//解析参数的库
module.exports = {
    /**
     *获取参数
     * @param obj
     * {
     *     url:String,
     *     arg:String
     * }
     * or
     * @param  obj : String
     * @return {*}
     */
    getQueryArg(obj){
        let arg = "";
        let url = "";
        if((typeof obj) === "string"){
            url = window.location.href;
            console.log(url)
            arg = obj;
        }else if(obj.url){
            url = obj.url;
            arg = obj.arg;
        }else{
            url = window.location.href;
            arg = obj.arg;
        }
        console.log(urlUtil.parse(url))
        let queryString = urlUtil.parse(url).query;
        console.log(queryString)
        let queryArg = qs.parse(queryString)[arg];
        console.log(queryArg)
        return queryArg || "";
    }
};
