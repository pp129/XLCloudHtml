<template>
    <div>
        <top :type="type" :htmlname="htmlname"></top>
        <div class="safe_width">
            <div class="head-row">
                快捷搜索：
                <span class="normal-tag" :class="{'checked':item.active}" v-for="item in quickSearch" @click="searchTag(item)"><span class="check_region" v-show="item.active"></span>{{item.name}}</span>
                <span class="fold_btn" @click="foldInfoClick(0)" ></span>
            </div>
            <div class="show_div">
                <div class="head-row">
                    搜索条件：行&nbsp;政&nbsp;区&nbsp;<span class="normal-tag" :class="{'checked':isRegionAll}" @click="searchRegion('all')">全部（{{getCount}}）</span><span class="normal-tag" :class="{'checked':item.active}" v-for="item in region" @click="searchRegion(item)"><span class="check_region" v-show="item.active"></span>{{item.name}}({{item.count}})</span>
                </div>
                <div class="head-row">
                    <div class="time-div">时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间&nbsp;
                        <el-date-picker
                            v-model="timeValue"
                            type="datetimerange"
                            :picker-options="pickerOptions2"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            :disabled="calender"
                            @change="showMyTime()">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="head-row" >
               <span style="border-bottom: 3px solid rgb(48,165,237);display: inline-block;height: 50px;box-sizing: border-box;text-align: center;padding-left: 5px;padding-right: 5px;">搜索结果：{{data.total}}条记录</span>
            </div>
        </div>
        <span class="cut-off-line"></span>
        <div class="safe_width">
            <div class="body_main">
                <table>
                    <tr style="height: 50px;">
                        <th style="width: 60px;">序号</th>
                        <th style="width: 170px">人员</th>
                        <th style="width: 90px;position: relative;">点数<div class="arrow-up"></div><div class="arrow-down"></div></th>
                        <th style="width: 90px;position: relative;">天数<div class="arrow-up"></div><div class="arrow-down"></div></th>
                        <th style="width: 90px;position: relative;">次数<div class="arrow-up"></div><div class="arrow-down"></div></th>
                        <th style="width: 820px;">抓拍信息</th>
                    </tr>
                    <tr v-for="item in data.rows">
                        <td>{{item.number}}</td>
                        <td>
                            <div class="info-box">
                                <div class="pic-box">
                                    <pic-adaption width="100" height="100" :src="src"></pic-adaption>
                                </div>
                                <div class="rows">{{item.name}}</div>
                                <div class="rows">
                                    <button class="idcard_label">{{item.idCard}}</button>
                                </div>
                                <div class="rows">
                                    <div class="msg-tab theme-1">
                                        <span class="tab-lf">治</span><span class="tab-lr">赌</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>55</td>
                        <td>13</td>
                        <td>147</td>
                        <td style="position: relative;">
                            <span class="shape_left" v-if="item.pic.length >= 5" @click="preGroup(item)" :class="{'endstate':item.current === 0}"></span>
                            <div class="capture-info">
                                <div id="stage" :style="{'width':getPicWidth(item),'left':item.left}" class="stage">
                                    <div class="row-pic" v-for="value in item.pic">
                                        <div class="pic-box">
                                            <pic-adaption width="100" height="100" :src="value.url"></pic-adaption>
                                        </div>
                                        <div class="text-box" title="value.text">
                                            {{value.text}}
                                        </div>
                                        <div class="text-box">
                                            {{value.time}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span class="shape_right" v-if="item.pic.length >= 5" @click="nextGroup(item)"></span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="page-div">
                <el-pagination
                    @size-change="handleSizeChangeFromCaptureList"
                    @current-change="handleCurrentChangeFromCaptureList"
                    :current-page="outputData.page"
                    :page-sizes="[15,30,50]"
                    :page-size="outputData.rows"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="data.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    let axios = require("axios");
    let _ = require("lodash");
    let moment = require("moment");
    let querystring = require("querystring");
    let util = require("../../../js/util/util");
    export default {
        data(){
            return{
                calender:false,//日历控制
                data:{
                    total:0,
                    rows:[],
                },//接收的数据
                htmlname:"-数据结果分析",
                isRegionAll:false,
                outputData:{
                    sendTag:"",
                    quickTag:"",
                    region:[],
                    beginTime:"",
                    endTime:"",
                    page:1,
                    rows:15,
                },
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },//时间快捷
                quickSearch:[
                    {name:"活跃人员top10",active:false},
                    {name:"从未出现人员",active:false},
                    {name:"首次出现人员",active:false},
                    {name:"近6个月从未出现人员",active:false},
                ],
                region:[],//行政区
                timeValue:"",//时间绑定
                type:"雪亮监护",
                src:'./public/image/1.jpg'
            }
        },
        components:{
            Top:()=>import("./common/top.vue"),
            Bottom:()=>import("./common/bottom.vue"),
            picAdaption : () => import("../common/picAdaption.vue"),
        },
        watch:{
            //监听全部标签
            isRegionAll:function (val,old) {
                if (val === true){
                    for(let item of this.region){
                        item.active = true;
                        let index = _.findIndex(this.outputData.region,item);
                        if (index === -1){
                            this.outputData.region.push(item)
                        }
                    }
                }else{
                    for(let item of this.region){
                        item.active = false;
                        let index = _.findIndex(this.outputData.region,item);
                        if (index !== -1){
                            this.outputData.region.splice(index,1)
                        }
                    }
                }
            },
            //监听数据包
            newQuickTag:{
                //深度监听
                handler(val,old){
                    if (val.name === "活跃人员top10"){
                        this.outputData.sendTag = "";
                    }
                    if(val.name === "从未出现人员"){
                        this.outputData.sendTag = 0;
                    }
                    if (val.name === "首次出现人员"){
                        this.outputData.sendTag = 1;
                    }
                    if (val.name === "近6个月从未出现人员") {
                        this.outputData.sendTag = 0;
                        this.outputData.beginTime = moment().format("YYYY-MM-DD HH:mm:ss");
                        this.outputData.endTime = moment().subtract(6,'months').format("YYYY-MM-DD HH:mm:ss");
                    }
                    this.getList();
                },
                deep:true
            },
            newRegion:{
                handler(){
                    this.getList();
                },
                deep:true
            }
        },
        computed:{
            getCount(){
                let num = 0;
                for(let item of this.region){
                    num += item.count;
                }
                return num;
            },
            //返回快捷标签，以便深度监听
            newQuickTag(){
                return this.outputData.quickTag
            },
            newRegion(){
                return this.outputData.region
            }
        },
        created(){
            this.getReions();
        },
        mounted(){
            this.init();
        },
        methods:{
            //初始化
            init(){
                $(".fold_btn").attr("deg",0);
                this.getList();
            },
            //获取图片宽度
            getPicWidth(item){
                let length = item.pic.length;
                let num = Math.ceil(length / 5);
                let width = num * 750 +'px';
                item.max = num;
                return width;
            },
            //获取行政区数据
            getReions(){
              axios.get(conf.api_local + "/tBasPsyosisInfo/getTBasPsyosisInfoStatisticsByArea").then((response)=>{
                  if (response.status === 200){
                      for(let item of response.data.data.rows){
                          let obj = {
                              name:item.orgName,
                              code:item.orgCode,
                              count:item.personCount,
                              active:false
                          };
                          this.region.push(obj);
                      }
                  }
              }).catch((error)=>{
                  console.log(error)
              })
            },
            //获取列表数据
            getList(){
                axios.get(conf.api_local + "/tBusCaptureInfo/getCaptureDataResultList?"+util.noNoneGetParams({
                    beginTime:this.outputData.beginTime,
                    endTime:this.outputData.endTime,
                    captureCount:this.outputData.quickTag,
                    communityId:this.getRegionCode(this.outputData.region),
                    page:this.outputData.page,
                    rows:this.outputData.rows,
                })).then((response)=>{
                    if (response.status === 200){
                        this.data.total = response.data.data.total;
                        let num = 0;//计数器
                        let tempAry = [];//暂存数据
                        for(let item of response.data.data.rows){
                            num ++;
                            let obj = {
                                captureCount:item.captureCount,//次数
                                dateCount:item.dateCount,//天数
                                deviceCount:item.deviceCount,//点数
                                idCard:item.idCard,
                                imgUrl:item.imgURL,
                                label:item.label,
                                name:item.name,
                                personId:item.personId,
                                current:0,//当前图片页
                                left:"0px",//当前定位位置
                                number:num,//排序
                                max:1,//最大页数
                                pic:[],
                            };
                            this.getItemPic(obj);
                            // axios.get(conf.api_local + "/tBusCaptureInfo/getLastCaptureInfoList?"+util.noNoneGetParams({
                            //     capturePersonId:obj.personId,
                            //     page:obj.current + 1,
                            //     rows:10
                            // })).then((response)=>{
                            //     if (response.status === 200){
                            //         for(let item of response.data.data.rows){
                            //             let picObj = {
                            //                 url:item.faceUrl,
                            //                 text:item.captureDeviceName,
                            //                 time:item.captureTime
                            //             };
                            //             obj.pic.push(picObj);
                            //         }
                            //     }
                            // }).catch((error)=>{
                            //     console.log(error)
                            // });
                            tempAry.push(obj)
                        }
                        this.data.rows = tempAry;
                    }
                }).catch((error)=>{
                   console.log(error)
                });
            },
            //获取行政区编码
            getRegionCode(params){
                let str = "";
                for (let item of params){
                    console.log(item)
                    str += item.code + ',';
                }
                str = str.substr(0,str.length - 1);
                return str;
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
            handleSizeChangeFromCaptureList(val){
                this.outputData.rows = val;
                this.getList()
            },
            handleCurrentChangeFromCaptureList(val){
                this.outputData.page = val;
                this.getList()
            },
            //下一组图片
            nextGroup(item){
                item.current ++;
                this.getItemPic(item)

            },
            //上一组照片
            preGroup(item){
                item.current --;
                if (item.current >= 0){
                    this.groupChange(item);
                } else{
                    item.current = 0;
                }
            },
            //获取对应行的照片组
            getItemPic(obj){
                axios.get(conf.api_local + "/tBusCaptureInfo/getLastCaptureInfoList?"+util.noNoneGetParams({
                    capturePersonId:obj.personId,
                    page:obj.current + 1,
                    rows:5
                })).then((response)=>{
                    if (response.status === 200){
                        for(let item of response.data.data.rows){
                            let picObj = {
                                url:item.faceUrl,
                                text:item.captureDeviceName,
                                time:item.captureTime
                            };
                            obj.pic.push(picObj);
                        }
                        if (obj.current !== 0){
                            obj.max ++;
                            if (obj.current >=  obj.max - 1){
                                obj.current = obj.max - 1;
                                this.groupChange(obj);
                            } else{
                                this.groupChange(obj);
                            }
                        }
                    }
                }).catch((error)=>{
                    console.log(error)
                });
            },
            groupChange(item){
                item.left =  - item.current * 750 + 'px';
            },
            //搜索行政区
            searchRegion(params){
                if (this.outputData.quickTag === ""){
                    if (params === 'all'){
                        this.isRegionAll = !this.isRegionAll;
                    }else{
                        params.active = !params.active;
                        let index = _.findIndex(this.outputData.region,params);
                        if (params.active){
                            if (index === -1){
                                this.outputData.region.push(params);
                                if (this.outputData.region.length === this.region.length){
                                    this.isRegionAll = true;
                                }
                            }
                        } else{
                            this.isRegionAll = false;
                            if (index !== -1){
                                this.outputData.region.splice(index,1);
                            }
                        }
                    }
                }
            },
            //快速搜索点击
            searchTag(item){
                let index = _.findIndex(this.quickSearch,item);
                for(let i = 0;i<this.quickSearch.length;i ++){
                    if (i === index){
                        this.quickSearch[i].active = !this.quickSearch[i].active;
                    }else{
                        this.quickSearch[i].active = false;
                    }
                }
                if (item.active){
                    this.outputData.quickTag = item;
                    this.isRegionAll = false;
                    this.calender = true;
                    for(let item of this.region){
                        item.active = false;
                    }
                } else{
                    this.calender = false;
                    this.outputData.quickTag = "";
                }
            },
            //获取开始时间和结束时间
            showMyTime(){
                if (this.outputData.quickTag !== ""){
                    this.outputData.beginTime = moment(this.timeValue[0]).format("YYYY-MM-DD HH:mm:ss");
                    this.outputData.endTime = moment(this.timeValue[1]).format("YYYY-MM-DD HH:mm:ss");
                    this.getList();
                }
            },
        }
    }
</script>

<style scoped lang="less">
    @import "../../../css/custody/dataResult-analysis";
</style>
