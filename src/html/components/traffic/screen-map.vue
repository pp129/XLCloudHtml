<template>
    <div class="screen-page-map">
        <!-- 标题 -->
        <div class="page-title">
            <h1 class="title-text">雪亮交通</h1>
        </div>
        <!-- 左侧数据展示 -->
        <div class="data-area">
            <!-- 时间显示 -->
            <div class="datetime upper-panel">
                <h3 class="datetime-date">{{time}}</h3>
                <p class="datetime-time">{{date}}</p>
            </div>
            <!-- 统计数据 -->
            <div class="data-board">
                <div class="data-list" v-for="item in dataList">
                    <div class="data-item-lf">
                        <p class="data-item-title">{{item.leftTitle}}</p>
                        <h3 class="data-item-value">{{item.leftValue}}</h3>
                    </div>
                    <div class="data-item-rt">
                        <p class="data-item-title">{{item.rightTitle}}</p>
                        <h3 class="data-item-value">{{item.rightValue}}</h3>
                    </div>
                </div>
            </div>
            <!-- 交通警情动态 -->
            <div class="data-news">
                <h3 class="data-news-title">交通警情动态</h3>
                <!-- 滚动区域 限高 显示三条 -->
                <ul class="news-rows">
                    <li class="news-item" v-for="item in news">
                        <div class="news-content">
                            <div class="news-content-lf">
                                <i class="news-icon-alarm"></i>
                                <span class="news-type"
                                      :class="iconType(item.alarmType)">{{newsType(item.alarmType)}}</span>
                            </div>
                            <div class="news-content-rt">
                                <p>
                                    <span class="news-content-label">地点：</span>
                                    <span class="news-content-detail news-content-location" :title="item.location">{{item.address}}</span>
                                </p>
                                <p>
                                    <span class="news-content-label">警情：</span>
                                    <span class="news-content-detail news-content-info"
                                          :title="item.briefAlarm">{{item.briefAlarm}}</span>
                                </p>
                                <p>
                                    <span class="news-content-label">时间：</span>
                                    <span class="news-content-detail news-content-time"
                                          :title="item.alarmTime">{{item.alarmTime}}</span>
                                </p>
                            </div>
                        </div>
                        <hr class="news-line">
                    </li>
                </ul>
            </div>
            <!-- 图例说明 -->
            <div class="data-legend">
                <div class="data-legend-lf">
                    <div>
                        <p class="legend-alarm"><i class="legend-icon legend-icon-crash"></i><span>事故位置</span></p>
                        <p class="legend-alarm"><i class="legend-icon legend-icon-crash-red"></i><span>事故亡人位置</span></p>
                        <p class="legend-alarm"><i class="legend-icon legend-icon-alarm"></i><span>告警未知</span></p>
                    </div>
                </div>
                <div class="data-legend-rt">
                    <!-- 热力图开关 -->
                    <el-switch
                        v-model="valueActive"
                        @change="changeActive"
                        active-color="#13ce66"
                        inactive-text="违章热力图"
                        inactive-color="#194998">
                    </el-switch>
                </div>
            </div>
        </div>
        <!-- 地图标识图例 -->
        <div class="map-icon-legend">
            <div class="icon-legend-item">
                <span class="legend-item-lf"><i class="legend-icon icon-normal"></i></span>
                <span class="legend-item-rt">正常</span>
            </div>
            <div class="icon-legend-item">
                <span class="legend-item-lf"><i class="legend-icon icon-off"></i></span>
                <span class="legend-item-rt">离线</span>
            </div>
            <div class="icon-legend-item">
                <span class="legend-item-lf"><i class="legend-icon icon-selected"></i></span>
                <span class="legend-item-rt">已选</span>
            </div>
            <div class="icon-legend-item">
                <span class="legend-item-lf"><i class="legend-icon icon-forbid"></i></span>
                <span class="legend-item-rt">停用</span>
            </div>
        </div>
        <!-- 地图事件图例 -->
        <div class="map-issue-legend">
            <div class="issue-item">
                <i class="issue-icon legend-icon-crash"></i>
                <span class="issue-text">事故</span>
            </div>
            <div class="issue-item">
                <i class="issue-icon legend-icon-crash-red"></i>
                <span class="issue-text">死亡</span>
            </div>
        </div>
        <!-- 设备类型 -->
        <d-label class="device-label" @changeStateFn="changeState"></d-label>
        <!-- 地图 -->
        <div id="showMap">
            <!-- 详情弹框 -->
            <div class="ol-popup" id="popup">
                <a href="javascript:void(0)" id="popup-closer" class="ol-popup-closer"></a>
                <div id="userpopup_content">
                    <div class="alarmInfoTitleCls" style="border-bottom: 2px solid #0891a5;">
                        <div class="alarmInfoTitleLogo"></div>
                        <div class="alarmInfoTitleCnt">{{popup.name}}</div>
                    </div>
                    <div class="alarminfoMapCls" style="width: 513px;">
                        <div>
                            <img class="sceneImg" :src="popup.sceneUrl"
                                 :onerror="reloadImg(popup.sceneUrl)"/>
                        </div>
                        <div class="alarminfodetail">
                            <div class="row">
                                <div class="inline-row">
                                    <span class="label">类别</span>
                                    :
                                    <span class="text">非机动车</span>
                                </div>
                                <div class="inline-row">
                                    <span class="label">抓拍时间</span>
                                    :
                                    <span class="text ellipsis">2018-08-29 11:11:11</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="inline-row">
                                    <span class="label">告警类别</span>
                                    :
                                    <span class="text"><b>未戴头盔</b></span>
                                </div>
                                <div class="inline-row">
                                    <span class="label">抓拍地点</span>
                                    :
                                    <span class="text ellipsis">湖里区竹坑路华昌路路口K2</span>
                                </div>
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
                        <li class="pop-list-item" v-for="item in popupList.data"
                            @click="reloadLastAlarmInfoList(item.gbId)">
                            <i class="pop-list-icon" :class="iconFn(item.deviceType)"></i><span
                            class="pop-list-text">{{item.name}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 告警弹窗 -->
            <div class="ol-popup-alarm" id="popupAlarm">
                <a href="javascript:void(0)" id="popup-alarm-closer" class="ol-popup-closer"></a>
                <div id="popup-alarm-content">

                </div>
            </div>
            <!-- 热力图例 -->
            <div class="heat-map-legend" v-if="valueActive"></div>
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
    let util = require("../../../js/util/util");
    export default {
        name: 'showMap',
        props: ['attrs'],
        components: {
            pLabel: () => import("../../../html/components/personLabel.vue"),
            dLabel: () => import("../../../html/components/deviceLabel.vue")
        },
        data: function () {
            return {
                valueActive: false,
                news: [],
                dataList: [
                    {
                        leftTitle: '全市布控点位数',
                        leftValue: '24,463,497',
                        rightTitle: '',
                        rightValue: ''
                    }, {
                        leftTitle: '总警情数',
                        leftValue: '325,692',
                        rightTitle: '本月',
                        rightValue: '25,235'
                    }, {
                        leftTitle: '总抓拍数',
                        leftValue: '325,692',
                        rightTitle: '本月',
                        rightValue: '12,621'
                    }, {
                        leftTitle: '总告警数',
                        leftValue: '231,586',
                        rightTitle: '本月',
                        rightValue: '1,586'
                    }
                ],
                date: '',
                time: '',
                mapObject: {},//地图对象
                overlay: {},//抓拍弹窗图层
                overlayList: {},//点位列表弹窗图层
                overlayAlarm: {},//点位列表弹窗图层
                view: {},//地图视图
                source: {
                    normal: {},
                    bridge: {},
                    tunnel: {},
                    trestle: {},
                    accident: {},
                    casualty: {}
                },//点位元素资源【分类】
                clusters: {
                    normal: {},
                    bridge: {},
                    tunnel: {},
                    trestle: {}
                },//聚合图层【分类】
                distance: 12,
                count: 2000,
                coordinates: [],//设备点位
                heatMapLayer: {},//热力图图层
                heatPoints: [],//热力图点位
                popup: {},//抓拍详情弹窗
                popupList: {
                    total: 0,
                    data: []
                },//点位列表弹窗
                popupAlarm: {},//告警弹窗
                firstAlarmDataId: ''
            }
        },
        mounted: function () {
            this.getStatistics();
            this.getAlarmInfo();
            this.init();
            this.initDatetime();
            this.getAllDevice();
            this.getHeatPoints();
        },
        watch: {
            //attrs:'findPoint'
        },
        methods: {
            //TODO:获取所统计数据
            getStatistics() {
                axios.get(conf.api_local + '/mapStatistics/mapStatistics').then((res) => {
                    let data = res.data;
                    if (data.hasOwnProperty('successFlag') && data.successFlag) {
                        this.dataList[0].leftValue = this.toThousand(data.data.deviceCount);
                        this.dataList[1].leftValue = this.toThousand(data.data.allAlarmCount);
                        this.dataList[1].rightValue = this.toThousand(data.data.currentMonthAlarmCount);
                        this.dataList[2].leftValue = this.toThousand(data.data.allCaptureCount);
                        this.dataList[2].rightValue = this.toThousand(data.data.currentMonthCaptureCount);
                        this.dataList[3].leftValue = this.toThousand(data.data.allWarningInstanceCount);
                        this.dataList[3].rightValue = this.toThousand(data.data.currentMonthWarningInstanceCount);
                    }
                })
            },
            //TODO:获取动态警情信息 定时获取
            getAlarmInfo() {
                let timer = null;
                this.getAlarmInfoList();
                let _this = this;
                timer = setInterval(() => {
                    _this.getAlarmInfoList();
                }, 15000);
            },
            getAlarmInfoList() {
                let param = {
                    page: 1,
                    rows: 10
                };
                axios.get(conf.api_local + '/alarmInfo/getAlarmInfoList', param).then((res) => {
                    let data = res.data;
                    if (data.hasOwnProperty('successFlag') && data.successFlag) {
                        this.news = data.data.rows;
                        let firstAlarmData = this.news[0];
                        if (this.news[0].alarmId !== this.firstAlarmDataId) {//当数据发生变化时再触发地图弹框

                        }
                        this.firstAlarmDataId = this.news[0].alarmId;
                    }
                })
            },
            //TODO:初始化地图
            init() {
                //瓦片
                let raster = new TileLayer({
                    source: new OSM()
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
                        attribution: false,
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
                //创建抓拍弹窗
                let container = document.getElementById('popup');
                //let content = document.getElementById('popup-content');
                let closer = document.getElementById('popup-closer');
                this.overlay = new Overlay({
                    element: container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                mapObject.addOverlay(this.overlay);
                //创建点位列表弹窗
                let listContainer = document.getElementById('popupList');
                this.overlayList = new Overlay({
                    element: listContainer,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                mapObject.addOverlay(this.overlayList);
                //创建告警弹窗
                let alarmContainer = document.getElementById('popupAlarm');
                this.overlayAlarm = new Overlay({
                    element: alarmContainer,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                mapObject.addOverlay(this.overlayAlarm);
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
                let _this = this;
                //mapObject.addInteraction(select);
                mapObject.on('pointermove', function (evt) {
                    mapObject.getTargetElement().style.cursor = mapObject.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
                });
                /**
                 * Add a click handler to hide the popup.
                 * @return {boolean} Don't follow the href.
                 */
                closer.addEventListener('click', function () {
                    _this.overlay.setPosition(undefined);
                    closer.blur();
                    return false;
                });
                /**
                 * Add a click handler to the map to render the popup.
                 */
                // display popup on click

                mapObject.on('singleclick', function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    let coor = mapObject.getCoordinateFromPixel(evt.pixel);
                    let lonlat = [toLonLat(coor)[0], toLonLat(coor)[1]];
                    console.log(lonlat);
                    let flag = mapObject.hasFeatureAtPixel(evt.pixel);
                    if (flag) {
                        mapObject.removeOverlay(_this.overlay);
                        mapObject.removeOverlay(_this.overlayList);
                        mapObject.removeOverlay(_this.overlayAlarm);
                        let features = mapObject.getFeaturesAtPixel(evt.pixel);
                        _this.setPopup(features)
                    }
                });

                this.mapObject = mapObject;
            },
            //TODO:显示实时时间
            initDatetime() {
                clearTimeout(this.dateTimer);
                let dt = new Date();
                let y = dt.getFullYear();
                let mm = dt.getMonth() + 1;
                (mm < 10) ? mm = '0' + mm : mm;
                let d = dt.getDate();
                (d < 10) ? d = '0' + d : d;
                let h = dt.getHours();
                (h < 10) ? h = '0' + h : h;
                let m = dt.getMinutes();
                (m < 10) ? m = '0' + m : m;
                let time = h + ':' + m;
                let date = y + '-' + mm + '-' + d;
                this.time = time;
                this.date = date;
                this.dateTimer = setTimeout(this.initDatetime, 1000)
            },
            //TODO:获取所有点位
            getAllDevice() {
                axios.get(conf.api_local + '/tBasDeviceInfo/getAllDeviceInfo').then((res) => {
                    this.coordinates = res.data.data;
                    this.showPointers();
                })
            },
            //TODO:显示点位
            showPointers: function () {
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
                    iconFeature.setId(this.coordinates[i].gbId);
                    if (coors.hasOwnProperty('deviceType')) {
                        deviceType = coors.deviceType;
                    } else {
                        deviceType = '普通'
                    }
                    switch (deviceType) {
                        case '普通':
                            iconSrc = '../../../public/image/icon-map-normal.png';
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
                            this.source.normal.addFeature(iconFeature);
                            break;
                        case '隧道':
                            iconSrc = '../../../public/image/icon-map-tunnel.png';
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
                            this.source.tunnel.addFeature(iconFeature);
                            break;
                        case '高架':
                            iconSrc = '../../../public/image/icon-map-trestle.png';
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
                            this.source.trestle.addFeature(iconFeature);
                            break;
                        case '事故':
                            iconSrc = '../../../public/image/nonmotorvehicleaccident.png';
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
                            this.source.accident.addFeature(iconFeature);
                            break;
                        case '死亡':
                            iconSrc = '../../../public/image/deathaccident.png';
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
                            this.source.casualty.addFeature(iconFeature);
                            break;
                        default:
                            iconSrc = '../../../public/image/icon-map-normal.png';
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
                            this.source.normal.addFeature(iconFeature);
                    }
                }
                //聚合
                let clusterSource = {
                    normal: {},
                    bridge: {},
                    trestle: {},
                    tunnel: {}
                };
                for (let key in clusterSource) {
                    clusterSource[key] = new Cluster({
                        distance: parseInt(this.distance, 10),
                        source: this.source[key]
                    });
                }
                //矢量图-可聚合
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
                    this.mapObject.addLayer(this.clusters[key])
                }
                let accidentLayer = new VectorLayer({
                    style: function (feature) {
                        return feature.get('style');
                    },
                    source: this.source.accident
                });
                let casualtyLayer = new VectorLayer({
                    style: function (feature) {
                        return feature.get('style');
                    },
                    source: this.source.casualty
                });
                this.mapObject.addLayer(accidentLayer);
                this.mapObject.addLayer(casualtyLayer);
            },
            //TODO:通过ID获取点位
            findPoint(data) {
                console.log(data, this.coordinates);
                this.coordinates.forEach((e) => {
                    if (e.gbId === data.gbId) {
                        let coordinates = [Number(e.longitude), Number(e.latitude)];
                        let size = (this.mapObject.getSize());
                        this.view.centerOn(fromLonLat(coordinates), size, [1918 / 2, 954 / 2]);
                        this.popDetail(e);
                    }
                })
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
                if (features) {
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
                            if (v.gbId === id) {
                                popData.push(v);
                            }
                        })
                    });
                    this.popupList.total = popData.length;
                    this.popupList.data = popData;
                    if (len > 0 && len === 1) {
                        this.getDataBybgId(this.popupList.data[0].gbId);
                        //this.popDetail(this.popupList.data[0]);
                    } else if (len > 1) {
                        this.overlayList.setPosition(fromLonLat(coordinates));
                        this.mapObject.addOverlay(this.overlayList);
                        let closer = document.getElementById('popup-list-closer');
                        let _this = this;
                        closer.addEventListener('click', () => {
                            _this.mapObject.removeOverlay(_this.overlayList);
                        });
                    }
                } else {
                    this.showPopAlarm(feature[0]);
                }
            },
            showPopAlarm(feature) {
                console.log(feature.getGeometry());
                console.log(feature.getId());
                let geo = feature.getGeometry();
                let coor = geo.getCoordinates();
                let coordinates = [toLonLat(coor)[0], toLonLat(coor)[1]];
                let size = (this.mapObject.getSize());
                this.view.centerOn(fromLonLat(coordinates), size, [1918 / 2, 954 / 2]);
                //this.popAlarm();
            },
            //TODO:通过gbIdf获取抓拍信息
            getDataBybgId(id) {
                axios.get(conf.api_local + '/alarmInfo/getLastAlarmInfo?' + util.noNoneGetParams({
                    gbid: id
                })).then((res) => {
                    let data = util.verifyResponse(res);
                    if (data) {
                        this.popDetail(data.rows[0]);
                    }
                })
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
            //TODO:更新父级告警抓拍列表
            reloadLastAlarmInfoList(id) {
                //console.log(id);
                this.$emit('reloadCapture', id)
            },
            //TODO:显示告警弹窗
            popAlarm(data) {
                console.log(data);
                this.popupAlarm = data;
                this.overlayAlarm.setPosition(fromLonLat([Number(data.longitude), Number(data.latitude)]));
                this.mapObject.addOverlay(this.overlayAlarm);
                let closer = document.getElementById('popup-closer');
                let _this = this;
                closer.addEventListener('click', () => {
                    _this.mapObject.removeOverlay(_this.overlay);
                });
            },
            //TODO:弹窗
            showPop(data) {
                console.log(data);
                this.popup.lat = data.lat;
                this.popup.lng = data.lng;
                let coordinates = [data.lng, data.lat];
                this.overlay.setPosition(fromLonLat(coordinates));
                let size = (this.mapObject.getSize());
                this.view.centerOn(fromLonLat(coordinates), size, [1186 / 2, 1080 / 2]);
            },
            //TODO:切换不同类型点位的显示状态
            changeState(item, state) {
                if (state) {
                    this.mapObject.removeLayer(this.clusters[item]);
                } else {
                    this.mapObject.addLayer(this.clusters[item]);
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
                        feature.setId(addData.gbId);
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
            //TODO:设备列表图标
            iconFn(data) {
                let name = '';
                switch (data) {
                    case '普通':
                        name = 'normal';
                        break;
                    case '隧道':
                        name = 'tunnel';
                        break;
                    case '高架':
                        name = 'trestle';
                        break;
                    case '大桥':
                        name = 'bridge';
                        break;
                    default:
                        name = 'normal';
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
            //TODO:onerror事件
            reloadImg(src) {
                return 'this.src=' + src;
            },
            iconType(type) {
                let style = '';
                switch (type) {
                    case '非机动车事故':
                        style = 'news-type-new';
                        break;
                    case '亡人事故':
                        style = 'news-type-accident';
                        break;
                    default:
                        style = ''
                }
                return style;
            },
            newsType(type) {
                let text = '';
                switch (type) {
                    case '非机动车事故':
                        text = 'NEW';
                        break;
                    case '亡人事故':
                        text = '亡';
                        break;
                    default:
                        text = ''
                }
                return text;
            }
        }
    }
</script>

<style scoped lang="less" type="text/less">
    @baseBg: rgba(13, 13, 61, 0.85);
    @base-blue: #3aa0ff;
    * {
        margin: 0;
        padding: 0;
    }

    ul li {
        list-style: none;
    }

    .ellipsis {
        white-space: nowrap;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .screen-page-map {
        position: relative;
    }

    #showMap {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        z-index: 1;
        .heat-map-legend {
            position: absolute;
            width: 0.427rem;
            height: 0.947rem;
            bottom: 10.6vh;
            right: 1vw;
            background: url("../../../images/public/heatmaplegend.png") no-repeat center;
            z-index: 2;
        }
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
            bottom: -2.65rem;
            left: -7.2rem;
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
                .sceneImg {
                    display: block;
                    margin: 4px auto;
                    width: 475px;
                    height: 248px;
                }
                .alarminfodetail {
                    padding: 8px;
                    .row {
                        font-size: 16px;
                        display: flex;
                        flex-direction: row;
                        .inline-row {
                            display: flex;
                            flex-flow: row;
                            width: 100%;
                            height: auto;
                            flex: 1;
                            .label {
                                flex: 1;
                                display: inline-block;
                                text-align: justify;
                                margin-right: 0.05rem;
                                color: #95baeb;
                                &:after {
                                    content: '';
                                    display: inline-block;
                                    width: 100%;
                                }
                            }
                            .text {
                                flex: 2;
                                width: 100%;
                                height: auto;
                                margin-left: 0.05rem;
                                color: #e7f1fe;
                                b {
                                    color: #ff7e33;
                                    display: inline-block;
                                    text-align: center;
                                    border: 1px solid #ff7e33;
                                    height: 25px;
                                    line-height: 25px;
                                    min-width: 96px;
                                    -webkit-border-radius: 12.5px;
                                    -moz-border-radius: 12.5px;
                                    border-radius: 12.5px;
                                }
                            }
                        }
                    }
                }
            }

            .alarmVideo {
                width: 6.33rem;
                height: 3.31rem;
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

    &::-webkit-scrollbar { /*滚动条整体样式*/
        position: absolute;
        width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
        background-color: #050c14;
    }

    &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        border-radius: 1px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #333;
    }

    &::-webkit-scrollbar-track { /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 1px;
        background: #181b22;
    }

    .data-area {
        height: 100%;
        width: (407/1920)*100%;
        position: absolute;
        left: 0;
        top: 0;
        background: @baseBg;
        z-index: 2;
        box-sizing: border-box;
        padding-left: 0.4rem;
        .datetime {
            .datetime-date {
                font-size: 0.4rem;
                font-weight: normal;
            }
            .datetime-time {
                font-size: 0.24rem;
            }
        }
        .data-board {
            margin-top: 0.6rem;
            .data-list {
                width: 100%;
                height: 1.17rem;
                -webkit-text-stroke: 1px #333333;
                .data-item-lf, .data-item-rt {
                    float: left;
                }
                .data-item-lf {
                    width: (214/377)*100%;
                }
                .data-item-rt {
                    width: (163/377)*100%;
                }
                .data-item-title {
                    font-size: 0.24rem;
                    line-height: 0.37rem;
                    font-weight: bolder;
                }
                .data-item-value {
                    font-size: 0.48rem;
                    color: #f2a834;
                    font-weight: bold;
                }
            }
        }
        .data-news {
            width: 100%;
            margin-top: 0.293rem;
            .data-news-title {
                font-size: 0.24rem;
                line-height: 0.373rem;
                color: #fdda4e;
            }

            .news-rows {
                width: 100%;
                height: 5.4rem;
                overflow: auto;
                .news-item {
                    width: 100%;
                    height: 1.8rem;
                    cursor: pointer;
                }

                .news-content {
                    width: 100%;
                    height: 1.787rem;
                }

                .news-line {
                    width: 100%;
                    height: 1px;
                    background: url('../../../images/public/news_line.png') no-repeat;
                    border: 0;
                }

                .news-content {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }

                .news-content-lf {
                    width: 0.4rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                }

                .news-icon-alarm {
                    display: block;
                    background: url("../../../images/public/icon-alarm.png") no-repeat center;
                    width: 0.4rem;
                    height: 0.347rem;
                    margin-bottom: 0.093rem;
                }

                .news-type {
                    background: #e10202;
                    color: #f2e900;
                    display: inline-block;
                    text-align: center;
                    font-size: 0.16rem;
                }

                .news-type-accident {
                    width: 0.347rem;
                    height: 0.347rem;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                    line-height: 0.347rem;
                }

                .news-type-new {
                    width: 100%;
                    height: 0.227rem;
                    line-height: 0.227rem;
                    -webkit-border-radius: 3px;
                    -moz-border-radius: 3px;
                    border-radius: 3px;
                }

                .news-content-rt {
                    width: 4.147rem;
                    padding: 0 0.187rem;
                    p {
                        overflow: hidden;
                        width: 100%;
                        span {
                            float: left;
                        }
                        .news-content-label {
                            display: inline;
                            font-size: 0.24rem;
                            line-height: 0.28rem;
                            color: #60abe4;
                        }
                        .news-content-detail {
                            font-size: 0.24rem;
                            line-height: 0.28rem;
                            width: 3.427rem;
                        }
                    }
                }

                .news-content-location {
                    white-space: nowrap;
                    overflow: hidden;
                    -ms-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                }

                .news-content-info {
                    overflow: hidden;
                    -ms-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .news-content-time {
                    color: #60abe4;
                }
            }
        }
        .data-legend {
            width: 100%;
            display: flex;
            flex: 1 1 auto;
            .data-legend-lf, .data-legend-rt {
                width: 50%;
                height: 2.173rem;
                display: flex;
                flex-direction: column;
            }
            .data-legend-lf {
                justify-content: center;
                .legend-alarm {
                    width: 100%;
                    font-size: 0.213rem;
                    line-height: 0.347rem;
                    display: flex;
                    flex-direction: row;
                    margin-bottom: 0.07rem;
                    .legend-icon {
                        display: block;
                        width: 0.613rem;
                    }
                }
            }
            .data-legend-rt {
                user-select: none;
                .el-switch {
                    margin-top: 0.55rem;
                }
            }
        }
    }

    .map-icon-legend {
        position: absolute;
        left: 5.44rem;
        bottom: 0;
        background: @baseBg;
        width: 1.32rem;
        height: 1.653rem;
        z-index: 2;
        display: flex;
        flex-direction: column;
        padding: 5px 2px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .icon-legend-item {
            display: flex;
            flex-direction: row;
            .legend-item-lf {
                display: flex;
                justify-content: center;
                align-items: center;
                .legend-icon {
                    display: block;
                    height: 0.4rem;
                    width: 0.773rem;
                }
                .icon-normal {
                    background-position: 0 3px;
                }
                .icon-off, .icon-selected, .icon-forbid {
                    background-position: 0.227rem 3px;
                }
            }
            .legend-item-rt {
                width: 0.467rem;
                font-size: 0.187rem;
                line-height: 0.4rem;
                text-align: center;
            }
        }
    }

    .map-issue-legend {
        position: absolute;
        left: 6.787rem;
        bottom: 0;
        background: @baseBg;
        width: 1.04rem;
        height: 0.88rem;
        z-index: 2;
        display: flex;
        flex-direction: column;
        padding: 6px 10px;
        box-sizing: border-box;
        .issue-item {
            display: flex;
            flex: 1 1 auto;
            align-items: center;
            justify-content: center;
            .issue-icon {
                display: block;
                width: 50%;
                height: 0.347rem;
            }
            .issue-text {
                text-align: center;
                display: inline-block;
                width: 50%;
                font-size: 0.187rem;
                line-height: 0.4rem;
            }
        }
    }

    .legend-icon-crash {
        background: url("../../../images/public/icon_nonmotorvehicleaccident.png") no-repeat;
    }

    .legend-icon-crash-red {
        background: url("../../../images/public/icon_deathaccident.png") no-repeat;
    }

    .legend-icon-alarm {
        background: url("../../../images/public/icon_otheraccident.png") no-repeat;
    }

    .icon-normal {
        background: url("../../../images/public/icon-legend-normal.png") no-repeat;
    }

    .icon-off {
        background: url("../../../images/public/icon-legend-off.png") no-repeat;
    }

    .icon-selected {
        background: url("../../../images/public/icon-legend-selected.png") no-repeat;
    }

    .icon-forbid {
        background: url("../../../images/public/icon-legend-forbid.png") no-repeat;
    }

    .device-label {
        position: absolute;
        right: 0.267rem;
        top: 0.2rem;
    }

    .pop-icon-tunnel {
        background: url("../../../images/public/icon-map-tunnel.png") no-repeat;
    }

    .pop-icon-normal {
        background: url("../../../images/public/icon-map-normal.png") no-repeat;
    }

    .pop-icon-bridge {
        background: url("../../../images/public/icon-map-bridge.png") no-repeat;
    }

    .pop-icon-trestle {
        background: url("../../../images/public/icon-map-trestle.png") no-repeat;
    }

    @media screen and(width: 5760px) {
        .map-icon-legend {
            left: 6.522rem;
        }

        .map-issue-legend {
            left: 7.84rem;;
        }
    }
</style>
<style>
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
