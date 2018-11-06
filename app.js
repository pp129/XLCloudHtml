const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();// express框架
const env = require("./config/env");
let open = require("open");
const _ = require("lodash");
const url = require("url");
const proxy = require('http-proxy-middleware');
let opened = false;
if (env === "devServer" || env === "dev") {
    let webpack = require("webpack");
    let webpackConfig = require("./webpack.dev.config.js");
    let compiler = webpack(webpackConfig);
    compiler.apply(new webpack.ProgressPlugin(function (percentage, msg) {
        console.log(parseInt(percentage * 100) + '%', msg);
        if (percentage === 1 && !opened) {
            opened = true;
            open("http://localhost:3000");
        }
    }));
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath // 大部分情况下和 `output.publicPath`相同
    }));
    // app.use(require('webpack-hot-middleware')(compiler,{
    //     log: false
    // }));
}
app.use(cookieParser());
// const imgProxy = proxy('/01_xlcloud_custody/static/html/static/images/',{
//     // router:function () {
//     //     return "http://localhost:9000";
//     // },
//     // router:{
//     //     "/api/1" :"http://localhost:9000"
//     // },
//     target: 'http://localhost:3000',
//     changeOrigin: false,
//     ws: true,                         // proxy websockets
//     pathRewrite: {
//         '^/01_xlcloud_custody/static/html/static/' : '/01_xlcloud_custody/static/',     // rewrite path
//     },
// });
// app.use('/01_xlcloud_custody/static/html/static/images/*', imgProxy);
app.use('/api/*', function (req , res, next) {
    if(req.method === "POST"){
        req.method = "GET";
    }
    next();
});
const apiProxy = proxy('/api', {
    // router:function () {
    //     return "http://localhost:9000";
    // },
    // router:{
    //     "/api/1" :"http://localhost:9000"
    // },
    target: 'http://localhost:3000',
    pathRewrite: function (path) {
        let obj = url.parse(path);
        let search = obj.search;
        let pathname = obj.pathname;
        let first = pathname.replace(/^\/api/ , "");
        let two = first.replace(/$/ , ".json");
        return two + (search || "");
    }
    // pathRewrite:{
    //     '^/api': '',     // rewrite path
    //     '$': '.json',     // rewrite path
    // },
});
app.use('/api/*', apiProxy);

const apiProxy2 = proxy('/xlcloud-custody-webapp', {
    // router:function () {
    //     return "http://localhost:9000";
    // },
    // router:{
    //     "/api/1" :"http://localhost:9000"
    // },
    target: 'http://10.130.146.29:8220',
    changeOrigin: false,
    ws: true,                         // proxy websockets
    pathRewrite: {
        '^/xlcloud-custody-webapp': '',     // rewrite path
    },
});
app.use('/xlcloud-custody-webapp/*', apiProxy2);

const apiProxy3 = proxy('/api3', {
    // router:function () {
    //     return "http://localhost:9000";
    // },
    // router:{
    //     "/api/1" :"http://localhost:9000"
    // },
    target: 'http://10.130.195.179:8220',
    changeOrigin: false,
    ws: true,                         // proxy websockets
    pathRewrite: {
        '^/api3': '',     // rewrite path
    },
});
app.use('/api3/*', apiProxy3);
const apiProxyMap = proxy('/PGIS_S_TileMapServer', {
    target: 'http://10.130.145.167:8080',
    changeOrigin: false
});
app.use('/PGIS_S_TileMapServer/*', apiProxyMap);
const photoProxy = proxy('/image-service', {
    target: 'http://10.130.146.42:8010',
    changeOrigin: false
});
app.use('/image-service/*', photoProxy);
// const apiProxy4 = proxy('/api4',{
//     // router:function () {
//     //     return "http://localhost:9000";
//     // },
//     // router:{
//     //     "/api/1" :"http://localhost:9000"
//     // },
//     target: 'http://localhost:3000',
//     changeOrigin: false,
//     ws: true,                         // proxy websockets
//     pathRewrite: {
//         '^/api4' : '',     // rewrite path
//     },
// });
// app.use('/api4/*', apiProxy4);


app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "api")));
app.use(express.static(path.join(__dirname)));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    if (req.headers.accept.match("image")) {
        next();
        return;
    }
    let err = new Error("Not Found" + req.url);
    err.code = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get("env") === "development" ? err : {};
    //
    // // render the error page
    // res.status(err.status || 500);
    // res.render("error");
    try {
        res.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    } catch (e) {
        null;
    }
    console.info(err);
    let resule = {
        status: err.code,
        msg: err.message,
    };
    res.end(JSON.stringify(resule));

});

module.exports = app;
