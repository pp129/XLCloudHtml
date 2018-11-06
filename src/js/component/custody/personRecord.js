// let $ = require("jquery");

$(function () {
    //日历
    var rldata = {
        id: "calendar-div",
        isRight: false,//是否显示右边模块
        isBtn: true,//是否可以日期切换
//	istopTitle:true,//是否显示上方标题
        isRadio:true//是否单选
    }
    createRl(rldata);
//医保信息无数据
//$("#health-record-div").html("");
//noInfo("#health-record-div");
//统计效果切换
//     $(".count-title").click(function(){
//         var index = $(this).index();
//         if(index == 0){
//             $("#border-roll").animate({
//                 "width":"40%",
//                 "left":"0"
//             },"fast");
//             $("#count-stage").animate({
//                 "margin-left":0
//             },"fast")
//         }else{
//             $("#border-roll").animate({
//                 "width":"60%",
//                 "left":"40%"
//             },"fast");
//             $("#count-stage").animate({
//                 "margin-left":"-1320px"
//             },"fast")
//         }
//     })
//     $(".fold_btn").attr("deg",0);
// //折叠菜单
//     $(".fold_btn").click(function(){
//         var index = $(".fold_btn").index(this);
//         var deg = $(this).attr("deg");
// //	if($(this).hasClass("fold_check")){
// //		$(this).removeClass("fold_check");
// //		deg = (deg +180)%360;
// //  	$(".show_div").eq(index).toggle("slow");
// //  	$(this).css({
// //	        'transform':'rotate('+ deg +'deg)',
// //	        'transition': 'transform 0.2s'
// //	    });
// //	}else{
// //		$(this).addClass("fold_check");
// //		deg = (deg +180)%360;
// //  	$(".show_div").eq(index).toggle("slow");
// //  	$(this).css({
// //	        'transform':'rotate('+ deg +'deg)',
// //	        'transition': 'transform 0.2s'
// //	    });
// //	}
//         deg = (Number(deg) +180)%360;
//         $(".show_div").eq(index).toggle("slow");
//         $(this).css({
//             'transform':'rotate('+ deg +'deg)',
//             'transition': 'transform 0.2s'
//         });
//         $(this).attr("deg",deg);
//     })
})
