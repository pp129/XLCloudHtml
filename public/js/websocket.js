// WebSocket操作对象
function WebsocketObject(websockturl, callbackFn) {
    //变量声明
    let objThis = this;
    this.wSocket = null;
    let hrefStr = document.location.href;
    let str = "ws://";
    if (hrefStr != null && hrefStr.substring(0, 5).indexOf("https") !== -1) {
        str = "wss://";
    }
    if(websockturl.indexOf("ws://") === 0){
        this.sWebSocketURL = websockturl;
    }else{
        this.sWebSocketURL = str + document.location.host +websockturl;
    }

    this.dataCallbackFn = callbackFn;
    //函数声明
    //
    this.connectWebsocket = function () {
        let myobj = this;
        if (myobj.wSocket != null) {
            myobj.closeConnect();
        }
        //
        console.log(myobj.sWebSocketURL);
        if ('WebSocket' in window) {
            myobj.wSocket = new WebSocket(myobj.sWebSocketURL);
        } else if ('MozWebSocket' in window) {
            myobj.wSocket = new MozWebSocket(myobj.sWebSocketURL);
        } else {
            myobj.printLog('WebSocket is not supported by this browser.');
            return;
        }
        //关联事件
        myobj.wSocket.onopen = myobj.handleOpenMessage;
        myobj.wSocket.onmessage = myobj.handleGetMessage;
        myobj.wSocket.onclose = myobj.handleWebSocketClose;
        myobj.wSocket.onerror = myobj.handleErrorMessage;
    };
    //输出打印消息
    this.printLog = function (sLog) {
        try {
            console.log("Websocket Info=>" + sLog);
        } catch (e) {

        }
    };
    //处理打开事件
    this.handleOpenMessage = function () {
        objThis.printLog("WebSocket has opened, Waiting message..");
    };
    //处理打开事件
    this.handleGetMessage = function (event) {
        //objThis.printLog("get server data=>"+event.data);
        //console.log(event)
        objThis.dataCallbackFn(event.data);
    };
    //处理打开事件
    this.handleWebSocketClose = function () {
        objThis.printLog("WebSocket has closed");
    };
    //处理打开事件
    this.handleErrorMessage = function (event) {
        objThis.printLog(event.data);
    };
    //
    this.closeConnect = function () {
        let myobj = this;
        if (myobj.wSocket != null) {
            myobj.wSocket.close();
            myobj.wSocket = null;
        }
    };
    //
    this.sendMessage = function (message) {
        let myobj = this;
        myobj.wSocket.send(message);
        myobj.printLog("send data=>" + message);
    };
}

let websocket = WebsocketObject;
export {
    websocket
}
