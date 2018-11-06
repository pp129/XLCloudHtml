<template>
    <div id="warningAnalysis">
        <!-- top -->
        <top :type="type" :htmlname="htmlname"></top>
        <div class="safe_width clearfix main">
            <!-- 左侧筛选区 -->
            <div class="content-lf">
                <div class="relative">
                    <div class="region-box">
                        <div class="left-title">行政区</div>
                        <div class="region-div">
                        <span class="region-span region-all" :class="{checked:regionAll}"
                              @click="chooseRegionAll()">全部</span>
                            <span class="region-span" v-for="item in regionList" :class="{'checked':item.active}"
                                  @click="chooseRegion(item)"><span class="check_region" v-show="item.active"></span>{{item.name}}</span>
                        </div>
                    </div>
                    <div class="alert-box">
                        <div class="left-title">警情类别</div>
                        <div class="alert-div" :class="{'checked':alertAll}" @click="chooseAlertAll">全部</div>
                        <div class="alert-div" v-for="item in alertSort" :class="{'checked':item.active}"
                             @click="chooseAlert(item)"><span class="check_region check_alert"
                                                              v-show="item.active"></span>{{item.name}}
                        </div>
                    </div>
                    <div class="time-div">
                        <div class="time-title">选择时间</div>
                        <div class="beginTime-div">
                            <el-date-picker
                                v-model="beginTime"
                                type="datetime"
                                placeholder="选择开始日期时间"
                                align="right"
                                :picker-options="pickerOptions1">
                            </el-date-picker>
                        </div>
                        <div class="endTime-div">
                            <el-date-picker
                                v-model="endTime"
                                type="datetime"
                                placeholder="选择结束日期时间"
                                align="right"
                                :picker-options="pickerOptions1"
                                @change="setDateTime"
                                @blur="checkTime">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="btn-div">
                        <span class="btn btn_blue" @click="submit">确定</span>
                        <span class="btn btn_grey" @click="reset">重置</span>
                    </div>
                </div>
            </div>
            <!-- 地图 -->
            <div id="showMap">
                <!-- 聚合点位展开列表 -->
                <div class="ol-popup" id="popupList">
                    <div class="ol-popup-header">
                        <span class="pop-header-title">事故列表（{{popupList.total}}）</span>
                        <span id="popup-list-closer" class="ol-popup-closer"></span>
                    </div>
                    <div id="popup-list-content">
                        <ul class="pop-content-list">
                            <li class="pop-list-item" v-for="item in popupList.data" @click="popDetail(item)">
                                <i class="pop-list-icon" :class="iconFn(item.alarmType)"></i><span
                                class="pop-list-text">{{item.address}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 交通事故弹框 -->
            <div class="popup" id="popup" v-if="showPop">
                <div class="popup-header">
                    <span class="header-title">{{popup.type}}</span>
                    <span id="popup-closer" class="popup-closer" @click="showPop=!showPop"></span>
                </div>
                <div id="popup-content" class="popup-content">
                    <label class="case-label">{{popup.alarmType}}</label>
                    <p class="case-info info-time row">
                        <i class="case-info-icon icon-popup-time"></i>
                        <span class="text-space-equal">接警时间</span>：<span class="text">{{popup.alarmTime}}</span>
                    </p>
                    <p class="case-info info-location row">
                        <i class="case-info-icon icon-popup-location"></i>
                        <span class="text-space-equal">事故地点</span>：<span class="ellipsis text">{{popup.address}}</span>
                    </p>
                    <p class="case-info info-longitude row">
                        <i class="case-info-icon icon-popup-longitude"></i>
                        <span class="text-space-equal">精度</span>：<span class="text">{{popup.longitude}}</span>
                    </p>
                    <p class="case-info info-latitude row">
                        <i class="case-info-icon icon-popup-latitude"></i>
                        <span class="text-space-equal">纬度</span>：<span class="text">{{popup.latitude}}</span>
                    </p>
                    <hr class="case-info-line"/>
                    <p class="case-detail-title">简要警情</p>
                    <div class="case-detail-content">
                        {{popup.briefAlarm}}
                    </div>
                    <div class="popup-bottom">
                        <button class="popup-btn">收藏</button>
                        <button class="popup-btn">周边摄像机</button>
                    </div>
                </div>
            </div>
            <!-- 图例 -->
            <div class="map-points-legend">
                <div class="rows">
                    <i class="legend-icon pop-icon-accident"></i><span class="legend-text">事故</span>
                </div>
                <div class="rows">
                    <i class="legend-icon pop-icon-casualty"></i><span class="legend-text">死亡</span>
                </div>
            </div>
        </div>
        <!-- bottom -->
        <bottom></bottom>
    </div>
</template>

<script>
    import Feature from 'ol/Feature';
    import Map from 'ol/Map';
    import Overlay from 'ol/Overlay';
    import View from 'ol/View';
    import XYZ from 'ol/source/XYZ';
    import Point from 'ol/geom/Point';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
    import {Cluster, Vector as VectorSource} from 'ol/source';
    import {Fill, Style, Text, Icon, Stroke, Circle as CircleStyle} from 'ol/style';
    import {defaults as controlDefault} from 'ol/control';
    import {defaults as interactionDefaults, Select, Snap, Modify, Draw} from 'ol/interaction';
    import {fromLonLat, toLonLat} from 'ol/proj';

    let axios = require("axios");
    let _ = require("lodash");
    let moment = require("moment");
    let querystring = require("querystring");
    export default {
        name: "warning-analysis",
        components: {
            Top: () => import("../custody/common/top.vue"),
            Bottom: () => import("../custody/common/bottom.vue")
        },
        data() {
            return {
                type: "雪亮交通",
                htmlname: '-警情分析',
                mapObject: {},//地图对象
                overlay: {},//弹窗图层
                view: {},//地图视图
                source: {
                    accident: {},//非机动车事故
                    casualty: {},//亡人事故
                    others: {}//其他事故
                },//点位元素资源【分类】
                clusters: {
                    accident: {},//非机动车事故
                    casualty: {},//亡人事故
                    others: {}//其他事故
                },//聚合图层【分类】
                distance: 12,
                count: 2000,
                coordinates: [],//设备点位
                popupList: {
                    total: 0,
                    data: []
                },
                popup: {//点位弹窗信息
                    type: '交通事故',
                    alarmType: '非机动车事故',
                    alarmTime: '2018-10-19 14:28:41',
                    address: '集美区同集南路霞梧天桥路',
                    longitude: '12.355568746',
                    latitude: '28.347896687',
                    briefAlarm: '接报警称，30分钟之前，闽D25FG2蓝色大众与一辆摩托车侧面刮擦，当时摩托车上2人受伤，已送至附近医院就诊，其他相关人员并无大碍，肇事车辆已经扣留，需做进一步处理。'
                },
                showPop: false,
                alertAll: false,//全选警情类别
                alertSort: [
                    {name: "非机动车事故", active: false},
                    {name: "亡人事故", active: false},
                    {name: "其他事故", active: false},
                ],//警情类别
                beginTime: "",//开始时间
                endTime: "",//结束时间
                outputData: {//选中的参数
                    region: [],//行政区
                    alert: [],//警情类别
                    time: {//时间范围
                        begin: '',
                        end: ''
                    }
                },
                pickerOptions1: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                regionAll: false,//全选行政区
                regionList: [
                    {
                        name: "思明区",
                        active: false
                    },
                    {
                        name: "湖里区",
                        active: false
                    },
                    {
                        name: "集美区",
                        active: false
                    },
                    {
                        name: "海沧区",
                        active: false
                    },
                    {
                        name: "同安区",
                        active: false
                    },
                    {
                        name: "翔安区",
                        active: false
                    }
                ],//行政区列表
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                //瓦片
                let raster = new TileLayer({
                    source: new XYZ({
                        projection: 'EPSG:4326',
                        url: "/PGIS_S_TileMapServer/Maps/sl2015/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3&key=one"
                    })
                });
                //视图
                let view = new View({
                    center: fromLonLat([118.096435, 24.485408]),
                    zoom: 13,
                    maxZoom: 17,
                    minZoom: 11
                });
                this.view = view;
                //创建地图
                let mapObject = new Map({
                    target: 'showMap',
                    layers: [raster],
                    view: view,
                    controls: controlDefault({
                        attributionOptions: {
                            collapsible: false
                        },
                        zoom: false
                    }),
                    interactions: interactionDefaults({
                        mouseWheelZoom: true,
                    })
                });
                //创建弹窗
                let container = document.getElementById('popupList');
                //let content = document.getElementById('popup-content');

                this.overlay = new Overlay({
                    element: container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    }
                });
                mapObject.on('pointermove', function (evt) {
                    mapObject.getTargetElement().style.cursor = mapObject.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
                });
                let _this = this;
                mapObject.on('singleclick', function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    let flag = mapObject.hasFeatureAtPixel(evt.pixel);
                    if (flag) {
                        mapObject.removeOverlay(_this.overlay);
                        let features = mapObject.getFeaturesAtPixel(evt.pixel);
                        _this.setPopup(features)
                    }
                });
                this.mapObject = mapObject;
            },
            //全选警情类别
            chooseAlertAll() {
                this.alertAll = !this.alertAll;
                if (this.alertAll) {
                    for (let item of this.alertSort) {
                        item.active = true;
                        let index = _.findIndex(this.outputData.alert, item);
                        if (index === -1) {
                            this.outputData.alert.push(item)
                        }
                    }
                } else {
                    for (let item of this.alertSort) {
                        item.active = false;
                        let index = _.findIndex(this.outputData.alert, item);
                        if (index !== -1) {
                            this.outputData.alert.splice(index, 1)
                        }
                    }
                }
            },
            //单选警情类别
            chooseAlert(params) {
                params.active = !params.active;
                let index = _.findIndex(this.outputData.alert, params);
                if (params.active) {
                    if (index === -1) {
                        this.outputData.alert.push(params);
                    }
                    if (this.outputData.alert.length === this.alertSort.length) {
                        this.alertAll = true;
                    }
                } else {
                    this.alertAll = false;
                    if (index !== -1) {
                        this.outputData.alert.splice(index, 1);
                    }
                }
            },
            //单选行政区
            chooseRegion(params) {
                params.active = !params.active;
                let index = _.findIndex(this.outputData.region, params);
                if (params.active) {
                    if (index === -1) {
                        this.outputData.region.push(params);
                    }
                    if (this.outputData.region.length === this.regionList.length) {
                        this.regionAll = true;
                    }
                } else {
                    this.regionAll = false;
                    if (index !== -1) {
                        this.outputData.region.splice(index, 1);
                    }
                }

            },
            //全选行政区
            chooseRegionAll() {
                this.regionAll = !this.regionAll;
                if (this.regionAll) {
                    for (let item of this.regionList) {
                        item.active = true;
                        let index = _.findIndex(this.outputData.region, item);
                        if (index === -1) {
                            this.outputData.region.push(item);
                        }
                    }
                } else {
                    for (let item of this.regionList) {
                        item.active = false;
                        let index = _.findIndex(this.outputData.region, item);
                        if (index !== -1) {
                            this.outputData.region.splice(index, 1);
                        }
                    }
                }
            },
            //检查时间是否正确
            checkTime() {
                if (this.beginTime && this.endTime) {
                    let beginTimeStamp = moment(this.beginTime, "YYYY-MM-DD HH:mm:ss").valueOf();
                    let endTimeStamp = moment(this.endTime, "YYYY-MM-DD HH:mm:ss").valueOf();
                    if (beginTimeStamp > endTimeStamp) {
                        this.$alert('开始时间必须小于结束时间，请重新选择', '提示消息', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.beginTime = "";
                                this.endTime = "";
                            }
                        })
                    }
                }
            },
            setDateTime() {
                if (this.beginTime && this.endTime) {
                    this.outputData.time.begin = moment(this.beginTime).format('YYYY-MM-DD HH:mm:ss');
                    this.outputData.time.end = moment(this.endTime).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            //重置查询条件
            reset() {
                this.beginTime = "";
                this.endTime = "";
                //行政区重置
                for (let item of this.regionList) {
                    item.active = false;
                }
                this.outputData.region = [];
                this.regionAll = false;
                //警情类别重置
                for (let item of this.alertSort) {
                    item.active = false;
                }
                this.outputData.alert = [];
                this.alertAll = false;
            },
            //TODO:参数校验
            /*confirm() {
                if (this.outputData.alert.length <= 0) {
                    this.$alert('请选择警情类别', '提示消息', {confirmButtonText: '确定'})
                } else {
                    this.submit()
                }
            },*/
            submit() {
                let param = {
                    page: 1,
                    rows: 10,
                    orgCode: '',//行政区代码
                    alarmType: '',//警情类别
                    beginTime: '',
                    endTime: ''
                };
                //格式化行政区参数
                let orgCodes = [];
                if (this.outputData.region.length > 0) {
                    let regions = this.outputData.region;
                    regions.forEach((e) => {
                        orgCodes.push(e.name);
                    })
                }
                if (orgCodes.length > 0) {
                    param.orgCode = orgCodes.join(',')
                }
                //格式化警情类别参数
                let alarmTypes = [];
                if (this.outputData.alert.length > 0) {
                    let alerts = this.outputData.alert;
                    alerts.forEach((e) => {
                        alarmTypes.push(e.name);
                    })
                }
                if (alarmTypes.length > 0) {
                    param.alarmType = alarmTypes.join(',')
                }
                //时间
                if (this.outputData.time.begin) {
                    param.beginTime = this.outputData.time.begin
                }
                if (this.outputData.time.end) {
                    param.endTime = this.outputData.time.end
                }
                axios.post(conf.api_local + '/alarmInfo/getAlarmInfoList', param).then((res) => {
                    let data = res.data;
                    if (data.hasOwnProperty('successFlag') && data.successFlag) {
                        if (data.data.rows.length > 0) {
                            this.coordinates = data.data.rows;
                            this.showPointers();
                        }
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
                    iconFeature.setId(this.coordinates[i].alarmId);
                    let iconSrc = '';
                    let alarmType = '';
                    let iconStyle = {};
                    if (coors.hasOwnProperty('alarmType')) {
                        alarmType = coors.alarmType;
                    } else {
                        alarmType = '其他事故'
                    }
                    switch (alarmType) {
                        case '其他事故':
                            iconSrc = '../../../public/image/otheraccident.png';
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
                            this.source.others.addFeature(iconFeature);
                            break;
                        case '非机动车事故':
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
                        case '亡人事故':
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
                            iconSrc = '../../../public/image/otheraccident.png';
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
                            this.source.others.addFeature(iconFeature);
                    }
                }
                //聚合
                let clusterSource = {
                    accident: {},//非机动车事故
                    casualty: {},//亡人事故
                    others: {}//其他事故
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
                        name: 'points',
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
            },
            setPopup(feature) {
                let features = feature[0].get('features');
                let len = features.length;
                let popData = [];
                let firstPoint = null;
                firstPoint = feature[0].getGeometry();
                let coor = firstPoint.getCoordinates();
                let coordinates = [toLonLat(coor)[0], toLonLat(coor)[1]];
                let size = (this.mapObject.getSize());
                this.view.centerOn(fromLonLat(coordinates), size, [1920 / 2, 779 / 2]);

                features.forEach((e) => {
                    let id = e.getId();
                    this.coordinates.forEach((v) => {
                        if (v.alarmId === id) {
                            popData.push(v);
                        }
                    })
                });
                this.popupList.total = popData.length;
                this.popupList.data = popData;
                if (len > 0 && len === 1) {
                    this.popDetail(this.popupList.data[0]);
                } else if (len > 1) {
                    this.overlay.setPosition(fromLonLat(coordinates));
                    this.mapObject.addOverlay(this.overlay);
                    let closer = document.getElementById('popup-list-closer');
                    let _this = this;
                    closer.addEventListener('click', () => {
                        _this.mapObject.removeOverlay(_this.overlay);
                    });
                }
            },
            popDetail(data) {
                this.showPop = true;
                this.popup = data;
            },
            iconFn(data) {
                let name = '';
                switch (data) {
                    case '其他事故':
                        name = 'others';
                        break;
                    case '非机动车事故':
                        name = 'accident';
                        break;
                    case '亡人事故':
                        name = 'casualty';
                        break;
                    default:
                        name = 'others';
                }
                return 'pop-icon-' + name;
            },
        }
    }
</script>

<style scoped lang="less">
    /*********子元素由于浮动给父元素造成高度坍塌的解决方法********/
    .clearfix::before,
    .clearfix::after {
        display: table;
    }

    .clearfix::after {
        clear: both;
    }

    div {
        font-size: 14px;
    }

    .text-space-equal {
        flex: 1;
        display: inline-block;
        text-align: justify;
        margin-right: 0.1rem;
        &:after {
            content: '';
            display: inline-block;
            width: 100%;
        }
    }

    .ellipsis {
        white-space: nowrap;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .main {
        width: 100%;
        height: ~"calc(100vh-70px-105px)";
        position: relative;
        top: 0;
        left: 0;
        #showMap {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            z-index: 1;
        }
        .content-lf {
            width: 300px;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            z-index: 2;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0 10px;
            box-sizing: border-box;
            .relative {
                width: 100%;
                height: 100%;
                position: relative;
            }
            .region-box {
                width: 100%;
                border-bottom: 1px solid rgb(207, 227, 239);
                padding-bottom: 20px;
            }
            .left-title {
                width: 100%;
                height: 40px;
                text-align: left;
                line-height: 40px;
                font-size: 16px;
            }
            .region-div {
                width: 100%;
            }
            .region-span {
                display: inline-block;
                padding-left: 25px;
                padding-right: 20px;
                height: 30px;
                border: 1px solid rgb(199, 199, 199);
                box-sizing: border-box;
                line-height: 30px;
                border-radius: 30px;
                margin-bottom: 5px;
                position: relative;
                color: rgb(199, 199, 199);
                margin-right: 3px;
                cursor: pointer;
            }
            .region-all {
                width: 100%;
                text-align: center;
                padding-left: 0;
                padding-right: 0;
            }
            .check_region {
                display: inline-block;
                width: 17px;
                height: 17px;
                background: url("../../../images/traffic/shape_check.png");
                position: absolute;
                left: 6px;
                top: 6px;
            }
            .alert-box {
                width: 100%;
                padding-bottom: 18px;
                border-bottom: 1px solid rgb(207, 227, 239);
            }
            .alert-div {
                width: 100%;
                height: 30px;
                color: rgb(199, 199, 199);
                line-height: 30px;
                text-align: center;
                border: 1px solid rgb(199, 199, 199);
                border-radius: 30px;
                margin-bottom: 10px;
                cursor: pointer;
                position: relative;
            }
            .check_alert {
                left: 12px;
            }
            .checked {
                border: 1px solid rgb(48, 156, 237);
                color: rgb(48, 156, 237);
            }
            .time-div {
                width: 100%;
            }
            .time-title {
                width: 100%;
                height: 40px;
                line-height: 40px;
            }
            .endTime-div {
                margin-top: 10px;
            }
            .btn-div {
                height: 72px;
                width: 100%;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: absolute;
                bottom: 0;
                left: 0;
            }
            .btn {
                display: inline-block;
                color: white;
                height: 30px;
                width: 80px;
                border-radius: 30px;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
            }
            .btn_blue {
                background-color: rgb(48, 165, 237);
            }
            .btn_grey {
                background-color: rgb(177, 188, 195);
            }
        }
        .popup {
            width: 300px;
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: 2;
            .popup-header {
                width: 100%;
                height: 40px;
                background-color: #37a8ee;;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 10px;
                .header-title {
                    color: #fff;
                    font-size: 16px;
                    line-height: 40px;
                }
                .popup-closer {
                    display: block;
                    width: 15px;
                    height: 15px;
                    background: url("../../../images/public/popup-close-white.png") no-repeat;
                    position: static;
                    cursor: pointer;
                }
                .popup-closer:after {
                    content: none;
                }
            }
            .popup-content {
                width: 100%;
                padding: 9px 10px;
                background: #fff;
                box-sizing: border-box;
                .case-label {
                    display: inline-block;
                    color: #30a5ed;
                    border: 1px solid #30a5ed;
                    -webkit-border-radius: 15px;
                    -moz-border-radius: 15px;
                    border-radius: 15px;
                    font-size: 14px;
                    height: 30px;
                    line-height: 30px;
                    padding: 0 12px;
                    margin-bottom: 15px;
                }
                .row {
                    display: flex;
                    flex-flow: row;
                    width: 100%;
                    margin-bottom: 0.1rem;
                    color: #373737;
                    height: 30px;
                    .case-info-icon {
                        display: block;
                        width: 18px;
                        height: 21px;
                        flex: 1;
                    }
                    .text-space-equal {
                        flex: 4;
                        display: inline-block;
                        text-align: justify;
                        margin-right: 0.1rem;
                        &:after {
                            content: '';
                            display: inline-block;
                            width: 100%;
                        }
                    }
                    .text {
                        flex: 9;
                        width: 100%;
                        margin-left: 0.2rem;
                    }
                }
                .case-info-line {
                    height: 1px;
                    background: #cfe3ef;
                    border: 0;
                    margin: 6px 0;
                }
                .case-detail-title {
                    font-size: 16px;
                    color: #373737;
                    line-height: 40px;
                }
                .case-detail-content {
                    width: 275px;
                    height: 127px;
                    overflow: auto;
                    margin: 0 auto;
                    border: 1px solid #969696;
                    color: #969696;
                    font-size: 14px;
                    line-height: 20px;
                    padding: 3px;
                }
                .popup-bottom {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    margin: 9px 0;
                    .popup-btn {
                        display: inline-block;
                        min-width: 80px;
                        font-size: 14px;
                        color: #fff;
                        background: #30a5ed;
                        height: 30px;
                        line-height: 30px;
                        border: 0;
                        -webkit-border-radius: 15px;
                        -moz-border-radius: 15px;
                        border-radius: 15px;
                        text-align: center;
                        padding: 0 20px;
                        cursor: pointer;
                        outline: none;
                    }
                }
            }
        }
        .map-points-legend {
            width: 71px;
            position: absolute;
            bottom: 2px;
            left: 302px;
            background-color: rgba(255, 255, 255, 0.8);
            display: flex;
            flex-direction: column;
            z-index: 2;
            padding: 0 7px;
            .rows {
                display: flex;
                flex-direction: row;
                height: 40px;
                align-items: center;
                .legend-icon {
                    width: 26px;
                    height: 26px;
                    display: block;
                    flex: 1;
                }
                .legend-text {
                    font-size: 14px;
                    color: #373737;
                    line-height: 24px;
                    flex: 1;
                }
            }
        }
    }

    .icon-popup-time {
        background: url("../../../images/public/icon-popup-time.png") no-repeat;
    }

    .icon-popup-location {
        background: url("../../../images/public/icon-popup-location.png") no-repeat;
    }

    .icon-popup-longitude {
        background: url("../../../images/public/icon-popup-longitude.png") no-repeat;
    }

    .icon-popup-latitude {
        background: url("../../../images/public/icon-popup-latitude.png") no-repeat;
    }

    .ol-popup {
        position: absolute;
        background-color: white;
        -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
        filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
        border-radius: 0.133rem;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        width: 244px;
        max-height: 275px;
        color: #000;
    }

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

    .pop-icon-others {
        background: url("../../../images/public/icon_otheraccident.png") no-repeat;
    }

    .pop-icon-accident {
        background: url("../../../images/public/icon_nonmotorvehicleaccident.png") no-repeat;
    }

    .pop-icon-casualty {
        background: url("../../../images/public/icon_deathaccident.png") no-repeat;
    }
</style>
