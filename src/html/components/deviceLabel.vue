<template>
    <div id="deviceLabel">
        <div :class="show?'content content-active':'content'">
            <span class="float-text main-text">设备类型</span>
            <div class="main" @click="changeDisplay"><i class="icon-device"></i></div>
            <div class="list" v-if="show">
                <div class="item" v-for="item in btnList">
                    <span class="float-text">{{item.text}}</span>
                    <div class="item-btn" @click="fn(item.name,item.state)"><i class="item-icon" :class="item.icon"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "deviceLabel",
        data: function () {
            return {
                show: false,
                btnList: [{
                    text: '普通',
                    icon: 'icon-road',
                    name: 'normal',
                    state: true
                }, {
                    text: '桥梁',
                    icon: 'icon-bridge',
                    name: 'bridge',
                    state: true
                }, {
                    text: '隧道',
                    icon: 'icon-tunnel',
                    name: 'tunnel',
                    state: true
                }, {
                    text: '高架',
                    icon: 'icon-trestle',
                    name: 'trestle',
                    state: true
                }]
            }
        },
        methods: {
            changeDisplay() {
                this.show = !this.show;
            },
            fn(item, state) {
                this.btnList.forEach((e) => {
                    if (e.name === item) {
                        e.state = !state;
                    }
                });
                this.$emit('changeStateFn', item, state);//TODO:触发父组件事件
            }
        }
    }
</script>
<style scoped lang="less">
    @import '../../css/deviceLabel';
</style>

