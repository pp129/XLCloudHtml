/////////////////////////////////////////////////////////////////////////////////////////////////////
///////地图操作
var MapGisApp = {};
var messageAccept = true;
var showRealAlarmObject = {
    showMaxNum: 1000,
    curShowAlarmId: "",
    showDataMap: []
};

showRealAlarmObject.taskInfo = [];
showRealAlarmObject.taskIds = "";
showRealAlarmObject.taskAlarmData = [];
showRealAlarmObject.viewTaskMap = [];
showRealAlarmObject.devceName = [];
showRealAlarmObject.alarmCount = [];
showRealAlarmObject.refuseAlarm = 0;
showRealAlarmObject.type = 3;

// 初始化地图
function InitMapGisApp() {
    MapGisApp.InitMapGisAppVariable();
    MapGisApp.usermap = new rk.mapgis(MapGisApp.mapparam);
    MapGisApp.usermap.SetMouseByClickCallbackFn(MouseByClickLonLat);
    MapGisApp.usermap.SetMouseByMoveCallbackFn(MouseByMoveLonLat);
    // 监听图层变化
    MapGisApp.usermap.BindChangeResolution(function () {
        var izoom = MapGisApp.usermap.getZoom();
        changeZoomShowHideResTextName(izoom);
    });
    //
    // createLineLayer();
    /*createResLayer();
    createDeviceCluster();*/
    MapGisApp.createHeatMap();//创建热力图
    //MapGisApp.InitHeatMap(heatMapData);
    ChangeMapToSate(false);
    //
    $(".ol-attribution").hide();
    //
    $(".ol-mouse-position").css({top: $("#" + MapGisApp.mapparam.target).height() - 18});
}

// ////////////////////////////////
// /// 公共函数
// ///////////////////////////////
// 移动到指定位置经纬度
function MoveToMapCenter(lonlat) {
    MapGisApp.usermap.MoveMapCenter(lonlat);
}

// 移动到中心
function MoveGoToMapUseCenter() {
    MapGisApp.usermap.MoveMapCenter(MapGisApp.mapparam.center);
}

// 飞动切换不同位置
function MoveToflyToBern(lonlat, duration, showNum) {
    MapGisApp.usermap.flyToBern(lonlat, duration, showNum);
}

// 点击界面坐标回调
function MouseByClickLonLat(lonlat) {
    // 写入线图层使用
    //handleClickLineLayerLonLat(lonlat);
    // 写入到QT客户端中
    clickLonLatToQTHandle(lonlat);
}

// 鼠标移动坐标回调
function MouseByMoveLonLat(lonlat) {
    // 写入到QT客户端中
    moveLonLatToQTHandle(lonlat);
}

// 获取地图对象
function GetUseMapGisObject() {
    return MapGisApp.usermap;
}

// 卫星/矢量地图切换
function ChangeMapToSate(istrue) {
    MapGisApp.usermap.ChangeMapToSate(istrue);
}

// 在地图显示聚合点位信息
function showMapOverlayOtherHtml(lonlat, showHtml, type) {
    if (lonlat == undefined) {
        return;
    }
    if (type == 3) {
        MapGisApp.usermap.setOverlayOffsetOther([260, 220]);
    }
    MapGisApp.usermap.showOverlayOther(lonlat, showHtml);
    //

}

// 在地图显示信息
function showMapOverlayHtml(lonlat, showHtml, type) {
    //console.log(lonlat, showHtml, type);
    if (lonlat == undefined) {
        return;
    }
    if (type == 1) {
        MapGisApp.usermap.setOverlayOffset([-145, 140]);
        $("#userpopup").removeClass("alarmCls");
        if (!$("#userpopup").hasClass("accessCls")) {
            $("#userpopup").addClass("accessCls");
        }
    }
    else if (type == 3) {
        //点位弹框
        MapGisApp.usermap.setOverlayOffset([265, 210]);
    }
    else {
        MapGisApp.usermap.setOverlayOffset([-260, 172]);
        $("#userpopup").removeClass("accessCls");
        if (!$("#userpopup").hasClass("alarmCls")) {
            $("#userpopup").addClass("alarmCls");
        }
    }

    MapGisApp.usermap.showOverlay(lonlat, showHtml);
    //
    var coordinate = [lonlat.lon, lonlat.lat];
    coordinate = MapGisApp.usermap.DisplayToUseTransForm(coordinate);// 转换坐标
    if (MapGisApp.resPointOverlay) {
        MapGisApp.resPointOverlay.setPosition(coordinate);
    }
    //
    var izoom = MapGisApp.usermap.getZoom() - MapGisApp.mapparam.minZoom;
    if (izoom == 0) {
        MapGisApp.usermap.MoveMapCenter(lonlat);
        return;
    }
    MapGisApp.usermap.flyToBern(lonlat, 2000, izoom);
}

/**
 * 隐藏弹框
 *
 * @author lhp 2017-4-6 上午9:44:08
 */
function hideOverlay() {
    MapGisApp.usermap.hideOverlay();
}

// ////////////////////////////////
// /// 私有函数
// ///////////////////////////////
// 初始变量
MapGisApp.InitMapGisAppVariable = function () {
    //
    MapGisApp.mapparam = {};
    MapGisApp.mapparam.isWMS = false;
    // MapGisApp.mapparam.serviceURL ="http://192.168.121.194:8090/geoserver/wms";
    // MapGisApp.mapparam.serviceSateURL ="http://192.168.121.194:8090/geoserver/gwc/service/wms";
    //视频网
    /* MapGisApp.mapparam.serviceURL = "http://35.48.98.202:7000/mapImageServer/showElecPic?imgFormat=png&x={x}&y={y}&z={z}";
     MapGisApp.mapparam.serviceSateURL = "http://35.48.98.202:7000/mapImageServer/showSatellitePic?imgFormat=png&x={x}&y={y}&z={z}";*/
    //公安网
    MapGisApp.mapparam.serviceURL = "/PGIS_S_TileMapServer/Maps/sl2015/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3&key=one";
    MapGisApp.mapparam.serviceSateURL = "/PGIS_S_TileMapServer/Maps/sl2015/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3&key=one";

    MapGisApp.mapparam.target = "showmap";
    MapGisApp.mapparam.center = {lon: 118.0934, lat: 24.5418};

    MapGisApp.mapparam.minZoom = 12;
    MapGisApp.mapparam.maxZoom = 17;
    MapGisApp.mapparam.mousetarget = "mouse-position";
    var _width = $(window).width();
    if (_width >= 1920) {//大屏
        MapGisApp.mapparam.mouseWheelZoom = true;//滚轮缩放
        MapGisApp.mapparam.zoom = 14;
    } else {
        MapGisApp.mapparam.mouseWheelZoom = false;//滚轮缩放
        MapGisApp.mapparam.zoom = 12;
    }
};
// /////////////////////////////////////////////////////////////
// //和QT交互函数
var MSG_LINE_LINEDATA = "lineData";

// 点击获取经纬度
function clickLonLatToQTHandle(lonlat) {
    window.webkit.clickedLonLat(lonlat.lon, lonlat.lat);
}

// 移动获取经纬度信息
function moveLonLatToQTHandle(lonlat) {
    window.webkit.moveedLonLat(lonlat.lon, lonlat.lat);
}

// 数据返回回调函数
function callbackToQTHandle(type, data, userdata) {
    window.webkit.callbackFn(type, data, userdata);
}

// ///////////////
// 画线操作
function createLineLayer() {
    MapGisApp.linelayer = new rk.layerVector(MapGisApp.usermap, {maxResolution: 100});// ,
    // minResolution:1
    MapGisApp.lineList = new Array();
}

//
function runLineAnimation(lineID) {
    if (lineID == null || lineID == "") return;
    var lineCurFeature = MapGisApp.lineList[lineID];
    if (lineCurFeature != null) {
        MapGisApp.lineRunObj = new rk.lineanimation(MapGisApp.usermap, MapGisApp.linelayer, {});//
        MapGisApp.lineRunObj.updateLineDataPoint(lineCurFeature.GetRkLine().getDataPoint());
        MapGisApp.lineRunObj.startRunLine();
    }
}

//
function endLineAnimation() {
    if (MapGisApp.lineRunObj != null) {
        MapGisApp.lineRunObj.stopRunLine();
        MapGisApp.lineRunObj.removeLine();
        MapGisApp.lineRunObj = null;
    }
}

// 显示或者隐藏线面板
function showHideLineLayer(val) {
    MapGisApp.linelayer.setVisible(val);
}

// 将String转为数组
function LineStringDataToArray(data) {
    var arrData = new Array();
    var tmpArr = data.split(",");
    //
    for (var icount = 0; (icount + 1) < tmpArr.length; icount = icount + 2) {
        var lonlat = new Array();
        lonlat.push(parseFloat(tmpArr[icount]));
        lonlat.push(parseFloat(tmpArr[icount + 1]));
        arrData.push(lonlat);
    }// end for
    return arrData;
}

// 添加一条线
function addLineFeature(lineID, data, option) {
    if (lineID == null || lineID == "") return;
    var lineCurFeature = MapGisApp.lineList[lineID];
    if (lineCurFeature == null) {
        //
        if (option == null || option == "") {
            option = {};
        } else if (typeof option == "string") {
            option = eval("(" + option + ")");
        }
        //
        lineCurFeature = new rk.staticline(MapGisApp.usermap, MapGisApp.linelayer, option);//
    }
    //
    if (data != null && data != "") {
        var arrData = LineStringDataToArray(data);
        if (lineCurFeature.className == "line") {
            lineCurFeature.AddLinePoints(arrData);
        } else {
            lineCurFeature.GetRkLine().AddLinePoints(arrData);
        }
    }
    //
    MapGisApp.lineList[lineID] = lineCurFeature;
}

// 线添加点信息
function addLineFeatureLonLat(lineID, lonlat) {
    if (lineID == null || lineID == "") return;
    var lineCurFeature = MapGisApp.lineList[lineID];
    if (lineCurFeature != null) {
        lineCurFeature.AddLinePoint(lonlat);
    }
}

// 移除一条线
function removeLineFeature(lineID) {
    if (lineID == null || lineID == "") return;
    var lineCurFeature = MapGisApp.lineList[lineID];
    if (lineCurFeature != null) {
        if (lineCurFeature.className = "staticline") {
            lineCurFeature.removeLine();
        } else {
            lineCurFeature.remove();
        }
        MapGisApp.lineList[lineID] = null;
    }
}

// 是否启用编辑
function enableEditLineFeature(lineID, isEnable) {
    if (lineID == null || lineID == "") return;
    var lineCurFeature = MapGisApp.lineList[lineID];
    if (lineCurFeature != null) {
        if (isEnable) {
            lineCurFeature.EnableEditLine();
        } else {
            lineCurFeature.DisableEditLine();
        }
    }
}

// 获取线的数据
function getLineFeature(lineID) {
    if (lineID == null || lineID == "") return;
    var lineCurFeature = MapGisApp.lineList[lineID];
    var dataList = null;
    if (lineCurFeature != null) {
        if (lineCurFeature.className == "line") {
            dataList = lineCurFeature.getDataPoint();
        } else {
            dataList = lineCurFeature.GetRkLine().getDataPoint();
        }
    }
    return dataList;
}

//
function getLineFeatureDistance(lineID) {
    if (lineID == null || lineID == "") return;
    var lineCurFeature = MapGisApp.lineList[lineID];
    if (lineCurFeature != null) {
        return lineCurFeature.getDistance();
    }
    return 0;
}

//
function getLineFeaturealong(lineID, runDis) {
    if (lineID == null || lineID == "") return;
    var lineCurFeature = MapGisApp.lineList[lineID];
    if (lineCurFeature != null) {
        return lineCurFeature.along(runDis);
    }
    return null;
}

// /////////////////
// /资源操作
// 创建资源图层
function createResLayer() {
    MapGisApp.reslayer = new rk.layerVector(MapGisApp.usermap, {});
    MapGisApp.resList = new Array();
    MapGisApp.usermap.EnableSelectFeature([MapGisApp.reslayer.layer], selectResLayerFeatures, selectPreResLayerFeatures);
    //
    if (MapGisApp.resPointOverlay == null) {
        createResOverlay();
    }
}

//
function createResOverlay() {
    var point_div = document.createElement('div');
    point_div.className = "resanimation";
    point_div.innerHTML = '<div class="resanimation-red"><div class="resanimation-red2"><div class="resanimation-red3"></div></div></div>';
    MapGisApp.resPointOverlay = new ol.Overlay({
        element: point_div,
        positioning: 'center-center'
    });
    MapGisApp.usermap.addOverlay(MapGisApp.resPointOverlay);
    MapGisApp.resPointDiv = point_div;
    //
    hideResOverlay();
}

//
function updateResOverlayLonlat(lonlat) {
    //
    showResOverlay();
    //
    var coordinate = [lonlat.lon, lonlat.lat];
    coordinate = MapGisApp.usermap.DisplayToUseTransForm(coordinate);// 转换坐标
    MapGisApp.resPointOverlay.setPosition(coordinate);
    //
    MapGisApp.usermap.flyToBern(lonlat, 1000, 9);
}

//
function showResOverlay() {
    $(MapGisApp.resPointDiv).show();
}

function hideResOverlay() {
    $(MapGisApp.resPointDiv).hide();
}

// 显示或者隐藏资源面板
function showHideResLayer(val) {
    MapGisApp.reslayer.setVisible(val);
}

// 选中节点数据
function selectResLayerFeatures(fearures) {
    return;
    if (fearures.length > 0) {
        var fearure = fearures[0];
        var resObject = MapGisApp.resList[fearure.i];
        //
        // updateResOverlayLonlat({lon:parseFloat(resObject.raw.lon),
        // lat:parseFloat(resObject.raw.lat)});
        //
        // MapGisApp.usermap.showOverlay({lon:parseFloat(resObject.raw.lon),
        // lat:parseFloat(resObject.raw.lat)},
        // '<div
        // style="width:200px;height:49px;">'+resObject.raw.name+'</div>');
    }

}

// 上一次选中，本次没有选中节点
function selectPreResLayerFeatures(fearures) {
    // console.log(fearures);
    // MapGisApp.usermap.hideOverlay();
}

// 添加资源
function addResFeature(resDataJsonObject) {
    removeResFeature(resDataJsonObject.resid);
    // 创建资源节点
    var fearure = new rk.image(MapGisApp.usermap, MapGisApp.reslayer, {
        id: resDataJsonObject.resid,
        lonlat: {lon: parseFloat(resDataJsonObject.lon), lat: parseFloat(resDataJsonObject.lat)},
        text: resDataJsonObject.name,
        src: resDataJsonObject.imageURL,
        offsetY: 8,
        anchor: [0.5, 25]
    });
    //
    MapGisApp.resList[resDataJsonObject.resid] = {fearure: fearure, raw: resDataJsonObject};
}

// 移除资源
function removeResFeature(resid) {
    var resObj = MapGisApp.resList[resid];
    if (resObj != null) {
        resObj.fearure.remove();
        MapGisApp.resList[resid] = null;
    }
}

// 更新资源经纬度坐标
function updateResFeatureLonLat(resid, lonlat) {
    var resObj = MapGisApp.resList[resid];
    if (resObj != null) {
        resObj.fearure.UpdateLonLat(lonlat);
    }
}

// 更新资源的样式
function updateResFeatureStyle(resid, style) {
    var resObj = MapGisApp.resList[resid];
    if (resObj != null) {
        resObj.fearure.UpdateTextStyle(style);
        MapGisApp.resList[resid] = null;
    }
}

// 移除所有资源
function removeResFeatureAll() {
    for (var key in MapGisApp.resList) {
        removeResFeature(key);
    }
    //
    MapGisApp.resList = new Array();
}

//
function changeZoomShowHideResTextName(izoom) {
    if (izoom == 12) {
        MapGisApp.reslayer.setVisible(false);
    } else if (izoom == 13) {
        MapGisApp.reslayer.setVisible(true);
    } else if (izoom == 14) {
        for (var resid in MapGisApp.resList) {
            var resObject = MapGisApp.resList[resid];
            resObject.fearure.UpdateText("");
        }
    } else if (izoom == 15) {
        for (var resid in MapGisApp.resList) {
            var resObject = MapGisApp.resList[resid];
            resObject.fearure.UpdateText(resObject.raw.name);
        }
    }
}

/** ******************************************************************************************** */
// 摄像头报警聚合
MapGisApp.deviceClusterLayer = null;
// 门禁报警聚合
MapGisApp.doorClusterLayer = null;
//摄像头点位
MapGisApp.devicePointerClusterLayer = null;
//门禁点位
MapGisApp.devicePointerClusterLayer = null;
//设备类型数组
MapGisApp.pointType = [];

// 创建报警聚合图层
function createDeviceCluster() {
    //卡口
    var optionsCamera = {};
    optionsCamera.userType = "camera";
    // 聚合范围
    optionsCamera.distance = 12;
    //
    MapGisApp.deviceClusterLayer = new rk.clusterLayer(MapGisApp.usermap, optionsCamera);
    MapGisApp.devicePointerClusterLayer = new rk.clusterLayer(MapGisApp.usermap, optionsCamera);

    //门禁
    var optionsDoor = {};
    optionsDoor.userType = "door";
    optionsDoor.distance = 12;
    MapGisApp.doorClusterLayer = new rk.clusterLayer(MapGisApp.usermap, optionsDoor);
    MapGisApp.doorPointerClusterLayer = new rk.clusterLayer(MapGisApp.usermap, optionsDoor);
    //TODO:点击点位显示弹窗
    //MapGisApp.usermap.EnableSelectFeature([MapGisApp.deviceClusterLayer.getLayer(), MapGisApp.doorClusterLayer.getLayer(), MapGisApp.devicePointerClusterLayer.getLayer(), MapGisApp.doorPointerClusterLayer.getLayer()], selectFeatureCB, null, clickDeviceLayerFeature);
    MapGisApp.devicePointerClusterLayer.setVisible(false);
    MapGisApp.doorPointerClusterLayer.setVisible(false);
    //MapGisApp.usermap.EnableSelectFeature([], selectDoorFeatureCB, null, clickDoorLayerFeature)
}

/**
 * 点击选中点回调函数
 *
 * @author lhp 2017-4-6 下午8:01:24
 * @param e
 */
function selectFeatureCB(selected) {
    if (selected.length > 0) {
        var deviceIds = "";
        var lon = null;
        var lat = null;
        var myobj = this;
        var type = null;
        $.each(selected[0].U.features, function (index, feature) {
            if (deviceIds != "") {
                deviceIds += ",";
            }
            var point = feature.getGeometry().getFirstCoordinate();
            point = MapGisApp.usermap.UseToDisplayTransForm(point);
            lon = point[0];
            lat = point[1];
//			return {lon:point[0],lat:point[1]};
            deviceIds += feature.getId();
            type = MapGisApp.pointType[feature.getId()];
        });
        //console.log("坐标" + lon + "+" + lat + "");
        //console.log(deviceIds.substring(0, 7));
        if (type == 2) {
            reloadAlarmPersonInfos(deviceIds, lon, lat);
        }
    }
}

/**
 * 点击地图上摄像头，展示相应的报警信息
 *
 * @author lhp 2017-4-6 下午4:01:27
 * @param deviceIds
 */
function reloadAlarmPersonInfos(deviceIds, lon, lat) {
    console.log(deviceIds, lon, lat);
    var htmlMapText = createMapAlarmInfoHtml(alarminfoFirst, "2");
    showMapOverlayHtml(changeAlarmInfo(alarminfoFirst),
        htmlMapText, alarminfoFirst.type);
}

/**
 * 展示聚合点位信息
 * @author lch 2017-9-4
 */
function showDeviceInfo(deviceIds, lon, lat) {
    //console.log(showRealAlarmObject);
    var html = '';
    var allCount = null;
    if (messageAccept == true) {
        html += '<div style="width:216px;height:200px;background-color:#fff">';
        var deviceStr = deviceIds.split(",");
        html += '<div style="color: #3aa0ff;height: 26px; padding-top: 5px;padding-left: 5px;"><span>点位列表(&nbsp;</span><span style="color:red" id="pointAlarmCount"></span>&nbsp;/<span >&nbsp;' + deviceStr.length + '&nbsp;</span><span>)</span></div>';
        html += '<hr>';
        html += '<div style="height:167px;overflow:hidden;overflow-y:scroll">';
        for (var i = 0; i < deviceStr.length; i++) {
            html += '<div style="color:#829396;width:190px;padding-left:5px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;" >';
            html += '<span>(&nbsp;</span><span style="color:red" >' + showRealAlarmObject.alarmCount[deviceStr[i]] + '</span><span>&nbsp;)</span>'
            html += '<span id="' + deviceStr[i] + '" title="' + showRealAlarmObject.devceName[deviceStr[i]] + '" class="point_cls" style="cursor:pointer;">&nbsp;' + showRealAlarmObject.devceName[deviceStr[i]] + '</span>';
            html += '</div>';
            if (showRealAlarmObject.alarmCount[deviceStr[i]] > 0) {
                allCount += showRealAlarmObject.alarmCount[deviceStr[i]];
            }
        }
        html += '</div>';
        html += '</div>';
    }
    else {
        html += '<div style="width:216px;height:200px;background-color:#fff">';
        var deviceStr = deviceIds.split(",");
        html += '<div style="    height: 26px; padding-top: 5px;padding-left: 5px;"><span>点位列表(</span><span style="color:red">&nbsp;' + deviceStr.length + '&nbsp;</span><span>)</span></div>';
        html += '<hr>';
        html += '<div style="height:167px;overflow:hidden;overflow-y:scroll">';
        for (var i = 0; i < deviceStr.length; i++) {
            console.log(showRealAlarmObject.alarmCount[deviceStr[i]]);
            html += '<div style="color:#829396;width:190px;padding-left:5px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;" >';
            html += '<span id="' + deviceStr[i] + '" class="point_cls"  title="' + showRealAlarmObject.devceName[deviceStr[i]] + '" style="cursor:pointer;">' + (i + 1) + '.' + showRealAlarmObject.devceName[deviceStr[i]] + '</span>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';
    }
    var lonlat = {
        'lon': lon,
        'lat': lat,
        'name': showRealAlarmObject.devceName[deviceStr[0]]
    };
    showMapOverlayOtherHtml(lonlat, html, 3);
    $("#pointAlarmCount").html(allCount);
    $(".point_cls").bind("click", loadPointCB);
}

/**
 * 点击列表点位展示相应的报警信息
 */
function loadPointCB() {

}

// 转换报警信息经纬度
function changeAlarmInfo(alarminfo) {
    var deviceInfo = alarminfo;
    if (!deviceInfo) return;
    return {
        lon: parseFloat(deviceInfo.captureDeviceLon),
        lat: parseFloat(deviceInfo.captureDeviceLat),
        name: deviceInfo.captureDeviceName
    };
}

var alarmInfoArray = [];

/**
 * 加载报警人列表回调函数
 *
 * @author lhp 2017-4-6 上午10:22:11
 * @param alarmInfoData
 */
function loadNewAlarmPersoninfoCB(data) {
    hideLayer(alarminfoObject.overlayer);
    if (data != "error") {
        $("#alarminfos_data_cls").empty();
        hideOverlay();
        var resultData = eval("(" + data + ")");
        alarmInfoArray = [];
        var totalArr = new Array();
        for (var indexNub in resultData.total) {
            var alarmObject = resultData.total[indexNub];
// if(alarmObject.personImg!=""&&alarmObject.idcard!=""&&alarmObject.idcard!=undefined&&alarmObject.idcard!=""){
            totalArr.push(alarmObject);
// }
        }

        resultData.total = totalArr;
        comparePicDialog.initAlarmData([]);
        for (var indexNum in resultData.total) {
            var alramObject = resultData.total[indexNum];

            var alarminfo = historyAlarmInfoToRealAlarm(alramObject);
            var htmlText = createAlarmInfoHtml(alarminfo);
            $("#alarminfos_data_cls").append(htmlText);
            comparePicDialog.initAlarmDataBefore(alarminfo);
        }
        $("#num_total").text(comparePicDialog.alarms.length);
        for (var num in resultData.total) {
            alarmInfoArray[resultData.total[num].alarmId] = (resultData.total[num]);
        }
        // 更新序号
        $(".indexPersonInfo").each(function (i) {
            this.innerHTML = i + 1;
        });
        //
        if (resultData.total.length == 0) {
            return;
        }
        //
        if (resultData.total[0].type == "2") {
            var alarminfoFirst = historyAlarmInfoToRealAlarm(resultData.total[0]);
            $.post("alarmInfo/checkAlarmVerifyInfo", {"alarmId": alarminfoFirst.alarmId}, function (data) {
                if (data == "2") {
                    var htmlMapText = createMapAlarmInfoHtml(alarminfoFirst, "2");
                    if (htmlMapText != null && htmlMapText != "") {
                        showMapOverlayHtml(changeAlarmInfo(alarminfoFirst),
                            htmlMapText, alarminfoFirst.type);
                    }
                } else if (data == "1") {
                    var htmlMapText = createMapAlarmInfoHtml(alarminfoFirst, "1");
                    if (htmlMapText != null && htmlMapText != "") {
                        showMapOverlayHtml(changeAlarmInfo(alarminfoFirst),
                            htmlMapText, alarminfoFirst.type);
                    }
                } else {
                    var htmlMapText = createMapAlarmInfoHtml(alarminfoFirst, "");
                    if (htmlMapText != null && htmlMapText != "") {
                        showMapOverlayHtml(changeAlarmInfo(alarminfoFirst),
                            htmlMapText, alarminfoFirst.type);
                    }
                }
            });
        }
        else {
            var alarminfoFirst = historyAlarmInfoToRealAlarm(resultData.total[0]);
            var htmlMapText = createMapDoorInfoHtml(alarminfoFirst);
            if (htmlMapText != null && htmlMapText != "") {
                showMapOverlayHtml(changeAlarmInfo(alarminfoFirst),
                    htmlMapText, alarminfoFirst.type);
            }
        }
        if (showRealAlarmObject.type == 1) {
            $("#taskId").combobox({disabled: true});
        }
        else {
        }
        $(".alarminfoCls").click(function () {
            if (AcceptSocket == false) {
                if (stopTime != undefined && stopTime != null && stopTime != "") {
                    stopTime = 14;
                    initTimeRecord();
                }
            }
            else {
                if (time == undefined || time == null) {
                    closeAcceptSocket();
                    createStopTime();
                    initTimeRecord();
                }
            }
            createAlarmInfo(this);
        });
    }
}

function createAlarmInfo(data) {
    var htmlMapText = createMapAlarmInfoHtml(data, "2");
    if (htmlMapText != null && htmlMapText != "") {
        showMapOverlayHtml(changeAlarmInfo(data),
            htmlMapText, 2);
    }

}

// 创建地图显示弹出框
function createMapAlarmInfoHtml(alarminfo, flag) {
    var personInfo = alarminfo;
    /*if (personInfo.personImg == undefined || personInfo.personImg == "" || personInfo.personImg == null) {
        personInfo.personImg = "static/image/showrealalarm/wuzhaop.png";
    }
    if (alarminfo.pictureUrl == undefined || alarminfo.pictureUrl == "" || alarminfo.pictureUrl == null) {
        alarminfo.pictureUrl = "static/image/showrealalarm/wuzhaop.png";
    }*/
    var showHtml = '';
    //
    showHtml += '<div class="alarmInfoTitleCls" style="border-bottom: 2px solid #3aa0ff;">';
    showHtml += '<div class="alarmInfoTitleLogo"></div>' +
        '<div class="alarmInfoTitleCnt">' + personInfo.captureDeviceName + '</div>';
    showHtml += '</div>';
    showHtml += '<div id="map' + personInfo.alarmId + '" class="alarminfoMapCls">';
    if (alarminfo.videoUrl != undefined && alarminfo.videoUrl != null && alarminfo.videoUrl != "" && alarminfo.videoUrl != "-1" && alarminfo.videoUrl != "0") {
        showHtml += '<div><video class="alarmVideo" autoplay="autoplay" src="' + alarminfo.videoUrl + '" controls="controls"></video></div>';
    }
    else {
        showHtml += '<div>' +
            '<img style="margin-left:10px;width:475px;height:248px;"  src="' + personInfo.sceneUrl + '" onclick="comparePicDialog.showImgDialogBefore(\'' + alarminfo.alarmId + '\',1)" />' +
            '</div>';
    }
    showHtml += '<div class="alarmCompare">';
    showHtml += '<div class="faceImageImg">';
    showHtml += '<div class="similarity" onclick="comparePicDialog.showCompareData(\''
        + alarminfo.alarmId + '\',\'' + personInfo.faceUrl + '\',\''
        + alarminfo.capturePersonImgUrl + '\',\'' + personInfo.similarity
        + '\',\'' + personInfo.idcard + '\')" style="cursor:pointer">';
    showHtml += '<div class="similarityTitle">相似度</div>';
    showHtml += '<div class="similarityValue">' + Number(personInfo.similarity).toFixed(2) + '%</div>';
    showHtml += '</div>';
    showHtml += '<img class="facecls1" src="' + personInfo.capturePersonImgUrl
        + '" title="在库人脸" onclick="comparePicDialog.showImgDialogBefore(\'' + alarminfo.alarmId + '\')" />';// onclick="showPersonFaceImageBefore(this);"
    showHtml += '<img class="capcls" src="' + alarminfo.faceUrl
        + '" title="抓拍人脸" onclick="comparePicDialog.showImgDialogBefore(\'' + alarminfo.alarmId + '\')" />';// onclick="pictureFaceEventClick(\''alarminfo.alarmId
    showHtml += '</div>';
    showHtml += '<div class="faceImageTitle">';
    showHtml += '<div class="faceImageTitleLeftCls">比对图片</div>';
    showHtml += '<div class="faceImageTitleRightCls">抓拍图片</div>';
    showHtml += '</div>';
    showHtml += '</div>';
    showHtml += '<div style="float:left;width:235px;">';
    showHtml += '<div class="personInfoCls">';
    showHtml += '<div class="personNameCls1">' + personInfo.capturePersonName + '</div>';
    if (flag == "1") {
        showHtml += '<div style="width: 98px;padding-left: 126px; margin-top: 7px;">';
        showHtml += '</div>';
        showHtml += '<div class="ensure_span" style=" background-color: #0d92a6;" onclick="comparePicDialog.showImgDialogBefore(\'' + alarminfo.alarmId + '\')"><span class="ensure_span_tong">同一人</span></div>';
    } else if (flag == "2") {
        showHtml += '<div style="width: 98px;padding-left: 126px; margin-top: 7px;">';
        showHtml += '</div>';
        showHtml += '<div class="ensure_span" style=" background-color: #d74c4c;" onclick="comparePicDialog.showImgDialogBefore(\'' + alarminfo.alarmId + '\')"><span class="ensure_span_tong">不同人</span></div>';
    } else {
        showHtml += '<div style="width: 98px;padding-left: 126px; margin-top: 7px;">';
        showHtml += '</div>';
        showHtml += '<div class="ensure_span" style=" background-color: #e89a36;"  onclick="comparePicDialog.showImgDialogBefore(\'' + alarminfo.alarmId + '\')"><span class="ensure_span_tong">待确认</span></div>';
    }
    showHtml += '</div>';
    showHtml += '<div class="personLabelsCls">';
    if (!alarminfo.repositoryName) {
        alarminfo.repositoryName = "";
    }
    showHtml += '<div  style="width: 200px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;" class="taskCls">' + getDatagridDivContent({
        "value": "布控任务: " + alarminfo.repositoryName,
        "length": 20,
        "offSet": 5
    }) + '</div>';
    showHtml += '</div>';
    showHtml += '<div class="personLabelsCls">';
    showHtml += '<div class="personIDCardCls" onclick="openPostWindow(\''
        + personInfo.capturePersonIdCard + '\')" id="personIDCardIdMap_'
        + personInfo.capturePersonIdCard + '" >';
    if (personInfo.hasOwnProperty('capturePersonIdCard')) showHtml += personInfo.capturePersonIdCard + '</div>';
    if (personInfo.hasOwnProperty('capturePersonIdcard')) showHtml += personInfo.capturePersonIdcard + '</div>';
    showHtml += '		</div>';

    showHtml += '<!--任务标签-->';
    showHtml += '<div class="personLable" title="' + personInfo.capturePersonLabel + '">' + label.personLabel({
        "value": personInfo.capturePersonLabel
    }) + '</div><div>';
    showHtml += '<div class="alarmTimeCls">报警时间:' + alarminfo.captureTime + '</div>';
    showHtml += '<div class="faceBntCls">';
    showHtml += '</div>';
    showHtml += '</div>';
    showHtml += '</div>';
    return showHtml;
}

// 创建报警消息 内容
function createAlarmInfoHtml(alarminfo) {
    showRealAlarmObject.showDataMap[alarminfo.alarmId] = alarminfo;
    //
    if (alarminfo.personInfo == null || alarminfo.personInfo.length == 0) {
        return "";
    }
    var personInfo = "";


    personInfo = alarminfo.personInfo[0];

    // 创建门禁消息报警
    if (alarminfo.type == '1') {
        if (personInfo.personImg == undefined || personInfo.personImg == "" || personInfo.personImg == null) {
            personInfo.personImg = "static/image/showrealalarm/wuzhaop.png";
        }
        var showHtml = '';
        showHtml += '<div id="a' + alarminfo.alarmId
            + '" class="alarminfoCls" style="">';
        showHtml += '	<!-- 编号 -->';
        showHtml += '	<!-- 人脸信息 -->';
        showHtml += '	<div class="faceImageImg">';
        showHtml += '<div class="doorInfolog"></div>';
        showHtml += '<div style="width:10px;height:100%;float:left;    border-left: 1px solid #e3e3e3;"></div>';
        showHtml += '<div class="taskInfoBottom">';
        showHtml += '		<img class="facecls" src="' + personInfo.personImg
            + '" title="在库人脸" />';
        showHtml += '	<div class="personInfoCls">';
        showHtml += '		<div class="alarmInfoTitleCnt" title="' + alarminfo.deviceName + '"style="color:#e68717;width: 139px;white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">' + alarminfo.deviceName
            + '</div>';
        if (personInfo.personName != undefined && personInfo.personName != "" && personInfo.personName != null) {
            showHtml += '		<div class="personNameCls">' + personInfo.personName;
        }
        else {
            showHtml += '		<div class="personNameCls">未知';
        }
        showHtml += '	</div>';
        showHtml += '		<!-- 报警时间 -->';
        showHtml += '		<div class="alarmTimeCls">'
            + alarminfo.updateTime.replace(".0", "") + '</div>';
        showHtml += '		<div class="faceBntCls">';
        showHtml += '</div>';
        showHtml += '		</div>';
        showHtml += '	</div>';
        return showHtml;
    }
    // 创建卡口消息报警
    else if (alarminfo.type == '2') {
        //
        //
        var deviceName1 = null;
        var deviceName2 = null;
        if (alarminfo.deviceName != undefined) {
            if (alarminfo.deviceName.length > 18) {
                deviceName1 = alarminfo.deviceName.substring(0, 9);
                deviceName2 = alarminfo.deviceName.substring(9, alarminfo.deviceName.length);
            }
        }

        var showHtml = '';
        //
        showHtml += '<div id="a' + alarminfo.alarmId
            + '" class="alarminfoCls" style="">';
        showHtml += '	<!-- 编号 -->';
        showHtml += '	<!-- 人脸信息 -->';
        showHtml += '	<div class="faceImageImg">';
        showHtml += '<div class="alarmInfolog"></div>';
        showHtml += '<div style="width:10px;height:100%;float:left;    border-left: 1px solid #e3e3e3;"></div>';
        showHtml += '<div class="taskInfoBottom">';
        if (personInfo.personName == undefined) {
            personInfo.personName = "";
        }
        showHtml += '		<img class="facecls" src="' + personInfo.personImg
            + '" title="在库人脸"  />';
        showHtml += '	<div class="personInfoCls">';
        if (alarminfo.deviceName != undefined) {
            if (alarminfo.deviceName.length > 18) {
                showHtml += '		<div class="alarmInfoTitleCnt" title="' + alarminfo.deviceName + '" style="width: 139px;text-overflow: ellipsis;overflow: hidden;">' + deviceName1
                    + '</div>';
                showHtml += '		<div class="alarmInfoTitleCnt" title="' + alarminfo.deviceName + '" style="margin-top:0px;width: 139px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">' + deviceName2
                    + '</div>';
            }
            else {
                showHtml += '		<div class="alarmInfoTitleCnt" title="' + alarminfo.deviceName + '" style="width: 139px;text-overflow: ellipsis;overflow: hidden;">' + alarminfo.deviceName
                    + '</div>';
            }
        }
        else {
            alarminfo.deviceName = '未知地点';
            showHtml += '		<div class="alarmInfoTitleCnt" title="' + alarminfo.deviceName + '" style="width: 139px;text-overflow: ellipsis;overflow: hidden;">' + alarminfo.deviceName
                + '</div>';
        }

        showHtml += '		<div class="personNameCls" title="' + personInfo.personName + '" style="width: 139px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">' + personInfo.personName;
        showHtml += '	</div>';
        showHtml += '		<!-- 报警时间 -->';
        showHtml += '		<div class="alarmTimeCls">'
            + alarminfo.updateTime.replace(".0", "") + '</div>';
        showHtml += '		<div class="faceBntCls">';
        showHtml += '</div>';
        showHtml += '		</div>';
        showHtml += '	</div>';
        return showHtml;
    }
}

function personTestDetail(idCard) {
    if (idCard != null) {
        $.post("personTest/queryPersonTestByIdCard", {
            idCard: idCard
        }, function (response) {
            if (response == "error") {
                alertMessage("提示", '数据库中不存在!', 'error');
            } else {
                showPersonTestDialog(idCard);
            }
        });

    }

}

/**
 * 清空选中点
 *
 * @author lhp 2017-4-6 下午7:59:11
 */
function clearSelectFeature() {
    MapGisApp.usermap.clearSelectFeature();
    // 关闭弹框
    $("#userpopup_closer").click();
}

var Id = "";

// 点击事件
function clickDeviceLayerFeature(fearure) {
    if (fearure == null) return;
    var sizeNum = null;
    var style = null;
    var type = null;
    var _width = $(window).width();
    var scale = 0.9;
    if (_width >= 1920) {//大屏
        MapGisApp.mapparam.mouseWheelZoom = true;//滚轮缩放
        scale = 1.8;
    } else {
        MapGisApp.mapparam.mouseWheelZoom = false;//滚轮缩放
        scale = 0.9
    }
    if (fearure.U.features[0].getId() != undefined) {
        type = MapGisApp.pointType[fearure.U.features[0].getId()];
    }
    if (messageAccept == true) {
        sizeNum = MapGisApp.deviceClusterLayer.getFeaturesSizeNum(fearure.U.features);
        if (sizeNum == 0) {
            sizeNum = MapGisApp.doorClusterLayer.getFeaturesSizeNum(fearure.U.features);
        }
        var strSizeNum = (sizeNum > 100 ? "99+" : sizeNum.toString());
        if (type == 2) {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 15,
                    stroke: new ol.style.Stroke({
                        color: "red"
                    }),
                    fill: new ol.style.Fill({
                        color: "red"
                    })
                }),
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 14],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    scale: scale,
                    src: '/public/image/showrealalarm/map_camera_click.png'
                })),
            });
        }
        else {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 15,
                    stroke: new ol.style.Stroke({
                        color: "red"
                    }),
                    fill: new ol.style.Fill({
                        color: "red"
                    })
                }),
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 14],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    scale: scale,
                    src: 'static/image/showrealalarm/map_entranceguard_click.png'
                })),
            });
        }

    }
    else if (messageAccept == false) {
        for (var i = 0 in fearure.U.features) {
            sizeNum += 1;
        }
        var strSizeNum = (sizeNum > 100 ? "99+" : sizeNum.toString());
        if (type == 2) {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 15,
                    stroke: new ol.style.Stroke({
                        color: "red"
                    }),
                    fill: new ol.style.Fill({
                        color: "red"
                    })
                }),
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 13],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    scale: 1,
                    src: 'static/image/showrealalarm/map_camera_click_1.png'
                })),
            });
        }
        else if (type == 1) {
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 15,
                    stroke: new ol.style.Stroke({
                        color: "red"
                    }),
                    fill: new ol.style.Fill({
                        color: "red"
                    })
                }),
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 13],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    scale: 1,
                    src: 'static/image/showrealalarm/map_entranceguard_click_1.png'
                })),
            });
        }

    }

    /*if (parent.AcceptSocket == false) {
        if (parent.stopTime != undefined && parent.stopTime != null && parent.stopTime != "") {
            parent.stopTime = 14;
            parent.initTimeRecord();
        }
    }
    else {
        if (parent.time == undefined || parent.time == null) {
            parent.closeAcceptSocket();
            parent.createStopTime();
            parent.initTimeRecord();
        }
    }*/
    return style;
}

//点击事件
function clickDoorLayerFeature(fearure) {
    if (fearure == null) return;
    var sizeNum = MapGisApp.deviceClusterLayer.getFeaturesSizeNum(fearure.U.features);
    var strSizeNum = (sizeNum > 100 ? "99+" : sizeNum.toString());
    var style = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 20],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'static/image/showrealalarm/map_entranceguard_click.png'
        })),
    });

    return style;
}

//

function addDeviceCluster(jsonObject) {
    if (!jsonObject) return;
    //console.log(jsonObject);
    var lonlat = {lon: parseFloat(jsonObject.longitude), lat: parseFloat(jsonObject.latitude)};
    //设备类型数组
    jsonObject.type = 2;
    MapGisApp.pointType[jsonObject.deviceId] = jsonObject.type;
    jsonObject.count = 1;
    if (jsonObject.type == 2) {
        MapGisApp.devicePointerClusterLayer.addPointInfo(jsonObject.deviceId, lonlat, 1, 4);
        if (jsonObject.count > 0) {
            MapGisApp.deviceClusterLayer.addPointInfo(jsonObject.deviceId, lonlat, jsonObject.count, jsonObject.type);
        }
    }
    else {
        MapGisApp.doorPointerClusterLayer.addPointInfo(jsonObject.deviceId, lonlat, 1, 3);
        if (jsonObject.count > 0) {
            MapGisApp.doorClusterLayer.addPointInfo(jsonObject.deviceId, lonlat, jsonObject.count, jsonObject.type);
        }

    }
}

//
function updateDeviceCluster(jsonObject) {

    var lonlat = {
        lon: parseFloat(jsonObject && jsonObject.longitude),
        lat: parseFloat(jsonObject && jsonObject.latitude)
    };
    //
    MapGisApp.deviceClusterLayer.addPointInfo(jsonObject && jsonObject.Id, lonlat, jsonObject && jsonObject.count);
}

//
function updateDeviceClusterAddNumOne(Id) {
    MapGisApp.deviceClusterLayer.updatePointInfoAddSize(Id);
}

/**
 * 清空地图上的标记
 */
function clearDeviceMap() {
    MapGisApp.deviceClusterLayer.clearPointInfos();
    MapGisApp.doorClusterLayer.clearPointInfos();
    MapGisApp.devicePointerClusterLayer.clearPointInfos();
    MapGisApp.doorPointerClusterLayer.clearPointInfos();
}

/**
 * 创建热力图层
 */
MapGisApp.createHeatMap = function () {
    MapGisApp.heatlayer = new ol.layer.Heatmap({
        source: new ol.source.Vector(),
        blur: parseInt(30),
        radius: parseInt(15)
    });
    MapGisApp.usermap.addLayer(MapGisApp.heatlayer);
    MapGisApp.heatlayer.setVisible(false);
};
/**
 * 描绘热力图点信息
 */
MapGisApp.InitHeatMap = function (data) {
    MapGisApp.heatlayer.getSource().clear();

    var list = data;
    //console.log(list)
    for (var i = 0; i < list.length; i++) {
        var adddata = list[i];
        var pointArr = MapGisApp.usermap.DisplayToUseTransForm([adddata && adddata.longitude, adddata && adddata.latitude]);// 转换坐标
        var feature = new ol.Feature({
            geometry: new ol.geom.Point(pointArr)
        });
        feature.setId(adddata.deviceId);
        MapGisApp.heatlayer.getSource().addFeature(feature);
    }
}
/**
 * 切换报警图和热力图
 */
MapGisApp.toogleHeatMapAndAlarm = function (state) {
    MapGisApp.heatlayer.setVisible(state);
}

/***********************************门禁聚合*********************************************************/
function getDatagridDivContent(options) {
    var str = "";
    options = $.extend(true, {}, {
        "value": "",
        "length": 6,
        "offSet": 0,
        "divContainer": true
    }, options);
    if (options.value != undefined) {
        if (options.divContainer) {
            str += "<div class='overflowhidden' >";
        }
        str += "<span title='" + options.value.substring(options.offSet)
            + "'>" + options.value.substring(0, options.length);
        if (options.value.length > options.length) {
            str += "...";
        }
        str += "</span>";
        if (options.divContainer) {
            str += "</div>";
        }
    }
    return str;
};
