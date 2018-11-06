let $ = require("jquery");
$(function () {
    var quick_tag = "a";//快速搜索标签
//快速搜索区域页面切换效果
    $(".search-tag").click(function(){
        var index = $(this).index()
        if(quick_tag != index){
            $(".search-tag").removeClass("tag_selected");
            $("#quick-search-div .shape_check").remove();
            $(this).addClass("tag_selected");
            var tag = $('<span class="shape_check"></span>');
            $(this).prepend(tag);
            quick_tag = index;
            $("#quick-search-div .show-entrance").hide();
            $("#search-menu-div").slideUp("fast");
            $(".show-entrance").hide();
        }else{
            if($(this).children().hasClass("shape_check")){
                $(".search-tag").removeClass("tag_selected");
                $("#quick-search-div .shape_check").remove();
                $("#quick-search-div .show-entrance").show();
            }else{
                $(".search-tag").removeClass("tag_selected");
                $("#quick-search-div .shape_check").remove();
                $(this).addClass("tag_selected");
                var tag = $('<span class="shape_check"></span>');
                $(this).prepend(tag);
            }
        }
    })
    var deg = 0;
//快速搜索限制详细搜索框
    $("#quick-search-div .show-entrance").click(function(){
        if($(".search-tag").children().hasClass("shape_check")){
            $("#search-menu-div").hide();
        }else{
            deg = (deg +180)%360;
            $("#search-menu-div").toggle("slow");
            $("#quick-search-div .show-entrance").css({
                'transform':'rotate('+ deg +'deg)',
                'transition': 'transform 0.2s'
            });
        }
    });
    var admin_tag = "b";//行政区标签
//初始行政区效果
    $(".admin-normal").click(function(){
        $(".box-show").slideDown("slow");
        var index = $(this).index();
        var left = -index*840;
        $("#stage-box").animate({
            "left":left+"px"
        },"slow");
        if($(this).hasClass("admin-selected")){
            $(this).removeClass("admin-selected");
            $(".show-div").eq(index).children(".unselect-tag").removeClass("select-tag");
            $(".show-div").eq(index).children(".unselect-tag").children(".select_check").remove()
            $(".show-div").eq(index).children(".unselect-tag").children().addClass("normal-style")
        }else{
            $(this).addClass("admin-selected");
            if($(".show-div").eq(index).children(".unselect-tag").children().hasClass("select_check")){

            }else{
                $(".show-div").eq(index).children(".unselect-tag").addClass("select-tag");
                var tag = $('<span class="shape_check select_check"></span>');
                $(".show-div").eq(index).children(".unselect-tag").prepend(tag);
                $(".show-div").eq(index).children(".unselect-tag").children().removeClass("normal-style")
            }
        }
        if($(".admin-normal").hasClass("admin-selected") == false){
            $(".box-show").slideUp("slow");
        }
    });

//行政区单个标签的加减
    $(".unselect-tag").click(function(){
//	var index = $(".unselect-tag").index(this);
        if($(this).children().hasClass("select_check")){
            $(this).children(".select_check").remove();
            $(this).removeClass("select-tag");
            $(this).children("span").addClass("normal-style");
        }else{
            $(this).children("span").removeClass("normal-style");
            var tag = $('<span class="shape_check select_check"></span>');
            $(this).prepend(tag);
            $(this).addClass("select-tag");
        }
    });


//圆点开关效果
    $("#switch").click(function(){
        if($(this).css("left") == "15px"){
            $(this).animate({
                "left":"0px"
            },"fast");
            $(this).css({
                "background-color":"rgb(199,204,206)"
            });
        }else{
            $(this).animate({
                "left":"15px"
            },"fast");
            $(this).css({
                "background-color":"rgb(48,165,237)"
            });
        }

    });

})
