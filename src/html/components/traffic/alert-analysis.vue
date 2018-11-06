<template>
    <div>
        <top :type="type" :htmlname="htmlname"></top>
        <div class="alert-body" :style="style">
            <div class="alert-left">
                <div class="region-box">
                    <div class="left-title">行政区</div>
                    <div class="region-div">
                        <span class="region-span region-all" :class="{checked:regionAll}" @click="chooseRegionAll()">全部</span>
                        <span class="region-span" v-for="item in regionList" :class="{'checked':item.active}" @click="chooseRegion(item)"><span class="check_region" v-show="item.active"></span>{{item.name}}</span>
                    </div>
                </div>
                <div class="alert-box">
                    <div class="left-title">警情类别</div>
                    <div class="alert-div" :class="{'checked':alertAll}" @click="chooseAlertAll">全部</div>
                    <div class="alert-div" v-for="item in alertSort" :class="{'checked':item.active}" @click="chooseAlert(item)"><span class="check_region check_alert" v-show="item.active"></span>{{item.name}}</div>
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
                            @blur="checkTime">
                        </el-date-picker>
                    </div>
                </div>
                <div class="btn-div">
                    <span class="btn btn_blue">确定</span>
                    <span class="btn btn_grey" @click="reset">重置</span>
                </div>
            </div>
            <div class="alert-right">
                <component :is="view"></component>
            </div>
        </div>
    </div>
</template>

<script>
    let axios = require("axios");
    let _ = require("lodash");
    let moment = require("moment");
    let querystring = require("querystring");
    export default {
        data () {
            return {
                alertAll:false,//全选警情类别
                alertSort:[
                    {name:"非机动车事故",active:false},
                    {name:"亡人事故",active:false},
                    {name:"其他事故",active:false},
                ],//警情类别
                beginTime:"",//开始时间
                endTime:"",//结束时间
                htmlname:"-警情分析",
                outputData:{
                    region:[],
                    alert:[],
                    time:[]
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
                regionAll:false,//全选行政区
                regionList:[
                    {
                        name:"思明区",
                        active:false
                    },
                    {
                        name:"湖里区",
                        active:false
                    },
                    {
                        name:"集美区",
                        active:false
                    },
                    {
                        name:"海沧区",
                        active:false
                    },
                    {
                        name:"同安区",
                        active:false
                    },
                    {
                    name:"翔安区",
                    active:false
                }
                ],//行政区列表
                style:{height:""},
                type:"雪亮交通",
                view:"alert-map",
            }
        },
        components :{
            Top: () => import("../custody/common/top.vue"),
            Bottom: () => import("../custody/common/bottom.vue"),
            alertMap: () => import("./alert-map.vue")
        },
        watch : {},
        computed : {},
        created () {},
        mounted () {
            this.style.height = window.innerHeight -70 + 'px';//计算页面高度
        },
        methods : {
            //全选警情类别
            chooseAlertAll(){
                this.alertAll = !this.alertAll;
                if (this.alertAll){
                    for(let item of this.alertSort){
                        item.active = true;
                        let index = _.findIndex(this.outputData.alert,item);
                        if (index === -1){
                            this.outputData.alert.push(item)
                        }
                    }
                }else{
                    for(let item of this.alertSort){
                        item.active = false;
                        let index = _.findIndex(this.outputData.alert,item);
                        if (index !== -1){
                            this.outputData.alert.splice(index,1)
                        }
                    }
                }
            },
            //单选警情类别
            chooseAlert(params){
                params.active = !params.active;
                let index = _.findIndex(this.outputData.alert,params);
                if(params.active){
                    if(index === -1){
                        this.outputData.alert.push(params);
                    }
                    if (this.outputData.alert.length === this.alertSort.length){
                        this.alertAll = true;
                    }
                }else{
                    this.alertAll = false;
                    if(index !== -1){
                        this.outputData.alert.splice(index,1);
                    }
                }
            },
            //单选行政区
            chooseRegion(params){
                params.active = !params.active;
                let index = _.findIndex(this.outputData.region,params);
                if(params.active){
                    if(index === -1){
                        this.outputData.region.push(params);
                    }
                    if (this.outputData.region.length === this.regionList.length){
                        this.regionAll = true;
                    }
                }else{
                    this.regionAll = false;
                    if(index !== -1){
                        this.outputData.region.splice(index,1);
                    }
                }

            },
            //全选行政区
            chooseRegionAll(){
                this.regionAll = !this.regionAll;
                if(this.regionAll){
                    for(let item of this.regionList){
                        item.active = true;
                        let index = _.findIndex(this.outputData.region,item);
                        if(index === -1){
                            this.outputData.region.push(item);
                        }
                    }
                }else{
                    for(let item of this.regionList){
                        item.active = false;
                        let index = _.findIndex(this.outputData.region,item);
                        if(index !== -1){
                            this.outputData.region.splice(index,1);
                        }
                    }
                }
            },
            //检查时间是否正确
            checkTime(){
                if(this.beginTime && this.endTime){
                    let beginTimeStamp = moment(this.beginTime,"YYYY-MM-DD HH:mm:ss").valueOf();
                    let endTimeStamp = moment(this.endTime,"YYYY-MM-DD HH:mm:ss").valueOf();
                    if(beginTimeStamp <= endTimeStamp){
                        this.$alert('开始时间必须小于结束时间，请重新选择','提示消息',{
                            confirmButtonText:'确定',
                            callback: action => {
                                this.beginTime = "";
                                this.endTime = "";
                            }
                        })
                    }
                }
            },
            //重置查询条件
            reset(){
                this.beginTime = "";
                this.endTime = "";
                //行政区重置
                for(let item of this.regionList){
                    item.active = false;
                }
                this.outputData.region = [];
                this.regionAll = false;
                //警情类别重置
                for(let item of this.alertSort){
                    item.active = false;
                }
                this.outputData.alert = [];
                this.alertAll = false;
            },
        }
    }
</script>


<style scoped lang="less">
    @import "../../../css/traffic/alert-analysis";
</style>
