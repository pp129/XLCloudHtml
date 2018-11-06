const querystring = require("querystring");
const http = require("http");
// const postData = querystring.stringify({
//     idCard:"1"
// });
// console.log(Buffer.byteLength(postData))
//
const postData = JSON.stringify({
    personId:"D00T002R20170505171509905014"
});

const options = {
    hostname: '35.48.152.73',
    // hostname: '35.48.98.178',
    port: 8220,
    path: '/tBasPsyosisInfo/statisticalAnalysis',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    }
};

const req = http.request(options, (res) => {
    // console.log(`STATUS: ${res.statusCode}`);
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    let data = []
    res.on('data', (chunk) => {
        data.push(chunk);
        // console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log(data.join(""));
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();
