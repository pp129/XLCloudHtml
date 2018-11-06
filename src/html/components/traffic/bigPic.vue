<template>
    <div class="mask" v-show="visible">
        <div class="bigPic-box">
            <div class="bigPic-head">
                全景图
                <span class="close_bigPic" @click="closeBigPic"></span>
            </div>
            <div class="bigPic-pic">
                <div class="clearfix">
                    <div class="pic-box">
                        <div class="pic-div">
                            <!--<pic-adaption width="565" height="315" src="/public/image/capture/1.jpg"></pic-adaption>-->
                            <cut-pic-view width="565" height="315" id="captureCanvas" :arg="picArg"></cut-pic-view>
                        </div>
                        <div class="circle-div">

                            <span class="circle-title">{{currentPic === 1 ? "全景图" : "抓拍图"}}</span>
                            <span class="circle-point"
                                  :class="{'circle-active':currentPic === item}"
                                    v-for="(item,key) in 2"
                                  @click="changePic(item)"></span>
                            <span class="circle-text">{{currentPic}}/2</span>
                        </div>
                    </div>
                    <div class="info-box" v-show="closeLog">
                        <div>
                            <div class="compare-box">
                                <div class="capture-pic">
                                    <!--<cut-pic-view width="130" height="130" id="captureCanvas" :arg="['/public/image/capture/1.jpg',280,98,100,124]"></cut-pic-view>-->
                                    <!--<canvas width="130" height="130" id="captureCanvas"></canvas>-->
                                    <pic-adaption width="130" height="130" :src="currentConfirmInfo && currentConfirmInfo.faceUrl || '/public/image/capture/no-photo.png'"></pic-adaption>
                                </div>
                                <div class="result-box">
                                    {{currentConfirmInfo && currentConfirmInfo.similarity || 0}}%
                                    <img src="../../../images/traffic/shape_3.png"/>
                                </div>
                                <div class="capture-pic">
                                    <div class="id-pic">
                                        <pic-adaption width="130" height="130"
                                                      :src="currentConfirmInfo && currentConfirmInfo.compareImgUrl || '/public/image/capture/no-info.png'"></pic-adaption>
                                    </div>
                                </div>
                            </div>
                            <div class="circle-right-div">
                                <span class="circle-point"
                                    :class="{'circle-active':currentConfirmInfoIndex === key}"
                                      v-if="confirmInfoList"
                                    v-for="(item,key) in confirmInfoList"
                                    @click="changeCurrentConfirmInfo(key)"></span>
                                <span class="circle-text">{{currentConfirmInfoIndex + 1}}/{{confirmInfoList && confirmInfoList.length || 0}}</span>
                            </div>
                            <div class="text-box ">
                                <div v-if="currentConfirmInfo">
                                    <div class="text-row">
                                        {{currentConfirmInfo && currentConfirmInfo.personName}}
                                    </div>
                                    <div class="text-row">
                                        {{currentConfirmInfo && currentConfirmInfo.idCard}}
                                    </div>
                                    <div class="label-div">
                                        <person-label :labels="currentConfirmInfo && currentConfirmInfo.personLabel"></person-label>
                                    </div>
                                </div>
                                <div class="no-conFirm-info"  v-if="!currentConfirmInfo">
                                    认证信息失败
                                </div>
                                <div class="text-row">
                                    <div class="row-title">
                                        <span class="info-name">类别</span>
                                    </div>
                                    <div class="text">: {{currentData && currentData.type}}</div>
                                </div>
                                <div class="text-row">
                                    <div class="row-title">
                                        <span class="info-name">告警类别</span>
                                    </div>
                                    <div class="text">: {{currentData && currentData.alarmType}}</div>
                                </div>
                                <div class="text-row">
                                    <div class="row-title">
                                        <span class="info-name">抓拍时间</span>
                                    </div>
                                    <div class="text">: {{currentData && currentData.captureTime}}</div>
                                </div>
                                <div class="text-row">
                                    <div class="row-title">
                                        <span class="info-name">抓拍地点</span>
                                    </div>
                                    <div class="text" @click="gotoDeviceAnalysis">: {{currentData && currentData.deviceName}}</div>
                                </div>
                                <div :class="{'approved-flag':currentConfirmInfo,'approve-fail-flag':!currentConfirmInfo}"></div>
                            </div>
                        </div>
                    </div>
                    <div class="info-box" v-show="isLog">
                        <div id="stage_bigPic">
                            <table>
                                <tr style="background-color: rgb(15,45,73);">
                                    <th style="width: 80px;">是否机动车</th>
                                    <th style="width: 80px;">是否戴头盔</th>
                                    <th style="width: 70px;">确认人</th>
                                    <th style="width: 105px;">时间</th>
                                </tr>
                                <tr style="border-bottom: 1px dashed rgb(24,52,79);" v-for="item in listLog.rows">
                                    <td>{{translateChinese(item.isVehicle)}}</td>
                                    <td>{{translateChinese(item.isHelmet)}}</td>
                                    <td>{{item.confirmPersonName}}</td>
                                    <td>{{item.confirmTime}}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="log-page">
                            <el-pagination
                                layout="prev,pager,next"
                                @current-change="handleCurrentChangeFromCaptureList"
                                :current-page="logPage"
                                :total="listLog.total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div class="confirm-box">
                    <div class="confirm-div">
                        <el-form ref="form" :model="form" label-width="50px" label-position="left">
                            <el-form-item>
                                <el-radio-group v-model="form.isVehicle">
                                    <el-radio :label="2">待确认</el-radio>
                                    <el-radio :label="1">机动车</el-radio>
                                    <el-radio :label="0">非机动车</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="confirm-div">
                        <el-form ref="form" :model="form" label-width="50px" label-position="left">
                            <el-form-item>
                                <el-radio-group v-model="form.isHelmet">
                                    <el-radio :label="2">待确认</el-radio>
                                    <el-radio :label="1">已戴头盔</el-radio>
                                    <el-radio :label="0">未戴头盔</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="btn-div">
                        <div class="btnClass Btn_blue" @click="confirm">确认</div>
                        <span class="getLog" @click="getLog()" v-show="closeLog">确认日志</span>
                        <span class="getLog" @click="closeLogShow()" v-show="isLog">关闭日志</span>
                    </div>
                </div>
                <div class="change-pic-box">
                    <div class="change-pic-div">
                        <div class="box-slide">
                            <span class="shape_slide"
                                  @click="gotoPreGroup"
                                  :class="{'left-slide':currentDataGroupIndex > 0 , 'left-slide-disable':currentDataGroupIndex === 0} "></span>
                        </div>
                        <div class="content-pic">
                            <img src="../../../images/traffic/screen/capture-list/1.jpg"
                                 :class="{active:currentData && currentData.index === item.index}"
                                 v-for="(item,index) of currentDataGroup"
                                 @click="changeCurrentData(item.index)"/>
                            <div class="count-box">
                                {{currentDataIndex + 1}}/{{allDataClone && allDataClone.length}}
                            </div>
                        </div>
                        <div class="box-slide">
                            <span class="shape_slide right-slide"
                                  @click="gotoNextGroup"
                                  :class="{'right-slide':groupTotalPage > currentDataGroupIndex + 1 , 'right-slide-disable':groupTotalPage <= currentDataGroupIndex + 1} "></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    const axios = require("axios");
    const util = require("../../../js/util/util");
    export default {
        props: [
            "dataIndex",
            "allData",
            "visible"
        ],
        components: {
            "cutPicView": () => import("../common/cut-pic-view.vue"),
            "picAdaption": () => import("../common/picAdaption.vue"),
            "personLabel": () => import("../personLabel.vue"),
        },
        data() {
            return {
                allDataClone :null,// 所有数据
                closeLog:true,//关闭日志
                currentDataIndex:null,// 当前数据索引
                currentPic: 1,// 当前图片序号
                currentConfirmInfoIndex: 0,// 当前确认信息索引
                currentDataGroupIndex:0,// 当前分组索引
                dialogFromVisble: false,
                form: {
                    isVehicle: 2,//机动车
                    isHelmet: 2//头盔
                },
                isLog:false,//打开日志
                groupPageRows:10,// 当前分组每页条数
                listLog:{total:0,rows:[]},//日志列表
                logPage:1,//当前页
                picArg: [],//图片参数

            }
        },
        watch: {
            "dataIndex": "init"
        },
        computed: {
            // 当前数据
            currentData(){
                if(this.allDataClone && this.currentDataIndex !== null){
                    return this.allDataClone[this.currentDataIndex];
                }else{
                    return null;
                }
            },
            // 被确认人列表
            confirmInfoList(){
                if(this.currentData && this.currentData.confirmInfo && this.currentData.confirmInfo.length){
                    return this.currentData.confirmInfo;
                }else{
                    return null
                }
            },
            // 当前被确认人
            currentConfirmInfo(){
                if(this.confirmInfoList  && this.currentConfirmInfoIndex !== null){
                    return this.confirmInfoList[this.currentConfirmInfoIndex];
                }else{
                    return null
                }
            },
            // 当前分组
            currentDataGroup(){
                if(this.allDataClone ){
                    return this.allDataClone.slice(this.currentDataGroupIndex * this.groupPageRows , (this.currentDataGroupIndex + 1) * this.groupPageRows);
                }else{
                    return [];
                }
            },
            // 分组数
            groupTotalPage(){
                if(this.allDataClone){
                    return Math.ceil(this.allDataClone.length  / this.groupPageRows);
                }else{
                    return 0;
                }
            }
        },
        created() {
        },
        mounted() {
            this.init();
        },
        methods: {
            // 确认
            confirm(){
                this.form.captureId = this.currentData.captureId;
                axios.post(conf.api_local + "/tBusCaptureConfirmInfo/addTBusCaptureConfirmInfo" , this.form).then((res)=>{
                    let data = util.verifyResponse(res);
                    if (data) {
                        this.$message({
                            type:"success",
                            message:"成功确认"
                        })
                    }
                })
            },
            //关闭大图
            closeBigPic() {
                this.$emit('update:visible', false);
            },
            // 改变确认人索引
            changeCurrentConfirmInfo(index){
                this.currentConfirmInfoIndex = index;
            },
            // 修改图片
            changePic(item) {
                this.currentPic = item;
                if (item === 1) {
                    this.picArg = [this.currentData.sceneUrL, 0, 0];
                } else {
                    this.picArg = [this.currentData.sceneUrL, 280, 98, 100, 124];
                }
            },
            // 设置当前数据
            changeCurrentData(index){
                this.isLog = false;
                this.closeLog = true;
                this.currentDataIndex = index;
                this.changePic(1);// 设置当前图片
                // 如果确认列表存在，设置当前确认信息
                if (this.confirmInfoList && this.confirmInfoList.length) {
                    this.changeCurrentConfirmInfo(0)
                }
                this.getTBusCaptureConfirmInfoByCaptureId();
            },

            init() {
                if (this.dataIndex !== undefined && this.dataIndex !== null ) {
                    this.allDataClone = _.cloneDeep(this.allData);// 复制所有列表数据
                    // 建立索引
                    for(let i = 0 ; i <  this.allDataClone.length ; i++){
                        this.allDataClone[i].index = i;
                    }
                    // 设置当前数据
                    this.changeCurrentData(this.dataIndex);
                    // 初始化分组信息
                    this.initDataGroup();
                }
            },
            // 初始化分组
            initDataGroup(){
                // 当前分组
                this.currentDataGroupIndex = Math.floor((this.currentDataIndex + 1)  / this.groupPageRows);
            },
            //打开日志
            getLog(){
                this.isLog = true;
                this.closeLog = false;
                this.logGet();
            },
            logGet(){
                axios.get(conf.api_local + "/tBusCaptureConfirmInfo/getTBusCaptureConfirmInfoHistory?" + util.noNoneGetParams({
                    captureId:this.currentData.captureId,
                    page:this.logPage,
                    rows:10
                })).then((response)=>{
                    let data = util.verifyResponse(response);
                    console.log(data)
                    if (data){
                        this.listLog.total = data.total;
                        this.listLog.rows = data.rows;
                    }
                }).catch((error)=>{
                    console.log(error)
                })
            },
            //关闭日志
            closeLogShow(){
                this.isLog = false;
                this.closeLog = true;
            },
            // 获取确认信息
            getTBusCaptureConfirmInfoByCaptureId(){
                this.form.captureId = this.currentData.captureId;
                axios.get(conf.api_local + "/tBusCaptureConfirmInfo/getTBusCaptureConfirmInfoByCaptureId?" + util.noNoneGetParams({
                    captureId:this.currentData.captureId
                })).then((res)=>{
                    let data = util.verifyResponse(res);
                    if (data) {
                        this.form = {
                            captureId : this.currentData.captureId,
                            isVehicle: data.isVehicle,
                            isHelmet: data.isHelmet
                        };
                    }
                })
            },
            // 上一组
            gotoPreGroup(){
                if(this.currentDataGroupIndex > 0 ){
                    this.currentDataGroupIndex --;
                }
            },
            // 下一组
            gotoNextGroup(){
                if(this.groupTotalPage > this.currentDataGroupIndex  + 1 ){
                    this.currentDataGroupIndex ++;
                }
            },
            // 进入点位分析
            gotoDeviceAnalysis(){
                this.$router.push("/traffic/device-analysis/" + this.currentData.gbid);
            },
            handleCurrentChangeFromCaptureList(val){
                this.logPage = val;
                this.logGet();
            },
            //翻译日志内容
            translateChinese(params){
                if (params === 0){
                    return "否";
                }
                if (params === 1){
                    return "是";
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../../css/traffic/bigPic";
</style>
