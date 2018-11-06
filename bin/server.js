const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

wss.on('connection', function connection(ws) {
    let timer = null
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.on('close', function incoming(message) {
        clearInterval(timer)
    });

    timer = setInterval(() => {
        ws.send(`{
            "captureTime": "2018-10-29 09:00:01",
            "captureDeviceId": "35020673001320001367",
            "captureDeviceName": "R003-湖里区SM一期商场北门1（肯德基）",
            "captureDeviceLon": "118.1218579",
            "captureDeviceLat": "24.5044391",
            "capturePersonId": "D00T002R20170505171509832651",
            "capturePersonName": "陈美珍",
            "capturePersonIdcard": "350206197111012022",
            "capturePersonLabel": "重点|精神",
            "capturePersonImgId": "D00T923R20170424161500296786",
            "capturePersonImgUrl": "http://10.130.146.16:9090/imageInfo/dxgk/PHOTO/350206711101202.jpg",
            "similarity": "88.59507",
            "sceneUrl": "http://10.130.146.42:8090/image-service/captureImage/getPanoramaImage?captureId=3502067300132000136702201810271734066845069925",
            "faceUrl": "http://10.130.146.42:8090/image-service/captureImage/getFaceImage?captureId==3502067300132000136702201810271734066845069925",
            "alarmId": "3502067300132000136702201810271734066845069925"
            }`);
    }, 10000)

});
