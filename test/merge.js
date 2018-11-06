/**
 * Created by lin on 2017/9/25.
 */
let _ = require("lodash");
let obj = {
    name : 1,
    sex:2
};
let obj2 = {
    name : 2
}
console.log(_.merge(obj , obj2))
