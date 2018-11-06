/*查看图片*/
function lookImgFun(imgURLArr, imgInfoArr, id, flag) {
	$("#" + id + " .ImgChangeLeftWarp").attr('flag', flag);
	$("#" + id + " .ImgChangeRightWarp").attr('flag', flag);
	var begin = flag - 2;
	if (begin < 0) {
		begin = 0;
	}
	var end = begin + 5;
	var len = imgURLArr.length;
	if (end > len) {
		end = len
	}
	addImgList(imgURLArr, imgInfoArr, begin, end, len, id)
	$("#" + id + " .ImgChangeLeftWarp").on("click", function () {
		begin -= 2;
		if (begin < 0) {
			begin = 0;
		}
		end = begin + 5;
		addImgList(imgURLArr, imgInfoArr, begin, end, len, id);
	})
	$("#" + id + " .ImgChangeRightWarp").on("click", function () {
		begin += 2;
		end += 2;
		addImgList(imgURLArr, imgInfoArr, begin, end, len, id);
	})
}

function addImgList(imgURLArr, imgInfoArr, begin, end, len, id) {
	if (end > len) {
		end = len
	}
	if (begin == 0) {
		$("#" + id + " .ImgChangeLeftBtn").addClass("ImgChangeUnclick")
		$("#" + id + " .ImgChangeLeftWarp").addClass("botImgChangeUnclick")
	} else {
		$("#" + id + " .ImgChangeLeftBtn").removeClass("ImgChangeUnclick")
		$("#" + id + " .ImgChangeLeftWarp").removeClass("botImgChangeUnclick")
	}
	if (end == len) {
		$("#" + id + " .ImgChangeRightBtn").addClass("ImgChangeUnclick")
		$("#" + id + " .ImgChangeRightWarp").addClass("botImgChangeUnclick")
	} else {
		$("#" + id + " .ImgChangeRightBtn").removeClass("ImgChangeUnclick")
		$("#" + id + " .ImgChangeRightWarp").removeClass("botImgChangeUnclick")
	}
	/*添加内容*/
	$("#" + id + " .botImgBody").html("");

	var flag = Number($("#" + id + " .ImgChangeLeftWarp").attr('flag'));
	$("#" + id + " .imgActive").removeClass("imgActive");
	for (var i = begin; i < end; i++) {
		var isclick = '';
		if (i == flag) {
			isclick = 'imgActive';
			$("#" + id + " .top_bigImg").attr("src", imgURLArr[i])
		}
		var html = '<div class="botImgInfoWarp ' + isclick + '" index="' + i + '"><img src="' + imgURLArr[i] + '" onerror="' + ImgErrorFun(1) + '"/><div class="botImgInfoText">' + imgInfoArr[i] + '</div></div>'
		$("#" + id + " .botImgBody").append(html);
	}

	$("#" + id + " .botImgInfoWarp").on("click", function () {
		$("#" + id + " .imgActive").removeClass("imgActive")
		$(this).addClass("imgActive")
		$("#" + id + " .top_bigImg").attr("src", $(this).find("img").attr("src"));
		var flag = $(this).attr('index');
		$("#" + id + " .ImgChangeLeftWarp").attr('flag', flag);
		$("#" + id + " .ImgChangeRightWarp").attr('flag', flag);
	})
}
/*自适应*/
function rateFun() {
	var rateX = $(window).innerWidth() / 1920;
	$(document.body).css({
		"transform": "scale(" + rateX + ")",
		"transform-origin": "left top"
	});
	window.onresize = function () {
		var rateX = $(window).innerWidth() / 1920;
		$(document.body).css({
			"transform": "scale(" + rateX + ")",
			"transform-origin": "left top"
		});
	};
}
//返回月和日
function getMonthAndDay(num) {
	if (num < 10) {
		num = "0" + num;
	}
	return num
}
//tab页
function tabFun(id, fistShowDiv) {
	$("#" + id + " .tab_content:eq(" + fistShowDiv + ")").show()
	$("#" + id + " .tabBtn_active").removeClass("tabBtn_active")
	$("#" + id + " .tabBtn:eq(" + fistShowDiv + ")").addClass("tabBtn_active")
	$("#" + id + " .tabBtn").on("click", function () {
		$("#" + id + " .tabBtn").removeClass("tabBtn_active");
		$(this).addClass("tabBtn_active");
		$("#" + id + " .tab_content").hide()
		$("#" + id + " .tab_content:eq(" + $(this).index() + ")").show()
	})
}
//滚动
function rollFun(id, time) {
	setInterval(function () {
		var n = $("#" + id + " .roll").css("top");
		var rn = parseInt(n);
		var h = $("#" + id + " .roll1").height();
		var rh = -h;
		if (rn == rh) {
			$("#" + id + " .roll").css("top", "0px");
		} else {
			var change = (rn - 1) + "px";
			$("#" + id + " .roll").css("top", change);
		}
	}, time);
}
//图片错误类型
function ImgErrorFun(num) {
	var errorSrc;
	switch (num) {
		case 0:
			errorSrc = '/static/image/public/undefined.png';
			break;
		case 1:
			errorSrc = '../image/MC/common/policeRoom_noInfo.png';
			break;
	}
	var errorJs = "javascript:this.src='" + errorSrc + "'";
	return errorJs
}
//筛选
function screenFun(id, arr) {
	$("#" + id).addClass("screen")
	for (var i in arr) {
		var contentHtml = "";
		for (var j in arr[i]) {
			if (j > 0) {
				if (j == 1) {
					contentHtml += '<span class="screenContent screenActive">' + arr[i][j] + '</span>'
				} else {
					contentHtml += '<span class="screenContent">' + arr[i][j] + '</span>'
				}
			}
		}
		var rowsHtml = '<div class="screenRows"><span class="screenType">' + arr[i][0] + '</span><span class="screenSolid"></span>' + contentHtml + '</div>';
		$("#" + id).append(rowsHtml)
	}
	$("#" + id + " .screenContent").on("click", function () {
		var index = $(this).parent().index()
		$("#" + id + " .screenRows:eq(" + index + ") .screenContent").removeClass("screenActive")
		$(this).addClass("screenActive")
	})
}
//人员标签class类别
var classType = {
	"部恐": 1,
	"重点": 2,
	"国": 3,
	"经": 4,
	"治": 5,
	"恐": 6,
	"禁": 7,
	"网": 8,
	"刑": 9,
	"市局": 10,
	"火眼": 11,
};
/**
 * TODO:人员标签
 * 
 * @param {any} data 标签
 * @param {any} type 显示标签个数
 */
function personLabel(data, count) {
	var labelArr = data.split(',');
	var labelHtml = '';
	if (count) {
		labelArr = labelArr.slice(0, count);
	}
	$.each(labelArr, function (i, e) {
		var labelName = e.split('|')[0];
		var labelText = e.split('|')[1];
		var labelClass = '';
		switch (labelName) {
			case '刑':
				labelClass = 'theme-9';
				break;
			case '治':
				labelClass = 'theme-5';
				break;
			case '重点':
				labelClass = 'theme-2';
				break;
			case '经':
				labelClass = 'theme-3';
				break;
			case '禁':
				labelClass = 'theme-1';
				break;
			case '国':
				labelClass = 'theme-6';
				break;
			default:
				labelClass = 'theme-8';
		}
		labelHtml += '<div class="msg-tab ' + labelClass + '" > ' +
			'<span class="tab-lf">' + labelName + '</span><span class="tab-lr">' + labelText + '</span>' +
			'</div>';
	});
	return labelHtml
}
//复选框二级样式
function boxMore(id) {
	$("#" + id + " :checkbox").on("click", function () {
		if ($(this).attr("index") == 0) {
			if ($("#" + id + " :checkbox").prop("checked")) {
				$("#" + id + " :checkbox").prop("checked", true);
				$("#" + id + " .infoboxChoose").removeClass("infoboxChoose")
			} else {
				$("#" + id + " :checkbox").prop("checked", false);
			}
		} else {
			var checkboxArr = $("#" + id + " :checkbox");
			var chooseNum = 0;
			for (var i in checkboxArr) {
				if (i != 0) {
					if (checkboxArr[i].checked) {
						chooseNum++;
					}
				}
			}
			if (chooseNum > 0 && chooseNum != checkboxArr.length - 1) {
				$("#" + id + " :checkbox:eq(0)").prop("checked", false)
				$("#" + id + " :checkbox:eq(0)").addClass("infoboxChoose")
			}
			if (chooseNum == checkboxArr.length - 1) {
				$("#" + id + " .infoboxChoose").removeClass("infoboxChoose")
				$("#" + id + " :checkbox:eq(0)").prop("checked", true)
			}
			if (chooseNum == 0) {
				$("#" + id + " :checkbox:eq(0)").prop("checked", false)
				$("#" + id + " .infoboxChoose").removeClass("infoboxChoose")
			}
		}
	})
}
//iframe高度
function iframeMinHeight(id) {
	/*	if (window.screen.width != 1920) {*/
	var h = window.innerHeight - $(".page_bg").height();
	$("#" + id).css("min-height", h);
	/*	}*/
}
//页脚
function footerFun(num) {
	var h = window.innerHeight - $(".page_bg").height() - $(".footer").height() + 80;
	if (num) {
		h -= num;
	}
	$(".safe_width").css("min-height", h)
}
//提示框
function createHint(flag, info) {
	var cname1;
	var cname2;
	var cname3;
	switch (flag) {
		case 0:
			cname1 = "errorHint";
			cname2 = "errorHintText";
			cname3 = "！"
			break;
		case 1:
			cname1 = "successHint";
			cname2 = "successHintText";
			cname3 = "√"
			break;
	}
	var hintHtml = '<div class="hintBox" id="createHintBox"><span class="hintImg ' + cname1 + '">' + cname3 + '</span><span class="hintText ' + cname2 + '">' + info + '</span></div>'
	$("body").append(hintHtml)
	$("#createHintBox").addClass("hintBoxAnimation")
	var removeHintBox = setTimeout(function () {
		$("#createHintBox").remove();
	}, 4000);
}

function showHint(info) {
	var cname1 = "errorHint";
	var cname2 = "errorHintText";
	var time = new Date();
	var year = time.getFullYear();
	var month = time.getMonth();
	var day = time.getDate();
	var hour = time.getHours();
	var minute = time.getMinutes();
	var second = time.getSeconds();
	var hintHtml = '<div class="hintBox" id="showHint' + year + month + day + hour + minute + second + '"><div class="dataloading_content"><div class="dataloading_content_one"><div class="dataloadingdic dataloadingdic1"></div><div class="dataloadingdic dataloadingdic2"></div><div class="dataloadingdic dataloadingdic3"></div><div class="dataloadingdic dataloadingdic4"></div></div><div class="dataloading_content_two"><div class="dataloadingdic dataloadingdic5"></div><div class="dataloadingdic dataloadingdic6"></div><div class="dataloadingdic dataloadingdic7"></div><div class="dataloadingdic dataloadingdic8"></div></div></div><span class="hintText ' + cname2 + '">' + info + '</span></div>'
	$("body").append(hintHtml);
	return 'showHint' + year + month + day + hour + minute + second;
}

function hideHint(id) {
	if (id) {
		$('#' + id).remove();
	}
}
//日历面板
function createRl(rldata) {
	var toTime = new Date();
	var nowMonth = toTime.getMonth();
	var nowYear = toTime.getFullYear();
	var nowToday = toTime.getDate();
	if (!rldata.year) {
		rldata.year = nowYear;
	}
	if (!rldata.month && rldata.month != 0 && rldata.month != 1) {
		rldata.month = nowMonth;
	}
	rldata.today = nowToday;
	rldata.nowYear = nowYear;
	rldata.nowMonth = nowMonth;
	rldata.nowToday = nowToday;
	rlFun(rldata)
}
var chooseTime = 0;

function rlFun(rldata) {
	chooseTime = 0;
	var id = rldata.id
	var year = rldata.year
	var month = rldata.month
	var today = rldata.today
	var monthIndex = rldata.month + 1
	$("#" + id).html("")
	var rlHtml = '<div class="rl"><div class="yearAndMonth"><div class="rlRadio rlRadio0"></div><div class="rlRadio rlRadio1"></div><div class="rlRadio rlRadio2"></div><span><div class="changeBtn leftBtn" btnIndex="0"></div></span><span class="nowYear" ></span><span><span class="nowMonth" index="' + monthIndex + '"></span>月</span><span class="topTitle"></span><span><div class="changeBtn rightBtn" btnIndex="1"></div></span></div><div class="rlModel"><div class="weekdays"><div class="weekday">日</div><div class="weekday">一</div><div class="weekday">二</div><div class="weekday">三</div><div class="weekday">四</div><div class="weekday">五</div><div class="weekday">六</div></div><div class="rlDayList"></div></div>'
	if (rldata.isRight) {
		rlHtml += '<div class="rlRight"><div class="rlrTop"></div><div class="rlrInfo"></div></div>'
	}
	rlHtml += '<div style="clear: both;"></div></div>'
	$("#" + id).append(rlHtml)
	if (!rldata.isBtn) {
		$("#" + id + " .changeBtn").hide()
	}
	if (!rldata.istopTitle) {
		$("#" + id + " .topTitle").hide()
	}
	var monthStr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
	var chineseMonth = monthStr[month];
	$("#" + id + " .nowMonth").html(chineseMonth)
	$("#" + id + " .nowYear").html(year)
	var ssdate = new Date(year, month, 1).getDay(); //0-6:ri-6
	var days;
	//				判断月份天数
	switch (month) {
		case 3:
		case 5:
		case 8:
		case 10:
			days = 30;
			break;
		case 1:
			if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
				days = 29;
			} else {
				days = 28;
			};
			break;
		default:
			days = 31;
			break;
	}
	//				rows总数
	var allRows = Math.ceil((ssdate + days) / 7);
	for (var i = 0; i < allRows; i++) {
		var rows = '<div class="rlListRows"></div>'
		$("#" + id + " .rlDayList").append(rows)
	}
	//				是否有右边
	if (rldata.isRight) {
		$("#" + id + " .rl ").css("width", "500px")
		for (var i = 0; i < allRows; i++) {
			var rlrHtml = '<div class="rlriDiv"><span class="rlriInfo"></span></div>'
			$("#" + id + " .rlrInfo").append(rlrHtml)
		}
	}
	//				添加日期
	var dayIndex = 0;
	if (ssdate > 0) {
		for (var i = 0; i < ssdate; i++) {
			var ods = "<div class='otherDaysDiv'></div>";
			$("#" + id + " .rlListRows:eq(0)").append(ods)
			dayIndex++;
		}
	}
	for (var i = 0; i < days; i++) {
		var addDay = i + 1
		var tds = '<div class="daysDiv"><div class="days"><div class="daysNum">' + addDay + '</div></div><div class="daysText"></div></div>'
		var addRows = Math.floor(dayIndex / 7)
		$("#" + id + " .rlListRows:eq(" + addRows + ")").append(tds)
		dayIndex++
	}
	//				日期点击
	if (!rldata.isRadio) {
		$("#" + id + " .daysDiv").on("click", function () {
			chooseTime++
			if (chooseTime > 2) {
				$(".daysDivActive").removeClass("daysDivActive")
				chooseTime = 1;
			}
			$(this).addClass("daysDivActive")
		})
	} else {
		$("#" + id + " .daysDiv").on("click", function () {
			$("#" + id + " .daysDivActive").removeClass("daysDivActive")
			$(this).addClass("daysDivActive")
		})
	}
	//				是否显示今天
	if (today) {
		if (rldata.nowYear == rldata.year && rldata.nowMonth == rldata.month) {
			var todayNum = today - 1
			$("#" + id + " .daysDiv:eq(" + todayNum + ")").addClass("daysDivToday")
		}
	}
	//				切换按钮
	$("#" + id + " .changeBtn").on("click", function () {
		var btnIndex = $(this).attr("btnindex");
		if (btnIndex == 0) {
			rldata.month -= 1;
			if (rldata.month < 0) {
				rldata.month = 11;
				rldata.year -= 1;
			}
		} else {
			rldata.month += 1;
			if (rldata.month > 11) {
				rldata.month = 0;
				rldata.year += 1;
			}
		}
		if (rldata.nowYear == rldata.year && rldata.nowMonth == rldata.month) {
			rldata.today = rldata.nowToday
		} else {
			rldata.today = ""
		}
		rlFun(rldata)
	})
}

//时间轴格式转换
Date.prototype.Format = function (fmt) { //
	var o = {
		"M+": this.getMonth() + 1, //Month
		"d+": this.getDate(), //Day
		"h+": this.getHours(), //Hour
		"m+": this.getMinutes(), //Minute
		"s+": this.getSeconds(), //Second
		"q+": Math.floor((this.getMonth() + 3) / 3), //Season
		"S": this.getMilliseconds() //millesecond
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
//时间格式转换
function timeChange(time) {
	var timeStr = "";
	timeStr += time.substring(0, 4);
	timeStr += "-" + time.substring(4, 6);
	timeStr += "-" + time.substring(6, 8);
	timeStr += " " + time.substring(8, 10);
	timeStr += ":" + time.substring(10, 12);
	timeStr += ":" + time.substring(12, 14);
	return timeStr;
}

//表格行点击选中事件
function tableTr(tableId) {
	$("#" + tableId + " tr").on("click", function () {
		$("#" + tableId + " tbody tr").removeClass("listTrActive")
		$("#" + tableId + " tbody tr:eq(" + $(this).index() + ")").addClass("listTrActive")
	})
}

//加载动画
function load() {
	$(".loadModal").show()
	var num = 0;
	var jd = setInterval(function () {
		num += Math.ceil(Math.random() * 10 + 20);
		if (num > 100) {
			$(".loadModal").hide();
			clearInterval(jd);
			num = 0;
		}
		var numText = num + "%"
		$(".loadText").html(numText);
	}, 300)
}
//图片分组查看
function pictureGroup(imgURL, imgInfo, id) {
	//	初始化宽度
	var indexRowW = $(".img_index_row").width();
	var index_row_width = (indexRowW - 60) + "px"
	$(".index_row").css("width", index_row_width);
	var nowGroup = 0; //	当前分组数
	var maxGroup = Math.ceil(imgURL.length / 5)
	groupChange(nowGroup, imgURL, imgInfo)
	$(".img_index_right").on("click", function () {
		nowGroup++;
		groupChange(nowGroup, imgURL, imgInfo)
	})
	$(".img_index_left").on("click", function () {
		nowGroup--;
		groupChange(nowGroup, imgURL, imgInfo)
	})

	function groupChange(nowGroup, imgURL, imgInfo) {
		$(".img_index_left,.img_index_right").removeClass("index_img_lr_unClick")
		$(".img_index_left>div,.img_index_right>div").removeClass("index_img_lrbtn_unClick")
		if (nowGroup == 0) {
			$(".img_index_left").addClass("index_img_lr_unClick")
			$(".img_index_left>div").addClass("index_img_lrbtn_unClick")
		}
		if (nowGroup == maxGroup - 1) {
			$(".img_index_right").addClass("index_img_lr_unClick")
			$(".img_index_right>div").addClass("index_img_lrbtn_unClick")
		}
		var nowImgURL = []; //当组图片
		var nowImgInfo = []; //当组图片信息
		var startNum = nowGroup * 5; //开始数
		var endNum = startNum + 5; //结束数
		for (var i = startNum; i < endNum; i++) {
			if (i < imgURL.length) {
				nowImgURL.push(imgURL[i])
				nowImgInfo.push(imgInfo[i])
			}
		}
		$(".index_img_choose").removeClass("index_img_choose_active index_img_choose_unClick") //移除选中样式
		$(".index_img_choose:eq(0)").addClass("index_img_choose_active") //添加选中样式
		$(".picture_group_images").attr("src", nowImgURL[0]); //显示当前组第一张图片
		for (var i = 0; i < 5; i++) {
			if (i < nowImgInfo.length) {
				$(".index_img_choose:eq(" + i + ")").html("<span title='" + nowImgInfo[i] + "'>" + nowImgInfo[i] + "</span>")
			} else {
				$(".index_img_choose:eq(" + i + ")").html("")
				$(".index_img_choose:eq(" + i + ")").addClass("index_img_choose_unClick")
			}
		}
		$(".index_img_choose").on("click", function () {
			$(".index_img_choose").removeClass("index_img_choose_active");
			var index = $(this).index();
			$(".index_img_choose:eq(" + index + ")").addClass("index_img_choose_active");
			$(".picture_group_images").attr("src", nowImgURL[index])
		})
		$(".picture_group_images").on("click", function () {
			var imgIndex = $(".index_img_choose_active").index()
			imgChange(imgIndex, nowImgURL, id)
		})
	}
}

//点击放大图片

function imgChange(imgIndex, imgURL, id) {
	//	图片数组长度
	var imgLen = imgURL.length - 1;
	//	打开模态框
	$("#" + id).show();
	//	改变图片路径
	var imgURLsrc = "url(" + imgURL[imgIndex] + ")"
	$("#" + id).css("background-image", imgURLsrc)
	//	关闭模态框
	$("#" + id + " .imgModelClose").on("click", function () {
		$("#" + id).hide();
	})
	//	点击左键
	$("#" + id + " .imgModelLeft").on("click", function () {
		if (imgIndex == 0) {
			imgIndex = imgLen + 1;
		}
		imgIndex--;
		var imgURLsrc = "url(" + imgURL[imgIndex] + ")"
		$("#" + id).css("background-image", imgURLsrc)

	})
	//	点击右键
	$("#" + id + " .imgModelRight").on("click", function () {
		if (imgIndex == imgLen) {
			imgIndex = -1;
		}
		imgIndex++;
		var imgURLsrc = "url(" + imgURL[imgIndex] + ")"
		$("#" + id).css("background-image", imgURLsrc)
	})
	//	判断左右切换按钮
	function imgIndexFun(imgLen, imgIndex) {
		$("#" + id + " .imgModelLeft,#" + id + " .imgModelRight").removeClass("imgModelUnClick")
		if (imgIndex == 0) {
			$("#" + id + " .imgModelLeft").addClass("imgModelUnClick")
		} else if (imgIndex == imgLen) {
			$("#" + id + " .imgModelRight").addClass("imgModelUnClick")
		}
	}
}

//js添加无数据
function noInfo(idclass, style) {
	var html = '<div class="noInfo" style="' + style + '"><img class="noInfoImg" src="../../static/image/public/noInfo.png"><p>无数据</p></div>'
	$(idclass).append(html);
}

//图片切换ball
function pictureBall(imgURL) {
	$(".picture_ball_images").attr("src", imgURL[0])
	for (var i = 0; i < imgURL.length; i++) {
		var html = '<span class="change_ball"></span>'
		if (i == 0) {
			html = '<span class="change_ball change_ball_active"></span>'
		}
		$(".ball_row").append(html)
	}
	$(".change_ball").on("click", function () {
		$(".change_ball").removeClass("change_ball_active");
		var index = $(this).index();
		$(".change_ball:eq(" + index + ")").addClass("change_ball_active");
		$(".picture_ball_images").attr("src", imgURL[index])
	})
}

//折叠菜单
function foldEvent() {
	$(".fold_head_hide").on("click", function () {
		var index = $(this).parent().parent().index();
		if ($(this).attr("class").indexOf('hide_content') > -1) {
			$(this).removeClass("hide_content");
		} else {
			$(this).addClass("hide_content");
		}
		$(".fold_content:eq(" + index + ")").fadeToggle();
	})
}
//echart
function initMapChart(id, option) {
	var myChart = echarts.getInstanceByDom(document.getElementById(id));
	if (myChart != undefined) {
		myChart.dispose();
		myChart = echarts.init(document.getElementById(id));
		myChart.showLoading();
		myChart.setOption(option);
		myChart.hideLoading();
	} else {
		myChart = echarts.init(document.getElementById(id));
		myChart.showLoading();
		myChart.setOption(option);
		myChart.hideLoading();
	}
	return myChart;
};
// 浮动
//searchId 查询框
//ppId 分页
//title 页眉
function myfunction(searchId, ppId, title) {
	$(window).scroll(function () {
		//页头
		if (document.body.scrollTop > $(".page_bg").height()) {
			$(title).css({
				"position": "fixed",
			})
		} else {
			$(title).css({
				"position": "relative",
			})
		}
		var searchTop;
		if (title) {
			searchTop = "80px";
		} else {
			searchTop = "0px";
		}
		/* 搜索框 */
		if (document.body.scrollTop > $(".page_bg").height()) {
			$(searchId).css({
				"position": "fixed",
				"top": searchTop,
				/*"left" : $(searchId).offset().left,*/
				"z-index": 9,
			})
		} else {
			$(searchId).css({
				"position": "relative",
				"left": "0px"
			})
		}
		// 分页
		var sh = document.body.scrollHeight - window.innerHeight - $(".footer").height()
		if (sh <= document.body.scrollTop) {
			$(ppId).css({
				"position": "relative",
				"left": "0px"
			})
		} else {
			$(ppId).css({
				"position": "fixed",
				"left": $(ppId).offset().left,
				"bottom": "0px",

			})
		}
	})
}

// 下拉框(可动态搜索)
// id_class input的class
// selected 选中的样式的class
function selectUl() {
	$('.select_down').on('click', function () {
		$(this).parent().find('.select_ul').show();
		$(this).val('');
	})
	// 选中
	$('.select_ul').on('click', 'li', function () {
		$(this).parent().children().each(function () {
			$(this).removeClass('select_selected');
			$(this).show();
		})
		$(this).addClass('select_selected');
		$(this).parent().parent().find('.select_down').val($(this).text());
		$(this).parent().parent().find('.select_down').attr('placeholder', $(this).text());
		$(this).parent().parent().find('.select_down').attr('index', $(this).attr('value'));
		$(this).parent().hide();
		$(this).parent().parent().find('.select_down').trigger('change'); //默认执行change事件
	})
	// 动态搜索
	$('.select_down').on('input', function () {
		$(this).parent().find('.select_ul').show();
		var inputInner = $(this).val();
		$(this).parent().find('.select_ul').children().each(function () {
			if (($(this).text().toLowerCase()).indexOf(inputInner.toLowerCase()) > -1) {
				$(this).show();
			} else {
				$(this).hide();
			}
		})
	})
	//失去焦点 隐藏下拉框
	$('.select_down').blur(function () {
		var flag = this;
		$(this).val($(this).attr('placeholder'));
		$(document).on('click', function (e) {
			if (!($(e.target).parent().is('.select_ul'))) {
				$(flag).attr('placeholder', '');
				$(flag).val('');
				$(flag).attr('index', '');
				$(flag).parent().find('.select_ul').hide();
			}
			$(document).off('click');
		})
	})
}

/* 时间插件
 * 在该js文件之前引用时间插件
 * ['今天','昨天','本周','上周','本月','上月','今年','全部']
 * dateFormat "yyyy-MM-dd HH:mm" 时间显示格式
 * datePanel 时间面板显示的内容   存在则有开始时间和结束时间  不存在则只有单个时间
 * defaultRange 默认时间范围
 * */
function DateShow(dateId, dateFormat, datePanel, defaultRange) {
	var startTimeOut = document.createElement("div");
	$(startTimeOut).addClass('time_out');
	var startTime = document.createElement("input"); //开始时间
	startTime.id = dateId + 'Start';
	$(startTime).addClass('date_style');
	$('#' + dateId).addClass('date_type');
	if (datePanel == undefined) { //单个
		$(startTime).on('click', function () {
			WdatePicker({
				el: startTime,
				dateFmt: dateFormat,
			});
		})
		$(startTimeOut).append(startTime);
		$('#' + dateId).append(startTimeOut);
	} else { //开始时间和结束时间
		ary = [{
			"name": "今天", // 文本
			"startTime": "0_DAY", // 选项值
			"startType": "00:00:00", // 日期类型:start开始00:00:00
			"endType": "23:59:59", //日期类型:end开始23:59  若空则默认为当前
		}, {
			"name": "昨天",
			"startTime": "-1_DAY", // 选项值
			"startType": "00:00:00", // 日期类型：start开始00:00:00
			"endType": "23:59:59"
		}, {
			"name": "本周", // 文本
			"startTime": "0_WEEK", // 选项值
			"startType": "00:00:00", // 日期类型：start开始00:00:00
			"endType": "23:59:59"
		}, {
			"name": "上周",
			"startTime": "-1_WEEK", // 选项值
			"startType": "00:00:00", // 日期类型：start开始00:00:00
			"endType": "23:59:59"
		}, {
			"name": "本月",
			"startTime": "0_M", // 选项值
			"startType": "00:00:00", // 日期类型：start开始00:00:00
			"endType": "23:59:59"
		}, {
			"name": "上月",
			"startTime": "-1_M", // 选项值
			"startType": "00:00:00", // 日期类型：start开始00:00:00
			"endType": "23:59:59"
		}, {
			"name": "今年",
			"startTime": "0_Y", // 选项值
			"startType": "00:00:00", // 日期类型：start开始00:00:00
			"endType": "23:59:59"
		}, {
			"name": "全部",
			"startTime": "ALL_ALL",
			"startType": "00:00:00",
			"endType": "23:59:59"
		}];
		var $data = [];
		var flag = defaultRange;
		for (var i = 0; i < datePanel.length; i++) { // data
			for (var j = 0; j < ary.length; j++) { // ary
				if (datePanel[i] == ary[j].name) {
					$data.push(ary[j]);
				}
			}
			if (defaultRange && defaultRange < datePanel.length) {
				flag = defaultRange
			} else {
				if (datePanel[i] == '本月') {
					flag = i;
				}
			}
		}
		var timePanel = document.createElement("div");
		var itemPanel = null;
		$.each($data, function (index, item) {
			itemPanel = document.createElement("div");
			itemPanel.innerHTML = item.name;
			itemPanel.startTime = item.startTime;
			itemPanel.startType = item.startType;
			itemPanel.endType = item.endType;
			$(itemPanel).addClass('time_panel_li');
			$(itemPanel).click(function () {
				$(this).parent().children().removeClass(
					"time_panel_select");
				$(this).addClass("time_panel_select");
				getPanelTime(this, startTime, endTime, dateFormat);
				$(timePanel).hide();
			});
			$(timePanel).append(itemPanel);
		});
		$(timePanel).css({
			"position": "absolute",
			"border": "1px solid #cccccc",
			"background-color": "#ffffff",
			"display": "none",
			"z-index": "100",
		});

		var panel_title = document.createElement("span");
		$(panel_title).addClass('panel_title');
		$(panel_title).on('click', function () {
			var $flag = this;
			$(timePanel).toggle();
			$(timePanel).css({
				'width': ($(this).parent().find('.date_style').eq(0).width() + 5) + 'px',
				"left": '25px',
			})
			$(document).on('click', function (e) {
				if (!(e.target == $flag) && !($(e.target).is('.time_panel_li'))) {
					$(timePanel).hide();
					$(document).off('click');
				}
			})
		})

		$(startTime).on('click', function () {
			WdatePicker({
				el: startTime,
				dateFmt: dateFormat,
				maxDate: '#F{$dp.$D(\'' + dateId + 'End\')||\'%y-%M-%d 23:59:59\'}',
			});
		})
		var endTimeOut = document.createElement("div");
		$(endTimeOut).addClass('time_out');
		var endTime = document.createElement("input");
		endTime.id = dateId + 'End';
		$(endTime).addClass('date_style');
		$(endTime).on('click', function () {
			WdatePicker({
				el: endTime,
				dateFmt: dateFormat,
				minDate: '#F{$dp.$D(\'' + dateId + 'Start\')}',
				maxDate: '%y-%M-%d 23:59:59',
			});
		})
		var start_end = document.createElement("span");
		start_end.innerText = '-';
		$(start_end).addClass('start_end');
		$('#' + dateId).append(panel_title);
		$(startTimeOut).append(startTime);
		$('#' + dateId).append(startTimeOut);
		$('#' + dateId).append(start_end);
		$(endTimeOut).append(endTime);
		$('#' + dateId).append(endTimeOut);
		$('#' + dateId).append(timePanel);
		$(timePanel).children().eq(flag).trigger('click');
	}

}
//时间面板
function getPanelTime(cont, start, end, dataFormat) {
	var startTime = '';
	var endTime = '';
	var date = new Date();
	var time = date.getTime();
	var type = cont.startTime.split('_');
	switch (type[1]) {
		case 'DAY': //天
			if (type[0] == '-1') { //昨天
				date.setTime(time - 24 * 60 * 60 * 1000);
				var dateAry = getTimeType(date);
				var startType = [];
				if (cont.startType != '') {
					startType = cont.startType.split(':');
					for (var i = 3; i < (3 + startType.length); i++) {
						dateAry[i] = startType[i - 3];
					}
				}
				startTime = repaceStr(dataFormat, dateAry);

				var endType = [];
				if (cont.endType != '') {
					endType = cont.endType.split(':');
					for (var i = 3; i < (3 + endType.length); i++) {
						dateAry[i] = endType[i - 3];
					}
				}
				endTime = repaceStr(dataFormat, dateAry);
				$(start).val(startTime);
				$(end).val(endTime);
			} else { //今天
				var dateAry = getTimeType(date);
				var startType = [];
				if (cont.startType != '') {
					startType = cont.startType.split(':');
					for (var i = 3; i < (3 + startType.length); i++) {
						dateAry[i] = startType[i - 3];
					}
				}
				startTime = repaceStr(dataFormat, dateAry);

				var endType = [];
				if (cont.endType != '') {
					endType = cont.endType.split(':');
					for (var i = 3; i < (3 + endType.length); i++) {
						dateAry[i] = endType[i - 3];
					}
				}
				endTime = repaceStr(dataFormat, dateAry);
				$(start).val(startTime);
				$(end).val(endTime);
			}
			break;
		case 'WEEK':
			if (type[0] == '-1') { //上周
				var dates = getTimeType(date);
				var weekedStart = new Date(dates[0], (dates[1] - 1), (dates[2] - dates[6] - 7));
				var dateAry = getTimeType(weekedStart);
				if (cont.startType != '') {
					startType = cont.startType.split(':');
					for (var i = 3; i < (3 + startType.length); i++) {
						dateAry[i] = startType[i - 3];
					}
				}
				startTime = repaceStr(dataFormat, dateAry);

				var weekedEnd = new Date(dates[0], (dates[1] - 1), (dates[2] - dates[6] - 1));
				dateAry = getTimeType(weekedEnd);
				if (cont.endType != '') {
					endType = cont.endType.split(':');
					for (var i = 3; i < (3 + endType.length); i++) {
						dateAry[i] = endType[i - 3];
					}
				}
				endTime = repaceStr(dataFormat, dateAry);
				$(start).val(startTime);
				$(end).val(endTime);
			} else {
				var dates = getTimeType(date);
				var weekStart = new Date(dates[0], (dates[1] - 1), (dates[2] - dates[6]));
				var dateAry = getTimeType(weekStart);
				if (cont.startType != '') {
					startType = cont.startType.split(':');
					for (var i = 3; i < (3 + startType.length); i++) {
						dateAry[i] = startType[i - 3];
					}
				}
				startTime = repaceStr(dataFormat, dateAry);

				dateAry = getTimeType(date);
				if (cont.endType != '') {
					endType = cont.endType.split(':');
					for (var i = 3; i < (3 + endType.length); i++) {
						dateAry[i] = endType[i - 3];
					}
				}
				endTime = repaceStr(dataFormat, dateAry);
				$(start).val(startTime);
				$(end).val(endTime);
			}
			break;
		case 'M': //月
			if (type[0] == '-1') {
				date.setDate(1);
				date.setMonth(date.getMonth() - 1);
				var dates = getTimeType(date);
				var monthedStart = new Date(dates[0], date.getMonth(), 1);
				var dateAry = getTimeType(monthedStart);
				if (cont.startType != '') {
					startType = cont.startType.split(':');
					for (var i = 3; i < (3 + startType.length); i++) {
						dateAry[i] = startType[i - 3];
					}
				}
				startTime = repaceStr(dataFormat, dateAry);
				//上个月的天数
				var mondayStart = new Date(dates[0], date.getMonth(), 1);
				var mondayEnd = new Date(dates[0], (date.getMonth() + 1), 1);
				var monday = (mondayEnd - mondayStart) / (1000 * 60 * 60 * 24);

				var monthedEnd = new Date(dates[0], date.getMonth(), monday);
				dateAry = getTimeType(monthedEnd);
				if (cont.endType != '') {
					endType = cont.endType.split(':');
					for (var i = 3; i < (3 + endType.length); i++) {
						dateAry[i] = endType[i - 3];
					}
				}
				endTime = repaceStr(dataFormat, dateAry);
				$(start).val(startTime);
				$(end).val(endTime);
			} else {
				var dates = getTimeType(date);
				var monthStart = new Date(dates[0], (dates[1] - 1), 1);
				var dateAry = getTimeType(monthStart);
				if (cont.startType != '') {
					startType = cont.startType.split(':');
					for (var i = 3; i < (3 + startType.length); i++) {
						dateAry[i] = startType[i - 3];
					}
				}
				startTime = repaceStr(dataFormat, dateAry);

				dateAry = getTimeType(date);
				if (cont.endType != '') {
					endType = cont.endType.split(':');
					for (var i = 3; i < (3 + endType.length); i++) {
						dateAry[i] = endType[i - 3];
					}
				}
				endTime = repaceStr(dataFormat, dateAry);
				$(start).val(startTime);
				$(end).val(endTime);
			}
			break;
		case 'Y': //年
			var dates = getTimeType(date);
			var yearStart = new Date(dates[0], 0, 1);
			var dateAry = getTimeType(yearStart);
			if (cont.startType != '') {
				startType = cont.startType.split(':');
				for (var i = 3; i < (3 + startType.length); i++) {
					dateAry[i] = startType[i - 3];
				}
			}
			startTime = repaceStr(dataFormat, dateAry);

			dateAry = getTimeType(date);
			if (cont.endType != '') {
				endType = cont.endType.split(':');
				for (var i = 3; i < (3 + endType.length); i++) {
					dateAry[i] = endType[i - 3];
				}
			}
			endTime = repaceStr(dataFormat, dateAry);
			$(start).val(startTime);
			$(end).val(endTime);
			break;
		case 'ALL':
			startTime = '';
			dateAry = getTimeType(date);
			if (cont.endType != '') {
				endType = cont.endType.split(':');
				for (var i = 3; i < (3 + endType.length); i++) {
					dateAry[i] = endType[i - 3];
				}
			}
			endTime = repaceStr(dataFormat, dateAry);
			$(start).val(startTime);
			$(end).val(endTime);
			break;
	}
}
//获取时间
function getTimeType(date) {
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var week = date.getDay();
	return dateAry = [year, (month + 1), day, hour, minute, second, week];
}
//转换时间格式
function repaceStr(dataFormat, data) {
	$.each(data, function (index, item) {
		if (Number(item) < 10) {
			data[index] = '0' + Number(item);
		}
	})
	dataFormat = dataFormat.replace('yyyy', data[0]);
	dataFormat = dataFormat.replace('MM', data[1]);
	dataFormat = dataFormat.replace('dd', data[2]);
	dataFormat = dataFormat.replace('HH', data[3]);
	dataFormat = dataFormat.replace('mm', data[4]);
	dataFormat = dataFormat.replace('ss', data[5]);
	return dataFormat;
};

// 获得地址栏参数
// name 参数名
function getUrlString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	if (result != null) {
		return unescape(result[2]);
	}
}
//排序 
//点击事件的最前面调用该函数
//in_class 排序点击
function beOrder() {
	$('.be_order').on('click', function () {
		var group = $(this).attr('index');
		var classes = $(this).attr('class').split(' ');
		var order_class = '';
		$.each(classes, function (index, item) {
			if (item == 'beOrder_0' || item == 'beOrder_1' || item == 'beOrder_2') {
				order_class = item;
				return false;
			}
		})
		var index = Number(order_class.split('_')[1]);
		$.each($('.be_order'), function () {
			if (group == $(this).attr('index')) {
				$(this).removeClass('beOrder_1 beOrder_2');
				$(this).addClass('beOrder_0');
			}
		})
		$(this).removeClass('beOrder_0 beOrder_1 beOrder_2');
		if (index == 2) {
			index = 0;
		}
		$(this).addClass('beOrder_' + (index + 1));
	})

}

//分页
function getPage(id) {
	page = $("#" + id + " .nowpageNum").html();
	if (page == undefined) {
		page = 1;
	}
	return page;
}

function getRows(num, id) {
	rows = parseInt($("#" + id + " .pagesize option:selected").val());
	if (rows == undefined || isNaN(rows)) {
		rows = num;
	}
	return rows;
}
//pageEvent([20, 50, 100], allNum,postInfoData,"pp")
//pageEvent([20, 50, 100], total,自定义方法,ID)
function pageEvent(pageNumList, allNum, thisFun, thisId) {
	$("#" + thisId).html("");
	$("#" + thisId).addClass("page")
	var pageHmtl = '<table><td>每页</td><td><select name="" class="pagesize"></select></td><td>条</td><td><div class="page_btn pre_first"></div></td><td><div class="page_btn pre_btn"></div></td><td><div>第</div></td><td><div class="nowpageNum">1</div></td><td>/</td><td><div class="allpage">1</div></td><td><div>页</div></td><td><div class="page_btn next_btn"></div></td><td><div class="page_btn next_last"></div></td><td><input type="text" name="" id="" value="1" class="nowpage"/></td><td><div class="pageturn">跳转</div></td><td>共&nbsp;<span class="total"></span>&nbsp;条记录</td></table>'
	$("#" + thisId).append(pageHmtl);
	var pageNumList = pageNumList;
	$("#" + thisId + " option").length;
	for (var i = 0; i < pageNumList.length; i++) {
		var option = '<option value="' + pageNumList[i] + '">' + pageNumList[i] + '</option>'
		$("#" + thisId + " .pagesize").append(option)
	}
	var nowpage = 1;
	$("#" + thisId + " .total").html(allNum);
	$("#" + thisId + " .nowpageNum").html(nowpage);
	$("#" + thisId + " .nowpage").val(nowpage);

	var pagesize = parseInt($("#" + thisId + " .pagesize option:selected").val())
	var allpage = Math.ceil(allNum / pagesize);

	if (allpage == 0) {
		$("#" + thisId + " .allpage").html(1);
		$("#" + thisId + " .nowpageNum").html(1);
		clickEvent(nowpage, allpage, thisId);
	} else {
		$("#" + thisId + " .allpage").html(allpage);
		clickEvent(nowpage, allpage, thisId);
		$("#" + thisId + " .pre_first").on("click", function () {
			nowpage = 1;
			clickEvent(nowpage, allpage, thisId);
			thisFun()
		})
		$("#" + thisId + " .pre_btn").on("click", function () {
			nowpage--;
			clickEvent(nowpage, allpage, thisId)
			thisFun()
		})
		$("#" + thisId + " .next_btn").on("click", function () {
			nowpage++;
			clickEvent(nowpage, allpage, thisId)
			thisFun()
		})
		$("#" + thisId + " .next_last").on("click", function () {
			nowpage = allpage;
			clickEvent(nowpage, allpage, thisId)
			thisFun()
		})
		$("#" + thisId + " .pageturn").on("click", function () {
			nowpage = parseInt($("#" + thisId + " .nowpage").val());
			if (nowpage < 1) {
				nowpage = 1;
			} else if (nowpage > allpage) {
				nowpage = allpage
			}
			clickEvent(nowpage, allpage, thisId)
			thisFun()
		})
		$("#" + thisId + " .pagesize").on("change", function () {
			nowpage = 1;
			$("#" + thisId + " .total").html(allNum);
			$("#" + thisId + " .nowpageNum").html(nowpage);
			$("#" + thisId + " .nowpage").val(nowpage);
			pagesize = parseInt($("#" + thisId + " .pagesize option:selected").val())
			allpage = Math.ceil(allNum / pagesize);
			$("#" + thisId + " .allpage").html(allpage)
			clickEvent(nowpage, allpage, thisId)
			thisFun()
		})
	}
}

function clickEvent(nowpage, allpage, thisId) {
	$("#" + thisId + " .nowpageNum").html(nowpage);
	$("#" + thisId + " .nowpage").val(nowpage);
	$("#" + thisId + " .page_btn").removeClass("unClick pre_first_unClick pre_btn_unClick next_btn_unClick next_last_unClick");
	if (nowpage == 1) {
		$("#" + thisId + " .pre_first,#" + thisId + " .pre_btn").addClass("unClick");
		$("#" + thisId + " .pre_first").addClass("pre_first_unClick");
		$("#" + thisId + " .pre_btn").addClass("pre_btn_unClick");
	}
	if (nowpage == allpage) {
		$("#" + thisId + " .next_btn,#" + thisId + " .next_last").addClass("unClick");
		$("#" + thisId + " .next_btn").addClass("next_btn_unClick");
		$("#" + thisId + " .next_last").addClass("next_last_unClick");
	}
	if (allpage == 0) {
		$("#" + thisId + " .pre_first,#" + thisId + " .pre_btn").addClass("unClick");
		$("#" + thisId + " .pre_first").addClass("pre_first_unClick");
		$("#" + thisId + " .pre_btn").addClass("pre_btn_unClick");
		$("#" + thisId + " .next_btn,#" + thisId + " .next_last").addClass("unClick");
		$("#" + thisId + " .next_btn").addClass("next_btn_unClick");
		$("#" + thisId + " .next_last").addClass("next_last_unClick");
	}
}


(function ($) {
	$.fn.extend({
		//下拉复选框
		MSDL: function (options) { /*MultiSelectDropList*/
			//各种属性参数

			var defaults = {
				width: '150', //下拉列表宽 
				maxheight: '180', //下拉列表最大高度
				data: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'], //下拉列表中的数据	
				selectallTxt: '全部', //全选文本
				selectokTxt: '确定', //确认文本
			};
			var options = $.extend(defaults, options);

			return this.each(function () {

				//插件实现代码
				//创建 input输入框
				//readonly:锁住键盘，不能向文本框输入内容  
				var $ipt = $('<input type="text" readonly value="" class="select_rel" />');
				$ipt.width(options.width); //设定文本框宽度

				var $this = $(this);
				$this.width(options.width);
				$ipt.appendTo($this);

				//创建 下拉选项 

				//1.下拉选项包裹
				var $container = $('<div class="container"></div>');

				//2.创建 全选和确认按钮  top层 
				var $top = $('<div class="multi_top"></div>'); //外层div包裹
				var $all = $('<div class="vertical_head"></div><input type="checkbox" class="select_all multi_select1 vertical_body"/><label class="vertical_body">' + options.selectallTxt + '</label>'); //全选
				var $btn = $('<button class="ok">' + options.selectokTxt + '</button>');
				$all.appendTo($top);
				$btn.appendTo($top);

				//3.下拉中的内容 content层
				var $content = $('<div class="content"></div>'); //外层div包裹
				var count = options.data.length;
				var h = ((count * 22) > parseInt(options.maxheight)) ? options.maxheight : "'" + count * 22 + "'";
				$content.height(h);
				for (var i = count - 1; i >= 0; i--) {
					var $list = $('<div><div class="vertical_head"></div><input class="vertical_body multi_select1" type="checkbox" value=' + options.data[i] + ' /><label  class="vertical_body overText" title="' + options.data[i] + '">' + options.data[i] + '</label></div>');
					$list.appendTo($content);
				}

				//4把top层和content层加到$container下
				$top.appendTo($container);
				$content.appendTo($container);

				//把$container加到$(this)下
				$container.appendTo($this);

				//js Effect
				var $dropList = $content.children().children('input');

				$all.change(function () { //点击all

					var opt_arr = [];
					$dropList.each(function () {
						if ($all.is(':checked')) {
							$(this)[0].checked = 'checked';
							opt_arr.push($(this).val());
						} else {
							$(this)[0].checked = '';
							opt_arr = [];
						}
					});

					$ipt.val(opt_arr.join(';'));
				});
				$dropList.change(function () { //勾选选项
					var opt_arr = [];
					$dropList.each(function () {
						if ($(this).is(':checked')) opt_arr.push($(this).val());
					});
					var $dropList_selected = $content.children().children('input:checked');
					$ipt.val(opt_arr.join(';'));
					var o = $all[0];
					var n1 = $dropList_selected.length;
					var n2 = $dropList.length;
					o.checked = (n1 === n2) ? 'checked' : '';
				});

				$(".select_rel,.ok").on("click", function () {
					$(".container").toggle()
				})
			});
		},
		//提示框
		showTip: function (options) {
			var defaults = {
				forceDirection: null,
				width: '480', //提示文本高度
				contentText: '', //提示内容
				iconPosition: {
					top: 0,
					left: 0
				},
				fnPosition: {
					top: 0,
					left: 0
				}
			};
			var options = $.extend({}, defaults, options);
			return $(this).each(function () {
				var contentText = $('<span class="tipsIcon">?</span><div class="function_tip function_tip1" style="display: none;">' +
					options.contentText +
					'<div class="arrow_div"></div>' +
					'</div>');
				$(this).html(contentText);
				if (options.iconPosition) {
					$(this).css({
						display: 'inline-block',
						top: options.iconPosition.top,
						bottom: options.iconPosition.bottom,
						left: options.iconPosition.left,
						right: options.iconPosition.right
					})
				}
				$(".function_tip1").css({
					'width': options.width + 'px',
					'top': options.fnPosition.top
				})
				$(this).find('.tipsIcon').on({
					'mouseover': function () {
						var windowWidth = $(window).width();
						if (!options.forceDirection) {
							if (windowWidth > 1377) {
								$(this).next('.function_tip').show().css({
									'width': options.width + 'px',
									'left': '48px'
								}).find('.arrow_div').removeClass('arrow_right').addClass('arrow_left');
							} else {
								$(this).next('.function_tip').show().css({
									'width': options.width + 'px',
									'left': options.fnPosition.left + 'px'
								}).find('.arrow_div').removeClass('arrow_left').addClass('arrow_right');
							}
						} else {
							if (options.forceDirection == 'left') {
								$(this).next('.function_tip').show().css({
									'width': options.width + 'px',
									'left': '48px'
								}).find('.arrow_div').removeClass('arrow_right').addClass('arrow_left');
							} else {
								$(this).next('.function_tip').show().css({
									'width': options.width + 'px',
									'left': options.fnPosition.left + 'px'
								}).find('.arrow_div').removeClass('arrow_left').addClass('arrow_right');
							}
						}
					},
					'mouseout': function () {
						$(this).next('.function_tip').hide();
					}
				})
			})
		},
		//声波动画
		soundWave: function (options) {
			var defaults = {
				color: '#67d6eb', //颜色
				waves: 5, //波数
				duration: '1.5s'
			};
			var options = $.extend({}, defaults, options);
			return $(this).each(function () {
				var contentText = '';
				for (var i = 0; i < options.waves; i++) {
					contentText += '<span></span>';
				}
				$(this).html(contentText);
				var $span = $(this).find('span');
				$.each($span, function (i, e) {
					$(e).css({
						'left': i * 3 + 'px',
						'animation-delay': randomNum(i) * 0.1 + 's'
					})
				})
				$(this).css('width', $span.length * 3 + 'px');
			});
		}
	});
})(jQuery);

function randomNum(minNum) {
	return parseInt(Math.random() * minNum + 1, 10);
}
//对象数组排序
function compare(ary) {
	return function (a, b) {
		var val_1 = a[ary];
		var val_2 = b[ary];
		return val_1 - val_2;
	}
}
//对象数组排序
var arrayObjCompare = function (prop, order) {
	console.log(prop, order)
	prop = prop.split('.');

	return function (obj1, obj2) {
		var val1 = obj1;
		var val2 = obj2;
		$.each(prop, function (index, item) {
			if (item == '') {
				return false;
			}
			val1 = val1[item];
			val2 = val2[item];
		})
		if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
			val1 = Number(val1);
			val2 = Number(val2);
		}
		switch (order) {
			case 'desc':
				if (val1 < val2) {
					return 1;
				} else if (val1 > val2) {
					return -1;
				} else {
					return 0;
				}
				break;
			case 'asc':
				if (val1 < val2) {
					return -1;
				} else if (val1 > val2) {
					return 1;
				} else {
					return 0;
				}
				break;
			default:
				return 0;
				break;
		}
	}
}
//菜单侧边栏
var MenuSidebarStr = '';
var title_margin = '';

function menuSidebarSpell(object, menuClass) {
	if (menuClass == undefined) {
		MenuSidebarStr += '<ul>';
		menuClass = 0;
	} else {
		MenuSidebarStr += '<ul style="display:none;">';
		menuClass = 1;
	}
	$.each(object, function (index, item) { //一级
		var value = '';
		if (item.value != undefined) {
			value = ' ( ' + item.value + ' )';
		}
		var clickStyle = '';
		if (item.children != undefined && item.children.length > 0) {
			clickStyle = '<span class="menu_sidebar_click_' + menuClass + '"></span>';
		} else {
			clickStyle = '<span class="menu_sidebar_unclick_' + menuClass + '"></span>';
		}
		MenuSidebarStr += '<li class="li_style_none"><p class="menu_sidebar_title menu_sidebar_title_' + menuClass + '" index="0">' + clickStyle + item.text + value + '</p>';
		if (item.children != undefined && item.children.length > 0) {
			menuSidebarSpell(item.children, menuClass);
		}
		MenuSidebarStr += '</li>';
	})
	MenuSidebarStr += '</ul>';
	return MenuSidebarStr;
}

function menuSidebar(id, object) {
	var str = menuSidebarSpell(object);
	$(id).html(str);
	$(id).on('click', '.menu_sidebar_title', function () {
		var index = Number($(this).attr('index')); //0->90 90->0
		var deg = $(this).children('span').css('transform');
		if (index == 0) {
			if (deg == 'none') {
				deg = 90;
			} else {
				deg = eval('get' + deg);
				deg = deg + 90;
			}
			$(this).children('span').css('transform', 'rotate(' + deg + 'deg)');
			$.each($(this).parent().parent().children().children('.menu_sidebar_title'), function (ind, ite) {
				if ($(this).attr('index') == 90) {
					var deg = $(this).children('span').css('transform');
					deg = eval('get' + deg);
					deg = deg - 90;
					$(this).children('span').css('transform', 'rotate(' + deg + 'deg)');
					$(this).parent().children('ul').hide();
					$(this).attr('index', 0);
				}
			})
			$(this).parent().children('ul').show();
			$(this).attr('index', 90);
		} else {
			deg = eval('get' + deg);
			deg = deg - 90;
			$(this).children('span').css('transform', 'rotate(' + deg + 'deg)');
			$(this).parent().children('ul').hide();
			$(this).attr('index', 0);
		}
	})
}

function getmatrix(a, b, c, d, e, f) {
	var aa = Math.round(180 * Math.asin(a) / Math.PI);
	var bb = Math.round(180 * Math.acos(b) / Math.PI);
	var cc = Math.round(180 * Math.asin(a) / Math.PI);
	var dd = Math.round(180 * Math.acos(a) / Math.PI);
	var deg = 0;
	if (aa == bb || -aa == bb) {
		deg = dd
	} else if (-aa + bb == 180) {
		deg = 180 + cc;
	} else if (aa + bb == 180) {
		deg = 360 - cc || 360 - dd;
	}
	return deg >= 360 ? 0 : deg;
}

/*模态框*/
function modalDiv(obj, str) {
	if (str == undefined) {
		str = '';
	}
	var outStr = $('<div class="modal_out" id="' + obj.id + '"></div>');
	outStr.css({
		'width': obj.width,
		'height': obj.height,
		'top': (window.innerHeight - obj.height) / 2,
		'left': (window.innerWidth - obj.width) / 2,
		'z-index': obj.zindex,
	})
	var titleDiv = '<div class="modal_title_out"><div class="modal_title">' + obj.title + '</div><div class="modal_close">+</div></div>';
	var contentDiv = '<div class="modal_content">' + str + '</div>';
	var maskDiv = $('<div class="modal_mask"></div>');
	maskDiv.css({
		'z-index': obj.zindex - 1
	});
	outStr.append(titleDiv);
	outStr.append(contentDiv);
	$('body').append(outStr);
	$('body').append(maskDiv);
	$('body').on('click', '.modal_close', function () {
		$('.modal_mask').hide();
		$(this).parents('.modal_out').hide();
	})
}
//模态框改进版
function createModalDiv(obj, str) {
	var defaultObj = {
		'id': '',
		'width': 260,
		'height': 200,
		'title': '',
		'zindex': 1,
		'mask': false,
	}
	var lastObj = $.extend(true, {}, defaultObj, obj);
	var outStr = $('<div id="' + lastObj.id + '" class="update_modal_out"></div>');
	outStr.css({
		'z-index': lastObj.zindex,
	})
	var contentStr = $('<div class="update_modal_window"></div>');
	contentStr.css({
		'width': lastObj.width,
		'height': lastObj.height,
		'top': (window.innerHeight - lastObj.height) / 2,
		'left': (window.innerWidth - lastObj.width) / 2,
		'z-index': lastObj.zindex,
	})
	var titleDiv = '<div class="update_modal_title_out"><div class="update_modal_title">' + lastObj.title + '</div><div class="update_modal_close">+</div></div>';
	var contentDiv = '<div class="update_modal_content">' + str + '</div>';
	contentStr.append(titleDiv);
	contentStr.append(contentDiv);
	outStr.append(contentStr);
	if (lastObj.mask) {
		var maskDiv = $('<div class="update_modal_mask"></div>');
		maskDiv.css({
			'z-index': lastObj.zindex - 1
		});
		outStr.append(maskDiv);
	}
	$('body').append(outStr);
	$('.update_modal_close').on('click', function () {
		$('#' + lastObj.id).hide();
	})
}
/*小弹窗*/
function alertDiv(obj, str) {
	var outStr = $('<div class="alert_out" id="' + obj.id + '"></div>');
	var titleDiv = '<div class="alert_title_out"><div class="alert_title">' + obj.title + '</div><div class="alert_close">+</div></div>';
	var contentDiv = '<div class="alert_content">' + str + '</div>';
	var btnDiv = '<div class="alert_btn_out">' +
		'<div class="btnClass Btn_blue alert_sure">确定</div>' +
		'<div class="btnClass Btn_red alert_cancel">取消</div>' +
		'</div>';
	var maskDiv = $('<div class="alert_mask"></div>');
	maskDiv.css({
		'z-index': obj.zindex - 1
	});
	outStr.append(titleDiv);
	outStr.append(contentDiv);
	outStr.append(btnDiv);
	$('body').append(outStr);
	$('body').append(maskDiv);
	var w = $('#' + obj.id).width();
	if (w < 260) {
		w = 260;
	}
	var h = $('#' + obj.id).height();
	outStr.css({
		'width': w,
		'height': h,
		'top': (window.innerHeight - h) / 2,
		'left': (window.innerWidth - w) / 2,
		'z-index': obj.zindex,
	})
	$('.alert_close,.alert_cancel').on('click', function () {
		$('.alert_mask').remove();
		$(this).parents('.alert_out').remove();
	})
	$('.alert_sure').on('click', function () {
		if (obj.yes != undefined) {
			obj.yes();
		}
		$('.alert_mask').remove();
		$(this).parents('.alert_out').remove();
	})
}
//小弹窗改进版
function createAlertDiv(obj, str) {
	var defaultObj = {
		'id': '',
		'title': '',
		'zindex': 1,
		'icon': 0,
		'btn': [],
		'mask': false,
	}
	var lastObj = $.extend(true, {}, defaultObj, obj)
	var outStr = $('<div class="update_alert_out" id="' + lastObj.id + '"></div>');
	outStr.css({
		'z-index': lastObj.zindex,
	})
	var contentStr = $('<div class="update_alert_window"></div>');
	var titleDiv = '<div class="update_alert_title_out"><div class="update_alert_title">' + lastObj.title + '</div><div class="update_alert_close">+</div></div>';

	var iconDiv = '';
	if (lastObj.icon) {
		switch (lastObj.icon) {
			case 1:
				iconDiv = '<span class="update_alert_icon update_alert_icon_1">√</span>';
				break;
			case 2:
				iconDiv = '<span class="update_alert_icon update_alert_icon_2">!</span>';
				break;
		}
	}

	var contentDiv = '<div class="update_alert_content">' + iconDiv + str + '</div>';

	contentStr.append(titleDiv);
	contentStr.append(contentDiv);
	var btnDiv = '';
	if (lastObj.btn && lastObj.btn.length > 0) {
		btnDiv = '<div class="update_alert_btn_out">';
		$.each(lastObj.btn, function (index, item) {
			if (item == true) {
				btnDiv += '<div class="btnClass Btn_blue update_alert_sure">确定</div>';
			}
			if (item == false) {
				btnDiv += '<div class="btnClass Btn_red update_alert_cancel">取消</div>';
			}
		})
		btnDiv += '</div>';
	}
	contentStr.append(btnDiv);
	outStr.append(contentStr);
	if (lastObj.mask) {
		var maskDiv = $('<div class="update_alert_mask"></div>');
		maskDiv.css({
			'z-index': lastObj.zindex - 1
		});
		outStr.append(maskDiv);
	}
	$('body').append(outStr);
	var w = $('#' + lastObj.id + ' .update_alert_window').width();
	if (w < 260) {
		w = 260;
	}
	var h = $('#' + lastObj.id + ' .update_alert_window').height();
	if (h < 123) {
		h = 123;
	}
	contentStr.css({
		'width': w,
		'height': h,
		'top': (window.innerHeight - h) / 2,
		'left': (window.innerWidth - w) / 2,
		'z-index': lastObj.zindex,
	})
	$('.update_alert_close,.update_alert_cancel').on('click', function () {
		$('#' + lastObj.id).remove();
	})
	$('.update_alert_sure').on('click', function () {
		if (lastObj.yes != undefined) {
			lastObj.yes(lastObj.id);
		}
	})
}

function closeAlertDiv(param) {
	$('#' + param).remove();
}
/*人员标签点击*/
function labelSelect() {
	$('.peronal_label').on('click', function () {
		var group = $(this).attr('group');
		$.each($('.peronal_label_select'), function (index, item) {
			if (group == $(this).attr('group')) {
				$(this).removeClass('peronal_label_select');
				$(this).children('span').removeClass('label_content');
			}
		})
		$(this).addClass('peronal_label_select');
		$(this).children('span').addClass('label_content');
	})
}
/*多数组合并去重*/
function manyArrayConcat() {
	if (arguments.length <= 1) {
		return arguments[0];
	}

	function arrayConcat(arr1, arr2) {
		var arr = arr1;
		for (var i = 0; i < arr2.length; i++) {
			arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
		}
		return arr;
	}
	var result = [];
	for (var i = 0; i < arguments.length; i++) {
		result = arrayConcat(result, arguments[i]);
	}
	return result;
}

function tipEvent() {
	$('.tip_out').on({
		'mouseover': function () {
			$(this).children('.tip_intro').show();
		},
		'mouseout': function () {
			$(this).children('.tip_intro').hide();
		},
	})
}

//提示
$(".engine_veracity_intro").on({
	mouseover: function () {
		$(this)
			.parent()
			.find(".function_tip")
			.show();
	},
	mouseout: function () {
		$(this)
			.parent()
			.find(".function_tip")
			.hide();
	}
});
//ajax返回数据验证
function ajaxValid(res) {
	//console.log(res)
	// {
	// 	"data": "返回内容",    // 请求返回值 
	// 	"errCode": "ST_Z001",   // 错误编码
	// 	"errMessage": "用户未登录", // 错误说明
	// 	"status": 1      // 接口请求状态，0：请求异常， 1：请求成功
	// }
	var data;
	if (res) {
		if (res.status == 1) {
			data = res.data;
		} else {
			createHint(0, res.errMessage);
			if (res.errCode == 'E001') {
				parent.location.href = '../../../index/index'
			}
			return false;
		}
	} else {
		createHint(0, res.errMessage);
		return false;
	}
	return data;
}

function pausePlayMusic(id) {
	var audio = document.getElementById(id);
	audio.pause();
}

function stopPlayMusic(id) {
	var audio = document.getElementById(id);
	audio.pause();
	audio.currentTime = 0.0;
}

function audioStartPlay(elem, times) {
	elem.play();
	var start = 0;
	elem.addEventListener('ended', function () {
		start++;
		if (start < times) {
			elem.play();
		} else {
			elem.pause();
		}
	})
}