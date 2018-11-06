<template>
    <div class="screen-page">
        <div class="part-first">
            <div class="long">
                <div class="board">
                    <div class="board-title">交警警情事件感知</div>
                    <div class="board-content">
                        <div class="big">
                            <div class="chart" id="industryTrendsChart"></div>
                        </div>
                        <div class="small">
                            <div class="chart" id="eventCategoryChart"></div>
                        </div>
                    </div>
                </div>
                <div class="board">
                    <div class="board-title">各区布控点位数量及其每月违章抓拍情况</div>
                    <div class="board-content">
                        <div class="big">
                            <div class="chart" id="illegalCaptureChart"></div>
                        </div>
                        <div class="small">
                            <div class="chart" id="alarmTrendsChart"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="board">
                    <div class="board-title">全市每天平均每个点位抓拍告警趋势分析</div>
                    <div class="board-content">
                        <div class="chart" id="trendAnalysisChart"></div>
                    </div>
                </div>
                <div class="board">
                    <div class="board-title">全市告警点位排名</div>
                    <div class="horizontal-bar-chart">
                        <div class="chart-top-btn">
                            <a v-for="(item,index)  in horizontalBarChartStartTimeList"
                               :class="{'active': item.id === nowBeginTimeId}"
                               @click="updateTrendAnalysisChartWithTime(item ,index)">{{item.name}}</a>
                        </div>
                        <div class="chart" id="horizontalBarChart"></div>
                        <div class="chart-bottom-btn">
                            <a v-for="(item,index) in horizontalBarChartTypeList"
                               :class="{'active': item.id === horizontalBarChartType}"
                               @click="updateTrendAnalysisChartWithType(item ,index)">{{item.name}}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="part-second">
            <component :is="view" ref="sMap" @reloadCapture="getLastAlarmInfoList">
                <!-- 组件在 vm.currentview 变化时改变！ -->
            </component>
        </div>
        <div class="part-third">
            <div class="column">
                <div class="board">
                    <div class="board-title">告警抓拍</div>
                    <div class="board-content">
                        <div class="capture-list">
                            <div class="capture" v-for="item in lastAlarmInfoList" @click="showPop(item)">
                                <div class="picture">
                                    <img :src="item.sceneUrl">
                                </div>
                                <div class="info">
                                    <div class="row">
                                        <div class="label">类别</div>
                                        :
                                        <div class="text">{{item.type}}</div>
                                    </div>
                                    <div class="row">
                                        <div class="label">告警类别</div>
                                        :
                                        <div class="text"><b>{{item.alarmType}}</b></div>
                                    </div>
                                    <div class="row">
                                        <div class="label">抓拍时间</div>
                                        :
                                        <div class="text">{{item.captureTime}}</div>
                                    </div>
                                    <div class="row">
                                        <div class="label">抓拍地点</div>
                                        :
                                        <div class="text">{{item.deviceName}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="board">
                    <div class="board-title">当月违章点位排名前四视频</div>
                    <div class="board-image-content">
                        <div class="image-list">
                            <div class="image">
                                <img src="">
                            </div>
                            <div class="image">
                                <img src="">
                            </div>
                            <div class="image">
                                <img src="">
                            </div>
                            <div class="image">
                                <img src="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部菜单栏 -->
        <div class="part-bottom">
            <div class="bottom-menu target-menu" @click="showMenu">
                <i :class="iconMenu" class="target-menu"></i>
            </div>
            <div class="bottom-links target-menu" v-if="showLink">
                <a v-for="item in bottomLink" href="javascript:void(0)" class="link-icon target-menu"
                   :class="item.class">{{item.name}}</a>
            </div>
        </div>
    </div>
</template>

<script src="../../../js/component/traffic/screen.js"></script>

<style lang="less">
    @import "../../../css/traffic/screen.less";
</style>
