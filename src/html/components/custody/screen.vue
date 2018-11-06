<template>
    <div class="screen-page">
        <div class="part-first">
            <div class="column">
                <div class="row">
                    <div class="board">
                        <div class="board-title">各区精神病标签人员数量</div>
                        <div class="board-content">
                            <div class="chart" id="pieChart"></div>
                        </div>
                    </div>
                    <div class="board">
                        <div class="board-title">全市每天抓拍人数与次数变化趋势</div>
                        <div class="board-content">
                            <div class="chart" id="lineChart"></div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="board">
                        <div class="board-title">精神病标签人员活跃度排序TOP10</div>
                        <div class="horizontal-bar-chart">
                            <div class="chart-top-btn">
                                <a class="active" id="weekBarBtn"
                                   @click="screenPageInit.updateHorizontalBarRangeBtn('本周', 'weekBarBtn')">周</a>
                                <a id="monthBarBtn"
                                   @click="screenPageInit.updateHorizontalBarRangeBtn('本月', 'monthBarBtn')">月</a>
                                <a id="yearBarBtn"
                                   @click="screenPageInit.updateHorizontalBarRangeBtn('半年', 'yearBarBtn')">年</a>
                            </div>
                            <div class="chart" id="horizontalBarChart"></div>
                            <div class="chart-bottom-btn">
                                <a class="active" id="pointBarBtn"
                                   @click="screenPageInit.updateHorizontalBarTypeBtn('点位', 'pointBarBtn')">点位</a>
                                <a id="dateBarBtn"
                                   @click="screenPageInit.updateHorizontalBarTypeBtn('天数', 'dateBarBtn')">天数</a>
                                <a id="countBarBtn"
                                   @click="screenPageInit.updateHorizontalBarTypeBtn('次数', 'countBarBtn')">次数</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="row">
                    <div class="board">
                        <div class="board-title">各区每月抓拍人数</div>
                        <div class="board-content">
                            <div class="chart" id="gradientBarChart"></div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="board">
                        <div class="board-title">从未出现与首次出现数量每月变化趋势</div>
                        <div class="board-content">
                            <div class="chart" id="areaLineChart"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="part-second">
            <!--<object data="./screen-map.html">
                &lt;!&ndash;
                    提示
                    <embed src="screen-map.html"> </embed>
                    Error: Embedded data could not be displayed.
                 &ndash;&gt;
            </object>-->
            <component :is="view" :attrs="showData" ref="olMap" >
                <!-- 组件在 vm.currentview 变化时改变！ -->
            </component>
        </div>
        <div class="part-third">
            <div class="column">
                <div class="board">
                    <div class="board-title">动态抓拍信息</div>
                    <div class="board-content">
                        <div class="capture-list">
                            <div class="capture" v-for="(item,index) in captureInfoList" @click="createAlarmInfo(item,index)">
                                <div class="picture">
                                    <img :src="item.capturePersonImgUrl">
                                </div>
                                <div class="info">
                                    <div class="row">
                                        <div class="label">姓名</div>
                                        :
                                        <div class="text">{{item.capturePersonName}}</div>
                                    </div>
                                    <div class="row">
                                        <div class="label">标签</div>
                                        :
                                        <!--<div class="text"><b>{{ item.capturePersonLabel}}</b></div>-->
                                        <p-label class="label-content"
                                                 v-bind:labels="item.capturePersonLabel"></p-label>
                                    </div>
                                    <div class="row">
                                        <div class="label">身份证</div>
                                        :
                                        <div class="text"><i>{{item.capturePersonIdcard}}</i></div>
                                    </div>
                                    <div class="row">
                                        <div class="label">抓拍时间</div>
                                        :
                                        <div class="text">{{item.captureTimeStr}}</div>
                                    </div>
                                    <div class="row">
                                        <div class="label">抓拍地点</div>
                                        :
                                        <div class="text">{{item.captureDeviceName}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="board">
                    <div class="board-title">医保</div>
                    <div class="board-content">
                        <div class="diagram-grid-board">
                            <div class="diagram-grid">
                                <div class="diagram-grid-title">医保每月人次统计</div>
                                <div class="diagram-grid-content">
                                    <div class="chart" id="healthBarChart" style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;"></div>
                                </div>
                            </div>
                            <div class="diagram-grid diagram-grid-last">
                                <div class="diagram-grid-title">医保动态纪录</div>
                                <div class="diagram-grid-content">
                                    <div class="grid-list">
                                        <ul class="row" v-for="(item,index) in healthCareRec">
                                            <li>
                                                {{item.NAME}}
                                            </li>
                                            <li>
                                            </li>
                                            <li>
                                                医保缴交
                                            </li>
                                            <li class="date-time">
                                                {{timestampToTime(item.MEDICINE_TIME)}}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="board">
                    <div class="board-title">警情</div>
                    <div class="board-content">
                        <div class="diagram-grid-board">
                            <div class="diagram-grid">
                                <div class="diagram-grid-title">警情趋势</div>
                                <div class="diagram-grid-content">
                                    <div class="chart" id="policeBarChart" style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;"></div>
                                </div>
                            </div>
                            <div class="diagram-grid diagram-grid-last">
                                <div class="diagram-grid-title">警情动态记录</div>
                                <div class="diagram-grid-content">
                                    <div class="grid-list">
                                        <!--<ul class="row">-->
                                            <!--<li>-->
                                                <!--马鑫-->
                                            <!--</li>-->
                                            <!--<li class="long">-->
                                                <!--在XX小区伤人-->
                                            <!--</li>-->
                                            <!--<li class="date-time">-->
                                                <!--2018-10-16 12:52:12-->
                                            <!--</li>-->
                                        <!--</ul>-->
                                        <!--<ul class="row">-->
                                            <!--<li>-->
                                                <!--某某人-->
                                            <!--</li>-->
                                            <!--<li class="long">-->
                                                <!--在XX小区伤人-->
                                            <!--</li>-->
                                            <!--<li class="date-time">-->
                                                <!--2018-10-16 12:52:12-->
                                            <!--</li>-->
                                        <!--</ul>-->
                                        <!--<ul class="row">-->
                                            <!--<li>-->
                                                <!--马鑫-->
                                            <!--</li>-->
                                            <!--<li class="long">-->
                                                <!--在XX小区伤人-->
                                            <!--</li>-->
                                            <!--<li class="date-time">-->
                                                <!--2018-10-16 12:52:12-->
                                            <!--</li>-->
                                        <!--</ul>-->
                                        <!--<ul class="row">-->
                                            <!--<li>-->
                                                <!--马鑫-->
                                            <!--</li>-->
                                            <!--<li class="long">-->
                                                <!--在XX小区伤人-->
                                            <!--</li>-->
                                            <!--<li class="date-time">-->
                                                <!--2018-10-16 12:52:12-->
                                            <!--</li>-->
                                        <!--</ul>-->
                                        <!--<ul class="row">-->
                                            <!--<li>-->
                                                <!--马鑫-->
                                            <!--</li>-->
                                            <!--<li class="long">-->
                                                <!--在XX小区伤人-->
                                            <!--</li>-->
                                            <!--<li class="date-time">-->
                                                <!--2018-10-16 12:52:12-->
                                            <!--</li>-->
                                        <!--</ul>-->
                                        <!--<ul class="row">-->
                                            <!--<li>-->
                                                <!--马鑫-->
                                            <!--</li>-->
                                            <!--<li class="long">-->
                                                <!--在XX小区伤人-->
                                            <!--</li>-->
                                            <!--<li class="date-time">-->
                                                <!--2018-10-16 12:52:12-->
                                            <!--</li>-->
                                        <!--</ul>-->
                                        <!--<ul class="row">-->
                                            <!--<li>-->
                                                <!--马鑫-->
                                            <!--</li>-->
                                            <!--<li class="long">-->
                                                <!--在XX小区伤人-->
                                            <!--</li>-->
                                            <!--<li class="date-time">-->
                                                <!--2018-10-16 12:52:12-->
                                            <!--</li>-->
                                        <!--</ul>-->
                                        <!--<ul class="row">-->
                                            <!--<li>-->
                                                <!--马鑫-->
                                            <!--</li>-->
                                            <!--<li class="long">-->
                                                <!--在XX小区伤人-->
                                            <!--</li>-->
                                            <!--<li class="date-time">-->
                                                <!--2018-10-16 12:52:12-->
                                            <!--</li>-->
                                        <!--</ul>-->
                                        <!--<ul class="row">-->
                                            <!--<li>-->
                                                <!--马鑫-->
                                            <!--</li>-->
                                            <!--<li class="long">-->
                                                <!--在XX小区伤人-->
                                            <!--</li>-->
                                            <!--<li class="date-time">-->
                                                <!--2018-10-16 12:52:12-->
                                            <!--</li>-->
                                        <!--</ul>-->
                                    </div>
                                </div>
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

<script src="../../../js/component/custody/screen.js"></script>

<style lang="less">
    @import "../../../css/custody/screen.less";
</style>

