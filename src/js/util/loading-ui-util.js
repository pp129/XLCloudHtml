/**
 * Created by linchaoqun on 2017/4/10.
 */
// 加载显示
let loadingShow = function (name , ClassName) {
    this[name] = true; // this.loading = true   this['loading'] = true
    let appEle = document.body;
    let eleClassName = appEle.className;
    appEle.className = eleClassName + " " + ClassName;
};
// 加载隐藏
let loadingHide = function (name , ClassName) {

};
module.exports = {
    loadingShow,
    loadingHide
};
