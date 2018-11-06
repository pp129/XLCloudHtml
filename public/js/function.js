/**
 * 常用函数
 * author:lincq
 * 2016/05/10
 * 使用方法见http://www.linchaoqun.com/html/cms/content.jsp?menu=js&id=1461121655066
 */
(function(window, $, undefined){
    oFunction = function() {
        this.accessTicket = "";
    };
    oFunction.prototype = {
        // 弹窗
        fnPop : function(sClassName) {
            var aPop = document.getElementsByClassName(sClassName);
            var iWinWidth = document.body.offsetWidth;
            var iWinHeight = window.innerHeight;
            for ( var i = 0; i < aPop.length; i++) {
                var oThisPop = aPop[i];
                var iThisWidth = oThisPop.offsetWidth || $("."+sClassName).width();
                var iThisHeight = oThisPop.offsetHeight || $("."+sClassName).height();
                oThisPop.style.left = (iWinWidth - iThisWidth) / 2 + "px";
                oThisPop.style.top = (iWinHeight - iThisHeight) / 2 + "px";
            }
        },
        // 根据id弹窗
        //oFunctionCase.fnPopById("loginPop");
        fnPopById : function(sId) {
        	var aPop = $("#" + sId);
            var iWinWidth = $(window).width();
            var iWinHeight = $(window).height();
            aPop.css({"display":"block"});
            var iThisWidth = aPop.offsetWidth || $("#"+sId).width();
            var iThisHeight = aPop.offsetHeight || $("#"+sId).height();
			var left = (iWinWidth - iThisWidth) / 2 + "px";
			var top = (iWinHeight - iThisHeight) / 2 + "px";
            aPop.css({"left" : left});
            aPop.css({"top" : top});
        },
        
        fnStopBubble : function(e) {
            if (e || e.stopPropagation) {
                e.stopPropagation();
            } else {
                window.event.CancelBubble = true;
            }
        },
        fnAlert : function(sMsg , fn ,iTime) {

            if($("#toast").length == 0){
                $("body").append("<div class=\"toast\" id=\"toast\"></div>");
            }
            var toast = $("#toast");
            toast.html(sMsg).css({
            	"background": "#000000",
				"opacity":"0.8",
                "border-radius": "3px",
                "color": "#fff",
                "font-size": "15px",
                "line-height": "22px",
                "max-width": "70%",
                "padding": "15px",
                "position": "fixed",
                "text-align":"center",
                "z-index": "9999"
            });
            toast.css({"display":"block"});
            var iWinWidth = $(window).width();
            var iWinHeight = $(window).height();
            var iThisWidth =  toast.width();
            var iThisHeight = toast.height();
            var left = (iWinWidth - iThisWidth) / 2 + "px";
            var top = (iWinHeight - iThisHeight) / 2 + "px";
            toast.css({"left" : left});
            toast.css({"top" : top});
            iTime = iTime?iTime:2000;
            setTimeout(function() {
                toast.hide().remove();
                if(fn){
                    fn();
                }
            }, iTime);
        },
        fnNewAlert : function(sMsg , fn,sTitle) {
            if(!sTitle) sTitle = "提示";
            var oThis = this;
            if($("#alertPop").length == 0){
                $.ajax({
                    url: URI.sPerjectName + "/text/alert.txt?date=" + new Date(),
                    async:false , 
                    dataType  : "text",
                    success : function(data){
                        $("body").append(data);
                        oThis.fnPopById("alertPop");
                        $("#alertTitle").html(sTitle);
                        $("#alertMsg").html(sMsg);
                        $("#alertPopMask").show();
                    }
                });
            }else{
                oThis.fnPopById("alertPop");
                $("#alertMsg").html(sMsg);
                $("#alertPopMask").show();
            }
            $("#alertBtn").on("click",function(){
                $("#alertPop").add("#alertPopMask").hide();
                $("#alertBtn").add("#alertPopMask").off();
                if(fn){
                    fn();
                }
            });
            $("#alertPopMask").on("click",function(){
                $("#alertPop").add("#alertPopMask").hide();
                $("#alertBtn").add("#alertPopMask").off();
            });
        },
        fnPhonePop : function(sPhone) {
            var oThis = this;
            var sId = "phonePop";
            var sMaskId = "phonePopMask";
            var sTxtId = "popTelphoneTxt";
            if($("#" + sId).length == 0){
                $.ajax({
                    url: URI.sPerjectName + "/text/phone.txt?date=" + new Date(),
                    async:false , 
                    dataType  : "text",
                    success : function(data){
                        $("body").append(data);
                        $("#" + sTxtId).html(sPhone);
                        $("#" + sId).slideDown("slow");
                        $("#" + sMaskId).show();
                    }
                });
            }else{
                $("#" + sTxtId).html(sPhone);
                $("#" + sId).slideDown("slow");
                $("#" + sMaskId).show();
            }
            $("#" + sMaskId).add("#cancelPop").on("click",function(e){
                oFunctionCase.fnStopBubble(e);
                $("#" + sMaskId).add("#" + sId).slideUp().off();
            });
            $("#popTelphoneTxt").on("click",function(e){
                window.location.href = "tel:" + sPhone;
            });
        },
        fnSharePop : function(content, pic) {
            var oThis = this;
            var sId = "sharePop";
            var sMaskId = "sharePopMask";
            if($("#" + sId).length == 0){
                $.ajax({
                    url: URI.sPerjectName + "/text/share.txt?date=" + new Date(),
                    async:false , 
                    dataType  : "text",
                    success : function(data){
                        $("body").append(data);
                        oThis.fnPopById(sId);
                        $("#" + sMaskId).show();
                    }
                });
            }else{
                oThis.fnPopById(sId);
                $("#" + sMaskId).show();
            }
            $("#" + sMaskId).add("#cancelPop").on("click",function(e){
                oFunctionCase.fnStopBubble(e);
                $("#" + sMaskId).add("#" + sId).hide().off();
            });
            $("#sinaWeibo").on("click" , function(){
                oThis.fnWeiboSina(content, pic);
            });
            $("#tengXunWeibo").on("click" , function(){
                oThis.fnWeiboTengXun(content, pic);
            });
            $("#QQZone").on("click" , function(){
                oThis.fnWeiboQzone(content, pic);
            });
        },
        fnConfirm : function(sMsg ,sSubmitMsg, fn) {
            var oThis = this;
            if($("#conformPop").length == 0){
                $.ajax({
                    url: URI.sPerjectName + "/text/confirm.txt?date=" + new Date(),
                    async:false , 
                    dataType  : "text",
                    success : function(data){
                        $("body").append(data);
                        oThis.fnPopById("conformPop");
                        $("#conformMsg").html(sMsg);
                        $("#nowGo").html(sSubmitMsg);
                        $("#conformPopMask").show();
                    }
                });
            }else{
                oThis.fnPopById("conformPop");
                $("#conformMsg").html(sMsg);
                $("#nowGo").html(sSubmitMsg);
                $("#conformPopMask").show();
            }
            $("#nowGo").on("click",function(){
                $("#conformPop").add("#conformPopMask").hide();
                $("#nowGo").add("#conformPopMask").add("#cancelPop").off();
                if(fn){
                    fn();
                }
            });
            $("#conformPopMask").add("#cancelPop").on("click",function(){
                $("#conformPop").add("#conformPopMask").hide();
                $("#nowGo").add("#conformPopMask").add("#cancelPop").off();
            });
        },
        /**
		 * 显示实名制弹窗
		 * @return
		 */
		showRealNamePop:function(){
			var _="realnamePop";
			if($("#"+_).length==0){
				var _h='<div class="pop" id="'+_+'" style="display:block;">'
						+'<div class="popHead">'
							+'<h1 class="popTit">该功能需要实名认证</h1>'
							+'<a href="javascript:void(0);" class="closeBtn">close</a>'
						+'</div>'
						+'<div class="popCont">'
							+'<div class="textWrap">'
								+'<img src="/static/common/images/i-realname.png" width="100" height="100" alt=""/>'
								+'<p>对不起，该功能需通过实名认证后才可使用</p>'
							+'</div>'
							+'<div class="btnWrap clearfix">'
								+'<a href="/portal/user/service/RealName.gotoRealName.do" class="btn">去实名认证</a>'
							+'</div>'
						+'</div>'
					+'</div>'
					+'<div class="popMask" id="popMask" style="display:block;"></div>';
				$("body").append(_h);
				$(".popHead .closeBtn").click(function(){ 
					$("#"+_).hide(); 
					$('#popMask').hide();
				}); 
				var _x1=$(window).width()
					,_x2=$("#"+_).width()
					,_y1=$(window).height()
					,_y2=$("#"+_).height();
				//显示
				$('#popMask').show();
				$("#"+_).css("top",(_y1-_y2)/2).css("left",(_x1-_x2)/2).show(); 
			}
		},
        fnGet : function(sQueryKey,sUrl) {
            sUrl = sUrl?sUrl:window.location.href;
            var aUrlPart = sUrl.split("?");
            var aGet = new Array();
            if (aUrlPart[1]) {
                aGetPair = aUrlPart[1].split("&");
                for (var i = 0; i < aGetPair.length; i++) {
                    aTmpArr = aGetPair[i].split("=");
                    sKey = aTmpArr[0];
                    aGet[sKey] = aTmpArr[1];
                }
            }
            return aGet[sQueryKey];
        },
        fnGetNew : function(sQueryKey,sUrl) {
            var sGet = this.fnGet(sQueryKey, sUrl);
            if(typeof sGet != "undefined" && sGet){
                return sGet;
            }else{
                return false;
            }
             
         },
        fnPhoneVerify:function(sPhoneInput){
            if(sPhoneInput.match(/^1\d{10}$/)){
                return true;
            }else{
                return false;
            }
        },
        fnNamePhoneVerify:function(sUserName){
            if(sUserName){
                if(sUserName.match(/^1\d{10}$/)){
                    var sPhoneName = sUserName;
                    sUserName = "";
                    for(var i=0; i<sPhoneName.length ; i++ ){
                        if(i>2 &&i<7){
                            sUserName+="*";
                        }else{
                            sUserName+=sPhoneName[i];
                        }
                    }
                }
            }else{
                sUserName = "暂无信息";
            }
            
            return sUserName;
        },
        fnNullVerify : function(vVar){
            if(vVar == "null" || !vVar){
                return false;
            }else{
                return true;
            }
        },
        fnUserBtn : function(){
            return;
        },
        // 如果用户名是手机，隐藏中间四位
        fnNamePhoneVerify : function(sUserName) {
            if (sUserName.match(/^1\d{10}$/)) {
                var sPhoneName = sUserName;
                sUserName = "";
                for ( var i = 0; i < sPhoneName.length; i++) {
                    if (i > 2 && i < 7) {
                        sUserName += "*";
                    } else {
                        sUserName += sPhoneName[i];
                    }
                }
            }
            return sUserName;
        },
        /**
         * 将身份证号码的出生日期部分替换为*
         * @param sIdcard
         */
        fnIdcardVerify : function(sIdcard) {
            if (sIdcard.match(/^\d{15}$/)) {
                var sTmpIdcard = sIdcard;
                sIdcard = "";
                for ( var i = 0; i < sTmpIdcard.length; i++) {
                    if (i > 5 && i < 12) {
                        sIdcard += "*";
                    } else {
                        sIdcard += sTmpIdcard[i];
                    }
                }
            }else if (sIdcard.match(/^(\d{18}$)|(^\d{17}(\d|X|x))$/)) {
                var sTmpIdcard = sIdcard;
                sIdcard = "";
                for ( var i = 0; i < sTmpIdcard.length; i++) {
                    if (i > 5 && i < 14) {
                        sIdcard += "*";
                    } else {
                        sIdcard += sTmpIdcard[i];
                    }
                }
            }
            return sIdcard;
        },
        fnDriverIdVerify : function(sDriverId) {
            var sTmpIdcard = sDriverId;
            sDriverId = "";
            var count = 0;
            for ( var i = 0; i < sTmpIdcard.length; i++) {
                if (i > 3 && i < sTmpIdcard.length -4) {
                    if(count < 4){
                        sDriverId += "*";
                        count ++;
                    }
                } else {
                    sDriverId += sTmpIdcard[i];
                }
            }
            return sDriverId;
        },

        // 非法字符验证
        fnIllegalChar : function (sTring) {
            var patrn=/[`~!/@#$%^&*()\-_=+|[{}\];:\'\",<.>\/?！￥%……&*（）\——：“《》？=【】、；‘，。、]+/g;
            if(patrn.test(sTring)){
                return true;
            }else{
                return false;
            }
        },
        fnTrim :function(sString){
            if(sString){
                return sString.replace(/(^\s*)|(\s*$)/g, ""); 
            }else{
                return "";
            }
        },
        fnHtml : function(sString){
            sString = sString.replace(/</g,"&lt;");
            sString = sString.replace(/>/g,"&gt;");
            return sString;
        },
        fnIsWeixin : function (){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        fnAlertShow : function() {
            if($("#loading").length == 0){
                $("body").append("<div class=\"loading\" id=\"loading\"></div>");
            }
        },
        fnAlertHide : function(){
            $("#loading").hide().remove();
        },
        fnMailCheck : function (mail) {
            var filter  = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            return filter.test(mail);
        },
        fnIsCardNo : function (card){
           // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
           var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
           return reg.test(card);
        },
        // 局部加载方法
        fnPartLoading : function (obj) {
            obj.html('<div class="tipbox"><img src="/static/common/images/nodataloading.gif" width="160" height="10" alt=""/></div>')
        },
        /**
        *将身份证号码的出生日期部分替换为*
        */
        fnIdcardReplace : function(sIdcard) {
            if (sIdcard.match(/^\d{15}$/)) {
                var sTmpIdcard = sIdcard;
                sIdcard = "";
                for ( var i = 0; i < sTmpIdcard.length; i++) {
                    if (i > 5 && i < 12) {
                        sIdcard += "*";
                    } else {
                        sIdcard += sTmpIdcard[i];
                    }
                }
            }else if (sIdcard.match(/^(\d{18}$)|(^\d{17}(\d|X|x))$/)) {
                var sTmpIdcard = sIdcard;
                sIdcard = "";
                for ( var i = 0; i < sTmpIdcard.length; i++) {
                    if (i > 5 && i < 14) {
                        sIdcard += "*";
                    } else {
                        sIdcard += sTmpIdcard[i];
                    }
                }
            }
            return sIdcard;
        },
        checkForm:function(paramsIds){
            for(var i = 0;i<paramsIds.length;i++){
                var input = $("#"+paramsIds[i]);
                if(input.attr("readonly")){
                    continue;
                }
                /**
                 * 为空验证
                 */
                if(input.attr("empty")=="0"){
                    if(!input.val() || input.val().trim().length < 1){
                        oFunctionCase.fnAlert(input.attr("empty_msg"));
                        return false;
                    }
                }
                /**
                 * 正则验证
                 */
                var regular = input.attr("regular");
                if(regular && regular != ""){
                    var pattern1 = new RegExp(regular); 
                    var result = pattern1.test(input.val()); 
                    if(!result){
                        oFunctionCase.fnAlert(input.attr("reg_msg"));   
                        return false;
                    }
                }
            }
            return true;
        },
        fnPicSlide : function(fn){
            if($("#imgPop").length == 0){
                $.ajax({
                    url: URI.sPerjectName + "/text/picSlide.txt?date=" + new Date(),
                    async:false , 
                    dataType  : "text",
                    success : function(data){
                        $("#mobileWrapper").append(data);
                        $("#picMask").show();
                        if(fn){
                            fn();
                        }
                    }
                });
            }else{
                $("#picMask").show();
                if(fn){
                    fn();
                }
            }
            $("#picMask").add("#imgPop").on("click" , function(){
                $("#imgPop").add("#picMask").remove();
            });
        },
        /**
         * 回到顶部
         * @param id
         */
        fnScollTop : function(id){
            var $Btn = $("#" + id);
            $(window).scroll(function(){
                if ($(window).scrollTop()>100){
                    $Btn.fadeIn(1500);
                }
                else
                {
                    $Btn.fadeOut(1500);
                }
            });
            //当点击跳转链接后，回到页面顶部位置
            $Btn.click(function(){
                $('body,html').animate({scrollTop:0},1000);
                return false;
            });
        },
        /**
         * 字符串多出隐藏
         */
        fnCutContent : function(sContent , length){
            var sRetrunContent = "";
            if(sContent.length > length){
                for(var i = 0 ; i <= length ; i++){
                    if(i == length){
                        sRetrunContent += "...";
                    }else{
                        sRetrunContent += sContent[i];
                    }
                }
            }else{
                sRetrunContent = sContent;
            }
            return sRetrunContent;
        },
        //分享到新浪微博
        fnWeiboSina: function(content,pic){
            var url = location.href;
            var html = [];
            html.push('http://service.weibo.com/share/share.php?');
            html.push('url='+encodeURIComponent(url));
            html.push('&title='+encodeURIComponent(content));
            //html.push('&appkey='+encodeURIComponent(site))
            html.push('&pic=' + pic);
            var size = this.fnInitSize();
            window.open(html.join(''),'_block',size.join(','));
        },
        //分享到QQ空间
        fnWeiboQzone: function(content,pic){
            var p = {
                url:location.href,
                showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
                desc:content,/*默认分享理由(可选)*/
                summary: content,/*分享摘要(可选)*/
                title: "",/*分享标题(可选)*/
                site:"福州市民网",/*分享来源 如：腾讯网(可选)*/
                pics:pic, /*分享图片的路径(可选)*/
                style:'201',
                width:39,
                height:39
            };
            var s = [];
            for(var i in p){
                s.push(i + '=' + encodeURIComponent(p[i]||''));
            }
            window.open( 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'+s.join('&'),'转播到腾讯微博', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no' );  

        },
        
        //分享到腾讯微博
        fnWeiboTengXun: function(content,pic){
            var _t = content;
            var _url = encodeURI(location.href);  
            var _appkey = "";//你从腾讯获得的appkey  
            var _pic = encodeURI(pic);//（列如：var _pic='图片url1|图片url2|图片url3....）  
            var _site = encodeURIComponent(location.href);//你的网站地址  
            var _u = 'http://v.t.qq.com/share/share.php?title='+_t+'&url='+_url+'&appkey='+_appkey+'&site='+_site+'&pic='+_pic;  
            window.open( _u,'转播到腾讯微博', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no' );  
            
        },
        //分享功能初始化大小
        fnInitSize: function(){
            var size = [];
            size.push('scrollbars='+'no');
            size.push('left='+75);
            size.push('top='+20);
            size.push('status='+'no');
            size.push('resizable='+'yes');
            return size;
        },
        fnDelHtmlTag : function (str){
            return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
        },
        fnReplaceWith : function(str , sKeyword , sTarget){
            return str.replace(sKeyword , sTarget);
        },
        fnGetAccessTicket : function(){
            var dtd = $.Deferred(); 
            var oThis = this;
            if(typeof Dcbaseapi != "undefined"){
                try {
                    Dcbaseapi.getAccessTicket(function(data){
                        oThis.fnIsLogin(data);
                        if(initPage) initPage();
                        dtd.resolve(); 
                    },function(data){
                        oThis.accessTicket = "";
                        dtd.resolve(); 
                    });
                } catch (e) {
                    dtd.resolve(); 
                }
            }else{
                oThis.fnAlert("未引入框架");
                //模拟
//              var data = "";
//              oThis.fnIsLogin(data);
//              dtd.resolve(); 
            }
            return dtd.promise(); 
        },
        fnIsLogin : function(data){
            var oThis = this;
            if(data){
                oThis.accessTicket = data;
                return true;
            }else{
                oThis.accessTicket = "";
                return false;
            }
        },
        fnStorageSupported : function() {
            var testKey = 'test', storage = window.sessionStorage;
            try {
                storage.setItem(testKey, '1');
                storage.removeItem(testKey);
                return true;
            } catch (error) {
                return false;
            }
        },
        /**
         * 确认框版本2
         * @param conf
         * var conf = {
                    showTitle : true,//是否显示标题
                    title : "确认取消订单？",//标题文字
                    showContext : false,//是否显示内容
                    context : "",//内容文字
                    cancelText : "否",//取消按钮文字
                    ensure : "是",//确认按钮文字
                    fn : function(){
                        
                    }//确认按钮事件
            };
         */
        fnConfirmVer2 : function(conf) {
            var oThis = this;
            if($("#conformPop").length == 0){
                $.ajax({
                    url:"../text/confirm.txt?date=" + new Date(),
                    async:false , 
                    dataType  : "text",
                    success : function(data){
                        $("body").append(data);
                        html();
                    }
                });
            }else{
                html();
            }
            function html(){
                oThis.fnPopById("conformPop");
                if(conf.showTitle){
                    $("#confirmTitle").html(conf.title).show();
                }else{
                    $("#confirmTitle").hide();
                }
                if(conf.showContext){
                    $("#conformMsg").html(conf.context).show();
                }else{
                    $("#conformMsg").hide();
                }
                if(conf.cancelText){
                    $("#cancelPop").html(conf.cancelText);
                }
                if(conf.ensure){
                    $("#nowGo").html(conf.ensure);
                }
                $("#conformPopMask").show();
            }
            $("#nowGo").on("click",function(){
                $("#conformPop").add("#conformPopMask").hide();
                $("#nowGo").add("#conformPopMask").add("#cancelPop").off();
                if(conf.fn){
                    conf.fn();
                }
            });
            $("#conformPopMask").add("#cancelPop").on("click",function(){
                $("#conformPop").add("#conformPopMask").hide();
                $("#nowGo").add("#conformPopMask").add("#cancelPop").off();
            });
        },
        fnUnLoginReload : function(){
            if(!oFunctionCase.accessTicket){
                oAppFunctionCase.login(function(data){
                    window.location.reload();
                });
            }
        },
        fnCreateHtmlValue : function(sOldHtml, values) {
            var i;
            var newHtml = sOldHtml;
            for (i = 0; i < values.length; i++) {
                newHtml = newHtml.replace("#{" + i + "}", values[i]);
            }
            return newHtml;
        },
        fnSplitString : function(oldStr, perLengh, splitStr) {
            var newStr = oldStr;
            if (typeof oldStr != "undefined") {
                newStr = "";
                var length = Math.ceil((oldStr.length) / perLengh);
                var i;
                for (i = 0; i < length; i++) {
                    if (i == length - 1)
                        newStr += oldStr.substring(i * perLengh, (i + 1) * perLengh);
                    else
                        newStr += oldStr.substring(i * perLengh, (i + 1) * perLengh) + splitStr;
                }
            }
            return newStr;
        },
        fnBuildMoreLineStr : function(oldStr, lineCount, lineWidth) {
            var newStr = "";
            if (typeof oldStr != "undefined") {
                if(oldStr.length > lineWidth){
                    newStr += oldStr.substring(0,lineWidth)+"<br/>";
                    if(oldStr.length > lineWidth*2){
                        newStr += oldStr.substring(lineWidth,lineWidth*2-1)+"...";
                    }else{
                        newStr += oldStr.substring(lineWidth,lineWidth*2);
                    }
                }else{
                    newStr = oldStr;
                }
            }
            return newStr;
        },
        fnLoginConfirm : function(){
            this.fnPop("conformPop");
            $("#conformPop").show();
            $("#conformPopMask").show();
            $("#cancelPop").add("#conformPopMask").on("click",function(){
                $("#conformPop").add("#conformPopMask").hide();
            });
        },
        /**
         * 修改指定URL的参数的值
         */
		fnChangeURLPar : function(destiny, par, par_value) {
			var pattern = par + '=([^&]*)';
			var replaceText = par + '=' + par_value;
			if (destiny.match(pattern)) {
				var tmp = '/\\' + par + '=([^&]*)/';
				return destiny.replace(eval(tmp), replaceText);
			} else {
				if (destiny.match('[\?]')) {
					return destiny + '&' + replaceText;
				} else {
					return destiny + '?' + replaceText;
				}
			}
			return destiny + '\n' + par + '\n' + par_value;
		}, 
		/**
       	 * 确认框版本2
       	 * @param conf
       	 * var conf = {
                       showTitle : true,//是否显示标题
                       title : "确认取消订单？",//标题文字
                       showContext : false,//是否显示内容
                       context : "",//内容文字
                       cancelText : "否",//取消按钮文字
                       ensure : "是",//确认按钮文字
                       fn : function(){
                           //确认按钮事件
                       },
                       cancel : function(){
                       	//取消按钮事件
                       }
               };
       	 */

           fnConfirm2 : function(conf) {
               var oThis = this;
               if($("#conformPop").length == 0){
   	            var sHtml = '<div  class="conformPop" style="display:block;" id="conformPop">';
   	            sHtml += '<div class="textWrap">';
   	            sHtml += '<h3 id="confirmTitle">提示</h3>';
   	            sHtml += '<p id="conformMsg"></p>';
   	            sHtml += ' </div>';
   	            sHtml += ' <div class="btnWrap clearfix">';
   	            sHtml += '    <a href="javascript:void(0)" class="conformBtn fl" id="cancelPop">取消</a>';
   	            sHtml += '    <a href="javascript:void(0)" class="conformBtn fr" id="nowGo">确定</a>';
   	            sHtml += ' </div>';
   	            sHtml += '</div>';
   	            sHtml += '<div class="popMask" id="conformPopMask"></div>';
   	            $("body").append(sHtml);
                   html();
               }else{
                   html();
               }
               function html(){
               	$(".conformPop").css({'display':'block', 'position':'fixed', 'left':'20px', 'box-sizing':'border-box', 'width':'280px', 'background':'#fff', '-moz-border-radius':'5px', '-webkit-border-radius':'5px', '-o-border-radius':'5px', 'border-radius':'5p', 'z-index':'9999'});
                   $(".textWrap").css({'padding': '20px','color': '#000' });
                   $(".textWrap h3").css({'margin-bottom': '12px', 'font-size': '16px', 'text-align': 'center'});
                   $(".textWrap p").css({'font-size': '13px', 'text-align': 'center', 'line-height': '18px'});
                   $(".btnWrap").css({ 'border-top': '1px solid #27ae60'});
                   $("a.conformBtn").css({ 'display' : 'block' , 'width' : '139px' , 'height' : '44px' , 'color' : '#27ae60' , 'font-size' : '17px' , 'text-align' : 'center' , 'line-height' : '44px'});
                   $("a.conformBtn.fl").css({ 'border-right': '1px solid #27ae60', 'color': '#333','float':"left"});
                   $("#conformPopMask").css({'display': 'none', 'position': 'fixed', 'top': '0', 'left': '0', 'bottom': '0', 'right': '0', 'background': '#000', 'opacity': '0.8', '-webkit-opacity': '0.8', '-o-opacity': '0.8', '-moz-opacity': '0.8', 'filter': 'alpha(opacity=80)', 'z-index': '9998', '-webkit-user-select': 'none', '-moz-user-select': 'none', '-ms-user-select': 'none', 'user-select': 'none', '-ms-touch-action': 'none', 'touch-action': 'none', 'overflow': 'hidden'})
                   $("#cancelPop").css({"float":"left"});
                   $("#nowGo").css({"float":"right"});
                   oThis.fnPopById("conformPop");
                   if(conf.showTitle){
                       $("#confirmTitle").html(conf.title).show();
                   }else{
                       $("#confirmTitle").hide();
                   }
                   if(conf.showContext){
                       $("#conformMsg").html(conf.context).show();
                   }else{
                       $("#conformMsg").hide();
                   }
                   if(conf.cancelText){
                       $("#cancelPop").html(conf.cancelText);
                   }
                   if(conf.ensure){
                       $("#nowGo").html(conf.ensure);
                   }
                   $("#conformPopMask").show();
               }
               $("#nowGo").on("click",function(){
                   $("#conformPop").add("#conformPopMask").hide();
                   $("#nowGo").add("#conformPopMask").add("#cancelPop").off();
                   if(conf.fn){
                       conf.fn();
                   }
               });
               $("#conformPopMask").add("#cancelPop").on("click",function(){
                   $("#conformPop").add("#conformPopMask").hide();
                   $("#nowGo").add("#conformPopMask").add("#cancelPop").off();
               });
               $("#cancelPop").on("click",function(){
                   if(conf.cancel){
                       conf.cancel();
                   }
               });
           },
		/**
         * 确认框PC版本 918新版有样式
         * @param conf
         * var conf = {
                        type : "confirmPop", // confirmPop 或者 alertPop
                       showTitle : true,//是否显示标题
                       title : "确认取消订单？",//标题文字
                       showContext : true,//是否显示内容
                       context : "",//内容文字
                       showCancel : true,
                       cancelText : "否",//取消按钮文字
                       ensure : "是",//确认按钮文字
                       fn : function(){
                           //确认按钮事件
                       },
                       cancel : function(){
                        //取消按钮事件
                       }
               };
         */

       fnConfirmPC : function(conf) {
           var oThis = this;
           if($("#confirmPop").length == 0){
                var sHtml = '<div class="pop confirmPop" style="display:none;" id="confirmPop">';
                sHtml += '<div class="popHead">';
                sHtml += '<h1 class="popTit">提示</h1>';
                sHtml += '<a href="javascript:void(0);" class="closeBtn" id="close">x</a>';
                sHtml += '</div>';
                sHtml += '<div class="popCont">';
                sHtml += '<div class="textWrap">';
                sHtml += '<h2 id="confirmTitle">注册成功</h2>';
                sHtml += '<p id="confirmMsg">确定删除该账号信息？</p>';
                sHtml += '</div>';
                sHtml += '<div class="btnWrap">';
                sHtml += '<a href="javascript:void(0);" class="btn" id="nowGo">确定</a>';
                sHtml += '<a href="javascript:void(0);" class="btn secondBtn" id="cancelPop" style="display:none;">取消</a>';
                sHtml += '</div>';
                sHtml += '</div>';
                sHtml += '</div>';
                sHtml += '<div class="popMask" style="display:none;" id="confirmPopMask"></div>';
                $("body").append(sHtml);
               html();
           }else{
               html();
           }
           function html(){
               $(".popMask").css({'display':'none','position':'fixed','top':'0','left':'0','width':'100%','height':'100%','background':'#000','opacity':'0.5','filter':'alpha(opacity=50)', '-moz-opacity':'0.5','z-index':'998'});
               $(".pop").css({'display':'none','position':'fixed','-moz-box-sizing':'border-box','-ms-box-sizing':'border-box','-o-box-sizing':'border-box','-webkit-box-sizing':'border-box','box-sizing':'border-box','min-width':'300px','max-width':'900px','background':'#fff','-webkit-border-radius':'5px','border-radius':'5px','-webkit-box-shadow':'0 0 10px #666','-moz-box-shadow':'0 0 10px #666','-o-box-shadow':'0 0 10px #666','-ms-box-shadow':'0 0 10px #666','box-shadow':'0 0 10px #666','z-index':'999'});
               $(".popHead").css({'position':'relative','padding':'10px 15px','background':'#F5F5F5','-webkit-border-radius':'5px 5px 0 0','border-radius':'5px 5px 0 0','color':'#333','overflow':'hidden'});
               $(".popHead .popTit").css({'margin-right':'30px','font-size':'14px','color':'#666','line-height':'14px','white-space':'nowrap','text-overflow':'ellipsis','overflow':'hidden'});
               $(".popHead .closeBtn").css({'position':'absolute','top':'50%','right':'15px','width':'20px','height':'20px','margin-top':'-10px', 'background':'url(/static/common/images/closeBtn.png) no-repeat center center','text-indent':'-9999px'});
               $(".popHead .closeBtn:hover").css({'transform':'rotate(360deg)','-webkit-transition':'all linear .5s','transition':'all linear .5s'})
               $(".popCont").css({'padding':'30px','text-align':'center'});
               $(".popCont .textWrap").css({'font-size':'14px','color':'#333','line-height':'20px'});
               $(".popCont .textWrap h2 ").css({'margin-bottom':'10px','font-size':'24px','color':'#27ae60','line-height':'24px'});
               $(".popCont .btnWrap").css({'padding-top':'20px','text-align':'center','overflow':'hidden'});
               $(".confirmPop .btnWrap .btn").css({'width':'90px','padding':'6px 8px','white-space':'nowrap','text-overflow':'ellipsis','overflow':'hidden'});
               $(".confirmPop .btnWrap .btn:first-child").css({'margin-right':'10px'});

               oThis.fnPopById("confirmPop");
               $("#confirmPop").addClass(conf.type);
               if(conf.showTitle){
                   $("#confirmTitle").html(conf.title).show();
               }else{
                   $("#confirmTitle").hide();
               }
               if(conf.showContext){
                   $("#confirmMsg").html(conf.context).show();
               }else{
                   $("#confirmMsg").hide();
               }
               if(conf.cancelText){
                   $("#cancelPop").html(conf.cancelText);
               }
               if(conf.ensure){
                   $("#nowGo").html(conf.ensure);
               }
               if(conf.showCancel){
                    $("#cancelPop").show();
               }
               $("#confirmPopMask").show();
           }
           $("#nowGo").on("click",function(){
               $("#confirmPop").add("#confirmPopMask").hide();
               $("#nowGo").add("#confirmPopMask").add("#cancelPop").off();
               if(conf.fn){
                   conf.fn();
               }
           });
           $("#confirmPopMask").add("#cancelPop").add("#close").on("click",function(){
               $("#confirmPop").add("#confirmPopMask").hide();
               $("#nowGo").add("#confirmPopMask").add("#cancelPop").off();
           });
           $("#cancelPop").on("click",function(){
               if(conf.cancel){
                   conf.cancel();
               }
           });
       },
       
    // 选择框直接调用 oFunctionCase.fnConfirmPCPop('确定删除吗？', '确定','取消',function(){})
       fnConfirmPCPop : function(text,ensure,cancelText,fn,fn2) {
           var conf = {
               type : "confirmPop", // confirmPop 或者 alertPop
               showTitle : false,//是否显示标题
               title : "确认取消订单？",//标题文字
               showContext : true,//是否显示内容
               context : text,//内容文字
               showCancel : true,
               cancelText : cancelText,//取消按钮文字
               ensure : ensure,//确认按钮文字
               fn : function(){
                   //确认按钮事件
                   if(fn){
                       fn();
                   }
               },
               cancel : function(){
                   $('#confirmPop').hide();
                   $('#confirmPopMask').hide();
                   if(fn2){
                       fn2();
                   }
               }
           };
           var oThis = this;
           if($("#confirmPop").length == 0){
               var sHtml = '<div class="pop confirmPop" style="display:none;" id="confirmPop">';
               sHtml += '<div class="popHead">';
               sHtml += '<h1 class="popTit">提示</h1>';
               sHtml += '<a href="javascript:void(0);" class="closeBtn" id="close">x</a>';
               sHtml += '</div>';
               sHtml += '<div class="popCont">';
               sHtml += '<div class="textWrap">';
               sHtml += '<h2 id="confirmTitle">注册成功</h2>';
               sHtml += '<p id="confirmMsg">确定删除该账号信息？</p>';
               sHtml += '</div>';
               sHtml += '<div class="btnWrap">';
               sHtml += '<a href="javascript:void(0);" class="btn" id="nowGo">确定</a>';
               sHtml += '<a href="javascript:void(0);" class="btn secondBtn" id="cancelPop" style="display:none;">取消</a>';
               sHtml += '</div>';
               sHtml += '</div>';
               sHtml += '</div>';
               sHtml += '<div class="popMask" style="display:none;" id="confirmPopMask"></div>';
               $("body").append(sHtml);
               html();
           }else{
               html();
           }
           function html(){
               $(".popMask").css({'display':'none','position':'fixed','top':'0','left':'0','width':'100%','height':'100%','background':'#000','opacity':'0.5','filter':'alpha(opacity=50)', '-moz-opacity':'0.5','z-index':'998'});
               $(".pop").css({'display':'none','position':'fixed','-moz-box-sizing':'border-box','-ms-box-sizing':'border-box','-o-box-sizing':'border-box','-webkit-box-sizing':'border-box','box-sizing':'border-box','min-width':'300px','max-width':'900px','background':'#fff','-webkit-border-radius':'5px','border-radius':'5px','-webkit-box-shadow':'0 0 10px #666','-moz-box-shadow':'0 0 10px #666','-o-box-shadow':'0 0 10px #666','-ms-box-shadow':'0 0 10px #666','box-shadow':'0 0 10px #666','z-index':'999'});
               $(".popHead").css({'position':'relative','padding':'10px 15px','background':'#F5F5F5','-webkit-border-radius':'5px 5px 0 0','border-radius':'5px 5px 0 0','color':'#333','overflow':'hidden'});
               $(".popHead .popTit").css({'margin-right':'30px','font-size':'14px','color':'#666','line-height':'14px','white-space':'nowrap','text-overflow':'ellipsis','overflow':'hidden'});
               $(".popHead .closeBtn").css({'position':'absolute','top':'50%','right':'15px','width':'20px','height':'20px','margin-top':'-10px', 'background':'url(/static/common/images/closeBtn.png) no-repeat center center','text-indent':'-9999px'});
               $(".popHead .closeBtn:hover").css({'transform':'rotate(360deg)','-webkit-transition':'all linear .5s','transition':'all linear .5s'});
               $(".popCont").css({'padding':'30px','text-align':'center'});
               $(".popCont .textWrap").css({'font-size':'14px','color':'#333','line-height':'20px'});
               $(".popCont .textWrap h2 ").css({'margin-bottom':'10px','font-size':'24px','color':'#27ae60','line-height':'24px'});
               $(".popCont .btnWrap").css({'padding-top':'20px','text-align':'center','overflow':'hidden'});
               $(".confirmPop .btnWrap .btn").css({'width':'100px','height':'36px','line-height':'36px','padding':'0','white-space':'nowrap','text-overflow':'ellipsis','overflow':'hidden'});
               $(".confirmPop .btnWrap .btn:first-child").css({'margin-right':'10px'});

               oThis.fnPopById("confirmPop");
               $("#confirmPop").addClass(conf.type);
               if(conf.showTitle){
                   $("#confirmTitle").html(conf.title).show();
               }else{
                   $("#confirmTitle").hide();
               }
               if(conf.showContext){
                   $("#confirmMsg").html(conf.context).show();
               }else{
                   $("#confirmMsg").hide();
               }
               if(conf.cancelText){
                   $("#cancelPop").html(conf.cancelText);
               }
               if(conf.ensure){
                   $("#nowGo").html(conf.ensure);
               }
               if(conf.showCancel){
                   $("#cancelPop").show();
               }
               $("#confirmPopMask").show();
           }
           $("#nowGo").on("click",function(){
               $("#confirmPop").add("#confirmPopMask").hide();
               $("#nowGo").add("#confirmPopMask").add("#cancelPop").off();
               conf.fn();
           });
           // $("#confirmPopMask").add("#cancelPop").add("#close").on("click",function(){
           //     $("#confirmPop").add("#confirmPopMask").hide();
           //     $("#nowGo").add("#confirmPopMask").add("#cancelPop").off();
           // });
           $("#cancelPop").on("click",function(){
               conf.cancel();
           });
           $("#close").on("click",function(){
               conf.cancel();
           });
       },
       /**
        * 警告框PC版本
        * @param conf
        * var conf = {
                       type : "confirmPop", // confirmPop 或者 alertPop
                      showTitle : true,//是否显示标题
                      title : "确认取消订单？",//标题文字
                      showContext : true,//是否显示内容
                      context : "",//内容文字
                      showCancel : true,
                      cancelText : "否",//取消按钮文字
                      ensure : "是",//确认按钮文字
                      fn : function(){
                          //确认按钮事件
                      },
                      cancel : function(){
                       //取消按钮事件
                      }
              };
        */
       fnAlertPC : function(title , fn) {
           var oThis = this;
           var conf = {
                   type : "alertPop", // confirmPop 或者 alertPop
                  showTitle : false,//是否显示标题
                  title : "",//标题文字
                  showContext : true,//是否显示内容
                  context : title,//内容文字
                  showCancel : false,
                  cancelText : "取消",//取消按钮文字
                  ensure : "确定",//确认按钮文字
                  fn : function(){
                      //确认按钮事件
                      if(fn)
                          fn();
                  },
                  cancel : function(){
                   //取消按钮事件
                  }
          };
           if($("#confirmPop").length == 0){
                var sHtml = '<div class="pop confirmPop" style="display:none;" id="confirmPop">';
                sHtml += '<div class="popHead">';
                sHtml += '<h1 class="popTit">提示</h1>';
//                sHtml += '<a href="javascript:void(0);" class="closeBtn" id="close">close</a>';
                sHtml += '</div>';
                sHtml += '<div class="popCont">';
                sHtml += '<div class="textWrap">';
                sHtml += '<h2 id="confirmTitle">注册成功</h2>';
                sHtml += '<p id="confirmMsg">确定删除该账号信息？</p>';
                sHtml += '</div>';
                sHtml += '<div class="btnWrap">';
                sHtml += '<a href="javascript:void(0);" class="btn" id="nowGo">确定</a>';
                sHtml += '<a href="javascript:void(0);" class="btn secondBtn" id="cancelPop" style="display:none;">取消</a>';
                sHtml += '</div>';
                sHtml += '</div>';
                sHtml += '</div>';
                sHtml += '<div class="popMask" style="display:none;" id="confirmPopMask"></div>';
                $("body").append(sHtml);
               html();
           }else{
               html();
           }
           function html(){

               oThis.fnPopById("confirmPop");
               $("#confirmPop").addClass(conf.type);
               if(conf.showTitle){
                   $("#confirmTitle").html(conf.title).show();
               }else{
                   $("#confirmTitle").hide();
               }
               if(conf.showContext){
                   $("#confirmMsg").html(conf.context).show();
               }else{
                   $("#confirmMsg").hide();
               }
               if(conf.cancelText){
                   $("#cancelPop").html(conf.cancelText);
               }
               if(conf.ensure){
                   $("#nowGo").html(conf.ensure);
               }
               if(conf.showCancel){
                    $("#cancelPop").show();
               }
               $("#confirmPopMask").show();
           }
           $("#nowGo").on("click",function(){
               $("#confirmPop").add("#confirmPopMask").hide();
               $("#nowGo").add("#confirmPopMask").add("#cancelPop").off();
               if(conf.fn){
                   conf.fn();
               }
           });
           $("#cancelPop").on("click",function(){
               $("#confirmPop").add("#confirmPopMask").hide();
               $("#nowGo").add("#confirmPopMask").add("#cancelPop").off();
           });
           $("#cancelPop").on("click",function(){
               if(conf.cancel){
                   conf.cancel();
               }
           });
       },
       /**
         * 图片框
         * @param conf
         *
        var conf = {
            showTitle : true,//是否显示标题
            title : "水费样单",//标题文字
            pic : "../../images/lifePay/tipImgs/water.png"
        };
         */
       fnImgPop : function(conf){
            var oThis = this;
           if($("#imgPop").length == 0){
                var sHtml = '<div class="pop imgPop" style="display:block;" id="imgPop">';
                sHtml += '<div class="popHead">';
                sHtml += '<h1 class="popTit"  id="imgPopTitle" style="display:none"></h1>';
                sHtml += '<a href="javascript:void(0);" class="closeBtn" id="close">close</a>';
                sHtml += '</div>';
                sHtml += '<div class="popCont">';
                sHtml += '<img src="" width="500" height="318" alt=""  id="imgPopImg"/>';
                sHtml += '</div>';
                sHtml += '</div>';
                sHtml += '<div class="popMask" style="display:block;"  id="imgPopMask"></div>';
                $("body").append(sHtml);
               html();
           }else{
               html();
           }
           function html(){
                $("#imgPopImg").attr({
                    "src": conf.pic
                });
                if(conf.showTitle){
                    $("#imgPopTitle").text(conf.title).show();
               }
               $("#imgPopMask").show();
                oFunctionCase.fnImgOnload($("#imgPopImg") , function(){
                    oThis.fnPopById("imgPop");
                });

           }
           $("#imgPopMask").add("#close").on("click",function(){
               $("#imgPop").add("#imgPopMask").hide();
               $("#confirmPopMask").add("#cancelPop").off();
           });
       },
       //图片加载完成以后执行回调
       fnImgOnload : function (img , fn){
            var oImg = $(img);
            if(oImg[0].complete){
                fn();
            }else{
                oImg.load(function(){
                    fn();
                });
            }
        },
        /**
         * sessionStorage封装
         * oFunctionCase.fnStorage("infro" , $("#infro").val());//存
         *  oFunctionCase.fnStorage("infro");//取
         */
       fnStorage : function(){
                if(that.fnStorageSupported()){
                    if(arguments.length == 1){
                         return window.sessionStorage[arguments[0]];
                    }else if(arguments.length >= 1){
                        if(typeof arguments[1] == "string"){
                            window.sessionStorage[arguments[0]] = arguments[1];
                        }else if(typeof arguments[1] == "object"){
                            window.sessionStorage[arguments[0]] = JSON.stringify(arguments[1]);
                        }else{
                            return false;
                        }
                    }
                }
                return true;
            },
            /**
             * 获取百分比
             * @param num
             * @param total
             * @returns
             */
            fnGetPercent : function(num, total) { 
         	   num = parseFloat(num); 
         	   total = parseFloat(total); 
         	   if (isNaN(num) || isNaN(total)) { 
         	   return "-"; 
         	   } 
         	   return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + 1 + "%");
         	   } ,
         	
       //html转义
        html_encode : function (str)
        {
            var s = str;
            if (s.length == 0) return "";
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            s = s.replace(/\n/g, "<br>");
            return s;
        },

        html_decode: function(str)
        {
            var s = str;
            if (s.length == 0) return "";
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/<br>/g, "\n");
            return s;
        },
        //json数组转json对象
        arryToJson: function (arrObject)
		{
			var o = {};
			$(arrObject).each(function (i, e) {
				for(key in e){
					o[key] = e[key];
				}
			});
			return o;
		},
        fnMoreToNewsList: function (obj,channelid,classsql){
            var title = encodeURI(obj.find('h2').text());
            var toNewList = '';
            if(!classsql){
                toNewList = '/news/public/newsList.jsp?channelid='+channelid+'&classsql=&title='+title+'';
            }else{
                toNewList = '/news/public/newsList.jsp?channelid='+channelid+'&classsql=' + classsql + '&title='+title+'';
            }
            obj.find('a').attr('href',toNewList);
        },

        fnCurrentToNewsList: function (obj,channelid,classsql){
            var title = encodeURI(obj.text());
            var toNewList = '/news/public/newsList.jsp?channelid='+channelid+'&classsql='+classsql+'&title='+title+'';
            obj.attr('href',toNewList);
        },
        fnCurrentToEduList: function (obj,type){
            var title = encodeURI(obj.text());
            var toNewList = '/news/public/eduNewsList.jsp?type='+type+'&title='+title+'';
            obj.attr('href',toNewList);
        },
        /*字符转日期*/
		stringToDate :function(DateStr){
			if(typeof DateStr=="undefined")return new Date();
			if(typeof DateStr=="date")return DateStr;
			var converted = Date.parse(DateStr);
			var myDate = new Date(converted);
			if(isNaN(myDate)){DateStr=DateStr.replace(/:/g,"-");
				DateStr=DateStr.replace(" ","-");
				DateStr=DateStr.replace(".","-");
				var arys= DateStr.split('-');
				switch(arys.length){
					case 7 : myDate = new Date(arys[0],--arys[1],arys[2],arys[3],arys[4],arys[5],arys[6]);break;
					case 6 : myDate = new Date(arys[0],--arys[1],arys[2],arys[3],arys[4],arys[5]);break;
					default: myDate = new Date(arys[0],--arys[1],arys[2]);break;
				}
			}
			return myDate;
		},
	    fnSessionStorageGet : function(params){
    		return sessionStorage[params] || false;
    	},
    	fnSessionStorageSet : function(params , value){
    		if(typeof value != "string"){
    			sessionStorage[params] = JSON.stringify(value);
    		}else{
        		sessionStorage[params] = value;
    		}
    	}
    };
    // 实例化
    window.oFunctionCase = new oFunction();
    $.fn.fnSrc = function(sSrc , sErrorSrc){
        var sFinalSrc = sSrc || sErrorSrc;
        this.attr("src" , sFinalSrc);
        if(sErrorSrc){
            this.each(function () {
                $(this).on('error', function () {
                    $(this).attr('src', sErrorSrc);
                });
            });
        }
    };
    $.fn.fnLoadError = function (_) {
        this.each(function () {
            $(this).on('error', function () {
                $(this).attr('src', _);
            });
        });
    };
    // 表单数据序列化成对象
    $.fn.serializeObject = function()
    {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }
})(window, jQuery);
