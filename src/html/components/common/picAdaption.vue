<template>
    <div :style="getStyle">
        <img :src="src"  :style="{'width':w,'height':h}" />
    </div>
</template>


<script>
export default {
    data(){
        return{
            h:"",
            w:"",
        }
    },
    props:['width','height','src'],
    created(){

    },
    watch:{
        "src":"img"
    },
    mounted(){
        this.img();
    },
    computed:{
        getStyle(){
            let style ={
                'width':this.width + "px",
                'height':this.height + "px",
                'text-align':'center',
                'line-height':this.height + "px",
            };
            return style;
        }
    },
    methods:{
        img(){
            if(!this.src){
                return;
            }
            let rate = this.width / this.height;
            let imgObj = new Image();
            imgObj.src = this.src;
            let fn = ()=>{
                let rate2 = imgObj.width / imgObj.height;
                if (rate < rate2){
                    this.w = '100%';
                    this.h = 'auto';
                }else{
                    this.w = 'auto';
                    this.h = '100%';
                }
            };
            if(imgObj.complete){
                fn();
            }else{
                imgObj.onload = () => {
                    fn();
                };
            }
        },

    }
}
</script>

<style>

</style>
