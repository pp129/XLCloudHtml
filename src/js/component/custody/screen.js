import {screenPageInit} from '../../../js/component/custody/screen-init';
import {websocketService} from '../../../../public/js/WebSocketService';

let axios = require("axios");
let $ = require("jquery");
let queryString = require('querystring');
let moment = require('moment');
export default {
    name: "screen",
    components: {
        sMap: () => import("../../../html/components/custody/screen-map.vue"),
        olMap: () => import("../../../html/components/custody/screen-map2.vue"),
        pLabel: () => import("../../../html/components/personLabel.vue"),
    },
    watch: {},
    data: function () {
        return {
            view: 'olMap',//穿透窗口
            iconMenu: 'icon-menu',//菜单按钮样式，激活或常态
            bottomLink: [{//底部菜单链接框
                name: '共享应用',
                class: 'icon-mainApp',
                link: ''
            }, {
                name: '一机一档',
                class: 'icon-deviceRecord',
                link: ''
            }],
            showLink: false,//是否显示菜单链接框
            healthCareRec: [],//医保动态记录s
            screenPageInit: screenPageInit,
            captureInfoList: [],//动态抓拍信息
            showData: {},
            timer: null
        }
    },
    mounted: function () {
        screenPageInit.init.call(this);
        this.listener();//TODO:监听屏幕点击事件，显示/隐藏-菜单弹窗
        //医保动态记录
        this.HealthUpdateRecord();
        this.getCaptureInfoList();//TODO:获取动态抓拍信息数据
        //TODO:链接WS
        let websocketObj = new websocketService(conf.api + '/websocket/captureInfo', '', '', (data) => {
            //let websocketObj = new websocketService('ws://localhost:8080', '', '', (data) => {
            this.captureInfoList.unshift(data);
            this.createAlarmInfo(data);
        });
        websocketObj.initService();
    },
    destroyed() {
        $('html').removeAttr("style");
    },
    methods: {
        createAlarmInfo(data, index) {
            console.log(data);
            let alarmData = {
                longitude: data.captureDeviceLon,
                latitude: data.captureDeviceLat,
                deviceName: data.captureDeviceName,
                label: data.capturePersonLabel,
                personName: data.capturePersonName,
                idcard: data.capturePersonIdcard,
                time: data.captureTimeStr,
                similarity: data.similarity,
                sceneUrl: data.sceneUrl,
                faceUrl: data.faceUrl,
                capturePersonImgUrl: data.capturePersonImgUrl,
                status: '待确认',
                id: data.captureDeviceId
            };
            this.$refs["olMap"].popDetail(alarmData);
        },
        listener: function () {
            let _this = this;
            document.addEventListener('click', function (event) {
                let className = event.target.className;
                if (className.indexOf('target-menu') < 0) {
                    _this.hideMenu();
                }
            });
            let _height = $(window).height();
            if (_height < 2160) {
                $('html').css({"font-size": '75px'});
            } else {
                $('html').css({"font-size": '150px'});
            }
            setTimeout(function () {
                window.onresize = function () {
                    //console.log($(window).height())
                    let _height = $(window).height();
                    if (_height < 2160) {
                        $('html').css({"font-size": '75px'});
                    } else {
                        $('html').css({"font-size": '150px'});
                    }
                }
            }, 20)
        },
        hideMenu: function () {
            this.iconMenu = 'icon-menu';
            this.showLink = false;
        },
        showMenu: function () {
            this.iconMenu = 'icon-menu-active';
            this.showLink = true;
        },
        //医保动态记录
        HealthUpdateRecord() {
            axios.post(conf.api + "/medicalInsurance/medicalInsuranceRecord").then((response) => {
                if (response.status === 200) {
                    this.healthCareRec = response.data.data;
                }
            }).catch((response) => {
                console.error(response)
            });
        },
        timestampToTime(timestamp) {
            let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ';
            let h = date.getHours() < 10 ? '0' + (date.getHours()) + ':' : date.getHours() + ':';
            let m = date.getMinutes() < 10 ? '0' + (date.getMinutes()) + ':' : date.getMinutes() + ':';
            let s = date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds();
            return Y + M + D + h + m + s;
        },
        getCaptureInfoList: function () {
            let param = {
                page: 1,
                rows: 4
            };
            axios.post(conf.api + "/tBusCaptureInfo/getTBusCaptureInfoList", param).then((res) => {
                let data = res.data;
                if (data.hasOwnProperty('successFlag') && data.successFlag) {
                    this.captureInfoList = data.data.rows;
                    let firstShowData = this.captureInfoList[0];
                    this.showData = {
                        longitude: firstShowData.captureDeviceLon,
                        latitude: firstShowData.captureDeviceLat,
                        deviceName: firstShowData.captureDeviceName,
                        label: firstShowData.capturePersonLabel,
                        personName: firstShowData.capturePersonName,
                        idcard: firstShowData.capturePersonIdcard,
                        time: firstShowData.captureTimeStr,
                        similarity: firstShowData.similarity,
                        sceneUrl: firstShowData.sceneUrl,
                        faceUrl: firstShowData.faceUrl,
                        capturePersonImgUrl: firstShowData.capturePersonImgUrl,
                        status: '待确认',
                        id: firstShowData.captureDeviceId
                    };
                }
            })
        }
    }
}
