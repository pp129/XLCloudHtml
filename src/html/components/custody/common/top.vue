<template>
    <header>
        <div id="head-title-div">
            <div id="left-title">
                <span style="font-size: 20px;">{{type}}</span>
                <span style="font-size: 16px;">{{htmlname}}</span>
            </div>
        </div>
        <div id="right-title">
            <img src="../../../../images/custody/police.png" style="float: left;margin-top: 15px;"/>
            <span style="margin-left: 5px;">管理员</span><span class="menu_down"></span>
            <span style="margin-left: 20px;">关于</span>
        </div>
    </header>
</template>

<script>
    let axios = require("axios");
    export default {
        props:["type","htmlname"],
        data() {
            return {

            };
        },
        watch: {

        },
        created: function () {

        },
        mounted: function () {

        },
        computed: {

        },
        methods: {

        }

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../../../css/top.less";

</style>
