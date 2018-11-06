/**
 * Created by lin on 2017/5/19.
 */
var express = require("express");
var router = express.Router();
/* GET users listing. */
router.post("/", function(req, res, next) {
    var arg = req.body;

    res.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    var resData = {};
    var data = resData.toString();
    res.end(data);
});
module.exports = router;
