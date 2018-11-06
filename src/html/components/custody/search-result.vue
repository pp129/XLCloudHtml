<template>
    <div>
        <div >
            <top htmlname="数据结果分析" type="雪亮监护"></top>
            <div class="safe_width">
                <div id="search-box">
                    <more-search @change="moreSearchChange" :input-data="inputData" :showBtn="true"></more-search>
                </div>
                <div class="row-box">
                    <span style="float: left;font-size: 14px;border-bottom: 3px solid rgb(48,165,237);">搜索结果:&nbsp;&nbsp;&nbsp;{{listTotal || 0}}条记录</span>
                    <span style="float: right;color: rgb(48,165,237);font-size: 14px;text-decoration: underline;" @click="onekeyFocus">一键关注</span>
                </div>
            </div>
            <span class="border_line"></span>
            <div class="safe_width clearfix">
                <div class="row_show" v-for="(item,index) in list" @click="clickList(item)">
                    <div class="friend_detail_content" >
                        <div class="police_detail_img_content">
                            <div class="vertical_head"></div>
                            <img v-bind:src="item.imgUrl" class="image_show friend_image" index="' + i + '" onerror="' + errorJs + '">
                        </div>
                        <div class="friend_detail_info_content">
                            <p class="p_margin">
                                <span class="name_span">{{item.name}}</span>
                                <span style="float: right;">{{item.sex}}</span>
                            </p>
                            <button class="idcard_label friend_info">{{item.idcard}}</button>
                            <p class="p_margin">
                                {{translateName(item.domicilePlace)}}（{{item.communityName}}）
                            </p>
                            <p class="p_margin">
                                {{item.captureDeviceCount}}点位-{{item.captureDateCount}}天-{{item.captureCount}}次
                            </p>
                            <p class="p_margin">
                                同行人：{{item.fellowCount}}
                            </p>
                            <p class="p_margin" style="position: absolute;top: 115px;" :class="getAttentionColor(item.attentionCount)" >
                                关注指数：{{item.attentionCount}}
                            </p>
                            <p class="p_underline friend_detail" v-show="false">查看详情</p>
                            <div class="clearfix">
                                <span :class="{'focus-icon':!item.attention ,'unfocus-icon':item.attention} " @click.stop="attention(item,index)"></span>
                            </div>
                        </div>
                        <div class="person_label">
                            <div class="msg-tab theme-2">
                                <span class="tab-lf">重点</span><span class="tab-lr">精神</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="safe_width pagination-wrap ">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[12, 24,36,48]"
                    :page-size="12"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="listTotal">sss
                </el-pagination>
            </div>
        </div>
        <bottom></bottom>
    </div>
</template>

<script>
    let moment = require("moment");
    let axios = require("axios");
    let querystring = require("querystring");
    let util = require("../../../js/util/util");
    let session = require("../../../js/util/storageUtil.js");
    export default {
        data() {
            return {
                currentPage: 1,
                pageSize:12,
                list: [],
                inputData:{},
                listTotal:20,
                key:"",
                outputData:{
                    togetherNum:0,//同行人数
                    point:0,//点位
                    day:0,//天数
                    times:0,//次数
                    isAttention:false,//我的关注
                    attentionRate:0,// 关注指数
                    quickSearchItem:null,//快速搜索
                    regions:[],//行政区
                    street:[],//街道
                },

            };
        },

        watch: {
//            '$route':'getParams'
        },
        components:{
            MoreSearch:()=>import("./common/moreSearch.vue"),
            Top:()=>import("./common/top.vue"),
            Bottom:()=>import("./common/bottom.vue"),
        },
        created: function () {
            let storage = localStorage.getItem("keyword");
            if (storage !== null){
                this.key = storage;
            }
            //清除本地存储
            session.removeLocalStorage("keyword");
//            this.getParams()
        },
        mounted: function () {
            this.init();
        },
        computed: {

        },
        methods: {
            attention(item,index){
                if(item.attention){
                    item.attention = false;
                    this.cancelFocus(item.personId);
                }else{
                    item.attention = true;
                    this.focuPsychosis(item.personId);
                }
                this.$set(this.list , index , item);
            },
            clickList(item){
                this.$router.push(`/custody/personRecord/${item.idcard}/${item.personId}`);
            },
            cancelFocus(psychosisId){
                axios.post(conf.api + "/myAttention/cancelFocus",querystring.stringify({
                    "psychosisId": psychosisId,
                    "userId": "U000001"
                })).then((data)=>{
                    if(data && data.data && data.data.successFlag){
                        this.$message({
                            type:"success",
                            message:"取消关注成功"
                        })
                    }
                })
            },
            focuPsychosis(psychosisId){
                axios.post(conf.api + "/myAttention/focusPsychosis",querystring.stringify({
                    "psychosisId": psychosisId,
                    "userId": "U000001"
                })).then((data)=>{
                    if(data && data.data && data.data.successFlag){
                        this.$message({
                            type:"success",
                            message:"关注成功"
                        })
                    }
                })
            },
            init(){
                this.getList();
            },
            //获取关注指数颜色
            getAttentionColor(params){
                if (params <= 50 ){
                    return "class_zero";
                }else if(params > 50 && params <= 100){
                    return "class_one";
                }else if(params >100 && params <= 300){
                    return "class_two";
                }else if(params >300 && params <= 500){
                    return "class_three"
                }else{
                    return "class_four"
                }
            },
            getList(){
//                togetherNum:0,//同行人数
//                point:0,//点位
//                day:0,//天数
//                times:0,//次数
//                isAttention:false,//我的关注
//                attentionRate:0,// 关注指数
//                quickSearchItem:null,//快速搜索
//                regions:[],//行政区
//                street:[],//街道
                let areaName = [];
                let communityName = [];
                if(this.outputData.region && this.outputData.region.length > 0){
                    for(let item of this.outputData.region){
                        areaName.push(item.id);
                    }
                }
                if(this.outputData.street && this.outputData.street.length > 0){
                    for(let item of this.outputData.street){
                        communityName.push(item.id);
                    }
                }
                // axios.get(conf.api + "/guardianShipSearchPage/getTBasPsyosisInfoList?" + util.noNoneGetParams({
                axios.post(conf.api + "/guardianShipSearchPage/getTBasPsyosisInfoList" , {
                    "page":this.currentPage,
                    "rows":this.pageSize,
                    "key": this.key.trim(),//关键字
                    "areaName": areaName.join(","),// 行政区
                    "communityName": communityName.join(","),// 街道
                    "captureCount":this.outputData.times,// 抓拍次数
                    "captureDeviceCount":this.outputData.point,// 点位
                    "captureDateCount":this.outputData.day,// 天数
                    "myAttention":this.outputData.isAttention ? 1 : 0,// 我的关注  1 0
                    "fellowCount":this.outputData.togetherNum,// 同行人数
                }).then((response)=>{
                    console.log(response)
                    this.list = response.data.data.rows;
                    this.listTotal = response.data.data.total;
//                    this.listTotal = response.
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            moreSearchChange(data){
                console.log(data)
                if(data.key === ""){
                    this.key ="";
                }
                this.currentPage =  1;
                this.pageSize = 12;
                this.outputData = data;
                this.getList();
            },
            onekeyFocus(){
                let psychosisId = [];
                for(let item of this.list){
                    psychosisId.push(item.personId);
                }
                this.focuPsychosis(psychosisId.join(","));
            },
            //去除福建省厦门市
            translateName(params){
                var str = params.replace("福建省厦门市","");
                return str;
            },
//            getParams(){
//                var routerParams = this.$route.params.data;
//                console.log(routerParams)
//            }
        }

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../../css/custody/search.less";
    @import "../../../css/custody/searchResult.less";

</style>
