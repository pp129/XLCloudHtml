<template>
    <div class="cms-content-inner background-gray index">
        <div id="main1" style="width: 760px;height: 405px;float: left;"></div>
        <div id="main2" style="width: 560px;height: 405px;float: left;"></div>
    </div>
</template>

<script>
    let moment = require("moment");
    let axios = require("axios");
    export default {
        props:['piePlaceMapList','pieTimeMapList'],
        data() {
            return {
//                myChart1:null,
//                myChart2:null,
            };
        },
        watch: {
            'piePlaceMapList':"initChart"
        },
        created: function () {

        },
        mounted: function () {
            this.initChart();
        },
        computed: {

        },
        methods: {
            initChart(){
               this.initChart1();
               this.initChart2();
            },
            initChart1(){
                let topOne = null;
                let max = 0;
                for(let item of this.piePlaceMapList){
                    if(item.value >= max){
                        topOne = item;
                        max = topOne.value;
                    }
                }
                let option = {
                    title : {
                        text: '点位统计',
                        subtext: `（出现点位top1：${topOne && topOne.name || ""}）`,
//                    top:20,
                        left:"center",
                        textStyle:{
                            color:"black",
                        },
                        subtextStyle:{
                            color:"rgb(204,65,65)"
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)",
                    },
                    legend: {
                        x : 'right',
                        y : '20%',
                        //图例文字样式
                        textStyle:{
                            color:'#000',
                            fontSize:14,
                            fontWeight:'700'
                        },
                        data:['图例4','图例5'],
//                    selected:{
//                        '图例4':false
//                    }
                    },
                    toolbox: {
                        show : false,
                    },
                    calculable : true,
                    color:['rgb(100,195,255)','rgb(101,195,219)','rgb(119,229,220)','rgb(129,220,157)','rgb(213,220,129)','rgb(220,189,129)','rgb(220,148,129)','rgb()','rgb(254,140,140)'],//自己设置扇形图颜色
                    series : [
                        {
                            name:'点位统计',
                            type:'pie',
                            radius : [30, 120],
                            center : ['50%','60%'],
                            roseType : 'radius',
                            x: '50%',               // for funnel
                            max: 40,                // for funnel
                            sort : 'ascending',     // for funnel
                            data:this.piePlaceMapList,
                            //标线的属性设置，以及显示的文字
                            itemStyle: {
                                normal:{
                                    label:{
                                        show:true,
                                        formatter: '{b}',
                                        textStyle:{
                                            color:'#000',
                                            fontSize:'10',
                                            fontWeight:'700'
                                        }

                                    },
                                    //标线长度，宽度
                                    labelLine:{
                                        show:true,
                                        length:5,
                                        lineStyle:{
                                            width:2
                                        }
                                    }
                                },
                                emphasis: {
                                    shadowBlur: 5,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        },{
                            name:'',
                            type:'pie',
                            radius:[20,21],
                            center:['50%','60%'],
                            silent:true,
                            data:[0],
                            label:{
                                normal:{
                                    show:false
                                },
                                emphasis:{
                                    show:false
                                }
                            },
                            itemStyle:{
                                normal:{
                                    color:"#e8e8e8"
                                }
                            }
                        },{
                            name:'',
                            type:'pie',
                            radius:[130,131],
                            center:['50%','60%'],
                            silent:true,
                            data:[0],
                            label:{
                                normal:{
                                    show:false
                                },
                                emphasis:{
                                    show:false
                                }
                            },
                            itemStyle:{
                                normal:{
                                    color:"#e8e8e8"
                                }
                            }
                        }

                    ]
                };
                var myChart1 = echarts.init(document.getElementById('main1'));
                myChart1.setOption(option);
            },
            initChart2(){
                let topOne = null;
                let max = 0;
                for(let item of this.pieTimeMapList){
                    if(item.value >= max){
                        topOne = item;
                        max = topOne.value;
                    }
                }
                let option2 = {
                    title : {
                        text: '时段统计',
                        subtext: `（出现时间段top1：${topOne && topOne.name || ""}）`,
                        left:"center",
                        textStyle:{
                            color:"black"
                        },
                        subtextStyle:{
                            color:"rgb(204,65,65)"
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        x : 'right',
                        y : '20%',
                        //图例文字样式
                        textStyle:{
                            color:'#000',
                            fontSize:14,
                            fontWeight:'700'
                        },
                        data:['图例4','图例5'],
//                    selected:{
//                        '图例4':false
//                    }
                    },
                    toolbox: {
                        show : false,
                    },
                    calculable : true,
                    color:['rgb(100,195,255)','rgb(101,195,219)','rgb(119,229,220)','rgb(129,220,157)','rgb(213,220,129)','rgb(220,189,129)','rgb(220,148,129)','rgb()','rgb(254,140,140)'],//自己设置扇形图颜色
                    series : [
                        {
                            name:'时段统计',
                            type:'pie',
                            radius : [30, 120],
                            center : ['50%','60%'],
                            roseType : 'radius',
                            x: '50%',               // for funnel
                            max: 40,                // for funnel
                            sort : 'ascending',     // for funnel
                            data:this.pieTimeMapList,
                            //标线的属性设置，以及显示的文字
                            itemStyle: {
                                normal:{
                                    label:{
                                        show:true,
                                        formatter: '{b}',
                                        textStyle:{
                                            color:'#000',
                                            fontSize:14,
                                            fontWeight:'700'
                                        }

                                    },
                                    //标线长度，宽度
                                    labelLine:{
                                        show:true,
                                        length:40,
                                        lineStyle:{
                                            width:2
                                        }
                                    }
                                },
                                emphasis: {
                                    shadowBlur: 5,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        },{
                            name:'',
                            type:'pie',
                            radius:[20,21],
                            center:['50%','60%'],
                            silent:true,
                            data:[0],
                            label:{
                                normal:{
                                    show:false
                                },
                                emphasis:{
                                    show:false
                                }
                            },
                            itemStyle:{
                                normal:{
                                    color:"#e8e8e8"
                                }
                            }
                        },{
                            name:'',
                            type:'pie',
                            radius:[130,131],
                            center:['50%','60%'],
                            silent:true,
                            data:[0],
                            label:{
                                normal:{
                                    show:false
                                },
                                emphasis:{
                                    show:false
                                }
                            },
                            itemStyle:{
                                normal:{
                                    color:"#e8e8e8"
                                }
                            }
                        }

                    ]
                };
// 基于准备好的dom，初始化echarts实例
                var myChart2 = echarts.init(document.getElementById('main2'));
// 绘制图表
                myChart2.setOption(option2);
            }
        }

    };
</script>
