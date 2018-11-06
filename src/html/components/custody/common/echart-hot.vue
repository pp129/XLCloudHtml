<template>
    <div class="cms-content-inner background-gray index">
       <div id="main" style="width: 1320px;height: 405px;"></div>
    </div>
</template>

<script>
    let moment = require("moment");
    export default {
        props:['yList','heatMapList'],
        data() {
            return {
            };
        },
        watch: {
            "heatMapList":"init"
        },
        created: function () {

        },
        mounted: function () {
            this.init();
        },
        computed: {

        },
        methods: {
            init(){
                if(!this.heatMapList){
                    return false;
                }else{
                    let option;
                    let mylineStyle={
                        color:"rgb(227,227,227)",               //颜色，'rgb(128, 128, 128)'，'rgba(128, 128, 128, 0.5)'，支持线性渐变，径向渐变，纹理填充
                        type:"solid",               //坐标轴线线的类型，solid，dashed，dotted
                        width:2, //坐标轴线线宽
                        opacity:1,                  //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形
                    };
                    let min = 0;
                    let max = 0;
                    let rangeAry = [];
                    //获取最大值和最小值
                    for (let item of this.heatMapList){
                        rangeAry.push(item[2]);
                    }
                    rangeAry.sort((a,b)=>{
                        return a-b;
                    });
                    if(rangeAry.length !== 0){
                        min = rangeAry[0];
                        max = rangeAry[rangeAry.length-1];
                    }

                    var hours = ['00点','01点','02点','03点','04点','05点','06点','07点','08点','09点','10点','11点','12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点',];
//                    var place = ['小区东大门出口_1','小区停车场入口_2','小区东大门入口_2','小区停车场东','小区东大门入口_1'];
                    var place = this.yList;
//                    var data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,38],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2]];
                    var data = this.heatMapList;
                    data = data.map(function (item) {
                        return [item[1], item[0], item[2] || '-'];
                    });
                    option = {
                        tooltip: {
                            position: 'top',
                            formatter:function (params) {
                                return params.value[1] + '：' + params.value[2] + '次';
                            }
                        },
                        animation: false,
                        grid: {
                            height: '60%',
                            width:"70%",
                            left:"22%",
                            // y: '20%'
                        },
                        xAxis: {
                            type: 'category',
                            data: hours,
                            name:"时间",
                            splitArea: {
                                show: true,
                                areaStyle:{
                                    color:['rgba(255,255,255,0.3)','rgba(247,247,247,0.3)']
                                }
                            },
                            splitLine:{                 //坐标轴在 grid 区域中的分隔线。
                                show:true,              //是否显示分隔线。默认数值轴显示，类目轴不显示。
                                lineStyle:{
                                    type:"dashed"
                                }
                            },
                            axisLine:{                 //坐标 轴线
                                show:true,             //是否显示坐标轴轴线
                                lineStyle:mylineStyle
                            },
                            axisTick :{                 //坐标轴刻度相关设置
                                show:false,              //是否显示坐标轴刻度。
                            },
                            axisLabel:{
                                show:true,              //是否显示interval:"auto",        //坐标轴刻度标签的显示间隔，在类目轴中有效。默认会采用标签不重叠的策略间隔显示标签。可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推
                                inside:false,           //刻度标签是否朝内，默认朝外
                                rotate:0,               //刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。旋转的角度从 -90 度到 90 度
                                textStyle:{
                                    color:"black"
                                }
                            }
                        },
                        yAxis: {
                            type: 'category',
                            data: place,
                            name:"点位",
                            splitArea: {
                                show: true,
                                areaStyle:{
                                    color:['rgb(247,247,247)','rgb(255,255,255)']
                                }
                            },
                            splitLine:{                 //坐标轴在 grid 区域中的分隔线。
                                show:true,              //是否显示分隔线。默认数值轴显示，类目轴不显示。interval:"auto",        //坐标轴分隔线的显示间隔，在类目轴中有效。默认会采用标签不重叠的策略间隔显示标签。可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，可以用数值表示间隔的数据，也可以通过回调函数控制。回调函数格式如下：
                                lineStyle:{
                                    type:"dashed"
                                }
                            },
                            axisLine:{                 //坐标 轴线
                                show:true,             //是否显示坐标轴轴线
                                lineStyle:mylineStyle
                            },
                            axisTick :{                 //坐标轴刻度相关设置
                                show:false,              //是否显示坐标轴刻度。
                            },
                            axisLabel:{
                                show:true,              //是否显示interval:"auto",        //坐标轴刻度标签的显示间隔，在类目轴中有效。默认会采用标签不重叠的策略间隔显示标签。可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推
                                inside:false,           //刻度标签是否朝内，默认朝外
                                rotate:0,               //刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠。旋转的角度从 -90 度到 90 度
                                textStyle:{
                                    color:"black"
                                }
                            }
                        },
                        visualMap: {
                            min: min,//min
                            max: max,//max
                            calculable: true,
                            orient: 'horizontal',
                            right: 'right',
                            top:"top",
                            inRange:{
                                color:['rgb(81,215,169)','rgb(46,164,236)'], //图元着色
                            }
                        },
                        series: [{
                            name: '测试',
                            type: 'heatmap',
                            data: data,
                            label: {
                                normal: {
                                    show: true,
                                    color:"white"
                                }
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    };
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById('main'));
                    // 绘制图表
                    myChart.setOption(option);
                }
            }

        }

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
