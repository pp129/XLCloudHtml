<template>
    <div>
        <top :type="type" :htmlname="htmlname"></top>
        <div class="safe_width clearfix">
            <div class="capture_analysis-left">
                <div class="capture-left-head">
                    <div class="capture-head-tab" style="border-right: 1px solid rgb(232,232,232);"
                         :class="{'select_show':isDevice}" @click="changeTab('点位选择')">
                        点位选择
                    </div>
                    <div class="capture-head-tab"
                         style="border-right: 1px solid rgb(232,232,232);padding-left: 10px;padding-right: 10px;width: 123px;"
                         :class="{'select_show':isSelected}" @click="changeTab('已选择')">
                        已选择({{deviceSelected.length}})
                    </div>
                    <div class="capture-head-tab">
                        <span class="drawPen" :class="drawPenActive?'drawPen-active':'drawPen-inactive'"
                              @click="drawPen"></span>
                        <span class="map-grey"></span>
                    </div>
                </div>
                <div class="capture-left-main">
                    <div class="tree-show">
                        <div id="stage" :class="{'move-transform':isSelected,'back-transform':isDevice}">
                            <div class="show-content">
                                <!--<div class="search-head">-->
                                <!--<input type="text" placeholder="请输入关键字搜索"/>-->
                                <!--<span class="search_btn"></span>-->
                                <!--</div>-->
                                <el-input
                                    placeholder="请输入关键字搜索"
                                    v-model="filterText">
                                </el-input>
                                <div class="tree-div">
                                    <el-tree
                                        class="filter-tree"
                                        :data="treeData"
                                        ref="tree"
                                        show-checkbox
                                        node-key="id"
                                        default-expand-all
                                        :props="defaultProps"
                                        :expand-on-click-node="false"
                                        :filter-node-method="filterNode"
                                        @check="choseDevice">
                                    <span class="custom-tree-node" slot-scope="{node,data}">
                                        <span :class="tagColor(data)">{{checkTreeTag(data)}}</span>
                                        <span>{{node.label}}</span>
                                    </span>
                                    </el-tree>
                                </div>
                            </div>
                            <div class="show-content">
                                <div class="show-content-box">
                                    <div class="mychoose-row" v-for="item in deviceSelected">
                                        <span class="delete-mychoose" @click="deleteMyDevice(item)">－</span>
                                        <span class="device-tag mychoose-tag">{{item.tag}}</span>
                                        <span class="mychoose-text">{{item.name}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="time-div">
                        <div class="time-title">选择时间</div>
                        <div class="beginTime-div">
                            <el-date-picker
                                v-model="inputOption.beginTime"
                                type="datetime"
                                placeholder="选择开始日期时间"
                                align="right"
                                :picker-options="pickerOptions1">
                            </el-date-picker>
                        </div>
                        <div class="endTime-div">
                            <el-date-picker
                                v-model="inputOption.endTime"
                                type="datetime"
                                placeholder="选择结束日期时间"
                                align="right"
                                :picker-options="pickerOptions2">
                            </el-date-picker>
                        </div>
                        <div class="time_btn-div">
                            <span class="btn_time btn_blue" @click="searchSure">确定</span>
                            <span class="btn_time btn_grey" @click="resetMy">重置</span>
                        </div>
                        <!--:default-time="['00:00:00','23:59:59']"-->
                    </div>
                </div>
            </div>
            <div class="capture_analysis-right">
                <component :is="view"
                           class="capture-map"
                           ref="captureMap"
                           @selected="selectedIds"
                           :inputOption="inputOption"></component>
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
    export default {
        components: {
            Top: () => import("../custody/common/top.vue"),
            Bottom: () => import("../custody/common/bottom.vue"),
            captureMap: () => import("./capture-map.vue"),
            captureList: () => import("./capture-list.vue")
        },
        data() {
            return {
                beginTime: "",//开始时间
                endTime: "",//结束时间
                htmlname: "-抓拍分析",
                isDevice: true,//点位选择标志
                isSelected: false,//已选择标志
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },//树形点位数据
                deviceSelected: [],//已选择的点位数据
                filterText: "",//关键字
                inputOption:{
                    beginTime: null,
                    endTime: null,
                    gbids:""
                },
                momentBegin: "",//开始时刻
                momentEnd: "",//结束时刻
                pickerOptions1: {
                    disabledDate:(date)=>{
                        return moment(date).isAfter(moment());
                    },
                    shortcuts: [
                    {
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
                },//时间插件数据
                pickerOptions2: {
                    disabledDate:(date)=>{
                        return  moment(date).isAfter(moment());
                    }
                },//时间插件数据
                type: "雪亮交通",
                treeData: [
                    /*{
                        ”id”:, “1234564654”
                        ”name”: “ XXX路口”,           //点位名称
                        ”gbid”:“null”,			          //国标ID
	                    “type”:”路口/高架/隧道/大桥”，     //点位类型
                        ”children”:[
                            ”id”:, “1234564654”         //
                            ”name”: “ XXX路口”,		  //点位名称
                            ”gbid”:“15456465456”,		  //国标ID
                            ”children”: null,               //子节点
                            “type”:”路口/高架/隧道/大桥”   //点位类型
                        ]
                    }*/
                ],
                value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
                value5: '',
                // view: "capture-map",
                view: "captureList",
                drawPenActive: false
            }
        },
        watch: {
            //监听关键字的变化
            filterText(val) {
                this.$refs.tree.filter(val)
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.getDeviceTreeData();
        },
        methods: {
            changeTab(params) {
                if (params === "已选择") {
                    this.isDevice = false;
                    this.isSelected = true;
                }
                if (params === "点位选择") {
                    this.isDevice = true;
                    this.isSelected = false;
                }
            },
            //检查树菜单是否包含标签
            checkTreeTag(data) {
                let type = '';
                if (data.hasOwnProperty('type') && data.type && data.type !== "") {
                    switch (data.type) {
                        case '路口':
                            type = '普';
                            break;
                        case '大桥':
                            type = '桥';
                            break;
                        case '隧道':
                            type = '隧';
                            break;
                        case '高架':
                            type = '高';
                            break;
                        default:
                            type = '普';
                    }
                } else {
                    type = '';
                }
                return type;
            },
            //TODO:返回节点标签颜色
            tagColor(node) {
                let color = '';
                if (node.hasOwnProperty('type') && node.type) {
                    switch (node.type) {
                        case '路口':
                            color = 'device-tag-normal';
                            break;
                        case '大桥':
                            color = 'device-tag-bridge';
                            break;
                        case '隧道':
                            color = 'device-tag-tunnel';
                            break;
                        case '高架':
                            color = 'device-tag-trestle';
                            break;
                        default:
                            color = 'device-tag-normal';
                    }
                    color = 'device-tag ' + color;
                } else {
                    color = '';
                }
                return color;
            },
            //检查时间是否正确
            checkTime() {
                if (this.beginTime && this.endTime) {
                    let beginTimeStamp = moment(this.beginTime, "YYYY-MM-DD HH:mm:ss").valueOf();
                    let endTimeStamp = moment(this.endTime, "YYYY-MM-DD HH:mm:ss").valueOf();
                    if (beginTimeStamp <= endTimeStamp) {
                        this.$alert('开始时间必须小于结束时间，请重新选择', '提示消息', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.beginTime = "";
                                this.endTime = "";
                            }
                        })
                    }
                }
            },
            //勾选树形点位
            choseDevice(data) {
                let temp = [];//收集最后一层子节点
                if (this.$refs.tree.getCheckedNodes().length === 0) {
                    this.deviceSelected = [];
                }
                for (let item of this.$refs.tree.getCheckedNodes()) {
                    if (!item.children) {
                        temp.push(item);
                        let index = _.findIndex(this.deviceSelected, item);
                        if (index === -1) {
                            this.deviceSelected.push(item)
                        } else {
                            this.deviceSelected.splice(index, 1);
                            this.deviceSelected.push(item);
                        }
                    }
                }
                for (let item of this.deviceSelected) {
                    let index = _.findIndex(temp, item);
                    if (index === -1) {
                        let hasIndex = _.findIndex(this.deviceSelected, item);
                        this.deviceSelected.splice(hasIndex, 1);
                    }
                }
            },
            //删除我的选择
            deleteMyDevice(params) {
                let index = _.findIndex(this.deviceSelected, params);
                if (index !== -1) {
                    this.deviceSelected.splice(index, 1);
                    this.$refs.tree.setChecked(params, false);
                }
            },
            //过滤关键字
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //重置选择
            resetMy() {
                this.view = "captureMap";
                this.deviceSelected = [];
                this.$refs.tree.setCheckedKeys(this.deviceSelected, false);
                this.beginTime = "";
                this.endTime = "";
            },
            //确定按钮搜索
            searchSure() {
                this.view = "capture-list";
            },
            //时间选择
            timeChange(value5) {
                if (value5.length !== 0) {
                    let momentAry = [];
                    for (let item of value5) {
                        let momentTime = moment(item).format("HH:mm:ss");
                        momentAry.push(momentTime)
                    }
                    this.momentBegin = momentAry[0];
                    this.momentEnd = momentAry[1];
                }
            },
            //TODO:调用地图组建的画笔全选方法
            drawPen() {
                this.drawPenActive = !this.drawPenActive;
                this.$refs["captureMap"].selectByPen();
            },
            //TODO:获取树形结构数据
            getDeviceTreeData() {
                axios.get(conf.api_local + '/tBasDeviceInfo/getDeviceTreeData').then((res) => {
                    let data = res.data;
                    if (data.hasOwnProperty('successFlag') && data.successFlag) {
                        this.treeData = data.data;
                    }
                })
            },
            //TODO:接收地图传来的点位ID
            selectedIds(ids) {
                if (ids && ids.length > 0) {
                    this.$refs.tree.setCheckedKeys(ids);
                    this.choseDevice();
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../../css/traffic/capture-analysis";
</style>
