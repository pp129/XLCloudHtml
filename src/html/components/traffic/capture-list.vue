<template>
    <div id="capture-list">
        <div class="capture-list-head">
            <span class="title"
               v-for="item in sortList"
               :class="{'active-title': item.id === nowSortItemId}"
               @click="getClick(item.id)">{{item.name}}({{item.count}})</span>
        </div>
        <div class="capture-list-body">
            <div class="capture-box" v-for="(value,index) in list"  @click="getBigPic(index)">
                <div class="box-main">
                    <div class="pic-box">
                        <img :src="value.sceneUrL"/>
                    </div>
                    <div class="capture-info-row">
                        {{value.deviceName}}
                    </div>
                    <div class="capture-info-row">
                        {{value.captureTime}}
                    </div>
                </div>
            </div>
        </div>
        <div id="page-div" >
            <el-pagination
                @size-change="handleSizeChangeFromCaptureList"
                @current-change="handleCurrentChangeFromCaptureList"
                :current-page="page"
                :page-sizes="[15, 30, 45]"
                :page-size="rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <component :is="bigPic" :visible.sync="showBigPic" :data-index="bigPicDataIndex" :all-data="list"></component>
    </div>
</template>

<script>
    let axios = require("axios");
    let moment = require("moment");
    let _ = require("lodash");
    let util = require("../../../js/util/util");
    export default {
        props:[
            "inputOption"
        ],
        data(){
            return{
                allListData:{},
                bigPic : "bigPic",//查看大图
                bigPicDataIndex:null,//流向大图数据
                bigPicShow : false,
                isAll : true,//全选标志
                list: [],
                nowSortItemId :"capture",
                page:1,
                rows:15,
                total:0,
                //数据类型
                sortList:[],
                showBigPic:false

            }
        },
        components:{
            bigPic:() => import("./bigPic.vue")
        },
        watch:{
        },
        computed:{
            getAmount(){
                let  amount = 0;
                for(let item of this.sortList){
                    amount += item.count;
                }
                return amount;
            }
        },
        created(){},
        mounted(){
            this.init();
        },
        methods:{
            async init(){
                await this.getTypeList();
                this.getListData();
            },
            //获取大图
            getBigPic(index){
                this.bigPicDataIndex = index;
                this.showBigPic = true;
            },
            //获取当前点击的类别
            getClick(params){
                this.nowSortItemId = params;
                this.page = 1;
                this.getListData();
            },
            // 获取类别列表数据
            async getTypeList(){
                let data = await axios.post(conf.api_local + "/captureInfo/getCaptureInfoCount" , util.noNoneGetParams({
                    gbids: this.inputOption.gbids,
                    beginTime:this.inputOption.beginTime ? moment(this.inputOption.beginTime).format("YYYY-MM-DD hh:mm:ss") : "",
                    endTime:this.inputOption.endTime ? moment(this.inputOption.endTime).format("YYYY-MM-DD hh:mm:ss") :"",
                })).then((res)=>{
                    let data = util.verifyResponse(res);
                    if (data) {
                        return data;
                    }
                }).catch((e)=>{
                    return false;
                });
                if(data){
                    let result = [
                        {name:"全部",id:"capture",count:0},
                        {name:"非机动车",id:"nonMotorizedVehicle",count:0},
                        {name:"没戴头盔",id:"noHelmet",count:0},
                        {name:"酒驾",id:"wineDriving",count:0},
                        {name:"毒驾",id:"poisonDriving",count:0},
                        {name:"其他",id:"other",count:0},
                    ];
                    for(let item of result){
                        item.count = data[0][item.id + "Count"];
                    }
                    this.sortList = result;
                }
            },
            // 获取列表数据
            async getListData(){
                let list = await axios.post(conf.api_local + "/captureInfo/getCaptureInfoList" , util.noNoneGetParams({
                    page:this.page,
                    rows:this.rows,
                    type:this.nowSortItemId,
                    gbids: this.inputOption.gbids,
                    beginTime:this.inputOption.beginTime ? moment(this.inputOption.beginTime).format("YYYY-MM-DD hh:mm:ss") : "",
                    endTime:this.inputOption.endTime ? moment(this.inputOption.endTime).format("YYYY-MM-DD hh:mm:ss") :"",
                })).then((res)=>{
                    let data = util.verifyResponse(res);
                    if (data) {
                        return data;
                    }
                }).catch((e)=>{
                    return false;
                });
                if(list){
                    this.list = list.rows;
                    this.total = list.total;
                }

            },
            //分页大小发生变化
            handleSizeChangeFromCaptureList(val){
                this.rows = val;
                this.getListData()
            },
            //当前页面发生变化
            handleCurrentChangeFromCaptureList(val){
                this.page = val;
                this.getListData()
            },
        },
    }
</script>

<style scoped lang="less">
    @import "../../../css/traffic/capture-list.less";
</style>
