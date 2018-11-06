<template>
    <div class="bg">
        <div class="login-left">
            <!--<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 width="340px" height="333px" viewBox="0 0 340 333" enable-background="new 0 0 340 333" xml:space="preserve">

              <path class="path" fill="#0b1d34" stroke="#f5a236" stroke-width="4" stroke-linecap="round" stroke-dasharray="118" stroke-linejoin="null" d="M66.039,133.545c0,0-21-57,18-67s49-4,65,8
                s30,41,53,27s66,4,58,32s-5,44,18,57s22,46,0,45s-54-40-68-16s-40,88-83,48s11-61-11-80s-79-7-70-41
                C46.039,146.545,53.039,128.545,66.039,133.545z"/>

            </svg>
            <div id="gear1"></div>-->
        </div>
        <div class="login-right">
            <div class="title">
                <div class="title-thumb"></div>
                <div class="title-text">
                    <span v-for="item in titleText" :class="item.class">{{item.text}}</span>
                </div>
            </div>
            <div class="login-form">
                <div class="userLogin userLoginShow">
                    <div class="form-label">
                        <input type="text" name="" id="userName" value="" placeholder="账号" class="form-input"
                               v-model="loginInfo.username" v-on:keyup.enter="loginValid"/>
                        <span class="loginPrompt" v-if="loginErr.username.show">{{loginErr.username.msg}}</span>
                    </div>
                    <div class="form-label">
                        <input type="password" name="" id="passWord" value="" placeholder="密码" class="form-input"
                               v-model="loginInfo.password" v-on:keyup.enter="loginValid"/>
                        <span class="loginPrompt" v-if="loginErr.password.show">{{loginErr.password.msg}}</span>
                    </div>
                    <div class="codeDiv">
                        <img :src="codeImgSrc" class="code_img" title="点击刷新" v-on:click="changeImage"/>
                        <input type="text" name="" id="code" value="" placeholder="请输入验证码" class="form-input-code"
                               v-model="loginInfo.code" v-on:keyup.enter="loginValid"/>
                        <span class="loginPrompt" v-if="loginErr.code.show">{{loginErr.code.msg}}</span>
                    </div>
                </div>
                <div class="ukey">
                    <canvas id="nodes" width="400" height="400"></canvas>
                    <div class="ukeyLogin" @click="loginValid">
                        <img src="../../../images/login/icon_user.png" class="icon_ukey"/>
                        <p class="ukey_text">登录</p>
                    </div>
                </div>
            </div>
            <div class="login-right-footer">
                <p class="login-support">
                    技术支持：<img src="" alt="" class="ropeok-login">罗普特（厦门）科技集团有限公司 推荐使用1366x768以上分辨率
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import {Nodes} from '../../../js/component/login/nodes';//TODO:引入登陆按钮动画效果js
    let axios = require('axios');
    let querystring = require('querystring');
    let $ = require('jquery');
    export default {
        name: "login",
        data() {
            return {
                titleText: [{
                    text: '雪',
                    class: 'loginTitle loginText1'
                }, {
                    text: '亮',
                    class: 'loginTitle loginText2'
                }, {
                    text: '云',
                    class: 'loginTitle loginText3'
                }, {
                    text: '平',
                    class: 'loginTitle loginText4'
                }, {
                    text: '台',
                    class: 'loginTitle loginText5'
                }],
                codeImgSrc: 'login/verifyCode.do?text=' + (new Date()).getTime(),
                loginErr: {
                    username: {
                        show: false,
                        msg: '',
                        title: '用户名'
                    },
                    password: {
                        show: false,
                        msg: '',
                        title: '密码'
                    },
                    code: {
                        show: false,
                        msg: '',
                        title: '验证码'
                    }
                },
                loginInfo: {
                    username: null,
                    password: null,
                    //code: null
                }
            }
        },
        mounted: function () {
            Nodes.init();
        },
        methods: {
            changeImage() {
                this.codeImgSrc = 'login/verifyCode.do?text=' + (new Date()).getTime();
            },
            loginValid() {
                let loginInfo = this.loginInfo;
                let ifValid = 0;
                for (let i in loginInfo) {
                    if (!loginInfo[i]) {
                        this.loginErr[i].show = true;
                        this.loginErr[i].msg = '请填写' + this.loginErr[i].title;
                        ifValid++;
                    } else {
                        this.loginErr[i].show = false;
                        this.loginErr[i].msg = '';
                    }
                }
                if (ifValid <= 0) {
                    this.loginSubmit();
                }
            },
            loginSubmit() {
                axios.post(conf.api + '/login/loginin', querystring.stringify({
                    userName: this.loginInfo.username,
                    password: this.loginInfo.password
                })).then((res) => {
                    let data = res.data;
                    if (data.hasOwnProperty('successFlag') && data.successFlag) {
                        console.log('登录成功');
                        this.loginErr.password.show = false;
                        this.loginErr.password.msg = '';
                    } else {
                        this.loginErr.password.show = true;
                        this.loginErr.password.msg = '帐号或密码错误';
                    }
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../../css/login.less";
</style>
