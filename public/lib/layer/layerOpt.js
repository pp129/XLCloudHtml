/**
 * 顯示遮罩曾
 * 
 * @author lhp 2017-5-28 下午3:18:53
 * @returns
 */
function showLayer() {
	var overlay = layer.load(1, {
		shade : [ 0.1, '#fff' ]
	});
	return overlay;
}

/**
 * 隐藏遮罩层
 * 
 * @author lhp 2017-5-28 下午3:19:10
 * @param overlay
 */
function hideLayer(overlay) {
	layer.close(overlay);
}