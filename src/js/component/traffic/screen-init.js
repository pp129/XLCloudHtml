let $ = require('jquery');
let _ = require('lodash');
let querystring = require("querystring");
let axios = require("axios");
let util = require("../..//util/util");
let moment = require("moment");
let initScreenPage = {
    initHorizontalBarRangeBtnName: '本周',
    initHorizontalBarRangeBtnNameId: 'weekBarBtn',
    initHorizontalBarTypeBtnName: '抓拍',
    initHorizontalBarTypeBtnId: 'pointBarBtn',
};
let screenPageInit = {
    // 存储所有图标
    chartSet: {},


    // 各区布控点位数量及抓拍、告警数量每月变化趋势2-1
    getIllegalCaptureChart: function () {
        let myChart = echarts.init(document.getElementById('illegalCaptureChart'));
        this.chartSet[2] = myChart;
        let option = {
            baseOption: {
                // timeline 和其他组件有些不同，它需要操作『多个option』
                title: {
                    text: '各区布控点位数量及抓拍、告警数量每月变化趋势',
                    textStyle: {
                        color: '#fff',
                        fontSize: 16
                    },
                    top: 15,
                    x: 'center'
                },
                legend: {
                    textStyle: {
                        color: '#fff'
                    },
                    top: 50,
                    data: ['抓拍', '告警', '点位数量']
                },
                calculable: true,
                grid: {
                    top: 100,
                    bottom: 80,
                    right: 40,
                    left: 100,
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
            },
        };
        myChart.setOption(option);
        this.getIllegalCaptureChartData();
    },
    // 各区布控点位数量及抓拍、告警数量每月变化趋势2-1
    getIllegalCaptureChartData() {
        axios.get(conf.api_local + "/tStatisticsMonthDeviceInfo/getMonthDeviceInfo?" + util.noNoneGetParams({
            beginMonth: moment().subtract(1, "years").format("YYYY-MM"),
            endMonth: moment().format("YYYY-MM")
        })).then((res) => {
            let data = util.verifyResponse(res);
            if (data) {
                let xAxis = [];
                let yData = [];
                let timeArray = [];
                for (let item of data) {
                    if (xAxis.indexOf(item.orgName) === -1) {
                        xAxis.push(item.orgName);
                    }
                    timeArray.push(item.caculateMonth)
                }
                let timeline = util.getMonthArray(timeArray);
                for (let i = 0; i < timeline.length; i++) {
                    yData.push({
                        captureCount: [],
                        alarmCount: [],
                        deviceCount: [],
                    });
                    for (let item of xAxis) {
                        let index = _.findIndex(data, {
                            orgName: item,
                            caculateMonth: timeline[i]
                        });
                        if (index !== -1) {
                            yData[i].captureCount.push(data[index].captureCount || 0);
                            yData[i].alarmCount.push(data[index].alarmCount || 0);
                            yData[i].deviceCount.push(data[index].deviceCount || 0);
                        } else {
                            yData[i].captureCount.push(0);
                            yData[i].alarmCount.push(0);
                            yData[i].deviceCount.push(0);
                        }
                    }
                }
                let option = {
                    baseOption: {
                        // timeline 和其他组件有些不同，它需要操作『多个option』
                        timeline: {
                            axisType: 'category',
                            autoPlay: true,
                            playInterval: 10000,
                            symbol: 'circle',
                            symbolSize: 10,
                            padding: 0,
                            bottom: 10,
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
                            data: timeline
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                                data: xAxis
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '次',
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
                                        opacity: 0.1
                                    }
                                },
                                axisTick: {
                                    show: false
                                }
                            },
                            {
                                type: 'value',
                                name: '个',
                                axisLine: {
                                    show: false,
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
                                        opacity: 0.1
                                    }
                                },
                                axisTick: {
                                    show: false
                                }
                            }
                        ],
                        series: [
                            {
                                name: '抓拍',
                                type: 'bar',
                                barWidth: '15%',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                        color: '#fff'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#1b41bc',
                                        barBorderRadius: [4, 4, 0, 0]
                                    }
                                }
                            },
                            {
                                name: '告警',
                                type: 'bar',
                                barWidth: '15%',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                        color: '#fff'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#3aa0ff',
                                        barBorderRadius: [4, 4, 0, 0]
                                    }
                                }
                            },
                            {
                                name: '点位数量',
                                type: 'bar',
                                barWidth: '15%',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'top',
                                        color: '#fff'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#644ef8',
                                        barBorderRadius: [4, 4, 0, 0]
                                    }
                                }
                            }
                        ],
                    },
                    options: (function () {
                        let list = [];
                        for (let i = 0; i < yData.length; i++) {
                            list.push({
                                series: [
                                    {
                                        data: yData[i].captureCount
                                    },
                                    {
                                        data: yData[i].alarmCount
                                    },
                                    {
                                        data: yData[i].deviceCount
                                    }
                                ]
                            });
                        }
                        return list;
                    })()
                };
                this.chartSet[2].setOption(option);
            }
        });
    },
    // 各区布控点位数量及其每月违章抓拍情况2-2
    getAlarmTrendsChart: function () {
        let myChart = echarts.init(document.getElementById('alarmTrendsChart'));
        let option = {
            title: {
                text: '全市各类告警变化趋势',
                textStyle: {
                    color: '#fff',
                    fontSize: 16
                },
                top: '5%',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                top: 50,
                textStyle: {
                    color: '#fff'
                },
                data: ['没戴头盔', '禁行']
            },
            grid: {
                left: 30,
                right: 40,
                bottom: 40,
                top: 120,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    name: '月份',
                    axisTick: {
                        show: true,
                        alignWithLabel: true,
                        inside: true
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#9db9de',
                            type: 'solid'
                        }
                    },
                    data: ['1月', '2月', '3月', '4月', '5月', '6月']
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
                    name: '没戴头盔',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            borderWidth: 3,
                            borderColor: '#8d83f0',
                            color: '#4545ca'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#8d83f0',
                            width: 4,
                            type: 'solid'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#35298b'
                        }
                    },
                    data: [300, 400, 320, 300, 330, 300]
                },
                {
                    name: '禁行',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            borderWidth: 3,
                            borderColor: '#3991f0',
                            color: '#1c73c4'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#3991f0',
                            width: 4,
                            type: 'solid'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#233f94'
                        }
                    },
                    data: [160, 260, 160, 180, 90, 120]
                }
            ]
        };
        myChart.setOption(option);
        this.chartSet[3] = myChart;
        this.getAlarmTrendsChartData();
    },
    // 各区布控点位数量及其每月违章抓拍情况2-2
    getAlarmTrendsChartData(){
        axios.get(conf.api_local + "/tStatisticsMonthDeviceInfo/getMonthDeviceCapture?" + util.noNoneGetParams({
            beginMonth: moment().subtract(6, "months").format("YYYY-MM"),
            endMonth: moment().format("YYYY-MM")
        })).then((res) => {
            let data = util.verifyResponse(res);
            if (data) {
                let timeArray = [];
                let series = {
                    captureNoEntryCount:[],
                    captureNoHelmetCount:[],
                };
                for (let item of data) {
                    timeArray.push(item.captureMonth)
                }
                let timeline = util.getMonthArray(timeArray);
                for(let time of timeline){
                    let index = _.findIndex(data , {
                        captureMonth:time
                    });
                    if (index !== -1) {
                        series.captureNoEntryCount.push(data[index].captureNoEntryCount || 0);
                        series.captureNoHelmetCount.push(data[index].captureNoHelmetCount || 0);
                    } else {
                        series.captureNoEntryCount.push(0);
                        series.captureNoHelmetCount.push(0);
                    }
                }
                let option = {
                    xAxis: [
                        {
                            data: timeline
                        }
                    ],
                    series: [
                        {
                            name: '没戴头盔',
                            data: series.captureNoHelmetCount
                        },
                        {
                            name: '禁行',
                            data:  series.captureNoEntryCount
                        }
                    ]
                };
                this.chartSet[3].setOption(option);
            }
        }).catch((e)=>{
            console.error(e);
        })
    },
    // 全市每天平均每个点位抓拍告警趋势分析1-3
    getTrendAnalysisChart: function () {
        let myChart = echarts.init(document.getElementById('trendAnalysisChart'));
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: 60,
                bottom: 90,
                right: 50,
                left: 40
            },
            legend: {
                top: 15,
                right: 0,
                textStyle: {
                    color: '#fff'
                },
                data: ['抓拍', '没戴头盔', '禁行']
            },
            xAxis: {
                type: 'category',
                name: '日期',
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
                        type: 'solid',
                        opacity: 0.1
                    }
                },
                axisTick: {
                    show: false
                }
            },
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
                            type: 'solid',
                            opacity: 0.1
                        }
                    },
                    axisTick: {
                        show: false
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'slider',
                    xAxisIndex: 0,
                    filterMode: 'empty',
                    start: 0,
                    end: 100,
                    bottom: 15,
                    borderColor: '#172b65',
                    textStyle: {
                        color: '#9db9de'
                    },
                    dataBackground: {
                        areaStyle: {
                            color: '#3361ec'
                        }
                    },
                    handleStyle: {
                        color: '#3aa0ff',
                        borderColor: '#3aa0ff'
                    }
                }
            ],
            color: ['#00cffc', '#5c2de3', '#de67fc'],
            series: [
                {
                    name: '抓拍',
                    type: 'line',
                    symbol: 'none'
                },
                {
                    name: '没戴头盔',
                    type: 'line',
                    symbol: 'none'
                },
                {
                    name: '禁行',
                    type: 'line',
                    symbol: 'none'
                }
            ]
        };
        myChart.setOption(option);
        this.chartSet[4] = myChart;
        this.getTrendAnalysisChartData();
    },
    // 全市每天平均每个点位抓拍告警趋势分析1-3
    getTrendAnalysisChartData() {
        axios.get(conf.api_local + "/tStatisticsDailyDeviceCapture/getDailyDeviceCapture?" + util.noNoneGetParams({
            beginDate: moment().subtract(1, "months").format("YYYY-MM-DD"),
            endDate: moment().format("YYYY-MM-DD")
        })).then((res) => {
            let data = util.verifyResponse(res);
            if (data) {
                let xAxis = [];
                let captureCount = [];
                let captureNoHelmetCount = [];
                let captureNoEntryCount = [];
                for (let i = 0; i <= 30; i++) {
                    let date = moment().subtract(i, "days");
                    xAxis.push(date.format("MM.DD"));
                    let index = _.findIndex(data, {
                        "statisticsDate": date.format("YYYY-MM-DD")
                    });
                    if (index === -1) {
                        captureCount.push(0);
                        captureNoHelmetCount.push(0);
                        captureNoEntryCount.push(0);
                    } else {
                        captureCount.push(data[index].captureCount || 0);
                        captureNoHelmetCount.push(data[index].captureNoHelmetCount || 0);
                        captureNoEntryCount.push(data[index].captureNoEntryCount || 0);
                    }
                }
                let option = {
                    xAxis: {
                        data: xAxis.reverse()
                    },
                    series: [
                        {
                            name: '抓拍',
                            data: captureCount.reverse()
                        },
                        {
                            name: '没戴头盔',
                            data: captureNoHelmetCount.reverse()
                        },
                        {
                            name: '禁行',
                            data: captureNoEntryCount.reverse()
                        }
                    ]
                };
                this.chartSet[4].setOption(option);
            }
        });
    }
};

//获取开始时间戳函数
function getBeginTime(timestamp, params) {
    let beginTime = '';
    if (params === "本周") {
        let time = 7 * 24 * 3600;
        beginTime = timestamp - time;
    }
    if (params === "本月") {
        let time = 30 * 24 * 3600;
        beginTime = timestamp - time;
    }
    if (params === "半年") {
        let time = 6 * 30 * 24 * 3600;
        beginTime = timestamp - time;
    }
    return beginTime;
}


screenPageInit.init = function(vue) {
    screenPageInit.getIllegalCaptureChart();  // 各区布控点位数量及抓拍、告警数量每月变化趋势
    screenPageInit.getAlarmTrendsChart();     // 各区布控点位数量及其每月违章抓拍情况
    screenPageInit.getTrendAnalysisChart();   // 全市每天平均每个点位抓拍告警趋势分析
    $(window).on("resize", () => {
        for (let key in screenPageInit.chartSet) {
            screenPageInit.chartSet[key].resize();
        }
    });
    return screenPageInit;
};

export {
    screenPageInit
}
