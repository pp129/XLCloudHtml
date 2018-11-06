/**
 * Created by lin on 2017/8/3.
 */
let moment = require('moment');
// console.log(new Date(moment("2000-11-10 10:10:03").format()).getTime())
// let birthday = "1996-10-06";
// let birthdayTimestamp = new Date(moment(birthday).format()).getTime();
// let nowTimestamp = new Date().getTime();
// let tempTime = nowTimestamp - birthdayTimestamp;
// let age = tempTime/1000/60/60/24/365;
// console.log(parseInt(age));
// let time = moment(new Date).format("YYYY-MM-DD HH:mm:ss");
// console.log(time);
// let m = moment().hour(12).minute(0).second(0)
// console.log(moment().isAfter(m))
// console.log(moment().get)

console.log(moment("1988-10").isBetween(moment("1988-10"),moment("1988-11")))
