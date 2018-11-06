let $ = require('jquery');
let querystring = require("querystring");
let moment = require("moment");
let _ = require("lodash");
let screenPageInit = {
    chartSet:{

    },
    // 各区精神病标签人员数量
    getPieChart: function getPieChart() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('pieChart'));
        // 指定图表的配置项和数据
        let option = {
            title: {
                text: '合计： {b|} 人',
                top: '0',
                right: '0',
                textStyle: {
                    color: '#9db9de',
                    fontWeight: 'normal',
                    fontSize: 12,
                    rich: {
                        b: {
                            color: '#fff',
                            fontSize: 20,
                            fontWeight: 'bold'
                        }
                    }
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            // grid: {
            //     top: '5%',
            //     left: '10%'
            // },
            color: ['#6780fe', '#1b41bc', '#00cffc', '#de67fc', '#5c2de3', '#3aa0ff'],
            series: [
                {
                    name: '各区精神病标签人员数量',
                    type: 'pie',
                    radius: ['35%', '50%'],
                    label: {
                        normal: {
                            formatter: '{b|{b} {c}} \n ({d}%)',
                            fontSize: 12,
                            rich: {
                                b: {
                                    fontSize: 10,
                                    lineHeight: 33,
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    },
                    data: []
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        this.chartSet[0] = myChart;
        $.get(conf.api + "/labelPsychosisCount/areaLabelPsyCount").done((response)=>{
            if (response.errorCode === 200){
                let newData = [];
                let ary = response.data;
                for(let key in ary){
                    let obj = {value:"",name:""};
                    obj.value = ary[key];
                    obj.name = key;
                    if (key !== "总数量"){
                        newData.push(obj);
                    }
                }
                myChart.setOption({
                    title: {
                        text: '合计： {b|' + ary["总数量"] + '} 人',
                    },
                    series: [
                        {
                            data: newData
                        }
                    ]
                })
            }
        })
    },

    // 各区每月抓拍人数
    getGradientBarChart: function getGradientBarChart() {
        let myChart = echarts.init(document.getElementById('gradientBarChart'));
        let dataMap = [];
        let option = {
            baseOption: {
                // timeline 和其他组件有些不同，它需要操作『多个option』
                timeline: {
                    axisType: 'category',
                    autoPlay: true,
                    playInterval: 1000,
                    symbol: 'circle',
                    symbolSize: 10,
                    padding: 0,
                    bottom: '2%',
                    lineStyle: {
                        show: true
                    },
                    label: {
                        color: '#9db9de'
                    },
                    checkpointStyle: {
                        symbol: 'circle',
                        color: '#de67fc',
                        symbolSize: 10,
                        borderWidth: 0
                    },
                    controlStyle: {
                        show: true,

                    },
                    data: []
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                calculable: true,
                grid: {
                    top: '8%',
                    bottom: '22%',
                    right: '5%',
                    left: '5%',
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
                        data: []
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
                        name: '各区每月抓拍人数',
                        type: 'bar',
                        barWidth: '20%',
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#d66ef0'},
                                        {offset: 1, color: '#7949f2'}
                                    ]
                                )
                            }
                        }
                    }
                ]
            },
            options: (function () {
                let list = [];
                for (let i = 1; i <= (dataMap.length - 1); i++) {
                    list.push({
                        series: [
                            {
                                data: dataMap[i]
                            }
                        ]
                    });
                }
                return list;
            })()
        };
        myChart.setOption(option);
        this.chartSet[1] = myChart;
        $.get(conf.api + "/labelPsychosisCount/areaMonthPsyCount").done((response)=>{
            let ydata = [];
            let xdata = [];
            let timeData = [];
            let monthData = [];
            //组包
            $.each(response.data,(index,item)=>{
                let tempy = [];
                let tempx = [];
                $.each(item,(key,value)=>{
                    tempy.push(value.SUMNUM);
                    tempx.push(value.AREA);
                });
                ydata.push(tempy);
                xdata.push(tempx);
                timeData.push(index);
            });
            for (var i = 0;i<timeData.length;i++){
                var endTime = Number(timeData[i].split('-')[1]);
                var str = endTime + "月";
                monthData.push(str)
            }
            myChart.setOption({
                baseOption:{
                    xAxis: [
                        {
                            data:xdata[0]
                        }
                    ],
                    timeline: {
                        data: monthData
                    },
                },
                options:(function (){
                    var list = [];
                    for (var i = 0; i <= (ydata.length-1); i++) {
                        list.push( {
                            series: [
                                {
                                    data: ydata[i]
                                }
                            ]
                        });
                    }
                    return list;
                })()
            });
        })
    },
    // 全市每天抓拍人数与次数变化趋势
    getLineChart: function getLineChart() {
        let myChart = echarts.init(document.getElementById('lineChart'));
        let timeAry = getDaysAry();
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: '15%',
                bottom: '25%',
                right: 52,
                left: 40
            },
            legend: {
                top: 10,
                right: 0,
                textStyle: {
                    color: '#fff'
                },
                data: ['抓拍人数', '抓拍次数']
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
                },
                data: timeAry
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
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'empty',
                    start: 75,
                    end: 100,
                    borderColor: '#9db9de',
                    textStyle: {
                        color: '#9db9de',
                    },
                    dataBackground: {
                        areaStyle: {
                            color: '#00cffc'
                        }
                    }
                }, {
                    show: true,
                    bottom: '10%'
                }
            ],
            color: ['#00cffc', '#5c2de3'],
            series: [
                {
                    name: '抓拍人数',
                    type: 'line',
                    symbol: 'none',
                    data: []
                },
                {
                    name: '抓拍次数',
                    type: 'line',
                    symbol: 'none',
                    data: []
                }
            ]
        };
        let endDate = moment().format("YYYY-MM-DD");
        let beginDate = moment(endDate).subtract(30,"days").format("YYYY-MM-DD");
        $.post(conf.api +"/tBusDailyCaptureStatistics/getTBusDailyCaptureDateStatistics",querystring.stringify({
            beginDate:beginDate,
            endDate:endDate
        })).done((response) =>{
            let personCountAry = [];
            let countAry = [];
            if(response.errorCode === 200){
                let personCountAry = [];
                let countAry = [];
                for (let item of response.data){
                    personCountAry.push(item.capturePersonCount);
                    countAry.push(item.captureCount);
                }
                 let source = response.data;
                 let length = source.length;
                 let end = moment(source[length-1].captureData).format("MM-DD");
                 let endIndex = timeAry.indexOf(end);
                 let begin = moment(source[0].captureData).format("MM-DD");
                 let beginIndex = timeAry.indexOf(begin);
                 for(let j = 0;j < beginIndex;j++){
                     personCountAry.unshift("");
                     countAry.unshift("")
                 }
                 for(let i = endIndex;i < 30;i++){
                     personCountAry.push("");
                     countAry.push("")
                 }
                myChart.setOption({
                    series: [
                        {
                            data: personCountAry
                        },
                        {
                            data: countAry
                        }
                    ]
                })
            }
        })
        myChart.setOption(option);
        this.chartSet[2] = myChart;
    },
    // 精神病标签人员活跃度排序TOP10
    beginTime:moment().subtract(7,"days").format("YYYY-MM-DD"),
    endTime: moment().format("YYYY-MM-DD"),
    typeSet:"点位",
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
                right: 0,
                bottom: '18%',
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
            color: ['#058cf9'],
            series: [
                {
                    name: screenPageInit.typeSet,
                    type: 'bar',
                    barWidth: '50%',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 4,
                            label: {
                                show: true,
                                position: 'insideRight',
                                textBorderWidth: 0,
                                fontWeight: 'bold'
                            },
                            color: new echarts.graphic.LinearGradient(
                                0, 1, 1, 0,
                                [
                                    {offset: 0, color: '#08bdf9'},
                                    {offset: 1, color: '#0480f9'}
                                ]
                            )
                        }
                    },
                }
            ]
        };
        myChart.setOption(option);
        let path = null;
        switch (screenPageInit.typeSet) {
            case "点位" :{
                path = "/tBusCaptureInfo/getDeviceCaptureStatistics";
                break;
            }
            case "天数" :{
                path = "/tBusDailyCaptureDetail/getCaptureDateStatistics";
                break;
            }
            case "次数" :{
                path = "/tBusDailyCaptureDetail/getCaptureCountStatistics";
                break;
            }
        }
        let url = conf.api + path + "?"+querystring.stringify({
            beginDate:screenPageInit.beginTime,
            endDate:screenPageInit.endTime
        });
        let that = screenPageInit;
        if(that.HorizontalBarChartDataCathe[that.typeSet] &&
            that.HorizontalBarChartDataCathe[that.typeSet][that.beginTime]){
            myChart.setOption({
                yAxis: {
                    data: that.HorizontalBarChartDataCathe[that.typeSet][that.beginTime].tempY,
                },
                series: [
                    {
                        name:screenPageInit.typeSet,
                        data: that.HorizontalBarChartDataCathe[that.typeSet][that.beginTime].tempX
                    }
                ]
            })
        }else{
            $.get(url).done((response)=>{
                if (response.errorCode === 200){
                    let tempX = [];
                    let tempY = [];
                    for(let item of response.data){
                        tempX.push(item.captureCount);
                        tempY.push(item.name);
                    }
                    tempX.reverse();
                    tempY.reverse();
                    myChart.setOption({
                        yAxis: {
                            data: tempY,
                        },
                        series: [
                            {
                                name:screenPageInit.typeSet,
                                data: tempX
                            }
                        ]
                    });
                    // 缓存
                    if(!that.HorizontalBarChartDataCathe[that.typeSet]){
                        that.HorizontalBarChartDataCathe[that.typeSet] = [];
                    }
                    if(!that.HorizontalBarChartDataCathe[that.typeSet][that.beginTime]){
                        that.HorizontalBarChartDataCathe[that.typeSet][that.beginTime] = [];
                    }
                    that.HorizontalBarChartDataCathe[that.typeSet][that.beginTime].tempX = tempX;
                    that.HorizontalBarChartDataCathe[that.typeSet][that.beginTime].tempY = tempY;


                }
            });
        }
        this.chartSet[3] = myChart;
    },
    // 数据缓存
    HorizontalBarChartDataCathe:{

    },

    // 点位按钮
    updateHorizontalBarTypeBtn: function updateHorizontalBarTypeBtn(typeName, typeBtnId) {
        console.log(screenPageInit.HorizontalBarChartDataCathe);
        $('.chart-bottom-btn').children('a').removeClass('active');
        $('#' + typeBtnId).addClass('active');
        screenPageInit.typeSet = typeName;
        screenPageInit.getHorizontalBarChart();     // 精神病标签人员活跃度排序TOP10
    },
    // 日期按钮
    updateHorizontalBarRangeBtn:  (typeName, typeBtnId) =>{
        console.log(screenPageInit.HorizontalBarChartDataCathe);
        $('.chart-top-btn').children('a').removeClass('active');
        $('#' + typeBtnId).addClass('active');
        if (typeName === "本周"){
            screenPageInit.beginTime = moment().subtract(7,"days").format("YYYY-MM-DD");
        }
        if (typeName === "本月"){
            screenPageInit.beginTime = moment().subtract(30,"days").format("YYYY-MM-DD");
        }
        if (typeName === "半年"){
            screenPageInit.beginTime = moment().subtract(180,"days").format("YYYY-MM-DD");
        }
        screenPageInit.getHorizontalBarChart();     // 精神病标签人员活跃度排序TOP10
    },
    // 从未出现与首次出现数量每月变化趋势
    getAreaLineChart: function getAreaLineChart() {
        let myChart = echarts.init(document.getElementById('areaLineChart'));
        let option = {
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
                top: 10,
                right: 0,
                textStyle: {
                    color: '#fff'
                },
                data: ['总数', '从未出现', '首次出现', '近6个月从未出现']
            },
            grid: {
                left: '5%',
                right: '10%',
                bottom: '10%',
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
                    data: [
                        // '11月', '12月', '2018年1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'
                    ]
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
                    }
                }
            ],
            series: [
                {
                    name: '总数',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            borderWidth: 3,
                            borderColor: '#00cffc',
                            color: '#149cba'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#00cffc',
                            width: 4,
                            type: 'solid'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#066e9d'
                        }
                    },
                    data: [
                        // 520, 500, 560, 510, 560, 520, 550, 520, 500, 560, 510, 560
                    ]
                },
                {
                    name: '从未出现',
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
                            color: '#3259bb'
                        }
                    },
                    data: [
                        // 420, 400, 460, 410, 460, 420, 450, 420, 400, 460, 410, 460
                    ]
                },
                {
                    name: '首次出现',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            borderWidth: 3,
                            borderColor: '#de67fc',
                            color: '#911cae'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#b662e9',
                            width: 4,
                            type: 'solid'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#6656c0'
                        }
                    },
                    data: [
                        // 320, 300, 360, 310, 360, 320, 350, 320, 300, 360, 310, 360
                    ]
                },
                {
                    name: '近6个月从未出现',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 10,
                    itemStyle: {
                        normal: {
                            borderWidth: 3,
                            borderColor: '#3aa0ff',
                            color: '#1c73c4'
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#4780e1',
                            width: 4,
                            type: 'solid'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#435cbc'
                        }
                    },
                    data: [
                        // 220, 200, 260, 210, 260, 220, 250, 220, 200, 260, 210, 260
                    ]
                }
            ]
        };
        myChart.setOption(option);
        $.get(conf.api + "/labelPsychosisCount/neverShowPersonCount").done((response)=>{
            if(response.errorCode === 200){
                let xData = []; //x轴数据
                let neverShow = [];//从未出现的数据
                let firstShow = [];//首次出现的数据
                let halfNot = [];//近半年未出现的数据
                let total = [];//总数
                for(let item in response.data){
                    //处理坐标月份
                    let month = Number(moment(item,"YYYY-MM").format("MM")) + '月';
                    if (month === '1月'){
                        let temp = moment(item,"YYYY-MM").format("YYYY") + '年' + Number(moment(item,"YYYY-MM").format("MM")) + '月';
                        xData.unshift(temp);
                    }else{
                        xData.unshift(month);
                    }
                    //处理从未出现
                    neverShow.unshift(response.data[item].notAppearCount);
                    //处理首次出现
                    firstShow.unshift(response.data[item].firstAppearCount);
                    //处理近6个月未出现
                    halfNot.unshift(response.data[item].lastSixMonthNotAppearCount);
                    total.unshift(response.data[item].totalPersonCount);
                    let option = {
                        xAxis: [
                            {
                                data: xData
                            }
                        ],
                        series: [
                            {
                                name: '总数',
                                data:total
                            },
                            {
                                name: '从未出现',
                                data:neverShow
                            },
                            {
                                name: '首次出现',
                                data: firstShow
                            },
                            {
                                name: '近6个月从未出现',
                                data: halfNot
                            },

                        ]
                    };
                    myChart.setOption(option);
                }
            }
        })
        this.chartSet[4] = myChart;
    },

    // 医保每月人次统计
    getHealthBarChart: function getHealthBarChart() {
        let myChart = echarts.init(document.getElementById('healthBarChart'));
        let option = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                top: '15%',
                containLabel: true
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
                    data: [
                        // '1月', '2月', '3月', '4月', '5月', '6月',
                        // '7月', '8月', '9月', '10月', '11月', '12月'
                    ]
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
                    name: '医保每月人次统计',
                    type: 'bar',
                    barWidth: '20%',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#08bdf9'},
                                    {offset: 1, color: '#0480f9'}
                                ]
                            )
                        }
                    },
                    data:[
                        // 10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390
                    ]
                }
            ]
        };
        myChart.setOption(option);
        $.post(conf.api + "/medicalInsurance/everyMonthCount",(response)=>{
            if (response.errorCode == 200){
                //组包
                let xData = [];
                let yData = [];
                let time = [];
                $.each(response.data,(index,item)=>{
                    for(let key in item){
                        yData.push(item[key]);
                        xData.push(key);
                    }
                });
                for(var i = 0;i<time.length;i++){
                    var month = Number(time[i].split('-')[1]);
                    var str = month + "月";
                    xData.push(str)
                }

                myChart.setOption({
                    xAxis: [
                        {
                            data: xData
                        }
                    ],
                    series : [
                        {
                            data:yData
                        }
                    ]
                });
            }
        })
        this.chartSet[5] = myChart;
    },
    // 警情趋势
    getPoliceBarChart: function getPoliceBarChart() {
        var myChart = echarts.init(document.getElementById('policeBarChart'));
        console.log(myChart)
        var option =  {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                top:'15%',
                containLabel: true
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
                    data: ['1月', '2月', '3月', '4月', '5月', '6月',
                        '7月', '8月', '9月', '10月', '11月', '12月']
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
            series : [
                {
                    name:'警情每月统计',
                    type:'bar',
                    barWidth: '20%',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#d66ef0'},
                                    {offset: 1, color: '#7949f2'}
                                ]
                            )
                        }
                    },
                    data:[10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 590]
                }
            ]
        };
        myChart.setOption(option);
        this.chartSet[6] = myChart;
    }
};
function getDaysAry() {
    let ary = [];
    for(let i=0;i<30;i++){
        let now = moment();
        let time = now.subtract(i,"days");
        let f = time.format("MM-DD")
        ary.unshift(f);
    }
    return ary;
}
//获取开始时间戳函数
function getBeginTime(timestamp,params) {
    if (params === "本周"){
        var time = 7*24*3600;
        var beginTime = timestamp - time;
    }
    if(params === "本月"){
        var time = 30*24*3600;
        var beginTime = timestamp - time;
    }
    if(params === "半年"){
        var time = 6*30*24*3600;
        var beginTime = timestamp - time;
    }
    return beginTime;
}


screenPageInit.init =  () =>{
    screenPageInit.getPieChart();   // 各区精神病标签人员数量
    screenPageInit.getGradientBarChart();   // 各区每月抓拍人数
    screenPageInit.getLineChart();  // 全市每天抓拍人数与次数变化趋势
    screenPageInit.getHorizontalBarChart();     // 精神病标签人员活跃度排序TOP10
    screenPageInit.getAreaLineChart();   // 从未出现与首次出现数量每月变化趋势
    screenPageInit.getHealthBarChart();     // 医保每月人次统计
    screenPageInit.getPoliceBarChart();     // 警情趋势
    $(window).on("resize",()=>{
        for(let key in screenPageInit.chartSet){
            screenPageInit.chartSet[key].resize();
        }
    });
    return screenPageInit;
};
export {
    screenPageInit
}
