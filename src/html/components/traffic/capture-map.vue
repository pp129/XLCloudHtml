<template>
    <div id="captureMap">
        <!-- 地图 -->
        <div id="showMap">
            <div class="ol-popup" id="popup">
                <div class="ol-popup-header">
                    <span class="pop-header-title">点位列表（{{popup.total}}）</span>
                    <span id="popup-closer" class="ol-popup-closer"></span>
                </div>
                <div id="popup-content">
                    <ul class="pop-content-list">
                        <li class="pop-list-item" v-for="item in popup.popupData">
                            <i class="pop-list-icon" :class="iconFn(item.deviceType)"></i><span class="pop-list-text">{{item.name}}{{item.deviceId}}</span>
                        </li>
                    </ul>
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
        <!-- 设备类型 -->
        <d-label class="device-label" @changeStateFn="changeState"></d-label>
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

    let axios = require('axios');
    export default {
        name: 'captureMap',
        components: {
            dLabel: () => import("../../../html/components/deviceLabel.vue")
        },
        data: function () {
            return {
                mapObject: {},//地图对象
                overlay: {},//弹窗图层
                view: {},//地图视图
                source: {
                    normal: {},
                    bridge: {},
                    tunnel: {},
                    trestle: {}
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
                popup: {
                    total: 0,
                    popupData: []
                },//弹窗点位
                modify: {},
                select: {}
            }
        },
        mounted: function () {
            this.init();
            this.getAllDevice();
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
                    minZoom: 12
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

                //this.modify.setActive(false);
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
                    // display popup on click
                let _this = this;
                mapObject.on('singleclick', function (evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    let flag = mapObject.hasFeatureAtPixel(evt.pixel);
                    if (flag) {
                        let features = mapObject.getFeaturesAtPixel(evt.pixel);
                        _this.showPop(features)
                    }
                });
                this.mapObject = mapObject;
            },
            //TODO:获取所有点位
            getAllDevice() {
                axios.get(conf.api_local + '/tBasDeviceInfo/getAllDeviceInfo').then((res) => {
                    this.coordinates = res.data.data;
                    this.showPointers();
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
                    iconFeature.setId(this.coordinates[i].deviceId);
                    let iconSrc = '';
                    let deviceType = '';
                    let iconStyle = {};
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
            //TODO:弹窗
            showPop(feature) {
                //console.log(feature);
                let features = feature[0].get('features');
                let popData = [];
                if (features) {
                    features.forEach((e) => {
                        let deviceId = e.getId();
                        this.coordinates.forEach((v) => {
                            if (v.deviceId === deviceId) {
                                popData.push(v);
                            }
                        })
                    });
                    this.popup.total = popData.length;
                    this.popup.popupData = popData;
                    let firstPoint = null;
                    firstPoint = feature[0].getGeometry();
                    let coor = firstPoint.getCoordinates();
                    let coordinates = [toLonLat(coor)[0], toLonLat(coor)[1]];
                    this.overlay.setPosition(fromLonLat(coordinates));
                    let size = (this.mapObject.getSize());
                    this.view.centerOn(fromLonLat(coordinates), size, [1070 / 2, 910 / 2]);
                }
            },
            iconFn(data) {
                let name = '';
                switch (data) {
                    case '隧道':
                        name = 'tunnel';
                        break;
                    case '普通':
                        name = 'normal';
                        break;
                    case '高架':
                        name = 'trestle';
                        break;
                    case '桥梁':
                        name = 'bridge';
                        break;
                    default:
                        name = 'normal';
                }
                return 'pop-icon-' + name;
            },
            //TODO:切换不同类型点位的显示状态
            changeState(item, state) {
                if (state) {
                    this.mapObject.removeLayer(this.clusters[item]);
                } else {
                    this.mapObject.addLayer(this.clusters[item]);
                }
            },
            selectByPen() {
                let layers = this.mapObject.getLayers().getArray();
                //console.log(layers);
                let drawLayer = layers.filter((item) => {
                    //console.log(item.get('name'));
                    return item.get('name') === 'draw';
                });
                drawLayer.forEach((e) => {
                    this.mapObject.removeLayer(e)
                });
                this.addDrawLayer();
            },
            addDrawLayer() {
                let vector = new VectorLayer({
                    name: 'draw',
                    source: new VectorSource(),
                    style: new Style({
                        fill: new Fill({
                            color: 'rgba(230,135,23,0.5)'
                        }),
                        stroke: new Stroke({
                            color: '#e68717'
                        }),
                        image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({
                                color: '#e68717'
                            })
                        })
                    })
                });
                this.mapObject.addLayer(vector);
                let drawSource = vector.getSource();
                let Polygon = new Draw({
                    source: drawSource,
                    type: 'Polygon'
                });
                this.mapObject.addInteraction(Polygon);
                Polygon.setActive(true);
                let _this = this;
                Polygon.on('drawend', function (evt) {
                    Polygon.setActive(false);
                    _this.$parent.drawPenActive = false;
                    //console.log(drawSource);
                    let polygon = evt.feature.getGeometry();
                    let extent = polygon.getExtent();
                    let Selected = [];
                    for (let key in _this.source) {
                        if (_this.source[key].getFeaturesInExtent(extent)) {
                            let featuresArr = _this.source[key].getFeaturesInExtent(extent);
                            featuresArr.forEach((e) => {
                                let point = e.getGeometry().getCoordinates();
                                let inSide = polygon.intersectsCoordinate(point);
                                if (inSide) {
                                    Selected.push(e.getId());
                                }
                            })
                        }
                    }
                    //console.log(Selected);
                    if (Selected.length > 0) {
                        _this.$emit('selected', Selected);//TODO:触发父组件事件
                    }
                });
                /*let snap = new Snap({
                    source: vector.getSource()
                });
                this.mapObject.addInteraction(snap);*/
            },
            addSelect() {
                //选中样式
                let layers = this.mapObject.getLayers().getArray();
                console.log(layers);
                let drawLayer = layers.filter((item) => {
                    console.log(item.get('name'));
                    return item.get('name') === 'points';
                });
                console.log(drawLayer);
                let selectStyle = {};
                this.select = new Select({
                    /*style: function (feature) {
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
                    }*/
                });

                this.mapObject.addInteraction(this.select);

                //this.select.setActive(false);
            }
        }
    }
</script>

<style scoped lang="less">
    @baseBg: rgba(255, 255, 255, 0.8);
    * {
        margin: 0;
        padding: 0;
    }

    ul li {
        list-style: none;
    }

    #captureMap {
        position: relative;
    }

    #showMap {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        z-index: 1;
    }

    .device-label {
        position: absolute;
        right: 0.267rem;
        top: 0.2rem;
        z-index: 2;
    }

    .map-icon-legend {
        position: absolute;
        left: 2px;
        bottom: 0;
        background: @baseBg;
        width: 99px;
        height: 124px;
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
                    height: 30px;
                    width: 57px;
                }
                .icon-normal {
                    background-position: 0 3px;
                }
                .icon-off, .icon-selected, .icon-forbid {
                    background-position: 17px 3px;
                }
            }
            .legend-item-rt {
                width: 35px;
                font-size: 14px;
                line-height: 30px;
                text-align: center;
            }
        }
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
        height: 24px;
    }

    .pop-icon-normal {
        background: url("../../../images/public/icon-map-normal.png") no-repeat;
    }

    .pop-icon-tunnel {
        background: url("../../../images/public/icon-map-tunnel.png") no-repeat;
    }

    .pop-icon-trestle {
        background: url("../../../images/public/icon-map-trestle.png") no-repeat;
    }

    .pop-icon-bridge {
        background: url("../../../images/public/icon-map-bridge.png") no-repeat;
    }
</style>
