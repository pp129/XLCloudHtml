<template>
    <div>
        <top :type="type" :htmlname="htmlname"></top>
        <div class="safe_width">
            <div class="deviceinfo-div">
                <div class="devicepic-box">
                    <div class="head-pic">
                        <img :src="deviceInfo.photoUrl"/>
                    </div>
                </div>
                <div class="deviceinfo-box">
                    <div class="deviceinfo-text">
                        <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td class="devicetext-title">摄像机名称：</td>
                                <td>{{deviceInfo.name}}</td>
                            </tr>
                            <tr>
                                <td class="devicetext-title">点位标签：</td>
                                <td>
                                    <span v-for="item in deviceInfo.tag" class="device-normaltag" :class="changeTagClass(item)">{{item}}</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="devicetext-title">经度：</td>
                                <td>{{deviceInfo.lon}}</td>
                            </tr>
                            <tr>
                                <td class="devicetext-title">纬度：</td>
                                <td>{{deviceInfo.lat}}</td>
                            </tr>
                            <tr>
                                <td class="devicetext-title">行政区：</td>
                                <td>{{deviceInfo.region}}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="liquid-box">
                    <div class="chart_liquid">
                        <div class="div_ball">{{deviceInfo.alarmCount}}</div>
                        <span>总告警数</span>
                    </div>
                    <div class="chart_liquid">
                        <div class="div_ball">{{deviceInfo.captureCount}}</div>
                        <span>总抓拍数</span>
                    </div>
                    <div class="chart_liquid">
                        <div id="chart-div-showOne" style="width: 100%;height: 100%;"></div>
                    </div>
                    <div class="chart_liquid">
                        <div id="chart-div-showTwo" style="width: 100%;height: 100%;"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="safe_width">
            <div class="title_box">
                <span class="title_line">抓拍信息</span>
                <span class="fold_btn" @click="foldInfoClick(0)" ></span>
            </div>
        </div>
        <span class="cut-off-line"></span>
        <div class="safe_width show_div">
            <div class="capture-box clearfix">
                <div class="capture-left-box">
                    <div class="left-head-box">
                        <span></span>
                        <!--<span class="left-head-normaltag" @click="searchAll()"><span class="shape_check" v-if="allCheck"></span>全部（{{getAmount}}）</span>-->
                        <span class="left-head-normaltag" v-for="item in captureList" @click="checkOne(item)">
                            <span class="shape_check" v-if="item.id === nowCaptureId"></span>
                            {{item.name}}({{item.count}})
                        </span>
                    </div>
                    <div id="calendar-div"></div>
                    <div>
                        <span style="color: rgb(238,80,81);font-size: 14px;margin-left: 35px;">* 红色文本为当日出现次数</span>
                    </div>
                </div>
                <div class="capture-right-box">
                    <div class="capture-right-box">
                        <div class="right-head-box">
                            时间：<span v-if="flagTime">{{today}}</span>{{outData.captureDate}} 00:00:00 至 {{outData.captureDate}} <span v-if="flagTime">{{today}}</span> 23:59:59
                        </div>
                        <div class="right-main-box clearfix">
                            <div class="show-content-div" v-for="item in list">
                                <div class="search-result">
                                    <div class="search-pic-show">
                                        <img :src="item.sceneUrL"/>
                                        <span class="img-span" :class="item.tag && 'img-span-' + item.tag "></span>
                                    </div>
                                    <div class="search-time">
                                       {{item.captureTime}}
                                    </div>
                                    <span :class="getTagClass(item.confirmResult)">{{item.confirmResult}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="search-page-div">
                            <el-pagination
                                @size-change="handleSizeChangeFromCaptureList"
                                @current-change="handleCurrentChangeFromCaptureList"
                                :current-page="outData.page"
                                :page-sizes="[15, 30, 45, 60]"
                                :page-size="outData.rows"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="outData.total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="safe_width">
            <div class="title_box">
                <span class="title_line">统计分析</span>
                <span class="fold_btn" @click="foldInfoClick(1)" ></span>
            </div>
        </div>
        <span class="cut-off-line"></span>
        <div class="safe_width show_div">
            <div id="lineChart"></div>
        </div>
        <bottom></bottom>
    </div>
</template>

<script>
    let axios = require("axios");
    let _ = require("lodash");
    let moment = require("moment");
    let querystring = require("querystring");
    let echarts = require("echarts");
    let util = require("../../../js/util/util");
    let echart_li = require('../../../js/lib/echarts-liquidfill.min.js');
    export default {
        data(){
            return{
                allCheck:false,//全选标志
                //设备信息
                captureList:[],
                nowCaptureId:null,
                deviceInfo:{
                    alarmCount:7,//告警总数
                    alarmPointCount:'23',//告警指数
                    captureCount:1562,//抓拍总数
                    //抓拍列表信息

                    connectState:"启用",
                    deviceState:"正常",
                    faceHitRate:"76%",//人脸命中率
                    lat:"263.4591",//纬度
                    lon:"14.433533",//经度
                    name:"思明区嘉禾路明发人行天桥半球2",
                    photoUrl:"/public/image/test1.jpg",
                    region:"思明区",//行政区
                    tag:["隧","普","高","桥"],
                },
                flagTime:true,
                htmlname:"-点位分析",
                id:"",
                list:[],
                //查询数据
                outData:{
                    page:1,
                    rows:15,
                    total:0,
                    captureDate:"",//日期
                    typeList:[],//查询的类型条件
                },
                today:"",
                type:"雪亮交通"
            }
        },
        components:{
          Top:() => import("../custody/common/top.vue"),
          Bottom:() => import("../custody/common/bottom.vue")
        },
        watch:{
        },
        computed:{
        },
        created(){

        },
        mounted(){
            this.initVue();
        },
        methods:{
            //日历
            calendar(){
                var rldata = {
                    id: "calendar-div",
                    isRight: false,//是否显示右边模块
                    isBtn: true,//是否可以日期切换
                //	istopTitle:true,//是否显示上方标题
                    isRadio:true,//是否单选
                    onChangeMonth:(data)=>{
                        console.log(data)
                    },
                    onClickDay:(data)=>{
                        this.flagTime = false;
                        this.outData.captureDate = `${data.year}-${util.addZero(data.month ,2)}-${util.addZero(data.checkedDayArray[0] ,2)}`;
                        this.getListData();
                    }
                };
                this.rldata = createRl(rldata);
            },
            //变化标签背景
            changeTagClass(params){
                if (params === "隧"){
                   return "back_orange"
                }
                if (params === "普"){
                    return "back_blue"
                }
                if (params === "高"){
                    return "back_purse"
                }
                if (params === "桥"){
                    return "back_green"
                }
            },
            //单选事件
            checkOne(item){
                this.nowCaptureId = item.id;
                this.getListData();
            },
            //折叠菜单
            foldInfoClick(index){
                var deg = $(".fold_btn").eq(index).attr("deg");
                deg = (Number(deg) +180)%360;
                $(".show_div").eq(index).toggle("slow");
                $(".fold_btn").eq(index).css({
                    'transform':'rotate('+ deg +'deg)',
                    'transition': 'transform 0.2s'
                });
                $(".fold_btn").eq(index).attr("deg",deg);
            },
            // 获取列表数据
            async getListData(){
                let list = await axios.post(conf.api_local + "/captureInfo/getCaptureInfoList" , util.noNoneGetParams({
                    page:this.outData.page,
                    rows:this.outData.rows,
                    type:this.nowCaptureId,
                    gbids: this.id ,
                    beginTime: this.outData.captureDate ? moment(this.outData.captureDate).hour(0).minute(0).second(0).format("YYYY-MM-DD hh:mm:ss") : "",
                    endTime: this.outData.captureDate ? moment(this.outData.captureDate).hour(23).minute(59).second(59).format("YYYY-MM-DD hh:mm:ss") : "",
                })).then((res)=>{
                    let data = util.verifyResponse(res);
                    if (data) {
                        return data;
                    }
                }).catch((e)=>{
                    return false;
                });
                if(list){
                    for(let item of list.rows){
                        if(item.alarmType && item.alarmType.indexOf("盔") !== -1){
                            item.tag = "no-helmet";
                            continue;
                        }
                        if(item.confirmInfo){
                            for(let confirmInfo of item.confirmInfo){

                                if(confirmInfo.personLabel){
                                    if(confirmInfo.personLabel.indexOf("毒") !== -1){
                                        item.tag = "poison";
                                        break
                                    }
                                    if(confirmInfo.personLabel.indexOf("酒") !== -1){
                                        item.tag = "wine";
                                        break
                                    }
                                }

                            }
                        }

                    }
                    this.list = list.rows;
                    this.outData.total = list.total;
                }

            },
            //获取日期数组
            getDaysAry() {
                let ary = [];
                for(let i=0;i<30;i++){
                    let now = moment();
                    let time = now.subtract(i,"days");
                    let f = time.format("MM-DD")
                    ary.unshift(f);
                }
                return ary;
            },
            //获取水球参数
            getLiquidParams(title,color,count,percent){
                let option = {
                    backgroundColor: 'white',
                    title: [{
                        text: title,
                        left: '70px',
                        bottom: '20px',
                        textAlign: 'center',
                        textStyle: {
                            fontWeight: 'normal',
                            color: 'rgb(150,150,150)',
                            fontSize: 12,
                            textAlign: 'center',
                        }
                    }],
                    series: [{
                        type: 'liquidFill',
                        // data: [0.6, 0.5, 0.4, 0.3],
                        data: [percent],
                        direction: 'right', //波浪方向或者静止
                        radius: '100px',
                        // 水球颜色
                        color: [color],
                        center: ['50%', '40%'], //水球位置
                        // outline  外边
                        outline: {
                            // show: false
                            borderDistance: 0, //内环padding值
                            itemStyle: {
                                borderWidth: 0, //圆边线宽度
//                                borderColor: '#00c2ff',
                            },
                        },
                        label: {
//                            insideColor:"#fff",
                            normal: {
                                formatter:count,
                                textStyle: {
                                    color: 'red',
//                                        insideColor: 'rgb(58,64,52)',
                                    fontSize: 30,
                                }
                            }
                        },
                        // 内图 背景色 边
                        backgroundStyle: {
                            color: 'rgb(244,244,244)',
                        }
                    }]
                };
                return option;
            },
            // 获取点位信息
            getDiviceInfo(){
                axios.get(conf.api_local + "/tBasDeviceInfo/getTBasDeviceInfoDetail?" + util.noNoneGetParams({
                    gbid:this.id
                })).then((res)=>{
                    let data = util.verifyResponse(res);
                    if (data) {
                        this.deviceInfo.lat = data.latitude;
                        this.deviceInfo.lon = data.longitude;
                        this.deviceInfo.name = data.deviceName;
                        this.deviceInfo.region = data.orgName;
                        this.deviceInfo.captureCount = data.captureCount;
                        this.deviceInfo.alarmCount = data.alarmCount;
                        this.deviceInfo.faceHitRate = data.faceHitRate;
                        this.deviceInfo.alarmPointCount = data.alarmRate;
                    }
                })
            },
            // 点位分析-抓拍信息
            getTBasDeviceInfoCaptureCount(){
                axios.get(conf.api_local + "/tBasDeviceInfo/getTBasDeviceInfoCaptureCount?" + util.noNoneGetParams({
                    gbid:this.id
                })).then((res)=>{
                    let data = util.verifyResponse(res);
                    if (data) {
                        let result = [
                            {name:"全部",id:"capture",count:0},
                            {name:"非机动车",id:"nonMotorizedVehicle",count:0},
                            {name:"没戴头盔",id:"noHelmet",count:0},
                            {name:"酒驾",id:"wineDriving",count:0},
                            {name:"毒驾",id:"poisonDriving",count:0},
                            {name:"其他",id:"other",count:0},
                        ];
                        for(let item of result){
                            item.count = data[item.id + "Count"];
                        }
                        this.nowCaptureId = result[0].id;
                        this.captureList = result;
                    }
                })
            },
            getTagClass(type){
                switch (type) {
                    case "待认证" :{
                        return "label-search-pre";
                    }
                    case "认证成功" :{
                        return "label-search-success";
                    }
                    case "认证失败" :{
                        return "label-search-fail";
                    }
                }
            },
            //分页大小变化时
            handleSizeChangeFromCaptureList(val){
                this.outData.rows = val;
                this.getListData();
            },
            //分页页数发生变化时
            handleCurrentChangeFromCaptureList(val){
                this.outData.page = val;
                this.getListData();
            },
            //初始化echarts图表
            initEcharts(){
                let myChart = echarts.init(document.getElementById('lineChart'));
                let timeAry = this.getDaysAry();
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
                        right: 45,
                        left: 40
                    },
                    legend: {
                        top: 10,
                        right: 0,
                        textStyle: {
                        },
                        data: ['抓拍数量', '告警数量']
                    },
                    xAxis: {
                        type: 'category',
                        name: '日期',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgb(227,227,227)',
                                type: 'solid'
                            }
                        },
                        splitArea: {
                            show: true,
                            areaStyle:{
                                color:['rgba(255,255,255,0.3)','rgba(247,247,247,0.3)']
                            }
                        },
                        axisLabel:{
                            show:true,              //是否显示interval:"auto",        //坐标轴刻度标签的显示间隔，在类目轴中有效。默认会采用标签不重叠的策略间隔显示标签。可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推
                            inside:false,           //刻度标签是否朝内，默认朝外
                            rotate:0,               //刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。旋转的角度从 -90 度到 90 度
                            textStyle:{
                                color:"black"
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#9db9de',
                                type: 'dashed',
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
                            name: '抓拍数量',
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: 'rgb(227,227,227)',
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
                            axisLabel:{
                                show:true,              //是否显示interval:"auto",        //坐标轴刻度标签的显示间隔，在类目轴中有效。默认会采用标签不重叠的策略间隔显示标签。可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推
                                inside:false,           //刻度标签是否朝内，默认朝外
                                rotate:0,               //刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。旋转的角度从 -90 度到 90 度
                                textStyle:{
                                    color:"black"
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
                                color: '#9db9de'
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
                            name: '抓拍数量',
                            type: 'line',
                            symbol: 'circle',
                            symbolSize:10,
                            itemStyle:{
                              normal:{
                                  color:"rgb(37,188,193)",
                                  lineStyle:{
                                      color:"rgb(46,164,236)"
                                  }
                              }
                            },
                            data: [
                                50, 100, 150, 50, 200, 100, 250,
                                100, 100, 100, 100, 100, 100, 100,
                                100, 50, 50, 50, 50, 100, 100, 300,
                                150, 160, 220, 189, 200, 152, 50,
                                458, 100, 200, 200, 50, 200, 500, 500,
                                150, 80, 220, 100, 200, 50, 156,
                                458, 50, 200, 100, 100, 200, 200, 500,
                                150, 80, 220, 100, 200, 100, 156,
                                200
                            ]
                        },
                        {
                            name: '告警数量',
                            type: 'line',
                            symbol: 'circle',
                            symbolSize:10,
                            itemStyle:{
                                normal:{
                                    color:"rgb(243,149,27)",
                                    lineStyle:{
                                        color:"rgb(243,149,27)"
                                    }
                                }
                            },
                            data: [
                                100, 200, 300, 100, 400, 200, 500,
                                150, 160, 220, 189, 200, 152, 156,
                                458, 100, 200, 300, 100, 400, 200, 500,
                                150, 160, 220, 189, 200, 152, 156,
                                458, 100, 200, 300, 100, 400, 200, 500,
                                150, 160, 220, 189, 200, 152, 156,
                                458, 100, 200, 300, 100, 400, 200, 500,
                                150, 160, 220, 189, 200, 152, 156,
                                458
                            ]
                        }
                    ]
                };
                let endDate = moment().format("YYYY-MM-DD");
                let beginDate = moment(endDate).subtract(30,"days").format("YYYY-MM-DD");
                // $.post(conf.api +"/tBusDailyCaptureStatistics/getTBusDailyCaptureDateStatistics",querystring.stringify({
                //     beginDate:beginDate,
                //     endDate:endDate
                // })).done((response) =>{
                //     let personCountAry = [];
                //     let countAry = [];
                //     if(response.errorCode === 200){
                //         let personCountAry = [];
                //         let countAry = [];
                //         for (let item of response.data){
                //             personCountAry.push(item.capturePersonCount);
                //             countAry.push(item.captureCount);
                //         }
                //         let source = response.data;
                //         let length = source.length
                //         let end = moment(source[length-1].captureData).format("MM-DD");
                //         let endIndex = timeAry.indexOf(end);
                //         let begin = moment(source[0].captureData).format("MM-DD");
                //         let beginIndex = timeAry.indexOf(begin);
                //         for(let j = 1;j<beginIndex;j++){
                //             personCountAry.unshift("");
                //             countAry.unshift("")
                //         }
                //         for(let i = endIndex;i < 30;i++){
                //             personCountAry.push("");
                //             countAry.push("")
                //         }
                //         myChart.setOption({
                //             series: [
                //                 {
                //                     data: personCountAry
                //                 },
                //                 {
                //                     data: countAry
                //                 }
                //             ]
                //         })
                //     }
                // })
                myChart.setOption(option);
            },
            //初始化
            initVue(){
                this.id = this.$route.params.id;
                this.liquidInit();
                this.calendar();
                this.initEcharts();
                $(".fold_btn").attr("deg",0);
                //初始化今天
                this.today = moment().format("YYYY-MM-DD");
                this.getDiviceInfo();
                this.getTBasDeviceInfoCaptureCount();
                this.getListData();
            },

            //水球初始化
            liquidInit(){
                let option1 = this.getLiquidParams('人脸命中率','rgb(238,165,60)',this.deviceInfo.faceHitRate,0.76);
                let option2 = this.getLiquidParams('告警指数','rgb(87,197,157)',this.deviceInfo.alarmPointCount,0.4);
               // 基于准备好的dom，初始化echarts实例
                var myChart1 = echarts.init(document.getElementById('chart-div-showOne'));
                var myChart2 = echarts.init(document.getElementById('chart-div-showTwo'));
                // 绘制图表
                myChart1.setOption(option1);
                myChart2.setOption(option2)
            },
            //全选事件
            searchAll(){
                this.allCheck = !this.allCheck;
                if(this.allCheck){
                    for(let item of this.deviceInfo.captureList){
                        item.active = true;
                        let index = this.outData.typeList.indexOf(item.name);
                        if (index === -1){
                            this.outData.typeList.push(item.name)
                        }
                    }
                }else{
                    for(let item of this.deviceInfo.captureList){
                        item.active = false;
                        this.outData.typeList = [];
                    }
                }
            },

        }
    }
</script>

<style scoped lang="less">
    @import "../../../css/custody/personRecord.less";
    @import "../../../css/traffic/device-analysis.less";
</style>
