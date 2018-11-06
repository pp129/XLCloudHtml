/**
 * Created by lin on 2017/4/17.
 */
import 'element-ui/lib/theme-chalk/index.css';
import '../css/public.less';

let _ = require("lodash");
import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
let storageUtil = require("./util/storageUtil");
let querystring = require("querystring");//解析参数的库
let url = require("url");
let router = require("../config/router-map");
Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {

    },
    mutations: {

    }
});
new Vue({
    store,
    router:new VueRouter(
        {
            routes:router
        }
    ),
    el:"#app",
    data () {
        return {

        };
    },
    computed:{

    },
    watch: {

    },
    created(){

    },
    mounted:function () {
    },
    methods:{

    },

});
