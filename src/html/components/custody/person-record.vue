<script src="../../../config/router.js"></script>
<template>
    <div>
        <top :htmlname="htmlname" :type="type"></top>
        <div class="safe_width">
            <div id="base-info-div">
                <div class="base-info-vis">
                    <span class="img_change_prev img_prev_unclick" index="0"></span>
                    <div class="pic-vis">
                        <div class="vision-box">
                            <div class="stage">
                                <img v-bind:src="getPhoto()" />
                            </div>
                        </div>
                    </div>
                    <span class="img_change_next img_next_unclick" index="0"></span>
                </div>
                <div class="base-info-text">
                    <div class="box-base-text">
                        <div class="base-text-row">
                            <p class="base-text-p">
                                <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
                                <span id="name">{{userInfo.name}}</span>
                            </p>
                            <p class="base-text-p">
                                <span>身份证号：</span>
                                <button class="idcard_label" id="identity">{{userInfo.ID}}</button>
                            </p>
                        </div>
                        <div class="base-text-row">
                            <p class="base-text-p">
                                <span>年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄：</span>
                                <span id="age">{{userInfo.age}}</span>
                            </p>
                            <p class="base-text-p">
                                <span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</span>
                                <span id="sex">{{userInfo.sex}}</span>
                            </p>
                        </div>
                        <div class="base-text-row">
                            <span>人员标签：</span>
                            <div class="msg-tab" :class="checkClass(item)" v-for="item in msgTabList" style="margin-right: 10px;">
                                <span class="tab-lf">{{item.level}}</span><span class="tab-lr">{{item.type}}</span>
                            </div>
                            <span v-show="!msgTabList || msgTabList.length === 0">无</span>
                        </div>
                    </div>
                    <div id="chart-div">
                        <div class="chart_liquid">
                            <div class="div_ball">{{userInfo.devices}}</div>
                            <span>抓拍点位</span>
                        </div>
                        <div class="chart_liquid">
                            <div class="div_ball">{{userInfo.days}}</div>
                            <span>抓拍天数</span>
                        </div>
                        <div class="chart_liquid">
                            <div class="div_ball">{{userInfo.times}}</div>
                            <span>抓拍次数</span>
                        </div>
                        <div class="chart_liquid">
                            <div id="chart-div-show" style="width: 100%;height: 100%;"></div>
                        </div>
                    </div>
                    <span id="attention-flag"></span>
                </div>
                <div id="address-div">
                    <div class="address-logo">地址</div>
                    <div class="address-text">
                        <div class="address-row">
                            <span class="title-address">行政区</span>
                            <span>{{userInfo.place1}}</span>
                        </div>
                        <div class="address-row">
                            <span class="title-address">四实地址</span>
                            <span>{{userInfo.place2.address}}</span>
                            <span style="color: rgb(121,179,216);margin-left: 10px;">(人户一致/正常居住)</span>
                            <span class="address-time">{{userInfo.place2.time}}</span>
                        </div>
                        <div class="address-row">
                            <span class="title-address" style="border: 1px solid rgb(238,158,62);">可能地址</span>
                            <span>{{userInfo.place3.address}}</span>
                            <span class="address-time">{{userInfo.place3.time}}</span>
                        </div>
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
            <div class="capture-div clearfix">
                <div id="capture-left-div">
                    <div id="capture-left-main">
                        <div id="capture-left-title">
                            <div class="capture-left-time">
                                监控时间跨度：<span>{{minCaptureDate}}<span v-if="minCaptureDate">到</span>{{maxCaptureDate}}</span><span class="time-count">（共{{countCaptureDate}}天）</span>
                            </div>
                            <div class="capture-left-row" v-show="false">
                                <span class="longstring" style="background-color: rgb(255,97,97);"></span>
                                <span>未出现天数：</span>
                                <span style="color: red;">4</span>天
                            </div>
                            <div class="capture-left-row">
                                <span class="longstring" style="background-color: rgb(46,146,236);"></span>
                                <span>最初出现时间：</span>
                                <span style="color: rgb(46,146,236);">{{minCaptureDateTime}}</span>
                            </div>
                            <div class="capture-left-row">
                                <span class="longstring" style="background-color: rgb(46,146,236);"></span>
                                <span>最近出现时间：</span>
                                <span style="color: rgb(46,146,236);">{{maxCaptureDateTime}}</span>
                            </div>
                        </div>
                        <div id="calendar-div"></div>
                        <div>
                            <span style="color: rgb(238,80,81);font-size: 14px;">* 红色文本为当日出现次数</span>
                            <span style="color: rgb(46,164,236);text-decoration: underline;float: right;font-size: 16px;cursor: pointer;" v-if="false">查看全部</span>
                        </div>
                    </div>
                </div>
                <div id="capture-right-div">
                    <div id="capture-right-head">
                        <span v-show="captureOption.captureDate">时间：</span>
                        <span id="capture_time">{{captureOption.captureDate}}  <template v-if='captureOption.captureDate'>00:00:00-23:59:59</template></span>
                        <div id="capture-head-right">
                            <el-form ref="form" :model="form" label-width="80px" style="position: absolute;top: 6px;left: 370px;">
                                <el-form-item>
                                    <el-select
                                        ref="selectDevice"
                                        v-model="form.data"
                                        placeholder="请选择摄像头"
                                        multiple
                                        collapse-tags
                                        @change="chooseDevice"
                                        >
                                            <el-option
                                                v-for="item in cities"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                                <!--<el-checkbox  name="type">{{item.label}}</el-checkbox>-->
                                            </el-option>
                                    </el-select>
                                </el-form-item>
                                <!--<el-form-item>-->
                                    <!--<el-button type="primary" @click="onSubmit">立即创建</el-button>-->
                                    <!--<el-button>取消</el-button>-->
                                <!--</el-form-item>-->
                            </el-form>
                            <span style="background-color: rgb(46,146,236);" >查询</span>
                            <!--<span style="background-color: rgb(46,146,236);"  @click="dialogVisible = true" v-if="treeData.length > 0">选择摄像头</span>-->
                            <!--<span style="background-color: rgb(46,146,236);">查询</span>-->
                            <span style="background-color: rgb(177,188,195);" @click="resetCaptureList">重置</span>
                        </div>
                        <el-dialog
                        title="提示"
                        :visible.sync="dialogVisible"
                        width="30%">
                            <el-tree
                                :data="treeData"
                                ref="tree"
                                show-checkbox
                                node-key="id"
                                :default-expanded-keys="[2, 3]"
                                :default-checked-keys="[5]"
                                :props="defaultProps">
                            </el-tree>

                            <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="treeDataConfirm">确 定</el-button>
                        </span>
                        </el-dialog>
                    </div>
                    <div id="capture-right-body" class="clearfix">
                        <div class="capture-pic-div" v-for="item in captureList">
                            <div class="capture-info-show">
                                <div class="capture-pic-box">
                                    <img :src="item.faceUrl" />
                                </div>
                                <div class="capture-right-row">
                                    <span>相似度：</span><span style="color: red;text-decoration: underline;">{{getNumToDotOne(item.similarity)}}%</span>
                                </div>
                                <div class="capture-right-row" :title="item.captureDeviceName">
                                    <span>{{item.captureDeviceName}}</span>
                                </div>
                                <div class="capture-right-row">
                                    <span style="font-size: 12px;">{{item.captureTimeStr}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="capture-box-page">
                        <!--抓拍分页-->
                        <el-pagination
                            @size-change="handleSizeChangeFromCaptureList"
                            @current-change="handleCurrentChangeFromCaptureList"
                            :current-page="captureOption.page"
                            :page-sizes="[10, 20,30,50]"
                            :page-size="captureOption.rows"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="listTotalFromCaptureList">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="familyRelationship.length > 0">
            <div class="safe_width" >
                <div class="title_box">
                    <span class="title_line">家谱关系</span>
                    <span class="fold_btn" @click="foldInfoClick(1)"></span>
                </div>
            </div>
            <span class="cut-off-line"></span>
            <div class="safe_width show_div">
                <div id="genealogy-div">
                    <div id="genealogy-box" class="clearfix">
                        <div class="genealogy-row clearfix" v-for="(item,index) in familyRelationship">
                            <div class="genealogy-title clearfix">
                                {{translateRelationship(item.type)}}
                            </div>
                            <div class="genealogy-body clearfix">
                                <div class="genealogy-pic" v-for="(value,key) in item.list">
                                    <div class="genealogy-pic-box">
                                        <div class="genealogy-pic-show">
                                            <div class="genealogy-pic-vis">
                                                <img v-bind:src="value.photoUrl" />
                                            </div>
                                        </div>
                                        <div class="genealogy-text-show">
                                            <div class="genealogy-text-row">
                                                <span class="base_genealogy">{{value.typeDescribe}}</span>
                                            </div>
                                            <div class="genealogy-text-row" style="line-height: 25px;">
                                                {{value.name}}
                                            </div>
                                            <div class="genealogy-text-row">
                                                <button class="idcard_label">{{value.idCard}}</button>
                                            </div>
                                            <div class="genealogy-text-row">
                                                <div class="msg-tab " :class="value.className">
                                                    <span class="tab-lf">{{value.labelOne}}</span><span class="tab-lr">{{value.labelTwo}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="false">
            <div class="safe_width">
                <div class="title_box">
                    <span class="title_line">监护人</span>
                    <span class="fold_btn" @click="foldInfoClick(2)"></span>
                </div>
            </div>
            <span class="cut-off-line"></span>
            <div class="safe_width show_div">
                <div id="guardian-div" class="clearfix">
                    <div class="genealogy-pic">
                        <div class="genealogy-pic-box">
                            <div class="genealogy-pic-show">
                                <div class="genealogy-pic-vis">
                                    <img src="../../../images/custody/test1.jpg" />
                                </div>
                            </div>
                            <div class="genealogy-text-show">
                                <div class="genealogy-text-row">
                                    <span class="base_genealogy">爷爷</span>
                                </div>
                                <div class="genealogy-text-row" style="line-height: 25px;">
                                    付合生
                                </div>
                                <div class="genealogy-text-row">
                                    <button class="idcard_label">350203199503101024</button>
                                </div>
                                <div class="genealogy-text-row">
                                    <!--<div class="msg-tab     `" >-->
                                    <!--<span class="tab-lf">{{item.labelOne}}</span><span class="tab-lr">{{item.labelTwo}}</span>-->
                                    <!--</div>-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="safe_width">
            <div class="title_box">
                <span class="title_line">同行人</span>
                <span class="fold_btn" @click="foldInfoClick(3)"></span>
            </div>
        </div>
        <span class="cut-off-line"></span>
        <div class="safe_width show_div">
            <div id="travel-div">
                <div class="friend_show">
                    <div class="friend_detail_content" v-for="(item,index) in fellowPerson">
                        <div class="police_detail_img_content">
                            <div class="vertical_head"></div>
                            <img  class="image_show friend_image">
                            <div class="tri_text">{{item['同行次数']}}
                                <div class="tri_leftTop tri_black"></div>
                            </div>
                        </div>
                        <div class="friend_detail_info_content">
                            <p class="p_margin" title="' + item.name + '">{{item['姓名']}}</p>
                            <button class="idcard_label friend_info">{{item['同行人Id']}} </button>
                            <!-- + label +-->
                            <p class="p_underline friend_detail" index="' + i + '">查看详情</p>
                        </div>
                    </div>
                </div>
                <!--同行人分页div-->
                <div class="safe_width pagination-wrap ">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes="[100, 200, 300, 400]"
                        :page-size="100"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="400">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-show="false">
            <div class="safe_width" >
                <div class="title_box">
                    <span class="title_line">医保记录</span>
                    <span class="fold_btn" @click="foldInfoClick(4)"></span>
                </div>
            </div>
            <span class="cut-off-line"></span>
            <div class="safe_width show_div">
                <div id="health-record-div">

                </div>
            </div>
        </div>
        <div class="safe_width">
            <div class="title_box">
                <span class="title_line">统计分析</span>
                <span class="fold_btn" @click="foldInfoClick(5)"></span>
            </div>
        </div>
        <span class="cut-off-line"></span>
        <div class="safe_width show_div">
            <div id="count-div">
                <div id="count-div-head">
                    <div id="nav-turn">
                        <span class="count-title" style="width: 40%;height: 100%;" @click="countResultChange(0)">饼图</span>
                        <span class="count-title" style="width: 60%;height: 100%;" @click="countResultChange(1)">热力图</span>
                        <div id="border-roll"></div>
                        <div id="count-title-border"></div>
                    </div>
                    <div id="count_show">
                        <div id="count-stage">
                            <div class="show_echart">
                                <Piemap :pie-place-map-list='piePlaceMapList' :pie-time-map-list="pieTimeMapList" ></Piemap>
                            </div>
                            <div class="show_echart">
                                <Heatmap :yList="yList" :heatMapList="heatMapList"></Heatmap>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
    let echart_li = require('../../../js/lib/echarts-liquidfill.min.js');
    let util = require('../../../js/util/util');
    export default {
        data(){
            return {
                currentPage4:1,
                countCaptureDate:null,
                //抓拍信息请求包
                captureOption:{
                    page:1,
                    rows:10,
                    idCard:"",
                    captureDate:"",
                    deviceIds:"",
                },
                captureList:[],
                dialogVisible:false,
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                foldShowList:{
                    catchDiv:{
                        deg:0
                    }
                },
                fellowPerson:[],
                form: {
                    data: '',
                    delivery: false,
                },
                cities: [{
                    value: 'all',
                    label: '全部',
                },{
                    value: 'Beijing',
                    label: '北京'
                }, {
                    value: 'Shanghai',
                    label: '上海'
                }, {
                    value: 'Nanjing',
                    label: '南京'
                }, {
                    value: 'Chengdu',
                    label: '成都'
                }, {
                    value: 'Shenzhen',
                    label: '深圳'
                }, {
                    value: 'Guangzhou',
                    label: '广州'
                }],



                htmlname:"一人一档",
                listTotalFromCaptureList:0,
                maxCaptureDate:null,
                minCaptureDate:null,
                maxCaptureDateTime:null,
                minCaptureDateTime:null,
                rldata:null,
                type:"雪亮监护",
                userIds:{
                    idCard: "",
                    personId: "",
                    faceId:""
                },
                userInfo:{
                    name:"",
                    ID:"",
                    age:0,
                    sex:"",
                    Birthplace:"",
                    place1:"",
                    place2:{
                        address:"",
                        time:""
                    },
                    place3:{
                        address:" ",
                        time:""
                    },
                },
                msgTabList:[
                    {
                        type:"精神",
                        level:"重点"
                    },
                    {
                        type:"精神",
                        level:"重点"
                    },
                    {
                        type:"精神",
                        level:"重点"
                    },
                ],
                tagFlag:false,//定义变量用于判断人员标签是否为空
                familyRelationship:[],//家谱关系
                heatMapList:[],//热力图数据
                yList:[],//y轴对应数据
                piePlaceMapList:[],//饼图点位数据
                pieTimeMapList:[],//饼图时段数据
            }
        },
        components:{
            Top:()=>import("./common/top.vue"),
            Bottom:()=>import("./common/bottom.vue"),
            Heatmap:()=>import("./common/echart-hot.vue"),
            Piemap:()=>import("./common/echart-pie.vue")
        },
        created:function () {

        },
        mounted:function () {
            this.init()

        },
        methods:{
            //统计效果切换
            countResultChange(index){
                if(index == 0){
                    $("#border-roll").animate({
                        "width":"40%",
                        "left":"0"
                    },"fast");
                    $("#count-stage").animate({
                        "margin-left":0
                    },"fast")
                }else{
                    $("#border-roll").animate({
                        "width":"60%",
                        "left":"40%"
                    },"fast");
                    $("#count-stage").animate({
                        "margin-left":"-1320px"
                    },"fast")
                }
            },
            calendar(){
                var rldata = {
                    id: "calendar-div",
                    isRight: false,//是否显示右边模块
                    isBtn: true,//是否可以日期切换
//	istopTitle:true,//是否显示上方标题
                    isRadio:true,//是否单选
                    onChangeMonth:(data)=>{
                        this.getTBusDailyCaptureDetail();
                    },
                    onClickDay:(data)=>{
                        this.captureOption.captureDate = data.year + "-" + (data.month + 1) + "-" + data.checkedDayArray[0];
                        this.getCatchList();
                    }
                };
                this.rldata = createRl(rldata);
            },
            //人员标签对应样式
            checkClass(params){
                if (params.level === "重点" ) {
                    return "theme-1"
                }
                if (params.level === "治") {
                    return "theme-5"
                }
                if (params.level === "市局") {
                    return "theme-10";
                }
            },
            //选择摄像头
            chooseDevice(data){
                console.log(this.$refs.selectDevice)
                console.log(data)
                if (data[data.length-1] === 'all'){
                    for (let item of this.cities){
                        let index = this.form.data.indexOf(item.value);
                        if (index === -1){
                            this.form.data.push(item.value)
                        }
                    }
                }
            },
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
            handleSizeChange(){

            },
            handleCurrentChange(){

            },
            handleCurrentChangeFromCaptureList(val){
                this.captureOption.page = val;
                this.getCatchList();
            },
            handleSizeChangeFromCaptureList(val){
                this.captureOption.rows = val;
                this.getCatchList();
            },
            init(){
                this.userIds.idCard = this.$route.params.idCard;
                this.userIds.personId = this.$route.params.personId;
                this.captureOption.idCard = this.userIds.idCard;
                //初始化家谱数据
                axios.post(`/xlcloud-custody-webapp/tBasPsyosisInfo/getFamilyRelationship?idCard=${this.userIds.idCard}`).then( (response)=> {
                    if(response.status === 200){
                        let result = [];
                        for(let item of response.data.data){
                            let label = this.translateLabel(item.label);
                            _.merge(item,label);
                            let index = _.findIndex(result , {type : item.type});
                            if(index === -1){
                                let temp = {
                                    type : item.type,
                                    list : []
                                };
                                temp.list.push(item)
                                result.push(temp);
                            }else{
                                result[index].list.push(item);
                            }
                        }
                        this.familyRelationship = result;
                    }
                });
                //初始化个人基本信息
                axios.post(`/xlcloud-custody-webapp/tBasPsyosisInfo/getPersonBaseInfo?idCard=${this.userIds.idCard}&personId=${this.userIds.personId}`).then((response)=>{
                    if (response.status === 200){
                        let user = response.data.data;
                        this.userInfo.name = user.name;
                        this.userInfo.ID = user.idCard;
                        this.userInfo.age = user.age;
                        this.userInfo.sex = user.sex;
                        this.userInfo.days = user.days;
                        this.userInfo.devices = user.devices;
                        this.userInfo.times = user.times;
                        this.userInfo.photoUrl = user.photoUrl;
                        this.userInfo.place1 = user.address;
                        this.msgTabList = user.label;
                        this.userIds.faceId = user.faceId;
                        if(user.label === ""){
                            this.tagFlag = true;
                        }else{
                            this.msgTabList = [];
                            let tempAry = user.label.split(",");
                            for(let item of tempAry){
                                let ary = item.split("|");
                                let obj = {type:"",level:""};
                                obj.level = ary[0];
                                obj.type = ary[1];
                                this.msgTabList.push(obj);
                            }
                        }
                    }
                });
                //初始化同行人
                axios.post(`/xlcloud-custody-webapp/tBasPsyosisInfo/getFellowPersonInfo?personId=${this.userIds.personId}`).then((response)=>{
                    if(response.status === 200){
                        this.fellowPerson = response.data.data.list;
                    }
                });
                this.getCatchInfo();
                this.getCatchList();
                //初始化饼图数据，并且获取热力图的y轴
                this.getPieMap();
                //将折叠菜单添加deg的属性，用于判断旋转的角度
                $(() =>{
                    $(".fold_btn").attr("deg",0);
                    this.calendar();
                    this.getTBusDailyCaptureDetail();
                });
                //水球效果初始化
                this.initLiquidFill();
                this.getDeviceTree();
            },
            //初始化水球
            initLiquidFill(){
                let option = {
                    backgroundColor: 'white',
                    title: [{
                        text: '关注指数',
                        left: '45px',
                        top: 'bottom',
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
                        data: [0.4],
                        direction: 'right', //波浪方向或者静止
                        radius: '50px',
                        // 水球颜色
                        color: ['rgb(87,197,157)'],
                        center: ['50%', '45%'], //水球位置
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
                                    formatter:'13',
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
                            // borderWidth: 5,
                            // borderColor: 'red',
                        }
                    }]
                };
//                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('chart-div-show'));
                // 绘制图表
                myChart.setOption(option);
            },
            getDeviceTree(){
                axios.get(conf.api + "/tBasDeviceInfo/getDeviceTree").then((res)=>{
                    let data = util.verifyResponse(res);
                    if(data){
                        this.treeData = data;
                    }
                }).catch((err)=>{
                    console.error(err);
                });
            },
            //根据条件查询每日抓拍数
            getTBusDailyCaptureDetail(){
                let oMoment = moment();
                if(this.rldata){
                    oMoment = oMoment.year(this.rldata.year).month(this.rldata.month);
                }
                let lastDate = oMoment.daysInMonth();
                axios.get(conf.api + "/tBusDailyCaptureDetail/getTBusDailyCaptureDetail?" + querystring.stringify({
                    idCard:this.userIds.idCard,
//                    idCard:"3502050008",
                    beginDate:oMoment.date(1).format("YYYY-MM-DD"),
                    endDate:oMoment.date(lastDate).format("YYYY-MM-DD")
                })
                ).then((res)=>{
                    let data = util.verifyResponse(res);
                    if(data ){
                        let temp = {};
                        for(let item of data){
                            if(item.captureDate){
                                let day = moment(item.captureDate,"YYYY-MM-DD").format("D");
                                temp[day] = item.captureCount;
                            }
                        }
                        let monthData = [];
                        for(let i = 1 ; i <= lastDate ; i++){
                            if(temp[i]){
                                monthData.push(temp[i]);
                            }else{
                                monthData.push("");
                            }
                        }
                        this.rldata.setData(monthData);
                    }
                }).catch((err)=>{
                    console.error(err);
                });
            },
            //获取热力图y轴数据,并且获取饼图数据
            getPieMap(){
                axios.post(conf.api + "/tBasPsyosisInfo/statisticalAnalysisSectorChart",querystring.stringify({
                    "personId":this.userIds.personId
                })).then((response)=>{
                    if (response.status === 200){
                        let pieData = response.data.data;
                        for(let item of pieData["地点"]){
                            let obj = {value:"",name:""};
                            for(let key in item){
                                obj.value = item[key];
                                obj.name = key;
                            }
                            this.piePlaceMapList.push(obj);

                        }
                        for(let item of pieData["时间"]){
                            let obj = {value:"",name:""};
                            for(let key in item){
                                obj.value = item[key];
                                obj.name = key + '点';
                            }
                            this.pieTimeMapList.push(obj);
                        }
                        this.yList = pieData["地点列表"];
                        //初始化热力图
                        this.getHeatMapData();
                    }
                });
            },
            // 获取底部统计热力图表数据（点位）
            getHeatMapData(){
                axios.post(conf.api + "/tBasPsyosisInfo/statisticalAnalysis",querystring.stringify({
                    "personId" : this.userIds.personId
                })).then((response)=>{
                    if(response.status === 200){
                        for(let item of response.data.data){
                            //组包
                            for (let value of item.detail){
                                let tempAry = [];
                                tempAry.push(value.address);
                                tempAry.push(item.time + '点');

                                tempAry.push(value.count);
                                this.heatMapList.push(tempAry)
                            }
                        }
                    }
                });
            },
            // 获取抓拍信息
            getCatchInfo(){
                axios.get(conf.api + "/tBusCaptureInfo/getTBusCaptureInfoDetailByIdCard?" + querystring.stringify({
                        idCard:this.userIds.idCard
                    })
                ).then((res)=>{
                    let data = util.verifyResponse(res);
                    if(data && data[0]){
                        data = data[0];
                        if(data.minCaptureDate){
                            this.minCaptureDateTime = data.minCaptureDate;
                            let minCaptureDateTime = moment(data.minCaptureDate,"YYYY-MM-DD hh:mm:ss");
                            this.minCaptureDate = minCaptureDateTime.format("YYYY-MM-DD");
                        }
                        if(data.maxCaptureDate){
                            this.maxCaptureDateTime = data.maxCaptureDate;
                            let maxCaptureDateTime = moment(data.maxCaptureDate,"YYYY-MM-DD hh:mm:ss");
                            this.maxCaptureDate = maxCaptureDateTime.format("YYYY-MM-DD");
                        }

                        this.countCaptureDate = data.countCaptureDate;
                    }
                }).catch((err)=>{
                    console.error(err);
                });
            },
            // 获取抓拍列表
            getCatchList(){
                axios.post(conf.api + "/tBusCaptureInfo/getTBusCaptureInfoList" ,this.captureOption).then((res)=>{
                    let data = util.verifyResponse(res);
                    console.log(data)
                    if(data ){
                        this.listTotalFromCaptureList = data.total;
                        this.captureList = data.rows;
                    }
                }).catch((err)=>{
                    console.error(err);
                });
            },
            getStringByTimestamp(timestamp){
                if(timestamp){
                    return moment(timestamp).format("YYYY-MM-DD hh:mm:ss");
                }else{
                    return "";
                }
            },
            getNumToDotOne(num){
                if(num){
                    return Number(num).toFixed(1);
                }else{
                    return "";
                }
            },
            // 获取照片
            getPhoto(){
                if(this.userIds.faceId){
                    return `http://10.130.146.42:8010/image-service/staticImage/getFile?wjbs=${this.userIds.faceId}`;
                }else{
                    return "";
                }
            },
            resetCaptureList(){
                this.captureOption.page = 1;
                this.captureOption.rows = 10;
                this.captureOption.captureDate = "";
                this.captureOption.deviceIds = "";
                this.rldata.reset();
                this.getCatchList();
            },
            //翻译家谱关系
            translateRelationship(params){
                let type;
                switch (params){
                    case "grand":
                        type = "祖父辈";
                        break;
                    case "parents":
                        type = "父母辈";
                        break;
                    case "self":
                        type = "同辈";
                        break;
                    case "child":
                        type = "子侄";
                        break;
                    case "grandChild":
                        type = "子孙";
                        break;
                }
                return type;
            },
            // 摄像头选择框确认
            treeDataConfirm(){
                let checkedNode = this.$refs["tree"].getCheckedNodes(true);
                let aDeviceIds = [];
                for(let item of checkedNode){
                    aDeviceIds.push(item.id);
                }
                this.captureOption.deviceIds = aDeviceIds.join("");
                this.getCatchList();
                this.dialogVisible = false;
            },
            //解析标签
            translateLabel(label){
                let classType = {
                    "部恐": 1,
                    "重点": 2,
                    "国": 3,
                    "经": 4,
                    "治": 5,
                    "恐": 6,
                    "禁": 7,
                    "网": 8,
                    "刑": 9,
                    "市局": 10,
                    "火眼": 11,
                };
                let labelary = label.split('|');
                return {
                    className : "theme-" + classType[labelary[1]],
                    title : label,
                    labelOne:labelary[1],
                    labelTwo:labelary[0]
                };

            },

        }
    }
</script>


<style scoped lang="less">
    @import "../../../css/custody/search.less";
    @import "../../../css/custody/searchResult.less";
    @import "../../../css/custody/personRecord.less";
</style>
