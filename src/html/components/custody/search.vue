<template>
    <div>
        <top htmlname="数据分析" type="雪亮监护"></top>
        <div id="main">
            <div id="search-box">
                <div id="search-div">
                    <input type="text" :placeholder="placeholder" id="search-input" v-model="key" @keyup.enter="search"/>
                    <!--<span class="shape_pic"></span>-->
                    <span id="search-btn" @click="search">搜索</span>
                </div>
                <div class="more-search-wrapper">
                    <more-search @change="moreSearchChange"></more-search>
                </div>

            </div>
        </div>
        <bottom></bottom>
    </div>
</template>

<script>
    let moment = require("moment");
    let axios = require("axios");
    let _ = require("lodash");
    let session = require("../../../js/util/storageUtil.js");
//    let search = require("../../../js/component/custody/search");
    export default {
        data() {
            return {
                data:null,
                key:"",
                total:""
            };
        },
        components:{
            MoreSearch:()=>import("./common/moreSearch.vue"),
            Top:()=>import("./common/top.vue"),
            Bottom:()=>import("./common/bottom.vue"),
        },
        watch: {

        },
        created: function () {

        },
        mounted: function () {
            this.getTotal();
        },
        computed: {
            placeholder(){
                return `输入姓名/身份证搜索，共${this.total || 0}名`
            }
        },
        methods: {
            moreSearchChange(data){
                this.data = data;
            },
            search(){
                session.setLocalStorage('inputData',this.data);
                localStorage.setItem('keyword',this.key);
                this.$router.push("/custody/search-result");
            },
            getTotal(){
                axios.get(conf.api + "/labelPsychosisCount/areaLabelPsyCount").then((response)=>{
                    if (response.data.errorCode === 200){
                        for(let key in response.data.data){
                            if (key === "总数量"){
                                this.total = response.data.data[key];
                            }
                        }
                    }
                })
            }
        }

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../../css/custody/search.less";

</style>
