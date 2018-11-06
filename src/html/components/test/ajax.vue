<template>
    <div>
        <ul>

        </ul>
    </div>
</template>

<script>
    let axios = require("axios");
    let $ = require("jquery");
    export default {
        data() {
            return {};
        },
        watch: {},
        created: function () {

        },
        mounted: function () {
//            axios.post("/api3/tBasPsyosisInfo/checkFaceIdExists","faceId=1",{
//                "Content-Type" : "application/x-www-form-urlencoded"
//            }).then((data)=>{
//                console.log(data)
//            });
            axios.get(conf.api_local + "/alarmInfo/getAlarmInfoStatisticsByYear").then((data)=>{
                console.log(data)
            });
//            axios.post(conf.api + "/tBasPsyosisInfo/getFamilyRelationship",{idCard:"1"},{
//                "Content-Type" : "application/x-www-form-urlencoded"
//            }).then((data)=>{
//                console.log(data)
//            });
//             axios.post("/api3/tBasPsyosisInfo/getFamilyRelationship",{idCard:"1"}).then((data)=>{
//                 console.log(data)
//             });
//            axios.post("/api/route",{idCard:"1"}).then((data)=>{
//                console.log(data)
//            });
//            axios.post("/api3/tBasPsyosisInfo/getFamilyRelationship",{idCard:"1"},{
//                "Content-Type" : "application/json"
//            }).then((data)=>{
//                console.log(data)
//            });
//            axios.post("/api3/tBasPsyosisInfo/getFamilyRelationship?idCard=1").then((data)=>{
//                console.log(data)
//            });
//            axios.post(conf.api + "/tBasPsyosisInfo/getFamilyRelationship","idCard=1").then((data)=>{
//                console.log(data)
//            });
//            axios.post(conf.api + "/tBasPsyosisInfo/getFamilyRelationship",{idCard:1}).then((data)=>{
//                console.log(data)
//            });
//            $.ajax({
//                url: conf.api + "/tBasPsyosisInfo/getFamilyRelationship",
//                data: {
//                    idCard: "1"
//                },
//                type:"POST",
//                "contentType": "application/x-www-form-urlencoded",
//                success:function (data) {
//                    console.log(data)
//                }
//            })
//            $.ajax({
//                url: conf.api + "/tBasPsyosisInfo/getFamilyRelationship",
//                data: {
//                    idCard: "1"
//                },
//                type:"POST",
//                "contentType": "application/json",
//                success:function (data) {
//                    console.log(data)
//                }
//            })
        },
        computed: {},
        methods: {}

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    /*@import "";*/
</style>
