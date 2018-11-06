<template>
    <div :title="labels" class="label-item">
        <div v-for="item in labelData" class="msg-tab" :class="item.class">
            <span class="tab-lf">{{item.lf}}</span>
            <span class="tab-lr">{{item.rt}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "person-label",
        props: ['labels'],
        watch: {
           // "labels": "init"
        },
        data: function () {
            return {
                classType: [
                    {name: '部恐', value: 1},
                    {name: '重点', value: 2},
                    {name: '国', value: 3},
                    {name: '经', value: 4},
                    {name: '治', value: 5},
                    {name: '恐', value: 6},
                    {name: '禁', value: 7},
                    {name: '网', value: 8},
                    {name: '刑', value: 9}
                ],
                labelData: []
            }
        },
        mounted: function () {
            this.init();
        },
        methods: {
            init: function () {
                let labelArr=[];
                if(this.labels){
                    labelArr = this.labels.split(',');//把获取到的参数储存到数组中
                    for (let key = 0; key < this.classType.length; key++) {//参照字典
                        if (labelArr.length > 0) {
                            for (let i = 0; i < labelArr.length; i++) {
                                if (this.classType[key].name === labelArr[i].split('|')[0]) {
                                    this.labelData.push({
                                        class: 'theme-' + this.classType[key].value,
                                        lf: labelArr[i].split('|')[0],
                                        rt: labelArr[i].split('|')[1]
                                    });
                                }
                            }
                        } else {
                            return false
                        }
                    }
                }else{

                }

            }
        }
    }
</script>

<style scoped lang="less">
    .label-item {
        overflow: hidden;
    }

    .msg-tab {
        display: inline-block;
        border-radius: 40px;
        margin: 3px 4px;
        height: 23px;
        width: 103px;
        text-align: left;
    }

    .msg-tab .tab-lf {
        display: inline-block;
        font-size: 14px;
        font-weight: bold;
        height: 24px;
        line-height: 24px;
        color: #FFF;
        width: 36px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 17px;
        vertical-align: middle;
        text-align: center;
    }

    .msg-tab .tab-lr {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 2px 0;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        vertical-align: middle;
        width: 60px;
    }

    .msg-tab .tab-tri {
        display: block;
        width: 14px;
        margin-left: -4px;
        font-size: 14px;
        line-height: 28px;
        float: left;
    }

    .theme-1 {
        border: 1px solid #d92220;
    }

    .theme-1 .tab-lf {
        background: #d92220;
    }

    .theme-1 .tab-tri,
    .theme-1 .tab-lr {
        color: #d92220;
    }

    .theme-2 {
        border: 1px solid #ea742d;
    }

    .theme-2 .tab-lf {
        background: #ea742d;
    }

    .theme-2 .tab-tri,
    .theme-2 .tab-lr {
        color: #ea742d;
    }

    .theme-3 {
        border: 1px solid #bb7878;
    }

    .theme-3 .tab-lf {
        background: #bb7878;
    }

    .theme-3 .tab-tri,
    .theme-3 .tab-lr {
        color: #bb7878;
    }

    .theme-4 {
        border: 1px solid #599a64;
    }

    .theme-4 .tab-lf {
        background: #599a64;
    }

    .theme-4 .tab-tri,
    .theme-4 .tab-lr {
        color: #599a64;
    }

    .theme-5 {
        border: 1px solid #24ab9a;
    }

    .theme-5 .tab-lf {
        background: #24ab9a;
    }

    .theme-5 .tab-tri,
    .theme-5 .tab-lr {
        color: #24ab9a;
    }

    .theme-6 {
        border: 1px solid #dd575c;
    }

    .theme-6 .tab-lf {
        background: #dd575c;
    }

    .theme-6 .tab-tri,
    .theme-6 .tab-lr {
        color: #dd575c;
    }

    .theme-7 {
        border: 1px solid #6873c7;
    }

    .theme-7 .tab-lf,
    .theme-7 .tab-tri {
        background: #6873c7;
    }

    .theme-7 .tab-lr {
        color: #6873c7;
    }

    .theme-8 {
        border: 1px solid #30a7df;
    }

    .theme-8 .tab-lf {
        background: #30a7df;
    }

    .theme-8 .tab-tri,
    .theme-8 .tab-lr {
        color: #30a7df;
    }

    .theme-9 {
        border: 1px solid #5c96e0;
    }

    .theme-9 .tab-lf {
        background: #5c96e0;
    }

    .theme-9 .tab-tri,
    .theme-9 .tab-lr {
        color: #5c96e0;
    }

    .theme-10 {
        border: 1px solid #12a7c2;
    }

    .theme-10 .tab-lf {
        background: #12a7c2;
    }

    .theme-10 .tab-tri,
    .theme-10 .tab-lr {
        color: #12a7c2;
    }
</style>
