<template>
    <!--<div class="cms-content-inner background-gray index">-->
        <!--&lt;!&ndash;z&ndash;&gt;-->
    <!--</div>-->
    <div id="index_bg">
        <header>
            <div id="logo-div">
                <div id="logo"></div>
                <div id="my-box" @mouseenter="myMenushow()" @mouseleave="myMenuhide()">
                    <img src="../../images/custody/index_my.png" />
                    <div id="my-div"  v-show="menuShow" @mouseenter="stayMenu()" @mouseleave="outMenu()">
                        <img src="../../images/custody/shape_border.png"/>
                        <div id="my-content">
                            <div class="myContent_row" :class="{'selected_show':enterChangePwd}" @mouseenter="enterDetail(1)" @mouseleave="enterDetail(1)">
                                <span class="myContent_line"></span>
                                <img src="../../images/custody/shape_aite.png"/>
                                <span>修改密码</span>
                            </div>
                            <div class="myContent_row" :class="{'selected_show':enterExit}" @mouseenter="enterDetail(2)" @mouseleave="enterDetail(2)">
                                <span class="myContent_line"></span>
                                <img src="../../images/custody/shape_lock.png"/>
                                <span>退出</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="about-box">
                    <img src="../../images/custody/about.png" />
                </div>
            </div>
            <div id="index_title">
                <img src="../../images/custody/index_title.png"  />
            </div>
        </header>
        <div id="index_main">
            <div id="box-div">
                <div class="xl_box">
                    <div class="xl_title">雪亮监护</div>
                    <div class="xl_div">
                        <div class="school_same" @click="goto('/#/custody/screen')">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/analysis_vis.png" />
                                    </div>
                                    <span>可视化决策分析</span>
                                </div>

                            </div>
                        </div>
                        <div class="school_same noFuntion">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/personRecord.png" />
                                    </div>
                                    <span>一人一档</span>
                                </div>
                            </div>
                        </div>
                        <div class="school_same" >
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/index_1.png" />
                                    </div>
                                    <span>抓拍分析</span>
                                </div>
                            </div>
                        </div>
                        <div class="school_same" @click="goto('/#/custody/search')">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/index_2.png" />
                                    </div>
                                    <span>人员搜索</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="xl_box">
                    <div class="xl_title">雪亮交通</div>
                    <div class="xl_div">
                        <div class="traffic_same" @click="goto('/#/traffic/screen')">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/traffic_1.png"/>
                                    </div>
                                    <span>可视化决策分析</span>
                                </div>
                            </div>
                        </div>
                        <div class="traffic_same"  @click="goto('/#/traffic/warning-analysis')">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/traffic_2.png"/>
                                    </div>
                                    <span>警情分析</span>
                                </div>
                            </div>
                        </div>
                        <div class="traffic_same"  @click="goto('/#/traffic/capture-analysis')">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/traffic_3.png"/>
                                    </div>
                                    <span>抓拍分析</span>
                                </div>
                            </div>
                        </div>
                        <div class="traffic_same">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/traffic_4.png"/>
                                    </div>
                                    <span>摄像机管理</span>
                                </div>
                            </div>
                        </div>
                        <div class="traffic_same" @click="goto('/#/traffic/device-analysis/35020300000012')">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/index_3.png"/>
                                    </div>
                                    <span>点位分析</span>
                                </div>
                            </div>
                        </div>
                        <div class="traffic_same noFuntion">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/traffic_6.png" style="width: 66px;height: 54px;"/>
                                    </div>
                                    <span>以图搜图</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="xl_box">
                    <div class="xl_title">雪亮校园</div>
                    <div class="xl_div">
                        <div class="school_same noFuntion">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/school_1.png"/>
                                    </div>
                                    <span>可视化决策分析</span>
                                </div>
                            </div>
                        </div>
                        <div class="school_same noFuntion">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/school_2.png"/>
                                    </div>
                                    <span>抓拍分析</span>
                                </div>
                            </div>
                        </div>
                        <div class="school_same noFuntion">
                            <div class="content-div">
                               <div>
                                   <div>
                                       <img src="../../images/custody/school_3.png"/>
                                   </div>
                                   <span>一校一档</span>
                               </div>
                            </div>
                        </div>
                        <div class="school_same noFuntion">
                            <div class="content-div">
                                <div>
                                    <div>
                                        <img src="../../images/custody/school_4.png"/>
                                    </div>
                                    <span>一人一档</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="xl_box">
                    <div class="xl_title">雪亮社区</div>
                    <div class="xl_div noFuntion" style="padding: 10px 10px;box-sizing: border-box;">
                        <div class="content-div" style="top: 25%;">
                            <div style="padding-top: 122px;">
                                <div>
                                    <img src="../../images/custody/index_4.png"/>
                                </div>
                                <span>社区网络三维</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="foot">
                <p>
                    技术支持：<span style="color: rgb(231,26,33);font-size: 16px;">ROPEOK</span>罗普特（厦门）科技集团有限公司
                </p>
                <p>
                    推荐使用1366✖768以上分辨率
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                enterChangePwd:false,
                enterExit:false,
                menuShow:false,
                current:false,
            };
        },
        watch: {

        },
        created: function () {

        },
        mounted: function () {
            console.log(conf);
        },
        computed: {

        },
        methods: {
            goto(url){
                window.open(url);
            },
            enterDetail(params){
                if(params === 1){
                    this.enterChangePwd = !this.enterChangePwd;
                }
                if (params === 2){
                    this.enterExit  = !this.enterExit;
                }

            },
            //鼠标移动显示对应菜单
            myMenushow(){
                this.menuShow = true;
            },
            //鼠标移除隐藏菜单
            myMenuhide(){
                setTimeout(()=>{
                    if (this.current === false){
                        this.menuShow = false;
                    }else{
                        this.menuShow = true;
                    }
                },3000)
            },
            stayMenu(){
                console.log(222)
                this.current = true;
                this.menuShow = true;
            },
            outMenu(){
                this.current = false;
                // this.menuShow = false;
            },
        }

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../css/index";
</style>
