<template>
    <div>
        <!--<div id="quick-search-div">-->
        <!--快速搜索:-->
        <!--<span class="search-tag" :class="{'tag_selected':item.active}"  v-for="(item,index) in quickList"  @click="searchTagClick(item,index)">-->
        <!--<span class="shape_check" v-show="item.active"></span>-->
        <!--{{item.name}}{{item.count? '(' + item.count + ')' : ""}}-->
        <!--</span>-->
        <!--&lt;!&ndash;<img src="../../../images/custody/shape_up.png" width="25px" height="30px" style="position: relative;top: 10px;"/>&ndash;&gt;-->
        <!--<img src="../../../../images/custody/shape_down.png" width="15px" height="15px" style="position: relative;top: 2px;"  class="show-entrance" @click="moreSearchBtnClick"/>-->
        <!--</div>-->
        <div id="search-menu-div" v-show="moreSearchShow" class="pr">
            <a class="return-btn" @click="returnBack" v-if="showBtn">返回搜索页</a>
            <div class="search-menu-row clearfix">
                <span>行政区</span>
                <div id="region-box">
                    <div class="region-row">
                        <span class="admin-normal" @click="regionAll"  :class="{'admin-selected': isAllSearch}">全部区域（{{allCount}}）</span>
                    </div>
                    <div class="region-row clearfix">
                        <div v-for="item in regionList"  class="admin-normal-wrapper fl">
                            <span class="admin-normal " :class="{'admin-selected':regionActive(item)}" @click="regionClick(item)">
                                {{translateName(item.name)}}（{{getRegionCount(item)}}）
                            </span>
                            <span class="select-down-icon" :class="{'up':item === currentRegion}" @click="showStreet(item)"></span>
                        </div>
                    </div>
                    <div class="region-row" v-show="streetShow">
                        <!--<transition name="slide-fade">-->
                        <div class="box-show clearfix" >
                            <div class="show-div">
                                <div class="unselect-tag"
                                     :class="{'select-tag':streetActive(item)}"
                                     v-for="item in streetList"
                                     @click="streetClick(item)">
                                    <span class="shape_check select_check" v-show="streetActive(item)"></span>
                                    <span class="normal-style">{{item.name}}（{{item.count}}）</span>
                                </div>
                            </div>
                        </div>
                        <!--</transition>-->
                    </div>
                </div>

            </div>
            <div>

                <div class="search-menu-row">
                    抓拍情况&nbsp;>=&nbsp;<input type="text"  v-model="outputData.point" @change="change()" style="padding-left: 5px;"/>&nbsp;点&nbsp;
                    <input type="text"  v-model="outputData.day" @change="change()"  style="padding-left: 5px;"/>&nbsp;天&nbsp;
                    <input type="text"  v-model="outputData.times" @change="change()"  style="padding-left: 5px;"/>&nbsp;次
                </div>
                <div class="search-menu-row">
                    关注指数&nbsp;>=&nbsp;<input type="text"  v-model="outputData.attentionRate" @change="change()"  style="padding-left: 5px;"/>
                </div>
                <div class="search-menu-row">
                    同行人数&nbsp;>=&nbsp;<input type="text" v-model="outputData.togetherNum" @change="change()" style="padding-left: 5px;"/>
                </div>
                <div class="search-menu-row" style="margin-bottom: 5px;">
                    <span style="float: left;">我的关注</span>
                    <span class="is-attention-input-wrap">
                        <el-switch
                            @change="change"
                            v-model="outputData.isAttention">
                        </el-switch>
                    </span>

                </div>
            </div>
            <div class="more-search-btn-wrap"  v-if="showBtn">
                <span class="search_btn" style="background-color: rgb(48,156,237);"  @click="change">确定</span>
                <span class="search_btn" style="background-color: rgb(177,188,195);margin-left: 5px;"  @click="reset">重置</span>
            </div>

        </div>
    </div>
</template>

<script>
    let moment = require("moment");
    let axios = require("axios");
    let _ = require("lodash");
    let util = require("../../../../js/util/util");
    let session = require("../../../../js/util/storageUtil.js");
    export default {
        props:[
            "showBtn"
        ],
        data() {
            return {
                currentRegion:null,
                list: [],
                moreSearchShow:true,
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
                quickList:[
                    {
                        name:"我的关注",
                        count:200,
                        active:false,
                    },
                    {
                        name:"高频出现人员top50",
                        count:0,
                        active:false,
                    },
                    {
                        name:"高频出现无同行关系人员",
                        count:0,
                        active:false,
                    },
                    {
                        name:"从未出现人员",
                        count:0,
                        active:false,
                    },
                    {
                        name:"近三个月从未出现人员",
                        count:0,
                        active:false,
                    }
                ],
                regionList:[

                ],
                streetShow:true,
                streetList:[

                ],
                streetListSelect:[],

            };
        },
        watch: {},
        created: function () {
            let storage = session.getLocalStorage("inputData");
            if (storage !== null){
                this.outputData = storage;
            }
            //清除本地存储
            session.removeLocalStorage("inputData");
        },
        mounted: function () {
            this.init();
        },
        computed: {
            allCount(){
                let count = 0;
                for(let region of this.regionList){
                    if(region.list){
                        for(let street of region.list){
                            count += street.count;
                        }
                    }
                }
                return count;
            },
            totalStreet(){
                let total = 0;
                for(let item of this.regionList){
                    total += item.list.length;
                }
                return total;
            },
            isAllSearch(){
                return this.outputData.street.length === this.totalStreet;
            }
        },
        methods: {
            change(){
                this.$emit("change",this.outputData);
            },
            init(){
                this.getRegionList();
            },
            getRegionCount(region){
                let count = 0;
                if(region){
                    for(let item of region.list){
                        count += item.count;
                    }
                }
                return count;
            },
            getRegionList(){
                axios.get(conf.api + "/guardianShipSearchPage/getAdministrativeDivision").then((data)=>{
                    let verifyData = util.verifyResponse(data);
                    if(verifyData){
                        this.regionList = verifyData;
                    }
                    this.change();
                }).catch((err)=>{
                    console.error(err);
                })
            },
            //行政区的全部选择
            regionAll(){
                //将街道全部添加
                if (this.isAllSearch){
                    //清空行政区
                    this.outputData.regions = [];
                    //清空街道
                    this.outputData.street = [];

                }else{
                    this.outputData.regions =  _.clone(this.regionList);
                    this.outputData.street = [];
                    for(let item of this.regionList){
                        for (let value of item.list){
                            //添加街道
                            this.outputData.street.push(value);
                        }
                    }
                }
                this.change();
            },
            // 行政区选择
            regionClick(item){
                let index = _.findIndex(this.outputData.regions,item);
                if(index === -1){
                    this.currentRegion = item;
                    this.streetShow = true;
                    this.outputData.regions.push(item);
                    //将街道全部添加
                    this.streetList = _.clone(item.list);
                    this.outputData.street = _.unionWith(this.outputData.street, item.list, _.isEqual);
                }else{
                    this.currentRegion = null;
                    this.streetShow = false;
                    this.outputData.regions.splice(index,1);
                    item.active = false;
                    this.streetList = [];
                    let theSame = _.intersectionWith(this.outputData.street, item.list, _.isEqual);
                    this.outputData.street = _.xorWith(this.outputData.street, theSame, _.isEqual);
                }
                this.change();
            },
            // 行政区选中样式
            regionActive(item){
                return _.intersectionWith(item.list,this.outputData.street , _.isEqual).length > 0;
            },
            // 街道选中样式
            streetActive(item){
                return _.findIndex(this.outputData.street , item) !== -1;
            },
            // 街区选择
            streetClick(item){
                let index =  _.findIndex(this.outputData.street,item);
                if(index === -1){
                    this.outputData.street.push(item);
                }else{
                    this.outputData.street.splice(index,1);
                }
                this.change();
            },
            showStreet(item){
                if(this.currentRegion === item){
                    this.streetShow = false;
                    this.currentRegion = null;
                    this.streetList = [];
                }else{
                    this.streetShow = true;
                    this.currentRegion = item;
                    this.streetList = _.clone(item.list);
                }
            },
            //去除福建省厦门市
            translateName(params){
                var str = params.replace("福建省厦门市","");
                return str;
            },
            reset(){
                this.outputData = {
                    togetherNum:0,//同行人数
                    point:0,//点位
                    day:0,//天数
                    times:0,//次数
                    isAttention:false,//我的关注
                    attentionRate:0,// 关注指数
                    quickSearchItem:null,//快速搜索
                    regions:[],//行政区
                    street:[],//街道
                    key:""
                };
                this.change();
            },
            returnBack(){
                this.$router.push("/custody/search");
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../../../css/custody/search.less";
</style>
