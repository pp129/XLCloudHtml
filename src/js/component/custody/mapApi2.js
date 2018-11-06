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
            mapGis:{},
            mapParam: {
                target: 'showmap', //容器ID
                deselectFlag: false,
                mousetarget: "",
                mousePositionLength: 6, // 经纬度小数点位数
                center: [118.10417, 24.55961], // 地图中心
                extent: [117.8, 24.38, 118.5, 25.0], // 地图中心点可视范围
                zoom: 13, //初始化缩放等级
                minZoom: 10, //最小缩放层级
                maxZoom: 17,
                popupOffset: [0, 0]
            },
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
        this.initDatetime();
        this.getStatistics();
        this.initMap();
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
            console.log(this.attrs)
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
        initMap() {
            this.mapGis = mapGisObj.mapGis(this.mapParam);
            this.mapGis.showZoomSliderControl();
        }
    }
}
