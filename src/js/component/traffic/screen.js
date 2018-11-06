import {screenPageInit} from '../../../js/component/traffic/screen-init';
import {websocketService} from "../../../../public/js/WebSocketService";

let axios = require("axios");
let moment = require("moment");
let $ = require("jquery");
let echarts = require("echarts");
let queryString = require('querystring');
let util = require("../../util/util");
export default {
    name: 'screen',
    data: function () {
        return {
            bottomLink: [
                {//底部菜单链接框
                    name: '共享应用',
                    class: 'icon-mainApp',
                    link: ''
                }, {
                    name: '一机一档',
                    class: 'icon-deviceRecord',
                    link: ''
                }
            ],
            EventCategoryChart: null,
            horizontalBarChartType: 0,
            horizontalBarChartTypeList: [
                {
                    name: "抓拍",
                    id: 0
                },
                {
                    name: "未戴头盔",
                    id: 1
                },
                {
                    name: "禁行",
                    id: 2
                },
            ],
            horizontalBarChartStartTimeList: [
                {
                    name: "周",
                    id: "week"
                },
                {
                    name: "月",
                    id: "month"
                },
                {
                    name: "年",
                    id: "year"
                },
            ],
            horizontalBarChartStartTime: moment().subtract(7, "days").format("YYYY-MM-DD"),
            horizontalBarChartEndTime: moment().format("YYYY-MM-DD"),
            HorizontalBarChart: null,
            healthCareRec: [],//医保动态记录
            IndustryTrendsChart: null,// 1-1
            IndustryTrendsChartData: {
                list: []
            },
            iconMenu: 'icon-menu',//菜单按钮样式，激活或常态
            lastAlarmInfoList: [],//告警抓拍
            nowBeginTimeId: "week",
            showLink: false,//是否显示菜单链接框
            screenPageInit: screenPageInit,
            showData: {},
            view: 'sMap',
            firstCapDataId: ''//存放上一条的id，用来判断是否有新数据
        }
    },
    components: {
        sMap: () => import("../../../html/components/traffic/screen-map.vue"),
    },
    mounted: function () {
        this.screenPageInit.init(this);
        this.listener();
        this.init();
    },
    destroyed() {
        $('html').removeAttr("style");
    },
    methods: {
        listener: function () {
            let _this = this;
            document.addEventListener('click', function (event) {
                let className = event.target.className;
                if (className.indexOf('target-menu') < 0) {
                    _this.hideMenu();
                }
            });
            let _height = $(window).height();
            if (_height < 2160) {
                $('html').css({"font-size": '75px'});
            } else {
                $('html').css({"font-size": '150px'});
            }
            setTimeout(function () {
                window.onresize = function () {
                    //console.log($(window).height())
                    let _height = $(window).height();
                    if (_height < 2160) {
                        $('html').css({"font-size": '75px'});
                    } else {
                        $('html').css({"font-size": '150px'});
                    }
                }
            }, 20)
        },
        hideMenu: function () {
            this.iconMenu = 'icon-menu';
            this.showLink = false;
        },
        init() {
            this.getHorizontalBarChart();
            this.getHorizontalBarChartData();
            this.getLastAlarmInfo();
            this.getIndustryTrendsChart();
            this.getEventCategoryChart();
        },
        // 每月警情趋势1-1
        getIndustryTrendsChart: function () {
            let myChart = echarts.init(document.getElementById('industryTrendsChart'));

            let option = {
                baseOption: {
                    // timeline 和其他组件有些不同，它需要操作『多个option』
                    timeline: {
                        axisType: 'category',
                        autoPlay: true,
                        playInterval: 5000,
                        symbol: 'circle',
                        symbolSize: 10,
                        padding: 0,
                        bottom: '6%',
                        lineStyle: {
                            show: true
                        },
                        label: {
                            color: '#9db9de'
                        },
                        checkpointStyle: {
                            symbol: 'circle',
                            color: '#00cffc',
                            symbolSize: 10,
                            borderWidth: 0
                        },
                        controlStyle: {
                            show: true
                        },
                        data: []
                    },
                    title: {
                        text: '全市近3年每月警情趋势',
                        textStyle: {
                            color: '#fff',
                            fontSize: 16
                        },
                        top: '5%',
                        x: 'center'
                    },
                    legend: {
                        textStyle: {
                            color: '#fff'
                        },
                        top: 50,
                        data: ['伤', '亡']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    calculable: true,
                    grid: {
                        top: '20%',
                        bottom: '22%',
                        right: 0,
                        left: 30,
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow',
                                label: {
                                    show: true,
                                    formatter: function (params) {
                                        return params.value.replace('\n', '');
                                    }
                                }
                            }
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                show: false,
                                alignWithLabel: true
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#9db9de',
                                    type: 'solid'
                                }
                            },
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '数量',
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#9db9de',
                                    type: 'solid'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#9db9de',
                                    type: 'dotted',
                                    opacity: 0.3
                                }
                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '伤',
                            type: 'bar',
                            barWidth: '30%',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#3aa0ff'
                                }
                            }
                        },
                        {
                            name: '亡',
                            type: 'bar',
                            barWidth: '20%',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#5c2de3',
                                    barBorderRadius: [6, 6, 0, 0]
                                }
                            }
                        }
                    ]
                },

            };
            myChart.setOption(option);
            myChart.on("timelinechanged", (data) => {
                this.getEventCategoryChartData(data.currentIndex);
            });
            this.IndustryTrendsChart = myChart;
            this.getIndustryTrendsChartData();
        },
        // 每月警情趋势数据1-1
        getIndustryTrendsChartData() {
            axios.get(conf.api_local + "/alarmInfo/getAlarmInfoStatisticsByYear?" + util.noNoneGetParams({
                beginYear: moment().subtract(3, "years").format("YYYY"),
                endYear: moment().format("YYYY")
            })).then((res) => {
                let data = util.verifyResponse(res);
                if (data) {
                    let result = {};
                    for (let item of data) {
                        if (!result[item.statisticsYear]) {
                            result[item.statisticsYear] = {
                                deadCount: [],
                                injuredCount: []
                            }
                        }
                    }
                    for (let year in result) {
                        for (let i = 1; i <= 12; i++) {
                            let index = _.findIndex(data, {
                                statisticsYear: year,
                                statisticsMonth: `${i}月`
                            });
                            if (index !== -1) {
                                result[year].deadCount.push(data[index].deadCount || 0);
                                result[year].injuredCount.push(data[index].injuredCount || 0);
                            } else {
                                result[year].deadCount.push(0);
                                result[year].injuredCount.push(0);
                            }
                        }
                    }

                    let option = {
                        baseOption: {
                            // timeline 和其他组件有些不同，它需要操作『多个option』
                            timeline: {
                                data: Object.keys(result)
                            },
                        },
                        options: (() => {
                            let list = [];
                            for (let year in result) {
                                list.push({
                                    series: [
                                        {
                                            data: result[year].injuredCount
                                        },
                                        {
                                            data: result[year].deadCount
                                        }
                                    ]
                                });
                            }
                            this.IndustryTrendsChartData.list = list;
                            this.getEventCategoryChartData(0);
                            return list;

                        })()
                    };
                    this.IndustryTrendsChart.setOption(option);
                }
            });
        },
        // 对应事件类别数量及占比1-2
        getEventCategoryChart: function () {
            let myChart = echarts.init(document.getElementById('eventCategoryChart'));
            let option = {
                title: {
                    text: '对应事件类别数量及占比',
                    top: '5%',
                    x: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c} ({d}%)"
                },
                color: ['#644ef8', '#ee6ee1', '#32a6ff'],
                series: [
                    {
                        name: '对应事件类别数量及占比',
                        type: 'pie',
                        radius: '42%',
                        label: {
                            normal: {
                                formatter: '{b|{b} \n {c}} ({d}%)',
                                fontSize: 12,
                                rich: {
                                    b: {
                                        fontSize: 14,
                                        lineHeight: 20,
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
            this.EventCategoryChart = myChart;
        },
        // 对应事件类别数量及占比1-2
        getEventCategoryChartData(index) {
            if (this.IndustryTrendsChartData.list.length > 0) {
                let data = this.IndustryTrendsChartData.list[index].series;
                let result = [];
                let titles = ["事故", "死亡"];
                for (let i = 0; i < 2; i++) {
                    let temp = {
                        name: titles[i],
                        value: 0
                    };
                    for (let item of data[i].data) {
                        temp.value += item;
                    }
                    result.push(temp);
                }
                let option = {
                    series: [
                        {
                            name: '对应事件类别数量及占比',
                            data: result
                        }
                    ]
                };
                this.EventCategoryChart.setOption(option)
            }
        },
        // 全市告警点位排名2-3
        getHorizontalBarChart: function getHorizontalBarChart() {
            let myChart = echarts.init(document.getElementById('horizontalBarChart'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    show: false
                },
                grid: {
                    top: 0,
                    left: 0,
                    right: 50,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: {
                    show: false
                },
                yAxis: {
                    type: 'category',
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#9db9de',
                            type: 'solid'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                color: ['#058cf9']
            };
            myChart.setOption(option);
            this.HorizontalBarChart = myChart;
            $(window).resize(() => {
                myChart.resize();
            })
        },
        // 全市告警点位排名2-3
        getHorizontalBarChartData() {
            let map = ["抓拍", "没戴头盔", "禁行"];
            axios.get(conf.api_local + "/tStatisticsDailyDeviceCapture/getDeviceCaptureRanking?" + util.noNoneGetParams({
                beginDate: this.horizontalBarChartStartTime,
                endDate: moment().format("YYYY-MM-DD"),
                type: this.horizontalBarChartType
            })).then((res) => {
                let data = util.verifyResponse(res);
                if (data) {
                    let yAxis = [];
                    let seriesName = map[this.horizontalBarChartType];
                    let seriesData = [];
                    for (let item of data) {
                        yAxis.push(item.deviceName);
                        seriesData.push(item.statisticsCount);
                    }
                    let option = {
                        yAxis: {
                            data: yAxis.reverse()
                        },
                        series: [
                            {
                                name: seriesName,
                                type: 'bar',
                                barWidth: '50%',
                                itemStyle: {
                                    normal: {
                                        barBorderRadius: 4,
                                        label: {
                                            show: true,
                                            position: 'right',
                                            textBorderWidth: 0,
                                            fontWeight: 'bold',
                                            color: '#fff'
                                        },
                                        color: new echarts.graphic.LinearGradient(
                                            0, 1, 1, 0,
                                            [
                                                {offset: 1, color: '#d66ef0'},
                                                {offset: 0, color: '#7949f2'}
                                            ]
                                        )
                                    }
                                },
                                data: seriesData.reverse()
                            }
                        ]
                    };
                    this.HorizontalBarChart.setOption(option);
                }
            });
        },
        // 最新告警信息
        getLastAlarmInfo() {
            let timer = null;
            this.getLastAlarmInfoList();
            let _this = this;
            timer = setInterval(() => {
                _this.getLastAlarmInfoList();
            }, 15000);
        },
        getLastAlarmInfoList(id) {
            //console.log(id);
            axios.get(conf.api_local + "/alarmInfo/getLastAlarmInfo?" + util.noNoneGetParams({
                page: 1,
                row: 5,
                gbid: id ? id : ''
            })).then((res) => {
                let data = util.verifyResponse(res);
                if (data) {
                    this.lastAlarmInfoList = data.rows;
                    let firstShowData = this.lastAlarmInfoList[0];
                    if (this.lastAlarmInfoList[0].gbId !== this.firstCapDataId && !id) {//当数据发生变化时再触发地图弹框
                        this.showData = {
                            type: firstShowData.type,//车辆类别
                            alarmType: firstShowData.alarmType,//报警类别
                            /*longitude: firstShowData.captureDeviceLon,
                            latitude: firstShowData.captureDeviceLat,*/
                            deviceName: firstShowData.deviceName,
                            time: firstShowData.captureTime,
                            sceneUrl: firstShowData.sceneUrl,
                            gbId: firstShowData.gbId
                        };
                        //if (this.$refs['sMap']!==undefined) {
                        this.showPop(this.showData);
                        //}
                    }
                    this.firstCapDataId = this.lastAlarmInfoList[0].gbId;
                }
            });
        },
        showMenu: function () {
            this.iconMenu = 'icon-menu-active';
            this.showLink = true;
        },
        // 全市告警点位排名 tab时间
        updateTrendAnalysisChartWithTime(item) {
            let type = item.id;
            this.nowBeginTimeId = type;
            if (type === "week") {
                this.horizontalBarChartStartTime = moment().subtract(7, "days").format("YYYY-MM-DD");
            }
            if (type === "month") {
                this.horizontalBarChartStartTime = moment().subtract(30, "days").format("YYYY-MM-DD");
            }
            if (type === "year") {
                this.horizontalBarChartStartTime = moment().subtract(180, "days").format("YYYY-MM-DD");
            }
            this.getHorizontalBarChartData();
        },
        // 全市告警点位排名 tab类别
        updateTrendAnalysisChartWithType(item) {
            let type = item.id;
            this.horizontalBarChartType = type;
            this.getHorizontalBarChartData();
        },
        createAlarmInfo(data, index) {
            console.log(data);
            let alarmData = {
                longitude: data.captureDeviceLon,
                latitude: data.captureDeviceLat,
                deviceName: data.captureDeviceName,
                label: data.capturePersonLabel,
                personName: data.capturePersonName,
                idcard: data.capturePersonIdcard,
                time: data.captureTimeStr,
                similarity: data.similarity,
                sceneUrl: data.sceneUrl,
                faceUrl: data.faceUrl,
                capturePersonImgUrl: data.capturePersonImgUrl,
                status: '待确认',
                id: data.captureDeviceId
            };
            this.$refs["sMap"].popDetail(alarmData);
        },
        showPop(data) {
            this.$refs['sMap'].findPoint(data);
        }
    }
}
