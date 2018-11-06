/**
 * Created by lin on 2017/8/24.
 */
let http = require("http"),
    httpProxy = require("http-proxy");

//
// Create a proxy server with custom application logic
//
let proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
let server = http.createServer(function(req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    let url = req.url;
    if(url === "/Alipay/receive_Notify" || url === "/Wxpay/result"){
        proxy.web(req, res, { target: "http://linchaoqun.com" });
    }else{
        res.end("");
    }
});

console.log("listening on port 8002");
server.listen(8002);
