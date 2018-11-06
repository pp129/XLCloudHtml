/*
 * 报警消息处理消息类
 * 
 * 
 * 消息格式: { type:'', //'serverData'/'clientData' time:, uniqueId:'', clientIP:'',
 * data:'' }
 * 
 */

var Function_Type_Server = "serverData";
var Function_Type_Client = "clientData";

//
function AlarmMessageService(websockturl, clientIP, sessionId, alarmCallbackFn) {
	//
	var m_thisObject = this;
	this.m_websockturl = websockturl;
	this.m_clentIP = clientIP;
	this.m_uniqueId = sessionId;
	this.m_alarmCallBackFunction = alarmCallbackFn;
	//this.m_clientCallBackFunction = clientCallbackFn;
	this.m_webSocketObject = null;
	//
	this.initService = function () {
		m_thisObject.m_webSocketObject = new WebsocketObject(
			m_thisObject.m_websockturl, m_thisObject.resolveAlarmMessage);
		m_thisObject.m_webSocketObject.connectWebsocket();
	};
	//
	this.unInitSevice = function () {
		m_thisObject.m_webSocketObject.closeConnect();
	};

	// 输出打印消息
	this.printLog = function (sLog) {
		try {
			console.log("AlarmMessageService Info=>" + sLog);
		} catch (e) {

		}
	};
	//
	this.resolveAlarmMessage = function (messageData) {
		try {
			// json对象
			var messageDataJson = eval("(" + messageData + ")");
			//console.log(messageDataJson)
			m_thisObject.handleServerData(messageDataJson);
			// 自己发送的不处理
			// if (messageDataJson.uniqueId == m_thisObject.m_uniqueId) {
			// 	return;
			// }
			// 判断发送类型
			// if (messageDataJson.type == Function_Type_Server) {
			// 	m_thisObject.handleServerData(messageDataJson.data);
			// } else if (messageDataJson.type == Function_Type_Client) {
			// 	m_thisObject.handleClientData(messageDataJson.data);
			// }
			//
		} catch (e) {
			m_thisObject.printLog("resolve AlarmMessage fail" + e.message);
		}
	};
	//
	this.sendCleantData = function (clientData) {
		m_thisObject.m_webSocketObject.sendMessage("{type:'" +
			Function_Type_Client + "',clientIP:'" +
			m_thisObject.m_clentIP + "',time:" + new Date().getTime() +
			",uniqueId:'" + m_thisObject.m_uniqueId + "',data:'" +
			clientData + "'}");
	};
	this.replaceAll = function (str, sptr, sptr1) {
		while (str.indexOf(sptr) >= 0) {
			str = str.replace(sptr, sptr1);
		}
		return str;
	};
	//
	this.handleServerData = function (alarmData) {
		if (m_thisObject.m_alarmCallBackFunction == null) {
			return;
		}
		m_thisObject.m_alarmCallBackFunction(alarmData);
	};
	//
	this.handleClientData = function (clientData) {
		if (m_thisObject.m_clientCallBackFunction == null) {
			return;
		}
		m_thisObject.m_clientCallBackFunction(eval("(" + clientData + ")"));
	};
};