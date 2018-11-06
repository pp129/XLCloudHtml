<template>
    <div>
        <div>
            <!-- 地图底层 -->
            <div id="showmap" class="usermap"></div>
            <!-- 标题 -->
            <div class="title-image upper-panel"></div>
            <!-- 时间显示 -->
            <div class="datetime upper-panel">
                <h3 class="datetime-time"></h3>
                <p class="datetime-date"></p>
            </div>
            <!-- 数据展示 -->
            <div class="data-board upper-panel">
                <div class="data-items">
                    <p class="data-text">总人数</p>
                    <div class="data-number"><span>24,463,497</span></div>
                </div>
                <div class="data-items">
                    <p class="data-text">抓拍人数</p>
                    <div class="data-number"><span>325,692</span></div>
                </div>
                <div class="data-items">
                    <p class="data-text">抓拍次数</p>
                    <div class="data-number"><span>325,692</span></div>
                </div>
                <div class="data-items">
                    <p class="data-text">今日人数</p>
                    <div class="data-number"><span>231,586</span></div>
                </div>
                <div class="data-items">
                    <p class="data-text">今日次数</p>
                    <div class="data-number"><span>321,531</span></div>
                </div>
                <div class="data-items">
                    <p class="data-text">从未出现人数</p>
                    <div class="data-number"><span>5,698</span></div>
                </div>
            </div>
            <!-- 地图模式开关 -->
            <div class="map-state-switch upper-panel">
                <el-switch
                    v-model="valueActive"
                    @change="changeActive"
                    active-color="#13ce66"
                    inactive-text="活动热力图"
                    inactive-color="#194998">
                </el-switch>
                <el-switch
                    v-model="valueAddress"
                    @change="changeAddress"
                    active-color="#13ce66"
                    inactive-text="活动热力图"
                    inactive-color="#194998">
                </el-switch>
            </div>
            <!-- 热力图例 -->
            <div class="heat-map-legend upper-panel"></div>
            <!-- 底部操作栏 -->
            <div class="bottom-line">
                <div class="bottom-link">
                    <i class="link-icon icon-deviceRecord"></i>
                    <a href="#" class="link-text">一机一挡</a>
                </div>
                <div class="bottom-link">
                    <i class="link-icon icon-mainApp"></i>
                    <a href="#" class="link-text">共享应用</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                valueActive: false,
                valueAddress: false,
                dateTimer: null,
                alarmData: alarmData,
                showRealAlarmObject: {
                    devceName: '',
                    alarmCount: 0
                },
                deviceDataObject: {
                    camerInfoMap: null
                }
            };
        },
        watch: {},
        created: function () {

        },
        mounted: function () {
            InitMapGisApp();
            this.initDatetime();
            this.loadDeviceData('');
        },
        computed: {},
        methods: {
            changeActive: function () {
                MapGisApp.toogleHeatMapAndAlarm(this.valueActive);
            },
            changeAddress: function () {
                console.log(this.valueAddress);
            },
            initDatetime: function () {
                clearTimeout(this.dateTimer);
                var dt = new Date();
                var y = dt.getFullYear();
                var mm = dt.getMonth() + 1;
                (mm < 10) ? mm = '0' + mm : mm;
                var d = dt.getDate();
                (d < 10) ? d = '0' + d : d;
                var h = dt.getHours();
                (h < 10) ? h = '0' + h : h;
                var m = dt.getMinutes();
                (m < 10) ? m = '0' + m : m;
                var time = h + ':' + m;
                var date = y + '-' + mm + '-' + d;
                $(".datetime-time").html(time);
                $(".datetime-date").html(date);
                this.dateTimer = setTimeout(this.initDatetime, 1000)
            },
            // 循环显示数据到摄像头
            useDeviceInfosDataToMap: function (deviceInfos) {
                if (!deviceInfos) {
                    return;
                }
                for (var index = 0; index < deviceInfos.length; index++) {
                    var deviceInfo = deviceInfos[index];
                    //console.log(deviceInfo);
                    //this.showRealAlarmObject.devceName[deviceInfo.Id] = deviceInfo.Name;
                    //this.showRealAlarmObject.alarmCount[deviceInfo.Id] = deviceInfo.count;

                    this.deviceDataObject.camerInfoMap[deviceInfo.Id] = deviceInfo;
                    this.useDeviceInfoDataToMap(deviceInfo);
                }
            },
            useDeviceInfoDataToMap: function (deviceInfo) {
                if (deviceInfo && !deviceInfo.latitude || deviceInfo && !deviceInfo.longitude) {
                    return;
                }
                if (!deviceInfo.count) {
                    deviceInfo.count = 0;
                } else {
                    deviceInfo.count = parseInt(deviceInfo.count);
                }
                addDeviceCluster(deviceInfo);
            },
            loadDeviceData: function (taskId) {
                this.deviceDataObject.currentTask = taskId;
                clearDeviceMap();
                this.deviceDataObject.curPage = 20;
                this.deviceDataObject.singleRows = 300;
                this.deviceDataObject.totalRow = 50;
                this.deviceDataObject.taskId = taskId;
                this.deviceDataObject.camerInfoMap = [];
                // 清空选中摄像头
                this.deviceDataObject.deviceIds = "";
                // 清空门禁
                this.deviceDataObject.doorIds = "";
                // 清空选中点样式
                clearSelectFeature();
                this.useDeviceInfosDataToMap(this.alarmData);
            }
        }

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
