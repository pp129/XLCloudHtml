/*
 * 报警消息处理消息类
 *
 *
 * 消息格式: { type:'', //'serverData'/'clientData' time:, uniqueId:'', clientIP:'',
 * data:'' }
 *
 */
import {websocket} from './websocket';

const Function_Type_Server = "serverData";
const Function_Type_Client = "clientData";

//
function WebSocketService(websockturl, clientIP, sessionId, alarmCallbackFn, clientCallbackFn) {
    //
    let m_thisObject = this;
    m_thisObject.m_websockturl = websockturl;
    this.m_clentIP = clientIP;
    this.m_uniqueId = sessionId;
    this.m_alarmCallBackFunction = alarmCallbackFn;
    this.m_clientCallBackFunction = clientCallbackFn;
    this.m_webSocketObject = null;
    //
    this.initService = function () {
        m_thisObject.m_webSocketObject = new websocket(
            m_thisObject.m_websockturl, m_thisObject.resolveMessage);
        m_thisObject.m_webSocketObject.connectWebsocket();
    };
    //
    this.unInitSevice = function () {
        m_thisObject.m_webSocketObject.closeConnect();
    };

    // 输出打印消息
    this.printLog = function (sLog) {
        try {
            console.log("Info=>" + sLog);
        } catch (e) {

        }
    };
    //
    this.resolveMessage = function (messageData) {
        try {
            // json对象
            let messageDataJson = eval("(" + messageData + ")");
            m_thisObject.handleServerData(messageDataJson);
            // 自己发送的不处理
            /*if (messageDataJson.uniqueId == m_thisObject.m_uniqueId) {
                return;
            }
            // 判断发送类型
            if (messageDataJson.type == Function_Type_Server) {
                m_thisObject.handleServerData(messageDataJson.data);
            } else if (messageDataJson.type == Function_Type_Client) {
                m_thisObject.handleClientData(messageDataJson.data);
            }*/
            //
        } catch (e) {
            m_thisObject.printLog("resolve AlarmMessage fail" + e.message);
        }
    };
    //
    this.sendCleantData = function (clientData) {
        m_thisObject.m_webSocketObject.sendMessage("{type:'"
            + Function_Type_Client + "',clientIP:'"
            + m_thisObject.m_clentIP + "',time:" + new Date().getTime()
            + ",uniqueId:'" + m_thisObject.m_uniqueId + "',data:'"
            + clientData + "'}");
    };
    this.replaceAll = function (str, sptr, sptr1) {
        while (str.indexOf(sptr) >= 0) {
            str = str.replace(sptr, sptr1);
        }
        return str;
    };
    //
    this.handleServerData = function (alarmData) {
        console.log(alarmData);
        if (m_thisObject.m_alarmCallBackFunction == null) {
            return;
        }
        console.log(alarmData);
        m_thisObject.m_alarmCallBackFunction(eval(alarmData));
    };
    //
    this.handleClientData = function (clientData) {
        if (m_thisObject.m_clientCallBackFunction == null) {
            return;
        }
        m_thisObject.m_clientCallBackFunction(eval("(" + clientData + ")"));
    };
}

let websocketService = WebSocketService;
export {
    websocketService
}
