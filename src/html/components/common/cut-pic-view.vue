<template>
    <canvas :width="width" :height="height" :id="id"></canvas>
</template>

<script>
    export default {
        name: "cut-pic-view",
        props:[
            "width",
            "height",
            "id",
            "arg"
        ],
        watch:{
            "arg":"argChange"
        },
        mounted(){
            this.drawCanvas(...this.arg);
        },
        methods:{
            drawCanvas(src,x,y,w,h){

                let canvas = document.getElementById(this.id );
                let ctx = canvas.getContext("2d");
                let img = new Image();
                let fn = ()=>{
                    if(w === undefined || h === undefined){
                        w = img.width;
                        h = img.height;
                    }
                    let rateInner = w / h;
                    let rateOuter = this.width / this.height;
                    let toW,toH,toX,toY;
                    if (rateInner < rateOuter){
                        toW = this.height * rateInner;
                        toH = this.height;
                        toX = (this.width - toW)/2 ;
                        toY = 0;
                    }else{
                        toW = this.width;
                        toH = this.width / rateInner;
                        toX = 0;
                        toY = (this.height - toH)/2 ;
                    }
                    ctx.drawImage(img,x,y,w,h,toX,toY ,toW ,toH)
                };
                img.src = src;
                if(img.complete){
                    fn();
                }else{
                    img.onload = () => {
                        fn();
                    };
                    img.onerror = (err)=>{
                        console.log(err)
                        ctx.clearRect(0,0,this.width,this.height)
                    }
                }
            },
            argChange(){
                if(this.arg && this.arg.length > 0){
                    this.drawCanvas(...this.arg);
                }
            }
        }
    }
</script>

<style scoped>

</style>
