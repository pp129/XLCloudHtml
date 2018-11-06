<template>
    <div class="screen-page-map">
        <!-- 地图底层 -->
        <div id="showmap" class="usermap"></div>
        <!-- 标题 -->
        <div class="title-image upper-panel"></div>
        <!-- 时间显示 -->
        <div class="datetime upper-panel">
            <h3 class="datetime-time"></h3>
            <p class="datetime-date"></p>
        </div>
        <!-- 数据展示 -->
        <div class="data-board upper-panel">
            <div class="data-items" v-for="item in statisticsData">
                <p class="data-text">{{item.name}}</p>
                <div class="data-number"><span>{{item.value}}</span></div>
            </div>
        </div>
        <!-- 地图模式开关 -->
        <div class="map-state-switch upper-panel">
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
        <!-- 热力图例 -->
        <div class="heat-map-legend upper-panel" v-if="valueActive"></div>
    </div>
</template>
<!-- 视频网版本 -->
<script>
    let $ = require("jquery");
    let axios = require('axios');
    import {alarmData} from '../../../js/component/custody/alarmData';

    export default {
        props: ["attrs"],
        data() {
            return {
                valueActive: false,
                valueAddress: false,
                dateTimer: null,//日期定时器
                alarmData: alarmData,//设备点位
                heatData: [],//热力图点位
                /*showRealAlarmObject: {
                    showMaxNum: 1000,
                    curShowAlarmId: "",
                    showDataMap: [],
                    taskInfo: [],
                    taskIds: '',
                    taskAlarmData: [],
                    viewTaskMap: [],
                    devceName: [],
                    alarmCount: [],
                    refuseAlarm: 0,
                    type: 3
                },*/
                deviceDataObject: {
                    camerInfoMap: null
                },
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
                ]//统计信息
            };
        },
        watch: {
            "attrs": "fn"
        },
        mounted: function () {
            InitMapGisApp();
            this.getHeatMapPoints();
            this.initDatetime();
            this.loadDeviceData('');
            this.getStatistics();
            //TODO:初始默认弹出动态抓拍信息第一个人的信息
            if (this.attrs) {
                createAlarmInfo(this.attrs)
            }
        },
        computed: {},
        methods: {
            changeActive: function () {
                MapGisApp.toogleHeatMapAndAlarm(this.valueActive);
            },
            changeAddress: function () {
                console.log(this.valueAddress);
            },
            fn() {
                createAlarmInfo(this.attrs)
            },
            initDatetime: function () {
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
                $(".datetime-time").html(time);
                $(".datetime-date").html(date);
                this.dateTimer = setTimeout(this.initDatetime, 1000)
            },
            // 循环显示数据到摄像头
            useDeviceInfosDataToMap: function (deviceInfos) {
                //console.log(deviceInfos);
                if (!deviceInfos) {
                    return;
                }
                for (let index = 0; index < deviceInfos.length; index++) {
                    let deviceInfo = deviceInfos[index];
                    //console.log(deviceInfo);
                    showRealAlarmObject.devceName[deviceInfo.deviceId] = deviceInfo.deviceName;
                    showRealAlarmObject.alarmCount[deviceInfo.deviceId] = deviceInfo.count;
                    //deviceDataObject.camerInfoMap[deviceInfo.Id] = deviceInfo;

                    this.useDeviceInfoDataToMap(deviceInfo);
                }
            },
            useDeviceInfoDataToMap: function (deviceInfo) {
                if (deviceInfo && !deviceInfo.latitude || deviceInfo && !deviceInfo.longitude) {
                    return;
                }
                if (!deviceInfo.count) {
                    deviceInfo.count = 0;
                } else {
                    deviceInfo.count = parseInt(deviceInfo.count);
                }

                addDeviceCluster(deviceInfo);
            },
            loadDeviceData: function (taskId) {
                this.deviceDataObject.currentTask = taskId;

                this.deviceDataObject.curPage = 20;
                this.deviceDataObject.singleRows = 300;
                this.deviceDataObject.totalRow = 50;
                this.deviceDataObject.taskId = taskId;
                this.deviceDataObject.camerInfoMap = [];
                // 清空选中摄像头
                this.deviceDataObject.deviceIds = "";
                // 清空门禁
                this.deviceDataObject.doorIds = "";

                axios.get(conf.api + '/tBasDeviceInfo/getAllDeviceLocation').then((res) => {
                    let data = res.data;
                    if (data.hasOwnProperty('successFlag') && data.successFlag) {
                        this.alarmData = data.data;
                        /*clearDeviceMap();
                        clearSelectFeature();*/
                        createResLayer();
                        createDeviceCluster();
                        this.useDeviceInfosDataToMap(this.alarmData);
                    }
                })
                //this.useDeviceInfosDataToMap(this.alarmData);
            },
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
            getHeatMapPoints: function () {
                axios.get(conf.api + '//tBasDeviceInfo/getCaptureThermalMap').then((res) => {
                    let data = res.data;
                    if (data.hasOwnProperty('successFlag') && data.successFlag) {
                        this.heatData = data.data;
                        MapGisApp.InitHeatMap(this.heatData);
                    }
                })
            }
        }
    }
</script>

<style lang="less">
    @import "../../../css/custody/screen-map";
</style>
