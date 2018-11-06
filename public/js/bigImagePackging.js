/*查看大图(所有)*/
var bigImageAllData = []; //所有数据
var bigImageAllIndex; //当前数据的下标
var bigImageAllType; //大图的类型

var bigImageMiddleIndex = 0; //中间右图的下标
var bigImageScreenIndex = 0; //场景图的下标

var bigImageMiddledata; //当前大图  抓拍图点赞、吐槽、评价
var bigImageScreendata; //当前大图  场景图点赞、吐槽、评价

var errorSrcBig = '../../static/image/public/bigImagePackging/id_photo_dis.png';
var errorSrc = '../../static/image/public/bigImagePackging/undefined_big.png';
var errorSrcScreen = '../../static/image/public/bigImagePackging/noscreen.png';

var errorJsBig = "javascript:this.src='" + errorSrcBig + "'";
var errorJs = "javascript:this.src='" + errorSrc + "'";
var errorJsScreen = "javascript:this.src='" + errorSrcScreen + "'";

var videoDown = '../../static/image/public/bigImagePackging/video_download.png';
var videoPlay = '../../static/image/public/bigImagePackging/play_s.png';
var videoAgain = '../../static/image/public/bigImagePackging/video_reload.png';
var videoNo = '../../static/image/public/bigImagePackging/video_novideo.png';
//创建大图
function createBigImgAll(type, sureType) {
	bigImageAllType = type;
	var bigImgStr = $('<div class="big_img_all_out"></div>');
	var bigImgMask = $('<div class="big_img_all_mask"></div>')
	bigImgStr.css({
		'left': (parent.window.innerWidth - 1070) / 2,
		'top': (parent.window.innerHeight - 604) / 2,
	})
	var closeDiv = '<div class="big_img_all_close">+</div>';
	var imgContentDiv = '';
	switch (type) {
		case 'single': //单个大图
			imgContentDiv = createImgSingle();
			break;
		case 'edit': //左右
			imgContentDiv = createImgEdit();
			break;
		case 'mapmore': //有小图
			imgContentDiv = createImgMapmore(sureType);
			break;
	}
	bigImgStr.append(closeDiv);
	bigImgStr.append(imgContentDiv);

	$('body').append(bigImgStr);
	$('body').append(bigImgMask);
}
//当前大图显示
function bigImgAllInfoShow(index, imgData) {
	bigImageAllIndex = Number(index);
	bigImageAllData = [];
	switch (bigImageAllType) {
		case 'single':
			var obj = {
				'imgURL': '',
				'detailInfo': {},
			}
			bigImageDataExtendFirst(imgData, obj);
			showImgSingle();
			break;
		case 'edit': //左右
			var obj = {
				'leftImage': '',
				'rightImage': '',
			}
			bigImageDataExtendFirst(imgData, obj);
			showImgEdit();
			break;
		case 'mapmore': //有小图
			bigImageDataExtendSecond(imgData);
			showImgMapmore();
			break;
	}
	$('.big_img_all_mask').show();
	$('.big_img_all_out').show();
}
/*single*/
//单个大图创建
function createImgSingle() {
	var imgContentDiv = '<div class="single_img_out">' +
		'<div class="btn_big left_btn single_left_btn left_right_btn_unclick" title="上一组"></div>' +
		'<div class="big_img_all_content_out single_img_content">' +
		'<div class="vertical_head"></div>' +
		'<img class="big_image_style single_image" src="" onerror="' + errorJsBig + '">' +
		'</div>' +
		'<div class="btn_big right_btn single_right_btn  left_right_btn_unclick" title="下一组"></div>' +
		'</div>' +
		'<div class="single_info_out">' +
		'<div class="single_info_show"></div>' +
		'<div class="single_group_out"><span class="group_this">0</span>/<span class="group_all">0</span></div>' +
		'</div>';
	return imgContentDiv;
}
//单个大图数据显示
function showImgSingle() {
	if (bigImageAllData.length <= 1) {
		$('.single_left_btn').hide();
		$('.single_right_btn').hide();
		$('.single_group_out').hide();
	} else {
		if (bigImageAllIndex == 0) {
			$('.single_right_btn').removeClass('left_right_btn_unclick');
		} else if (bigImageAllIndex + 1 == bigImageAllData.length) {
			$('.single_left_btn').removeClass('left_right_btn_unclick');
		} else {
			$('.single_left_btn').removeClass('left_right_btn_unclick');
			$('.single_right_btn').removeClass('left_right_btn_unclick');
		}
	}
	$('.group_this').text(bigImageAllIndex + 1);
	$('.group_all').text(bigImageAllData.length);
	$('.single_image').attr('src', bigImageAllData[bigImageAllIndex].imgURL);
	var str = detailInfoShow(bigImageAllData[bigImageAllIndex].detailInfo, '');
	$('.single_info_show').html(str);
}
//单个大图左右切换
$('html').on('click', '.single_right_btn', function () {
	bigImageAllIndex = Number($('.group_this').text());
	$('.single_left_btn').removeClass('left_right_btn_unclick');
	showImgSingle();
	if (bigImageAllIndex + 1 == Number($('.group_all').text())) {
		$(this).addClass('left_right_btn_unclick');
	}
})
$('html').on('click', '.single_left_btn', function () {
	bigImageAllIndex = Number($('.group_this').text()) - 2;
	$('.single_right_btn').removeClass('left_right_btn_unclick');
	showImgSingle();
	if (bigImageAllIndex == 0) {
		$(this).addClass('left_right_btn_unclick');
	}
})

/*edit*/
//左右图创建
function createImgEdit() {
	var imgContentDiv = '<div class="big_img_all_content_out edit_img_content_out">' +
		'<div class="vertical_head"></div>' +
		'<div class="edit_left_big_img_content">' +
		'<div class="vertical_head"></div>' +
		'<img src="" class="big_image_style edit_left_image" onerror="' + errorJsBig + '">' +
		'</div>' +
		'<div class="edit_arrow_out">' +
		'<span class="edit_arrow_rec"></span><span class="edit_arrow_tri"></span>' +
		'</div>' +
		'<div class="edit_right_big_img_content">' +
		'<div class="vertical_head"></div>' +
		'<img src="" class="big_image_style edit_right_image" onerror="' + errorJsBig + '">' +
		'</div>' +
		'</div>' +
		'<div class="big_thumbnail_content">' +
		'<span class="big_img_group_change edit_left_group" title="上一组"><span class="big_image_tri_left"></span></span>' +
		'<div class="edit_group_content"><span class="group_this">0</span>/<span class="group_all">0</span></div>' +
		'<span class="big_img_group_change edit_right_group" title="下一组"><span class="big_image_tri_right"></span></span>' +
		'<span class="big_edit_del"></span>' +
		'</div>';
	return imgContentDiv;
}
//左右图显示
function showImgEdit() {
	$('.group_this').text(bigImageAllIndex + 1);
	$('.group_all').text(bigImageAllData.length);
	$('.edit_left_image').attr('src', bigImageAllData[bigImageAllIndex].leftImage);
	$('.edit_right_image').attr('src', bigImageAllData[bigImageAllIndex].rightImage);
}
//左右图切换
$('html').on('click', '.edit_right_group', function () {
	var index = Number($('.group_this').text());
	var group = Number($('.group_all').text());
	if (index == group) {
		return false;
	}
	bigImageAllIndex = index;
	showImgEdit();
})
$('html').on('click', '.edit_left_group', function () {
	var index = Number($('.group_this').text());
	if (index == 1) {
		return false;
	}
	bigImageAllIndex = index - 2;
	showImgEdit();
})
//删除
$('html').on('click', '.big_edit_del', function () {
	if (bigImageAllData[bigImageAllIndex].onDelete != undefined) {
		bigImageAllData[bigImageAllIndex].onDelete();
	}
})

/*mapmore*/
//有小图创建  左
function createImgMapmore(type) {
	var sureHtml = '';
	if (type) {
		if (type == 1) {
			sureHtml = '<div class="mapmore_middle_sure_person">' +
				'<input type="radio" name="mapmore_sure" class="radio_common" index="0" checked="checked"><span>待确认</span>' +
				'<input type="radio" name="mapmore_sure" class="radio_common" index="1"><span>不同人</span>' +
				'<input type="radio" name="mapmore_sure" class="radio_common" index="2"><span>同一人</span>' +
				'<input type="text" placeholder="请输入身份证" class="mapmore_sure_idcard">' +
				'<div class="btnClass Btn_blue mapmore_sure_idcard_btn">确定</div>';
		} else {
			sureHtml = '<div class="mapmore_middle_sure_person">' +
				'<input type="radio" name="mapmore_sure" class="radio_common" index="0" checked="checked"><span>待确认</span>' +
				'<input type="radio" name="mapmore_sure" class="radio_common" index="2"><span>同一人</span>' +
				'<input type="radio" name="mapmore_sure" class="radio_common" index="1"><span>不同人</span>' +
				'<input type="text" placeholder="请输入身份证" class="mapmore_sure_idcard">' +
				'<div class="btnClass Btn_blue mapmore_sure_idcard_btn">确定</div>';
		}
	} else {
		sureHtml = '<div class="mapmore_middle_sure_person">' +
			'<input type="radio" name="mapmore_sure" class="radio_common" index="0" checked="checked"><span>待确认</span>' +
			'<input type="radio" name="mapmore_sure" class="radio_common" index="1"><span>不同人</span>' +
			'<input type="radio" name="mapmore_sure" class="radio_common" index="2"><span>同一人</span>' +
			'<input type="text" placeholder="请输入身份证" class="mapmore_sure_idcard">' +
			'<div class="btnClass Btn_blue mapmore_sure_idcard_btn">确定</div>';
	}
	var imgContentDiv = '<div class="left_content_out">' +
		'<div class="mapmore_left_title big_img_all_title"></div>' +
		'<div class="big_img_all_content_out">' +
		'<div class="mapmore_left_image_content">' +
		'<div class="vertical_head"></div>' +
		'<img src="" class="big_image_style mapmor_left_image" onerror="' + errorJsBig + '">' +
		'</div>' +
		'</div>' +
		'<div class="mapmore_left_info"></div>' +
		'</div>' +
		//中间
		'<div class="middle_content_out">' +
		'<div class="mapmore_middle_title big_img_all_title"></div>' +
		'<div>' +
		'<div class="btn_big left_btn left_right_btn_unclick mapmore_middle_btn_left"></div>' +
		'<div class="big_img_all_content_out">' +
		'<div class="mapmor_middle_contne_out">' +
		'<div class="mapmore_middle_image_left_out">' +
		'<div class="mapmore_middle_image_left_content">' +
		'<div class="vertical_head"></div>' +
		'<img src="" class="big_image_style mapmore_middle_image_left" onerror="' + errorJsBig + '">' +
		'</div>' +
		'<div class="mapmore_middle_info_left"></div>' +
		'</div>' +
		'<div class="mapmore_middle_style"></div>' +
		'<div class="mapmore_middle_image_right_out">' +
		'<div class="mapmore_middle_image_right_content">' +
		'<div class="vertical_head"></div>' +
		'<img src="" class="big_image_style mapmore_middle_image_right" onerror="' + errorJsBig + '">' +
		'</div>' +
		'<div class="mapmore_middle_info_right"></div>' +
		'</div>' +
		'</div>' +
		'<div class="mapmore_middle_comment_out">' +
		'<span class="middle_comment_praise" title="点赞"></span>' +
		'<span class="middle_comment_dislike" title="吐槽"></span>' +
		'<span class="middle_comment_text" title="评论"></span>' +
		'</div>' +
		'</div>' +
		'<div class="btn_big right_btn left_right_btn_unclick mapmore_middle_btn_right"></div>' +
		'<div class="mapmore_middle_info">' +
		'<div class="vertical_head"></div>' +
		sureHtml +
		'</div>' +
		'<a class="mapmore_sure_log" href="javascript:void(0)">>确认日志</a>' +
		'</div>' +
		'</div>' +
		'</div>' +
		//场景
		'<div class="screen_content_out">' +
		'<div class="mapmore_screen_title big_img_all_title"></div>' +
		'<div>' +
		'<div class="btn_big left_btn left_right_btn_unclick mapmore_screen_btn_left"></div>' +
		'<div class="big_img_all_content_out">' +
		'<div class="mapmore_screen_image_content">' +
		'<div class="vertical_head"></div>' +
		'<img src="" class="big_image_style mapmor_screen_image" onerror="' + errorJsScreen + '">' +
		'</div>' +
		'</div>' +
		'<div class="btn_big right_btn left_right_btn_unclick mapmore_screen_btn_right"></div>' +
		'<div class="mapmore_screen_info_out">' +
		'<div class="mapmore_screen_info"></div>' +
		'<div class="mapmore_screen_comment_out">' +
		'<span class="screen_comment_praise" title="点赞"></span>' +
		'<span class="screen_comment_dislike" title="吐槽"></span>' +
		'<span class="screen_comment_text" title="评论"></span>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		//视频
		'<div class="video_content_out">' +
		'<div class="mapmore_video_title big_img_all_title"></div>' +
		'<div class="big_img_all_content_out">' +
		'<div class="mapmore_video_content">' +
		'<div class="vertical_head"></div>' +
		'<video id="mapmore_video" class="big_image_style mapmore_video" controls="controls" poster="' + videoDown + '" onerror="bigImageVideoError(this)"></video>' +
		'</div>' +
		'</div>' +
		'<div class="mapmore_video_info"></div>' +
		'</div>' +
		//缩略图
		'<div class="big_thumbnail_content">' +
		'<span class="big_img_group_change mapmore_group_tri_left_click" title="上一组"><span class="mapmore_group_tri_left"></span></span>' +
		'<div class="thumbnail_contnet_out">' +
		//左侧
		'<div class="thumbnail_left_content">' +
		'<div class="vertical_head"></div>' +
		'<img class="big_image_style thumbnail_iamge_left" src="" onerror="' + errorJs + '">' +
		'</div>' +
		//中间
		'<div class="thumbnail_middle_content">' +
		'<div class="vertical_head"></div>' +
		'<img src="" class="big_image_style thumbnai_image_middle_left" onerror="' + errorJs + '">' +
		'<img src="" class="big_image_style thumbnail_image_middle_right" onerror="' + errorJs + '">' +
		'</div>' +
		//场景
		'<div class="thumbnail_screen_content">' +
		'<div class="vertical_head"></div>' +
		'<img class="big_image_style thumbnail_iamge_screen" src="" onerror="' + errorJsScreen + '">' +
		'</div>' +
		//视频
		'<div class="thumbnail_video_content">' +
		'<div class="vertical_head"></div>' +
		'<img class="big_image_style video_image" src="">' +
		'</div>' +
		//组数显示
		'<div class="group_show_content">' +
		'<span class="mapmore_group_this">0</span>/<span class="mapmore_group_all">0</span>' +
		'</div>' +
		'</div>' +
		'<span class="big_img_group_change mapmore_group_tri_right_click" title="下一组"><span class="mapmore_group_tri_right"></span></span>' +
		'</div>';
	return imgContentDiv;
}
//有小图显示
function showImgMapmore() {
	$('.mapmore_group_all').text(bigImageAllData.length);
	$('.mapmore_group_this').text(bigImageAllIndex + 1);
	bigImageClearAll();
	//初始化
	if (bigImageAllData[bigImageAllIndex].onInit != undefined) {
		bigImageMiddledata = $.extend(true, {}, bigImageAllData[bigImageAllIndex].middle.comment.detail);
		bigImageScreendata = $.extend(true, {}, bigImageAllData[bigImageAllIndex].screen.comment.detail);
		var param = getBackParameters();
		param.rightcomment = bigImageMiddledata;
		param.screencomment = bigImageScreendata;
		bigImageAllData[bigImageAllIndex].onInit(param);
		bigImageAllData[bigImageAllIndex].middle.comment.detail = $.extend(true, {}, bigImageMiddledata);
		bigImageAllData[bigImageAllIndex].screen.comment.detail = $.extend(true, {}, bigImageScreendata);
		if (Object.keys(bigImageMiddledata).length) {
			if (bigImageMiddledata[0].standpoint == 1) {
				$('.middle_comment_praise').addClass('middle_comment_praise_point');
				$('.middle_comment_dislike').removeClass('middle_comment_dislike_point');
			} else if (bigImageMiddledata[0].standpoint == 2) {
				$('.middle_comment_dislike').addClass('middle_comment_dislike_point');
				$('.middle_comment_praise').removeClass('middle_comment_praise_point');
			}
		}
		if (Object.keys(bigImageScreendata).length) {
			if (bigImageScreendata[0].standpoint == 1) {
				$('.screen_comment_praise').addClass('screen_comment_praise_point');
				$('.screen_comment_dislike').removeClass('screen_comment_dislike_point');
			} else if (bigImageScreendata[0].standpoint == 2) {
				$('.screen_comment_dislike').addClass('screen_comment_dislike_point');
				$('.screen_comment_praise').removeClass('screen_comment_praise_point');
			}
		}
	}
	//左侧
	if (bigImageAllData[bigImageAllIndex].left != undefined) {
		$('.thumbnail_left_content').css('display', 'inline-block');
		if (bigImageAllData[bigImageAllIndex].left.title != '') {
			var title = '<div class="big_img_title_tri"></div><div class="big_img_title_text">' + bigImageAllData[bigImageAllIndex].left.title + '</div>';
			$('.mapmore_left_title').html(title);
		}
		$('.mapmor_left_image').attr('src', bigImageAllData[bigImageAllIndex].left.image);
		$('.thumbnail_iamge_left').attr('src', bigImageAllData[bigImageAllIndex].left.image);
		var str = '';
		str = detailInfoShow(bigImageAllData[bigImageAllIndex].left.info, '');
		$('.mapmore_left_info').html(str);
	}
	//中间
	if (bigImageAllData[bigImageAllIndex].middle != undefined) {
		$('.thumbnail_middle_content').css('display', 'inline-block');
		if (bigImageAllData[bigImageAllIndex].middle.title != '') {
			var title = '<div class="big_img_title_tri"></div><div class="big_img_title_text">' + bigImageAllData[bigImageAllIndex].middle.title + '</div>';
			$('.mapmore_middle_title').html(title);
		}
		//图片信息
		$('.thumbnai_image_middle_left').attr('src', bigImageAllData[bigImageAllIndex].middle.left.image);
		$('.mapmore_middle_image_left').attr('src', bigImageAllData[bigImageAllIndex].middle.left.image);
		var str = '';
		str = detailInfoShow(bigImageAllData[bigImageAllIndex].middle.left.info, 'bigimage_text_over');
		$('.mapmore_middle_info_left').html(str);
		if (bigImageAllData[bigImageAllIndex].middle.right.image.length > 1) {
			$('.mapmore_middle_btn_left').css('display', 'inline-block');
			$('.mapmore_middle_btn_right').css('display', 'inline-block');
			$('.mapmore_middle_btn_right').removeClass('left_right_btn_unclick');
		}
		$('.thumbnail_image_middle_right').attr('src', bigImageAllData[bigImageAllIndex].middle.right.image[0]);
		$('.mapmore_middle_image_right').attr('src', bigImageAllData[bigImageAllIndex].middle.right.image[0]);
		var str = '';
		str = detailInfoShow(bigImageAllData[bigImageAllIndex].middle.right.info, 'bigimage_text_over');
		$('.mapmore_middle_info_right').html(str);
		//中间样式
		var str = '';
		switch (bigImageAllData[bigImageAllIndex].middle.center.type) {
			case 'sure':
				str = MapmoreMiddleSure(bigImageAllData[bigImageAllIndex].middle.center.text);
				break;
			case 'label':
				str = '<div class="vertical_head"></div><span class="left_right_arrow"></span>';
				break;
			case 'single':
				if (bigImageAllData[bigImageAllIndex].middle.center.text.num != undefined &&
					bigImageAllData[bigImageAllIndex].middle.center.text.num != '') {
					var isclick = 'similarity_unclick';
					if (bigImageAllData[bigImageAllIndex].middle.center.text.click) {
						isclick = '';
					}
					str = '<div class="vertical_head"></div>' +
						'<div class="mapmor_middle_similarity_single">' +
						'<div>相似度</div>' +
						'<div class="mapmore_similarity_show similarity_color ' + isclick + '">' +
						(bigImageAllData[bigImageAllIndex].middle.center.text.num).toFixed(2) +
						'%</div>' +
						'</div>';
				}
				break;
			case 'more':
				str = MapmoreMiddleMore(bigImageAllData[bigImageAllIndex].middle.center.text,
					bigImageAllData[bigImageAllIndex].middle.center.min);
				break;
		}
		$('.mapmore_middle_style').html(str);
		var node = document.getElementById('mapmore_middle_wheel_show');
		if (node != null) {
			node.onmousewheel = scrollSimilar;
		}
		//评论
		if (bigImageAllData[bigImageAllIndex].middle.comment.show) {
			var node = document.getElementById('mapmore_middle_comment_window');
			if (node == null) {
				var obj = {
					'id': 'mapmore_middle_comment_window',
					'width': 480,
					'height': 225,
					'title': '图片评价',
					'zindex': 1000,
				}
				var str = '<div class="mapmore_middle_comment_window_out">' +
					'<div>' +
					'<span class="image_comment" group="0" index="1">人脸清晰</span>' +
					'<span class="image_comment" group="0" index="2">人脸模糊 </span>' +
					'<span class="image_comment" group="1" index="1">光线太暗 </span>' +
					'<span class="image_comment" group="1" index="2">光线太亮 </span>' +
					'<span>（可多选）</span>' +
					'</div>' +
					'<textarea class="mapmore_middle_comment_text"></textarea>' +
					'<div class="mapmore_comment_btn_content">' +
					'<div class="btnClass Btn_blue mapmore_middle_comment_sure">确定</div>' +
					'<div class="btnClass Btn_red mapmore_middle_comment_cancel">取消</div>' +
					'</div>' +
					'</div>';
				mapmoreComment(obj, str);
			}
			$('.mapmore_middle_comment_out').show();
			if (bigImageAllData[bigImageAllIndex].middle.comment.detail[0].standpoint == 1) {
				$('.middle_comment_praise').addClass('middle_comment_praise_point');
			} else if (bigImageAllData[bigImageAllIndex].middle.comment.detail[0].standpoint == 2) {
				$('.middle_comment_dislike').addClass('middle_comment_dislike_point');
			}
		}
		//确认   日志
		if (bigImageAllData[bigImageAllIndex].middle.sure.person.show) {
			$('.mapmore_middle_sure_person').css('display', 'inline-block');
		}
		var num = Number(bigImageAllData[bigImageAllIndex].middle.sure.person.default[0]);
		$('.mapmore_middle_sure_person').children('.radio_common').eq(num).click();
		var type = bigImageAllData[bigImageAllIndex].middle.sure.person.idcard.type ? bigImageAllData[bigImageAllIndex].middle.sure.person.idcard.type : 1;
		if (type == 1) {
			if (num == 2) {
				$('.mapmore_sure_idcard').hide();
			}
		} else {
			if (num == 1) {
				$('.mapmore_sure_idcard').hide();
			}
		}
		if (bigImageAllData[bigImageAllIndex].userdefined.identfyIdcard) {
			$(".mapmore_sure_idcard").val(bigImageAllData[bigImageAllIndex].userdefined.identfyIdcard);
		}
		if (bigImageAllData[bigImageAllIndex].middle.sure.log.show) {
			$('.mapmore_sure_log').css('display', 'inline-block');
			if (bigImageAllData[bigImageAllIndex].middle.sure.log.position == 'right') {
				$('.mapmore_middle_info').addClass('mapmore_midddle_info_right');
			}
		}
	}
	//场景
	if (bigImageAllData[bigImageAllIndex].screen != undefined) {
		$('.thumbnail_screen_content').css('display', 'inline-block');
		if (bigImageAllData[bigImageAllIndex].screen.title != '') {
			var title = '<div class="big_img_title_tri"></div><div class="big_img_title_text">' + bigImageAllData[bigImageAllIndex].screen.title + '</div>';
			$('.mapmore_screen_title').html(title);
		}
		if (bigImageAllData[bigImageAllIndex].screen.image.length > 1) {
			$('.mapmore_screen_btn_left').css('display', 'inline-block');
			$('.mapmore_screen_btn_right').css('display', 'inline-block');
			$('.mapmore_screen_btn_right').removeClass('left_right_btn_unclick');
		}
		$('.mapmor_screen_image').attr('src', bigImageAllData[bigImageAllIndex].screen.image[0]);
		$('.thumbnail_iamge_screen').attr('src', bigImageAllData[bigImageAllIndex].screen.image[0]);
		$('.mapmor_screen_image').attr('src', bigImageAllData[bigImageAllIndex].screen.image[0]);
		var str = '';
		str = detailInfoShow(bigImageAllData[bigImageAllIndex].screen.info, '');
		$('.mapmore_screen_info').html(str);
		if (bigImageAllData[bigImageAllIndex].screen.comment.show) {
			var node = document.getElementById('mapmore_screen_comment_window');
			if (node == null) {
				var screenobj = {
					'id': 'mapmore_screen_comment_window',
					'width': 480,
					'height': 260,
					'title': '图片评价',
					'zindex': 1000,
				}
				var screenstr = '<div class="mapmore_middle_comment_window_out">' +
					'<div>' +
					'<span class="image_comment" group="2" index="1">图像清晰</span>' +
					'<span class="image_comment" group="2" index="2">图像模糊 </span>' +
					'<span class="image_comment" group="3" index="1">光线太暗 </span>' +
					'<span class="image_comment" group="3" index="2">光线太亮 </span>' +
					'<span class="image_comment" group="4" index="1">安装角度不合理 </span>' +
					'<span>（可多选）</span>' +
					'</div>' +
					'<textarea class="mapmore_screen_comment_text"></textarea>' +
					'<div class="mapmore_comment_btn_content">' +
					'<div class="btnClass Btn_blue mapmore_screen_comment_sure">确定</div>' +
					'<div class="btnClass Btn_red mapmore_screen_comment_cancel">取消</div>' +
					'</div>' +
					'</div>';
				mapmoreComment(screenobj, screenstr);
			}
			$('.mapmore_screen_comment_out').show();
			if (bigImageAllData[bigImageAllIndex].screen.comment.detail[0].standpoint == 1) {
				$('.screen_comment_praise').addClass('screen_comment_praise_point');
			} else if (bigImageAllData[bigImageAllIndex].screen.comment.detail[0].standpoint == 2) {
				$('.screen_comment_dislike').addClass('screen_comment_dislike_point');
			}
		}
	}
	//视频
	if (bigImageAllData[bigImageAllIndex].video != undefined) {
		$('.thumbnail_video_content').css('display', 'inline-block');
		if (bigImageAllData[bigImageAllIndex].video.title != '') {
			var title = '<div class="big_img_title_tri"></div><div class="big_img_title_text">' + bigImageAllData[bigImageAllIndex].video.title + '</div>';
			$('.mapmore_video_title').html(title);
		}
		$('.video_image').attr('src', videoPlay);
		if (bigImageAllData[bigImageAllIndex].video.url != undefined && bigImageAllData[bigImageAllIndex].video.url != '') {
			$('.mapmore_video').attr('src', bigImageAllData[bigImageAllIndex].video.url);
			var node = document.getElementById('mapmore_video');
			if (node != null) {
				node.addEventListener('canplaythrough', videoSuccess(node));
			}
		} else {
			$('.mapmore_video').attr('index', 'reload');
		}
		var str = '';
		str = detailInfoShow(bigImageAllData[bigImageAllIndex].video.info, '');
		$('.mapmore_video_info').html(str);
	}
	//默认点击
	if (bigImageAllData[bigImageAllIndex].clickTag != '') {
		$('.thumbnail_' + bigImageAllData[bigImageAllIndex].clickTag + '_content').trigger('click');
	} else {
		$('.thumbnail_contnet_out').children().eq(0).trigger('click');
	}
}
//小图点击
$('html').on('click', '.thumbnail_left_content', function () {
	changeThumbnail('left');
	$('.thumbnail_image_click').removeClass('thumbnail_image_click');
	$(this).addClass('thumbnail_image_click');

	$('.left_content_out').show();
	$('.middle_content_out').hide();
	$('.right_content_out').hide();
	$('.screen_content_out').hide();
	$('.video_content_out').hide();
})
$('html').on('click', '.thumbnail_middle_content', function () {
	changeThumbnail('middle');
	$('.thumbnail_image_click').removeClass('thumbnail_image_click');
	$(this).addClass('thumbnail_image_click');

	$('.left_content_out').hide();
	$('.middle_content_out').show();
	$('.right_content_out').hide();
	$('.screen_content_out').hide();
	$('.video_content_out').hide();
})
$('html').on('click', '.thumbnail_screen_content', function () {
	changeThumbnail('screen');
	$('.thumbnail_image_click').removeClass('thumbnail_image_click');
	$(this).addClass('thumbnail_image_click');

	$('.left_content_out').hide();
	$('.middle_content_out').hide();
	$('.right_content_out').hide();
	$('.screen_content_out').show();
	$('.video_content_out').hide();
})
$('html').on('click', '.thumbnail_video_content', function () {
	changeThumbnail('video');
	$('.thumbnail_image_click').removeClass('thumbnail_image_click');
	$(this).addClass('thumbnail_image_click');

	$('.left_content_out').hide();
	$('.middle_content_out').hide();
	$('.right_content_out').hide();
	$('.screen_content_out').hide();
	$('.video_content_out').show();
})
//中间左右切换
$('html').on('click', '.mapmore_middle_btn_right', function () {
	$('.mapmore_middle_btn_left').removeClass('left_right_btn_unclick');
	bigImageMiddleIndex++;
	$('.mapmore_middle_image_right').attr('src', bigImageAllData[bigImageAllIndex].middle.right.image[bigImageMiddleIndex]);
	$('.thumbnail_image_middle_right').attr('src', bigImageAllData[bigImageAllIndex].middle.right.image[bigImageMiddleIndex]);

	if (bigImageMiddleIndex == bigImageAllData[bigImageAllIndex].middle.right.image.length - 1) {
		$('.mapmore_middle_btn_right').addClass('left_right_btn_unclick');
	}
	$('.middle_comment_praise_point').removeClass('middle_comment_praise_point');
	$('.middle_comment_dislike_point').removeClass('middle_comment_dislike_point');
	if (bigImageAllData[bigImageAllIndex].middle.comment.detail[bigImageMiddleIndex] != undefined) {
		if (bigImageAllData[bigImageAllIndex].middle.comment.detail[bigImageMiddleIndex].standpoint == 1) {
			$('.middle_comment_praise').addClass('middle_comment_praise_point');
		} else if (bigImageAllData[bigImageAllIndex].middle.comment.detail[bigImageMiddleIndex].standpoint == 2) {
			$('.middle_comment_dislike').addClass('middle_comment_dislike_point');
		}
	}
	var num = Number(bigImageAllData[bigImageAllIndex].middle.sure.person.default[bigImageMiddleIndex]);
	$('.mapmore_middle_sure_person').children('.radio_common').eq(num).click();
	if (num == 2) {
		$('.mapmore_sure_idcard').hide();
	}
})
$('html').on('click', '.mapmore_middle_btn_left', function () {
	$('.mapmore_middle_btn_right').removeClass('left_right_btn_unclick');
	bigImageMiddleIndex--;
	$('.mapmore_middle_image_right').attr('src', bigImageAllData[bigImageAllIndex].middle.right.image[bigImageMiddleIndex]);
	$('.thumbnail_image_middle_right').attr('src', bigImageAllData[bigImageAllIndex].middle.right.image[bigImageMiddleIndex]);

	if (bigImageMiddleIndex == 0) {
		$('.mapmore_middle_btn_left').addClass('left_right_btn_unclick');
	}
	$('.middle_comment_praise_point').removeClass('middle_comment_praise_point');
	$('.middle_comment_dislike_point').removeClass('middle_comment_dislike_point');
	if (bigImageAllData[bigImageAllIndex].middle.comment.detail[bigImageMiddleIndex] != undefined) {
		if (bigImageAllData[bigImageAllIndex].middle.comment.detail[bigImageMiddleIndex].standpoint == 1) {
			$('.middle_comment_praise').addClass('middle_comment_praise_point');
		} else if (bigImageAllData[bigImageAllIndex].middle.comment.detail[bigImageMiddleIndex].standpoint == 2) {
			$('.middle_comment_dislike').addClass('middle_comment_dislike_point');
		}
	}
	var num = Number(bigImageAllData[bigImageAllIndex].middle.sure.person.default[bigImageMiddleIndex]);
	$('.mapmore_middle_sure_person').children('.radio_common').eq(num).click();
	if (num == 2) {
		$('.mapmore_sure_idcard').hide();
	}
})
//中间  点赞吐槽  评论
$('html').on('click', '.middle_comment_praise', function () {
	if ($('.middle_comment_praise').is('.middle_comment_praise_point')) {
		$('.middle_comment_praise').removeClass('middle_comment_praise_point');
		bigImageMiddledata[bigImageMiddleIndex].standpoint = 0;
	} else {
		$('.middle_comment_praise').addClass('middle_comment_praise_point');
		bigImageMiddledata[bigImageMiddleIndex].standpoint = 1;
	}
	$('.middle_comment_dislike').removeClass('middle_comment_dislike_point');

})
$('html').on('click', '.middle_comment_dislike', function () {
	if ($('.middle_comment_dislike').is('.middle_comment_dislike_point')) {
		$('.middle_comment_dislike').removeClass('middle_comment_dislike_point');
		bigImageMiddledata[bigImageMiddleIndex].standpoint = 0;
	} else {
		$('.middle_comment_dislike').addClass('middle_comment_dislike_point');
		bigImageMiddledata[bigImageMiddleIndex].standpoint = 2;
	}
	$('.middle_comment_praise').removeClass('middle_comment_praise_point');
})
$('html').on('click', '.middle_comment_text', function () {
	$('#mapmore_middle_comment_window .image_comment_click').removeClass('image_comment_click');
	$('.mapmore_middle_comment_text').val('');
	if (bigImageAllData[bigImageAllIndex].middle.comment.detail[bigImageMiddleIndex] != undefined) {
		$.each(bigImageMiddledata[bigImageMiddleIndex].viewpoint, function (index, item) {
			switch (index) {
				case 'face':
					$.each($('.mapmore_middle_comment_window_out .image_comment'), function () {
						if ($(this).attr('group') == '0' && $(this).attr('index') == item) {
							$(this).addClass('image_comment_click');
						}
					})
					break;
				case 'light':
					$.each($('.mapmore_middle_comment_window_out .image_comment'), function () {
						if ($(this).attr('group') == '1' && $(this).attr('index') == item) {
							$(this).addClass('image_comment_click');
						}
					})
					break;
				case 'text':
					$('.mapmore_middle_comment_text').val(item);
					break;
			}
		})
	}
	$('#mapmore_middle_comment_window').show();
})
//中间  评论  点击
$('html').on('click', '.image_comment', function () {
	var flag = 0;
	if ($(this).is('.image_comment_click')) {
		flag++;
	}
	var group = $(this).attr('group');
	$.each($('.image_comment_click'), function (index, item) {
		if (group == $(this).attr('group')) {
			$(this).removeClass('image_comment_click');
		}
	})
	if (flag == 0) {
		$(this).addClass('image_comment_click');
	}
})
$('html').on('click', '.mapmore_middle_comment_cancel', function () {
	$('#mapmore_middle_comment_window').hide();
})
$('html').on('click', '.mapmore_middle_comment_sure', function () {
	var face = 0;
	var light = 0;
	$.each($('.image_comment_click'), function () {
		if ($(this).attr('group') == '0') {
			face = $(this).attr('index');
		} else if ($(this).attr('group') == '1') {
			light = $(this).attr('index');
		}
	})
	bigImageMiddledata[bigImageMiddleIndex].viewpoint.face = face;
	bigImageMiddledata[bigImageMiddleIndex].viewpoint.light = light;
	bigImageMiddledata[bigImageMiddleIndex].viewpoint.text = $('.mapmore_middle_comment_text').val();
	$('#mapmore_middle_comment_window').hide();
})
//点击同一人是否出现身份证输入框
$('html').on('click', 'input[name="mapmore_sure"]', function () {
	if (bigImageAllData[bigImageAllIndex].middle.sure.person.idcard.show == true) {
		var type = bigImageAllData[bigImageAllIndex].middle.sure.person.idcard.type ? bigImageAllData[bigImageAllIndex].middle.sure.person.idcard.type : 1;
		if (type == 1) {
			if ($(this).attr('index') == '2') {
				$('.mapmore_sure_idcard').show();
			} else {
				$('.mapmore_sure_idcard').hide();
			}
		} else {
			if ($(this).attr('index') == '1') {
				$('.mapmore_sure_idcard').show();
			} else {
				$('.mapmore_sure_idcard').hide();
			}
		}
	}
})
//相似度点击
$('html').on('click', '.mapmore_similarity_show', function () {
	if (bigImageAllData[bigImageAllIndex].onSimilarity != undefined) {
		var param = getBackParameters();
		bigImageAllData[bigImageAllIndex].onSimilarity(param);
	}
})
//确认  0待确认  1不同人   2同一人
$('html').on('click', '.mapmore_sure_idcard_btn', function () {
	if (bigImageAllData[bigImageAllIndex].onSure != undefined) {
		var param = getBackParameters();
		$.each($('input[name="mapmore_sure"]'), function () {
			if ($(this).prop('checked')) {
				param.sure = $(this).attr('index');
				return false;
			}
		})
		if (bigImageAllData[bigImageAllIndex].middle.sure.person.idcard.show) {
			param.idcard = $('.mapmore_sure_idcard').val();
		}
		bigImageAllData[bigImageAllIndex].onSure(param, sureSuccess);
	}
})

function sureSuccess() {
	$.each($('input[name="mapmore_sure"]'), function () {
		if ($(this).prop('checked')) {
			bigImageAllData[bigImageAllIndex].middle.sure.person.default[bigImageMiddleIndex] = $(this).attr('index');
			return false;
		}
	})

}
//确认日志
$('html').on('click', '.mapmore_sure_log', function () {
	if (bigImageAllData[bigImageAllIndex].onLog != undefined) {
		var param = getBackParameters();
		bigImageAllData[bigImageAllIndex].onLog(param);
	}
})
//多相似度滚动事件
function scrollSimilar(e) {
	var top = Number($('.mapmore_middle_wheel_offset').attr('index'));
	var maxTop = Number($('.mapmore_middle_wheel_offset').height()) - 26 * 5;
	switch (e.wheelDelta) { //mapmore_middle_wheel_offset
		case 120: //向上滚
			if (top >= 0) {
				return false;
			}
			$('.mapmore_middle_wheel_offset').css('top', (top + 26));
			$('.mapmore_middle_wheel_offset').attr('index', (top + 26));
			break;
		case -120: //向下滚
			if (top <= (0 - maxTop)) {
				return false;
			}
			$('.mapmore_middle_wheel_offset').css('top', (top - 26));
			$('.mapmore_middle_wheel_offset').attr('index', (top - 26));
			break;
	}
}
//场景左右
$('html').on('click', '.mapmore_screen_btn_right', function () {
	$('.mapmore_screen_btn_left').removeClass('left_right_btn_unclick');
	bigImageScreenIndex++;
	$('.mapmor_screen_image').attr('src', bigImageAllData[bigImageAllIndex].screen.image[bigImageScreenIndex]);
	$('.thumbnail_iamge_screen').attr('src', bigImageAllData[bigImageAllIndex].screen.image[bigImageScreenIndex]);

	if (bigImageScreenIndex == bigImageAllData[bigImageAllIndex].screen.image.length - 1) {
		$(this).addClass('left_right_btn_unclick');
	}
	$('.screen_comment_praise_point').removeClass('screen_comment_praise_point');
	$('.screen_comment_dislike_point').removeClass('screen_comment_dislike_point');
	if (bigImageAllData[bigImageAllIndex].screen.comment.detail[bigImageScreenIndex] != undefined) {
		if (bigImageAllData[bigImageAllIndex].screen.comment.detail[bigImageScreenIndex].standpoint == 1) {
			$('.screen_comment_praise').addClass('screen_comment_praise_point');
		} else if (bigImageAllData[bigImageAllIndex].screen.comment.detail[bigImageScreenIndex].standpoint == 2) {
			$('.screen_comment_dislike').addClass('screen_comment_dislike_point');
		}
	}
})
$('html').on('click', '.mapmore_screen_btn_left', function () {
	$('.mapmore_screen_btn_right').removeClass('left_right_btn_unclick');
	bigImageScreenIndex--;
	$('.mapmor_screen_image').attr('src', bigImageAllData[bigImageAllIndex].screen.image[bigImageScreenIndex]);
	$('.thumbnail_iamge_screen').attr('src', bigImageAllData[bigImageAllIndex].screen.image[bigImageScreenIndex]);

	if (bigImageScreenIndex == 0) {
		$(this).addClass('left_right_btn_unclick');
	}
	$('.screen_comment_praise_point').removeClass('screen_comment_praise_point');
	$('.screen_comment_dislike_point').removeClass('screen_comment_dislike_point');
	if (bigImageAllData[bigImageAllIndex].screen.comment.detail[bigImageScreenIndex] != undefined) {
		if (bigImageAllData[bigImageAllIndex].screen.comment.detail[bigImageScreenIndex].standpoint == 1) {
			$('.screen_comment_praise').addClass('screen_comment_praise_point');
		} else if (bigImageAllData[bigImageAllIndex].screen.comment.detail[bigImageScreenIndex].standpoint == 2) {
			$('.screen_comment_dislike').addClass('screen_comment_dislike_point');
		}
	}
})
//场景  点赞 吐槽 评论
$('html').on('click', '.screen_comment_praise', function () {
	if ($('.screen_comment_praise').is('.screen_comment_praise_point')) {
		$('.screen_comment_praise').removeClass('screen_comment_praise_point');
		bigImageScreendata[bigImageScreenIndex].standpoint = 0;
	} else {
		$('.screen_comment_praise').addClass('screen_comment_praise_point');
		bigImageScreendata[bigImageScreenIndex].standpoint = 1;
	}
	$('.screen_comment_dislike').removeClass('screen_comment_dislike_point');
})
$('html').on('click', '.screen_comment_dislike', function () {
	if ($('.screen_comment_dislike').is('.screen_comment_dislike_point')) {
		$('.screen_comment_dislike').removeClass('screen_comment_dislike_point');
		bigImageScreendata[bigImageScreenIndex].standpoint = 0;
	} else {
		$('.screen_comment_dislike').addClass('screen_comment_dislike_point');
		bigImageScreendata[bigImageScreenIndex].standpoint = 2;
	}
	$('.screen_comment_praise').removeClass('screen_comment_praise_point');
})
$('html').on('click', '.screen_comment_text', function () {
	$('#mapmore_screen_comment_window .image_comment').removeClass('image_comment_click');
	$('.mapmore_screen_comment_text').val('');
	if (bigImageAllData[bigImageAllIndex].screen.comment.detail[bigImageScreenIndex] != undefined) {
		$.each(bigImageScreendata[bigImageScreenIndex].viewpoint, function (index, item) {
			switch (index) {
				case 'face':
					$.each($('.image_comment'), function () {
						if ($(this).attr('group') == '2' && $(this).attr('index') == item) {
							$(this).addClass('image_comment_click');
						}
					})
					break;
				case 'light':
					$.each($('.image_comment'), function () {
						if ($(this).attr('group') == '3' && $(this).attr('index') == item) {
							$(this).addClass('image_comment_click');
						}
					})
					break;
				case 'angel':
					$.each($('.image_comment'), function () {
						if ($(this).attr('group') == '4' && $(this).attr('index') == item) {
							$(this).addClass('image_comment_click');
						}
					})
					break;
				case 'text':
					$('.mapmore_screen_comment_text').val(item);
					break;
			}
		})
	}
	$('#mapmore_screen_comment_window').show();
})
$('html').on('click', '.mapmore_screen_comment_cancel', function () {
	$('#mapmore_screen_comment_window').hide();
})
$('html').on('click', '.mapmore_screen_comment_sure', function () {
	var face = 0;
	var light = 0;
	var angel = 0;
	$.each($('.image_comment_click'), function () {
		if ($(this).attr('group') == '2') {
			face = $(this).attr('index');
		} else if ($(this).attr('group') == '3') {
			light = $(this).attr('index');
		} else if ($(this).attr('group') == '4') {
			angel = $(this).attr('index');
		}
	})
	bigImageScreendata[bigImageScreenIndex].viewpoint.face = face;
	bigImageScreendata[bigImageScreenIndex].viewpoint.light = light;
	bigImageScreendata[bigImageScreenIndex].viewpoint.angel = angel;
	bigImageScreendata[bigImageScreenIndex].viewpoint.text = $('.mapmore_screen_comment_text').val();
	$('#mapmore_screen_comment_window').hide();
})
//中间   场景    关闭点击
$('html').on('click', '.mapmore_comment_close', function () {
	$(this).parents('.mapmore_comment_out').hide();
})
//视频重新下载
$('html').on('click', '.mapmore_video_reload', function () {
	var URL = $(this).attr('src') + '?value=' + Math.random() * 1000;
	$(this).attr('src', URL);
})
//有小图整组左右切换
$('html').on('click', '.mapmore_group_tri_right_click', function () {
	var index = Number($('.mapmore_group_this').text());
	var group = Number($('.mapmore_group_all').text());
	if (index == group) {
		return false;
	}
	bigImageAllIndex = index;
	showImgMapmore();
})
$('html').on('click', '.mapmore_group_tri_left_click', function () {
	var index = Number($('.mapmore_group_this').text());
	if (index == 1) {
		return false;
	}
	bigImageAllIndex = index - 2;
	showImgMapmore();
})
//关闭      点赞 吐槽 评论可在关闭大图之后进行保存
$('html').on('click', '.big_img_all_close', function () {
	if (bigImageAllData[bigImageAllIndex].onClose != undefined) {
		var param = getBackParameters();
		bigImageAllData[bigImageAllIndex].onClose(param);
	}
	$('.big_img_all_mask').hide()
	$(this).parents('.big_img_all_out').hide();
})

//中间样式
function MapmoreMiddleSure(cont) {
	var str = '<div class="vertical_head"></div>';
	switch (cont) {
		case 0:
			str += '<span class="stateClass state_not mapmore_middle_center">待确认</span>';
			break;
		case 1:
			str += '<span class="stateClass state_false mapmore_middle_center">不同人</span>';
			break;
		case 2:
			str += '<span class="stateClass state_true mapmore_middle_center">同一人</span>';
			break;
	}
	return str;
}

function MapmoreMiddleMore(ary, cont) {
	var wheelstr = '';
	var iswheel = 'mapmore_wheel_none';
	if (ary.length > 5) {
		wheelstr = '<div class="wheel_label_show">' +
			'<span class="wheel_down_bling">&#187</span>' +
			'<div class="wheel_text_blue">滚动查看更多</div>' +
			'</div>';
		iswheel = '';
	}
	var str = '<div class="vertical_head"></div>' +
		'<div class="mapmore_middle_wheel_out">' +
		'<div>相似度</div>' +
		'<div id="mapmore_middle_wheel_show" class="mapmore_middle_wheel_show ' + iswheel + '">' +
		'<div class="mapmore_middle_wheel_window">' +
		'<div class="mapmore_middle_wheel_offset" index="0">';

	for (var i = 0; i < ary.length; i++) {
		var similarity = '<span class="similarity_color_green">' + (ary[i].num).toFixed(2) + '%</span>';
		var style = '<span class="similarity_text_show_green"></span>';
		if (ary[i].num < cont && ary[i].num > 0) {
			similarity = '<span class="similarity_color_red">' + (ary[i].num).toFixed(2) + '%</span>';
			style = '<span class="similarity_text_show_red"></span>';
		} else if (ary[i].num == 0) {
			similarity = '<span class="similarity_color_red">比对失败</span>';
			style = '<span class="similarity_text_show_red"></span>';
		}
		str += '<div class="mapmore_middle_wheel_content">' +
			'<span>' + ary[i].text + '：</span>' +
			similarity +
			style +
			'</div>';
	}
	str += '</div></div>';
	str += wheelstr;
	str += '</div></div>';
	return str;
}

function detailInfoShow(ary, type) {
	var str = '';
	$.each(ary, function (index, item) {
		switch (index) {
			case 'text':
				for (var i in item) {
					str += '<div class="info_text ' + type + '" title="' + item[i] + '">' + item[i] + '</div>';
				}
				break;
			case 'label':
				var labelstr = item;
				var labels = item.split(',');
				if (labels.length > 2) {
					labelstr = labels[0] + ',' + labels[1];
				}
				str += '<div class="bigimage_info_label" title="' + item + '">' + labelstr + '</div>';
				break;
			case 'car':
				str += '<div><span class="info_car info_car_blue">' + item.plate + '</span>' +
					'<span class="car_text">' + item.text + '</span></div>';
				break;
		}
	})
	return str;
}
//清空
function bigImageClearAll() {
	$('.big_img_all_title').html('');
	$('.big_image_style').attr('src', '');
	$('.left_content_out,.middle_content_out,.right_content_out,.screen_content_out,.video_content_out').hide();
	$('.thumbnail_left_content,.thumbnail_middle_content,.thumbnail_screen_content,.thumbnail_video_content').hide();

	$('.mapmore_left_info').html('');
	$('.mapmore_middle_info_left').html('');
	$('.mapmore_middle_style').html('');

	$('.mapmore_middle_comment_out').hide();
	$('.mapmore_middle_sure_person').hide();
	$('.mapmore_sure_idcard').hide();
	$('.mapmore_sure_log').hide();
	$('.mapmore_middle_btn_left').hide();
	$('.mapmore_middle_btn_right').hide();

	$('.mapmore_right_info').html('');
	$('.mapmore_middle_info_right').html('');

	$('.mapmore_screen_btn_left').hide();
	$('.mapmore_screen_btn_right').hide();
	$('.mapmore_screen_comment_out').hide();
	$('.mapmore_screen_info').html('');

	$('.mapmore_video').attr('src', '');
	$('.mapmore_video').attr('index', '');
	$('.mapmore_video').attr('poster', '');
	$('.mapmore_video').removeClass('mapmore_video_reload');
	$('.mapmore_middle_info').removeClass('mapmore_midddle_info_right');

	$('.screen_comment_dislike').removeClass('screen_comment_dislike_point');
	$('.screen_comment_praise').removeClass('screen_comment_praise_point');
	$('.middle_comment_praise').removeClass('middle_comment_praise_point');
	$('.middle_comment_dislike').removeClass('middle_comment_dislike_point');

	$('.mapmore_middle_sure_person').children('.radio_common').eq(0).css('display', 'inline-block');
	$('.mapmore_middle_sure_person').children('span').eq(0).css('display', 'inline-block');

	$('.mapmore_middle_btn_right').addClass('left_right_btn_unclick');
	$('.mapmore_middle_btn_left').addClass('left_right_btn_unclick');
	$('.mapmore_screen_btn_left').addClass('left_right_btn_unclick');
	$('.mapmore_screen_btn_right').addClass('left_right_btn_unclick');
	bigImageMiddleIndex = 0;
	bigImageScreenIndex = 0;
}
//视频下载成功
function videoSuccess(cont) {
	$(cont).attr('poster', '');
}
//视频下载失败
function bigImageVideoError(cont) {
	if ($(cont).attr('index') == undefined || $(cont).attr('index') == '') {
		cont.poster = videoAgain;
		$(cont).addClass('mapmore_video_reload');
		$(cont).attr('index', 'reload');
	} else {
		cont.poster = videoNo;
		$(cont).removeClass('mapmore_video_reload');
		$(cont).attr('index', '');
	}
}
/* 评价弹窗 */
function mapmoreComment(obj, str) {
	if (str == undefined) {
		str = '';
	}
	var outStr = $('<div class="mapmore_comment_out" id="' + obj.id + '"></div>');
	outStr.css({
		'width': obj.width,
		'height': obj.height,
		'position': 'fixed',
		'top': (window.innerHeight - obj.height) / 2,
		'left': (window.innerWidth - obj.width) / 2,
		'z-index': obj.zindex,
	})
	var titleDiv = '<div class="mapmore_comment_title_out">' +
		'<div class="mapmore_comment_title">' + obj.title + '</div>' +
		'<div class="mapmore_comment_close">+</div>' +
		'</div>';
	var contentDiv = '<div class="mapmore_comment_content">' + str + '</div>';

	outStr.append(titleDiv);
	outStr.append(contentDiv);
	$('body').append(outStr);

	/*$('body').on('click', '.modal_close', function() {
		$(this).parents('.modal_out').hide();
	})*/
}
/*改变默认点击*/
function changeThumbnail(tag) {
	$.each(bigImageAllData, function (index, item) {
		item.clickTag = tag;
	})
}
/*数据合并*/
function bigImageDataExtendFirst(imgData, obj) {
	$.each(imgData, function (index, item) {
		var extendObj = $.extend(true, {}, obj, item);
		bigImageAllData.push(extendObj);
	})
}
/*数据合并*/
function bigImageDataExtendSecond(imgData) {
	var temp1 = {
		'standpoint': 0, //1 点赞   2吐槽
		'viewpoint': {
			'face': 0, //1 图像清晰   2图像模糊  0无
			'light': 0, //1 光线太暗  2光线太亮  0无
			'text': '', //
		},
	}
	var temp2 = {
		'standpoint': 0, //1 点赞   2吐槽
		'viewpoint': {
			'face': 0, //1 图像清晰   2图像模糊  0无
			'light': 0, //1 光线太暗  2光线太亮  0无
			'angel': 0, //角度安装不合理
			'text': '', //
		},
	}
	$.each(imgData, function (index, item) {
		var obj = {
			'clickTag': 'middle',
			'userdefined': {},
		}
		if (item.left != undefined) {
			obj.left = {
				'title': '',
				'image': '',
				'info': {},
			};
		}
		if (item.middle != undefined) {
			obj.middle = {
				'title': '',
				'left': {
					'image': '',
					'info': {},
				},
				'right': {
					'image': [],
					'info': {}
				},
				'center': {},
				'comment': {
					'show': false,
					'detail': [],
				},
				'sure': {
					'person': {
						'show': false,
						'idcard': {
							'show': false,
							'cardnum': '',
						},
						'default': 0, //0待确认  1不同人   2同一人
					},
					'log': {
						'show': false,
						'position': '',
					}
				}
			}
			if (item.middle.comment != undefined && item.middle.comment.show == true) {
				var ary = [];
				$.each(item.middle.right.image, function () {
					ary.push(temp1);
				})
				obj.middle.comment.detail = ary;
			}
		}
		if (item.screen != undefined) {
			obj.screen = {
				'title': '',
				'image': [],
				'info': {},
				'comment': {
					'show': false,
					'detail': [],
				},
			}
			if (item.screen.comment != undefined && item.screen.comment.show == true) {
				var ary = [];
				$.each(item.screen.image, function () {
					ary.push(temp2);
				})
				obj.screen.comment.detail = ary;
			}
		}
		if (item.video != undefined) {
			obj.video = {
				'title': '',
				'url': '',
				'info': {}
			};
		}
		var extendObj = $.extend(true, {}, obj, item);
		bigImageAllData.push(extendObj);
	})
}
/*返回参数*/
function getBackParameters() {
	var param = {
		'index': bigImageAllIndex
	};
	if (bigImageAllData[bigImageAllIndex].middle != undefined) {
		param.left = bigImageAllData[bigImageAllIndex].middle.left.image;
		param.right = bigImageAllData[bigImageAllIndex].middle.right.image;
		if (bigImageAllData[bigImageAllIndex].middle.comment.show) {
			param.rightcomment = $.extend(true, {}, bigImageMiddledata);
		}
	}
	if (bigImageAllData[bigImageAllIndex].screen != undefined) {
		param.screen = bigImageAllData[bigImageAllIndex].screen.image;
		if (bigImageAllData[bigImageAllIndex].screen.comment.show) {
			param.screencomment = $.extend(true, {}, bigImageScreendata);
		}
	}
	param.userdefined = bigImageAllData[bigImageAllIndex].userdefined;
	return param;
}