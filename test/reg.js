// let reg = /\/(\w|-)*$/;
// let s = "/referral/referral-apply/a5be8802-548e-4c50-9ac0-8faff71d90e5";
// console.log(s.replace(reg,"/0"))
let s = "/api/1111";
let first = s.replace(/^\/api/ , "");
let two = first.replace(/$/ , ".json");
console.log(two)

