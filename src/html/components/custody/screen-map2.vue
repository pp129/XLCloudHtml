<template>
    <div class="screen-page-map">
        <!-- 标题 -->
        <div class="page-title">
            <h1 class="title-text">雪亮监护</h1>
        </div>
        <!-- 地图 -->
        <div id="showMap">
            <!-- 详情弹框 -->
            <div class="ol-popup" id="popup">
                <a href="javascript:void(0)" id="popup-closer" class="ol-popup-closer"></a>
                <div id="userpopup_content">
                    <div class="alarmInfoTitleCls" style="border-bottom: 2px solid #0891a5;">
                        <div class="alarmInfoTitleLogo"></div>
                        <div class="alarmInfoTitleCnt">{{popup.deviceName}}</div>
                    </div>
                    <div class="alarminfoMapCls" style="width: 490px;">
                        <div>
                            <img style="margin-left:10px;width:475px;height:248px;" :src="popup.sceneUrl"
                                 :onerror="reloadImg(popup.sceneUrl)"/>
                        </div>
                        <div style="float:left;width:245px;padding-left:5px;padding-top:5px">
                            <!-- 人脸信息 -->
                            <div class="faceImageImg" style="width: 250px;">
                                <div class="similarity" style="cursor:pointer">
                                    <div class="similarityTitle">相似度</div>
                                    <div class="similarityValue">{{popup.similarity}}%</div>
                                </div>
                                <img class="facecls1" :src="popup.capturePersonImgUrl" title="在库人脸">
                                <img class="capcls" :src="popup.faceUrl" title="抓拍人脸">
                            </div>
                            <div class="faceImageTitle">
                                <div class="faceImageTitleLeftCls">比对图片</div>
                                <div class="faceImageTitleRightCls">抓拍图片</div>
                            </div>
                        </div>
                        <div style="float:left;width:235px;">
                            <!-- 人的基本信息 -->
                            <div class="personInfoCls">
                                <div class="personNameCls1">{{popup.personName}}</div>
                                <div
                                    style="width: 98px;height: 77px;padding-left: 126px; margin-top: 7px;position: absolute"></div>
                                <div class="ensure_span" :class="ensureStyle(popup.status)">
                                    <span>{{popup.status}}</span></div>
                            </div>
                            <!-- 人的标签信息  -->
                            <div class="personLabelsCls">
                                <div class="personIDCardCls">
                                    {{popup.idcard}}
                                </div>
                            </div>
                            <!-- 人员标签  -->
                            <div class="personLable" title="undefined">
                                <p-label class="label-content" v-bind:labels="popup.label"></p-label>
                            </div>
                            <div>
                                <!-- 报警时间 -->
                                <div class="alarmTimeCls">报警时间：{{popup.time}}</div>
                                <div class="faceBntCls"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 聚合点位展开列表 -->
            <div class="ol-popup-list" id="popupList">
                <div class="ol-popup-header">
                    <span class="pop-header-title">点位列表（{{popupList.total}}）</span>
                    <span id="popup-list-closer" class="ol-popup-closer"></span>
                </div>
                <div id="popup-list-content">
                    <ul class="pop-content-list">
                        <li class="pop-list-item" v-for="item in popupList.data" @click="popDetail(item)">
                            <i class="pop-list-icon" :class="iconFn(item.aLarmType)"></i><span
                            class="pop-list-text">{{item.deviceName}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 热力图例 -->
        <div class="heat-map-legend" v-if="valueActive"></div>
        <!-- 左侧数据展示 -->
        <div class="data-area">
            <h1 class="data-area-title">雪亮监护</h1>
            <div class="data-area-statistics" v-for="item in statisticsData">
                <p class="statistics-text">{{item.name}}</p>
                <h2 class="statistics-value">{{item.value}}</h2>
            </div>
            <div class="data-area-legend">
                <!-- 地图元素图例 -->
                <p class="legend-rows">
                    <i class="legend-icon legend-icon-device"></i>
                    <span class="legend-text">摄像机</span>
                </p>
                <p class="legend-rows">
                    <i class="legend-icon legend-icon-alarm"></i>
                    <span class="legend-text">告警</span>
                </p>
                <!-- 地图模式开关 -->
                <div class="map-state-switch">
                    <el-switch
                        v-model="valueActive"
                        @change="changeActive"
                        active-color="#13ce66"
                        inactive-text="活动热力图"
                        inactive-color="#194998">
                    </el-switch>
                    <!--<el-switch
                        v-model="valueAddress"
                        @change="changeAddress"
                        active-color="#13ce66"
                        inactive-text="住址热力图"
                        inactive-color="#194998">
                    </el-switch>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Feature from 'ol/Feature';
    import Map from 'ol/Map';
    import Overlay from 'ol/Overlay';
    import View from 'ol/View';
    import XYZ from 'ol/source/XYZ';
    import Point from 'ol/geom/Point';
    import {Tile as TileLayer, Vector as VectorLayer, Heatmap as HeatmapLayer} from 'ol/layer';
    import {Cluster, OSM, Vector as VectorSource} from 'ol/source';
    import {Circle as CircleStyle, Fill, Stroke, Style, Text, Icon} from 'ol/style';
    import {defaults as controlDefault, ZoomSlider} from 'ol/control';
    import {defaults as interactionDefaults, Select} from 'ol/interaction';
    import {fromLonLat, toLonLat} from 'ol/proj';

    let axios = require('axios');
    export default {
        name: "screen-map2",
        props: ["attrs"],
        components: {
            pLabel: () => import("../../../html/components/personLabel.vue"),
        },
        data: function () {
            return {
                valueActive: false,
                valueAddress: false,
                heatData: [],//热力图点位
                statisticsData: [
                    {
                        name: '总人数',
                        value: '',
                        id: 'totalPersonCount'
                    }, {
                        name: '抓拍人数',
                        value: '',
                        id: 'totalCapturePersonCount'
                    }, {
                        name: '抓拍次数',
                        value: '',
                        id: 'totalCaptureTimes'
                    }, {
                        name: '今日人数',
                        value: '',
                        id: 'todayCapturePersonCount'
                    }, {
                        name: '今日次数',
                        value: '',
                        id: 'todayCaptureTimes'
                    }, {
                        name: '从未出现人数',
                        value: '',
                        id: 'neverShowPersonCount'
                    }
                ],//统计信息
                mapObject: {},//地图对象
                overlay: {},//弹窗图层
                overlayList: {},//点位列表图层
                view: {},//地图视图
                source: {
                    device: {},
                    alarm: {}
                },//点位元素资源【分类】
                clusters: {
                    device: {},
                    alarm: {}
                },//聚合图层【分类】
                distance: 12,
                count: 2000,
                coordinates: [],//设备点位
                heatMapLayer: {},//热力图图层
                heatPoints: [],//热力图点位
                popup: {//详情弹窗
                    deviceName: '',
                    longitude: '',
                    latitude: '',
                    idcard: '',
                    personName: '',
                    similarity: '',
                    label: '',
                    time: '',
                    sceneUrl: '',
                    faceUrl: '',
                    capturePersonImgUrl: '',
                    status: '',
                    deviceId: ''
                },
                popupList: {//点位列表弹框
                    total: 0,
                    data: []
                }
            }
        },
        mounted: function () {
            this.getStatistics();
            this.init();
            this.getHeatPoints();
            this.loadDeviceData('');
            //TODO:初始默认弹出动态抓拍信息第一个人的信息
            if (this.attrs) {
                console.log(this.attrs);
                this.popDetail(this.attrs)
            }
        },
        methods: {
            //TODO:初始化地图
            init() {
                //瓦片
                let raster = new TileLayer({
                    source: new XYZ({
                        projection: 'EPSG:4326',
                        url: "/PGIS_S_TileMapServer/Maps/sl2015/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3&key=one"
                    })
                });
                let view = new View({
                    center: fromLonLat([118.096435, 24.485408]),
                    zoom: 13,
                    maxZoom: 17,
                    minZoom: 12
                });
                this.view = view;
                //判断屏幕大小
                let _width = document.body.offsetWidth;
                let mouseWheelZoom = false;
                let controllers = {};
                let zoomSlider = null;
                if (_width > 1920) {
                    mouseWheelZoom = true;
                    controllers = controlDefault({
                        zoom: false
                    });
                } else {
                    controllers = controlDefault({
                        attributionOptions: {
                            collapsible: false
                        },
                        zoom: true
                    });
                    mouseWheelZoom = false;
                    zoomSlider = new ZoomSlider();
                }
                //创建地图
                let mapObject = new Map({
                    target: 'showMap',
                    layers: [raster],
                    view: view,
                    controls: controllers,
                    interactions: interactionDefaults({
                        mouseWheelZoom: mouseWheelZoom,
                    })
                });
                //缩放
                //let zoomSlider = new ZoomSlider();
                if (zoomSlider) {
                    mapObject.addControl(zoomSlider);
                }

                //创建弹窗
                let container = document.getElementById('popup');
                //let content = document.getElementById('popup-content');
                let closer = document.getElementById('popup-closer');
                let overlay = new Overlay({
                    element: container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                this.overlay = overlay;
                mapObject.addOverlay(overlay);

                let list = document.getElementById('popupList');
                let listCloser = document.getElementById('popup-list-closer');
                let overlayList = new Overlay({
                    element: list,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                this.overlayList = overlayList;
                mapObject.addOverlay(overlayList);

                //选中样式
                let selectStyle = {};
                let select = new Select({
                    style: function (feature) {
                        let size = feature.get('features').length;
                        let style = selectStyle[size];
                        if (!style) {
                            style = new Style({
                                image: new Icon({
                                    anchor: [0.5, 12],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'pixels',
                                    scale: 0.9,
                                    src: '../../../public/image/showrealalarm/map_camera_click.png'
                                }),
                                text: new Text({
                                    text: size.toString(),
                                    fill: new Fill({
                                        color: '#fff'
                                    })
                                })
                            });
                            selectStyle[size] = style;
                        }
                        return style;
                    }
                });
                //mapObject.addInteraction(select);
                mapObject.on('pointermove', function (evt) {
                    mapObject.getTargetElement().style.cursor = mapObject.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
                });
                /**
                 * Add a click handler to hide the popup.
                 * @return {boolean} Don't follow the href.
                 */
                closer.addEventListener('click', function () {
                    overlay.setPosition(undefined);
                    closer.blur();
                    return false;
                });
                /**
                 * Add a click handler to the map to render the popup.
                 */
                let _this = this;
                mapObject.on('singleclick', function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    let flag = mapObject.hasFeatureAtPixel(evt.pixel);
                    if (flag) {
                        mapObject.removeOverlay(_this.overlay);
                        mapObject.removeOverlay(_this.overlayList);
                        let features = mapObject.getFeaturesAtPixel(evt.pixel);
                        _this.setPopup(features)
                    }
                });
                this.mapObject = mapObject;
            },
            //TODO:获取统计数据
            getStatistics: function () {
                axios.get(conf.api + '/labelPsychosisCount/getStatistics').then((res) => {
                    let data = res.data;
                    if (data.hasOwnProperty('successFlag') && data.successFlag) {
                        let statistics = data.data;
                        for (let i = 0; i < this.statisticsData.length; i++) {
                            for (let key in statistics) {
                                if (key === this.statisticsData[i].id) {
                                    this.statisticsData[i].value = this.toThousand(statistics[key]);
                                }
                            }
                        }
                    }
                })
            },
            //TODO:千分位转化
            toThousand: function (data) {
                let value = data.toString();
                let trans = '';
                while (value.length > 3) {
                    trans = ',' + value.slice(-3) + trans;
                    value = value.slice(0, value.length - 3)
                }
                if (value) {
                    return value + trans
                }
            },
            //TODO:获取热力图点位并生成热力图
            getHeatPoints() {
                this.heatMapLayer = new HeatmapLayer({
                    source: new VectorSource(),
                    blur: parseInt(30),
                    radius: parseInt(15)
                });
                this.heatMapLayer.getSource().clear();
                let result = {
                    "result": "success",
                    "data": {
                        "list": [{
                            "alarmCount": 12,
                            "latitude": 24.54789924621582,
                            "name": "厦门高崎国际机场T4国内出口#2",
                            "deviceId": "D00T003R20170713164248001050",
                            "longitude": 118.14430236816406
                        }, {
                            "alarmCount": 6,
                            "latitude": 24.54789924621582,
                            "name": "厦门高崎国际机场T4国内出口#1",
                            "deviceId": "D00T003R20170713164248001047",
                            "longitude": 118.14430236816406
                        }], "dateFlag": {}
                    }
                };
                if (result.result === 'success') {
                    let list = result.data.list;
                    //添加节点
                    for (let i = 0; i < list.length; i++) {
                        let addData = list[i];
                        // geometry: new Point(fromLonLat([Number(this.coordinates[i].longitude), Number(this.coordinates[i].latitude)]))
                        let pointArr = fromLonLat([addData.longitude, addData.latitude]);// 转换坐标
                        let feature = new Feature({
                            geometry: new Point(pointArr)
                        });
                        feature.setId(addData.deviceId);
                        this.heatMapLayer.getSource().addFeature(feature);
                    }
                }
            },
            //TODO:热力图状态切换
            changeActive: function () {
                /*MapGisApp.toogleHeatMapAndAlarm(this.valueActive);*/
                if (this.valueActive) {
                    this.mapObject.addLayer(this.heatMapLayer)
                } else {
                    this.mapObject.removeLayer(this.heatMapLayer)
                }
            },
            //TODO:获取所有摄像头点位
            loadDeviceData() {
                axios.get(conf.api + '/tBasDeviceInfo/getAllDeviceLocation').then((res) => {
                    let data = res.data;
                    if (data.hasOwnProperty('successFlag') && data.successFlag) {
                        this.coordinates = data.data;
                        this.showPointers();
                    }
                })
            },
            //TODO:显示点位
            showPointers() {
                //资源
                for (let key in this.source) {
                    this.source[key] = new VectorSource();
                }
                //let source = new VectorSource();
                //元素
                for (let i = 0; i < this.coordinates.length; i++) {
                    let coors = this.coordinates[i];
                    let iconFeature = new Feature({
                        geometry: new Point(fromLonLat([Number(this.coordinates[i].longitude), Number(this.coordinates[i].latitude)]))
                    });
                    let iconSrc = '';
                    let deviceType = '';
                    let iconStyle = {};
                    iconFeature.setId(this.coordinates[i].deviceId);
                    if (coors.hasOwnProperty('deviceType')) {
                        deviceType = coors.deviceType;
                    } else {
                        deviceType = '摄像机'
                    }
                    switch (deviceType) {
                        case '摄像机':
                            iconSrc = '../../../public/image/map-icon-device.png';
                            iconStyle = new Style({
                                image: new Icon({
                                    anchor: [0.5, 12],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'pixels',
                                    scale: 1,
                                    src: iconSrc
                                })
                            });
                            iconFeature.setStyle(iconStyle);
                            this.source.device.addFeature(iconFeature);
                            break;
                        case '告警':
                            iconSrc = '../../../public/image/map-icon-alarm-circle.png';
                            iconStyle = new Style({
                                image: new Icon({
                                    anchor: [0.5, 12],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'pixels',
                                    scale: 1,
                                    src: iconSrc
                                })
                            });
                            iconFeature.setStyle(iconStyle);
                            this.source.alarm.addFeature(iconFeature);
                            break;
                        default:
                            iconSrc = '../../../public/image/map-icon-device.png';
                            iconStyle = new Style({
                                image: new Icon({
                                    anchor: [0.5, 12],
                                    anchorXUnits: 'fraction',
                                    anchorYUnits: 'pixels',
                                    scale: 1,
                                    src: iconSrc
                                })
                            });
                            iconFeature.setStyle(iconStyle);
                            this.source.device.addFeature(iconFeature);
                    }
                }
                //聚合
                let clusterSource = {
                    device: {},
                    alarm: {}
                };
                for (let key in clusterSource) {
                    clusterSource[key] = new Cluster({
                        distance: parseInt(this.distance, 10),
                        source: this.source[key]
                    });
                }
                //矢量图
                for (let key in this.clusters) {
                    let styleCache = {};
                    this.clusters[key] = new VectorLayer({
                        source: clusterSource[key],
                        style: function (feature) {
                            let size = feature.get('features').length;
                            let style = styleCache[size];
                            if (!style) {
                                if (size > 1) {
                                    style = new Style({
                                        image: new CircleStyle({
                                            radius: 12,
                                            fill: new Fill({
                                                color: '#078cf2'
                                            }),
                                            stroke: new Stroke({
                                                color: '#fff',
                                                width: 1.2
                                            })
                                        }),
                                        text: new Text({
                                            text: size.toString(),
                                            fill: new Fill({
                                                color: '#fff'
                                            })
                                        })
                                    });
                                    styleCache[size] = style;
                                } else {
                                    style = feature.get('features')[0].getStyle();
                                }
                            }
                            return style;
                        }
                    });
                }
                for (let key in this.clusters) {
                    this.mapObject.addLayer(this.clusters[key])
                }
            },
            //TODO:获取元素
            getFeatures() {
                let features = [];
                for (let i = 0; i < this.coordinates.length; i++) {
                    let coordinates = fromLonLat([Number(this.coordinates[i].longitude), Number(this.coordinates[i].latitude)]);
                    let obj = {};
                    obj[this.coordinates[i].deviceType] = new Point(coordinates);
                    let feature = new Feature(obj);
                    //feature.setGeometryName(this.coordinates[i].deviceType);
                    //feature.setId(this.coordinates[i].deviceType);
                    features.push(feature);
                }
                //console.log(features)
                return features;
            },
            //TODO:判断是否是聚合元素，显示弹框类型
            setPopup(feature) {
                let features = feature[0].get('features');
                let len = features.length;
                let popData = [];
                let firstPoint = null;
                firstPoint = feature[0].getGeometry();
                let coor = firstPoint.getCoordinates();
                let coordinates = [toLonLat(coor)[0], toLonLat(coor)[1]];
                let size = (this.mapObject.getSize());
                this.view.centerOn(fromLonLat(coordinates), size, [1918 / 2, 954 / 2]);
                features.forEach((e) => {
                    let id = e.getId();
                    this.coordinates.forEach((v) => {
                        if (v.deviceId === id) {
                            popData.push(v);
                        }
                    })
                });
                this.popupList.total = popData.length;
                this.popupList.data = popData;
                if (len > 0 && len === 1) {
                    this.popDetail(this.popupList.data[0]);
                } else if (len > 1) {
                    this.overlayList.setPosition(fromLonLat(coordinates));
                    this.mapObject.addOverlay(this.overlayList);
                    let closer = document.getElementById('popup-list-closer');
                    let _this = this;
                    closer.addEventListener('click', () => {
                        _this.mapObject.removeOverlay(_this.overlayList);
                    });
                }
            },
            //TODO:显示抓拍详情弹框
            popDetail(data) {
                console.log(data);
                this.popup = data;
                this.overlay.setPosition(fromLonLat([Number(data.longitude), Number(data.latitude)]));
                this.mapObject.addOverlay(this.overlay);
                let closer = document.getElementById('popup-closer');
                let _this = this;
                closer.addEventListener('click', () => {
                    _this.mapObject.removeOverlay(_this.overlay);
                });
            },
            //TODO:设备列表图标
            iconFn(data) {
                let name = '';
                switch (data) {
                    case '摄像机':
                        name = 'device';
                        break;
                    case '告警':
                        name = 'alarm';
                        break;
                    default:
                        name = 'device';
                }
                return 'pop-icon-' + name;
            },
            //TODO:同一人标签样式
            ensureStyle(data) {
                let style = '';
                switch (data) {
                    case'待确认':
                        style = 'ensure-status-0';
                        break;
                    case'同一人':
                        style = 'ensure-status-1';
                        break;
                    case'不同人':
                        style = 'ensure-status-2';
                        break;
                    default:
                        style = 'ensure-status-0';
                }
                return style;
            },
            reloadImg(src) {
                return 'javascript:"this.src=' + src + '"';
            }
        }
    }
</script>

<style scoped lang="less">
    @baseBg: rgba(13, 13, 61, 0.85);
    @base-blue: #3aa0ff;
    * {
        margin: 0;
        padding: 0;
        color: #fff;
    }

    ul li {
        list-style: none;
    }

    .screen-page-map {
        position: relative;
        /*大标题*/
        .page-title {
            position: absolute;
            top: 0;
            left: 50%;
            margin-left: -1.093rem;
            width: 4.32rem;
            height: 0.96rem;
            background: url("../../../images/public/title_img.png") no-repeat;
            background-size: 100%;
            z-index: 2;
            text-align: center;
            .title-text {
                font-size: 0.587rem;
                color: #b6dcfd;
            }
        }
        /*地图*/
        #showMap {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            z-index: 1;
            //点位列表弹框
            .ol-popup-list {
                position: absolute;
                background-color: white;
                bottom: -140px;
                left: 12px;
                width: 244px;
                color: #000;
                .ol-popup-header {
                    width: 100%;
                    height: 40px;
                    background-color: #37a8ee;;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 10px;
                    .pop-header-title {
                        color: #fff;
                        font-size: 16px;
                        line-height: 40px;
                    }
                    .ol-popup-closer {
                        display: block;
                        width: 15px;
                        height: 15px;
                        background: url("../../../images/public/popup-close-white.png") no-repeat;
                        position: static;
                        cursor: pointer;
                    }
                    .ol-popup-closer:after {
                        content: none;
                    }
                }

                .ol-popup:after, .ol-popup:before {
                    top: 100%;
                    border: solid transparent;
                    content: " ";
                    height: 0;
                    width: 0;
                    position: absolute;
                    pointer-events: none;
                }

                .ol-popup:after {
                    border-top-color: white;
                    border-width: 10px;
                    left: 48px;
                    margin-left: -10px;
                }

                .ol-popup:before {
                    border-top-color: #cccccc;
                    border-width: 11px;
                    left: 48px;
                    margin-left: -11px;
                }

                .pop-content-list {
                    padding: 10px 0 10px 12px;
                    max-height: 275px;
                    overflow: auto;
                }

                .pop-list-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: start;
                    width: 100%;
                    cursor: pointer;
                }

                .pop-list-text {
                    font-size: 14px;
                    line-height: 29px;
                    color: #373737;
                    white-space: nowrap;
                    -ms-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .pop-list-icon {
                    display: block;
                    width: 40px;
                    height: 26px;
                }
            }
            //抓拍详情弹窗
            .ol-popup {
                position: absolute;
                bottom: -2.9rem;
                left: -6.9rem;
                .ol-popup-closer {
                    display: block;
                    width: 15px;
                    height: 15px;
                    background: url("../../../../public/image/showrealalarm/close-t.png") no-repeat;
                    position: absolute;
                    cursor: pointer;
                    right: 0;
                    top: 0;
                }
                .ol-popup-closer:after {
                    content: none;
                }
                .alarminfoMapCls .faceImageImg {
                    cursor: pointer;
                    position: relative;
                    width: 4.00rem;
                    height: 1.5rem;
                    margin: 0 3px;
                }

                .faceImageImg .facecls1 {
                    width: 1.08rem;
                    height: 1.43rem;
                    display: inline-block;
                    border: 2px solid;
                    border-image: url('/src/images/custody/screen/face-image-border.png') fill 2% repeat;
                    /*background-size: 100%;*/
                }

                .faceImageImg .capcls {
                    padding: 2px;
                    background-size: 100% 100%;
                    width: 1.08rem;
                    height: 1.43rem;
                    margin-left: 0.80rem;
                    display: inline-block;
                    border: 1px solid #d84745;
                }

                .alarminfoMapCls .faceImageTitle {
                    position: relative;
                    width: 100%;
                    height: 0.32rem;
                    margin: 1px auto;
                }

                .faceImageTitle .faceImageTitleLeftCls {
                    position: absolute;
                    left: 0.16rem;
                    top: 0;
                    text-align: center;
                    line-height: 0.32rem;
                    font-size: 0.19rem;
                    font-weight: 500;
                }

                .faceImageTitle .faceImageTitleRightCls {
                    position: absolute;
                    right: 26px;
                    top: 0;
                    text-align: center;
                    line-height: 0.32rem;
                    font-size: 0.19rem;
                    font-weight: 500;
                }

                .faceImageImg .similarity {
                    position: absolute;
                    left: 1.11rem;
                    top: 0.03rem;
                    width: 0.91rem;
                    height: 1.60rem;
                    background: url("/public/image/showrealalarm/img_similarity-blue.png") no-repeat 0.13rem 0.67rem;
                    background-size: auto;
                }

                .similarity .similarityTitle {
                    margin-top: 0.40rem;
                    position: relative;
                    font-weight: 600;
                    font-style: normal;
                    color: #d84949;
                    font-size: 0.19rem;
                    text-align: center;
                    width: 100%;
                }

                .similarity .similarityValue {
                    position: relative;
                    margin-top: 0.35rem;
                    font-weight: 600;
                    font-style: normal;
                    color: #d84949;
                    font-size: 0.19rem;
                    text-align: center;
                    width: 100%;
                }

                .personInfoCls .personNameCls1 {
                    width: auto;
                    height: 0.27rem;
                    margin-top: 0.13rem;
                    padding: 0;
                    color: #fff;
                    font-size: 0.21rem;
                    font-weight: 500;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .alarminfoMapCls .personLabelsCls {
                    position: relative;
                    width: 70%;
                    height: 0.33rem;
                    margin-top: 20px;
                }

                .alarminfoMapCls .personLabelsCls .taskCls {
                    position: relative;
                    width: 93%;
                    height: 0.32rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .overflowhidden {
                    width: 2.67rem;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .alarminfoMapCls .personLabelsCls {
                    position: relative;
                    width: 70%;
                    height: 0.33rem;
                    margin-top: 20rem;
                }

                .alarminfoMapCls .personInfoCls {
                    position: relative;
                }

                .alarminfoMapCls .personLabelsCls .personIDCardCls {
                    position: absolute;
                    bottom: 0.08rem;
                    border: 1px solid @base-blue;
                    color: @base-blue;
                    padding: 1px 3px;
                    font-size: 0.19rem;
                    cursor: pointer;
                    border-radius: 0.33rem;
                }

                .alarminfoMapCls .alarmTimeCls {
                    position: relative;
                    width: 100%;
                    height: 0.40rem;
                    color: #fff;
                    margin-top: 5px;
                }

                .alarminfoMapCls .personLabelsCls {
                    position: relative;
                    width: 70%;
                    height: 0.33rem;
                    margin-top: 10px;
                }

                .ensure_span {
                    cursor: pointer;
                    position: absolute;
                    top: 0.36rem;
                    right: 0.13rem;
                    border-radius: 0.67rem;
                    width: 0.73rem;
                    text-align: center;
                    color: #ffffff;
                    height: 0.27rem;
                }
                .ensure-status-0 {
                    background-color: #e89a36;
                }
                .ensure-status-1 {
                    background-color: #069db4;
                }
                .ensure-status-2 {
                    background-color: #e76162;
                }
                .alarmInfoTitleCnt {
                    line-height: 0.48rem;
                    text-indent: 0.13rem;
                    color: @base-blue;
                }

                .alarmInfoTitleCls {
                    background: @baseBg;
                }

                .alarminfoMapCls {
                    overflow: hidden;
                    background: @baseBg;
                    width: 6.53rem;
                }

                .alarmVideo {
                    width: 6.33rem;
                    height: 3.31rem;
                }

                .alarmCompare {
                    float: left;
                    width: 3.27rem;
                    padding-left: 0.07rem;
                    padding-top: 0.07rem
                }

                .faceImageImg {
                    width: 3.33rem;
                }

                .ol-popup-closer {
                    top: 0.11rem;
                    right: 0.11rem;
                }

                .ol-popup-closer:after {
                    background: url(../../../../public/image/showrealalarm/close-t.png) no-repeat;
                    display: block;
                    background-size: cover;
                    width: 0.21rem;
                    height: 0.21rem;
                }
            }

            .ol-popup:after, .ol-popup:before {
                top: 100%;
                border: solid transparent;
                content: " ";
                height: 0;
                width: 0;
                position: absolute;
                pointer-events: none;
            }
            .ol-popup:after {
                border-top-color: transparent;
                border-width: 10px;
                left: 48px;
                margin-left: -10px;
            }
            .ol-popup:before {
                border-top-color: rgba(13, 13, 61, .85);
                border-width: 11px;
                right: -22px;
                margin-left: -11px;
                transform: rotate(-90deg);
                top: 48%;
            }
        }
        /*热力图图例*/
        .heat-map-legend {
            position: absolute;
            width: 0.427rem;
            height: 0.947rem;
            bottom: 10.6vh;
            right: 1vw;
            background: url("../../../images/public/heatmaplegend.png") no-repeat center;
            z-index: 2;
        }
        /*左侧统计数据区域*/
        .data-area {
            height: 100%;
            width: (198/1920)*100%;
            position: absolute;
            left: 0;
            top: 0;
            background: @baseBg;
            z-index: 2;
            /*标题*/
            .data-area-title {
                font-size: 36px;
                width: 100%;
                text-align: center;
                line-height: 89px;
            }
            //统计数据
            .data-area-statistics {
                margin-top: 22px;
                -webkit-text-stroke: 1px #333333;
                box-sizing: border-box;
                padding-left: 32px;
                //统计名称
                .statistics-text {
                    font-size: 18px;
                }
                //统计值
                .statistics-value {
                    font-size: 34px;
                    color: #f2a834;
                }
            }
            .data-area-legend {
                width: 100%;
                height: 178px;
                box-sizing: border-box;
                padding-left: 32px;
                position: absolute;
                bottom: 0;
                left: 0;
                .legend-rows {
                    margin-bottom: 5px;
                    display: flex;
                    height: 24px;
                    flex-direction: row;
                    .legend-icon {
                        display: block;
                        flex: 1;
                    }
                    .legend-text {
                        font-size: 16px;
                        line-height: 24px;
                        flex: 3;
                    }
                }
            }
        }
    }

    .legend-icon-device {
        width: 21px;
        height: 22px;
        background: url("../../../images/public/icon-legend-device.png") no-repeat;
    }

    .legend-icon-alarm {
        width: 22px;
        height: 20px;
        background: url("../../../images/public/icon-alarm-red.png") no-repeat;
    }

    .pop-icon-device {
        background: url("../../../images/public/icon-legend-device.png") no-repeat;
    }

    .pop-icon-alarm {
        background: url("../../../images/public/icon-alarm-red.png") no-repeat;
    }
</style>
<style>
    /***element**/
    .el-switch__label, .el-switch__label.is-active {
        color: #fff;
    }

    .el-switch__label {
        height: 0.27rem;
        font-size: 0.19rem;
    }

    .el-switch__label * {
        line-height: 1;
        font-size: 0.19rem;
    }

    .el-switch__label--left {
        margin-right: 0.13rem;
    }

    .el-switch__core {
        width: 0.53rem !important;
        height: 0.27rem !important;
        border-radius: 0.13rem;
    }

    .el-switch__core:after {
        width: 0.21rem;
        height: 0.21rem;
    }

    /***ol**/
    .ol-zoom {
        left: 24.87rem;
        top: 2.9rem;
    }

    .ol-zoomslider {
        left: 24.87rem;
        top: 3.7rem;
    }

    .el-switch__label, .el-switch__label.is-active {
        color: #fff;
    }

</style>
