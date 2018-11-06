var rk = rk == null ? {} : rk;
/*
 * 创建点
 */
rk.clusterColorType = [ {
	minNum : 0,
	textColor : "#FFFFFF",
	fillColor : "rgb(57,141,238)",
	strokeColor : "rgba(255, 255, 255, 0.7)"
}, {
	minNum : 50,
	textColor : "#FFFFFF",
	fillColor : "rgb(40,99,185)",
	strokeColor : "rgba(255, 255, 255, 0.7)"
}, {
	minNum : 100,
	textColor : "#FFFFFF",
	fillColor : "rgb(237,190,80)",
	strokeColor : "rgba(255, 255, 255, 0.7)"
}, {
	minNum : 200,
	textColor : "#FFFFFF",
	fillColor : "rgb(255,194,48)",
	strokeColor : "rgba(255, 255, 255, 0.7)"
}, {
	minNum : 500,
	textColor : "#FFFFFF",
	fillColor : "rgb(255,127,48)",
	strokeColor : "rgba(255, 255, 255, 0.7)"
}, {
	minNum : 1000,
	textColor : "#FFFFFF",
	fillColor : "rgb(255,34,31)",
	strokeColor : "rgba(255, 255, 255, 0.7)"
} ];
//
rk.clusterLayer = function(usermap, options) {
	/**
	 * @private
	 * @type {对象自己}
	 */
	var m_obj = this;
	/**
	 * @private
	 * @type {地图对象}
	 */
	this.usermap = usermap;
	/**
	 * @private
	 * @type {图层对象}
	 */
	this.layer = null;

	// 聚合范围
	this.distance = (options.distance == null ? 40 : options.distance);
	//
	this.sourceObject = null;
	this.clusterSource = null;
	this.styleCache = {};
	//
	this.pointNumMap = null;
	this.pointTypeMap = null;
	this.userType = options.userType==null?'default':options.userType;
	/**
	 * @public 初始化函数
	 */
	this.InitClusterLayer = function() {
		//
		m_obj.pointNumMap = new Array();
		//
		m_obj.pointTypeMap = new Array();
		// 数据
		m_obj.sourceObject = new ol.source.Vector();
		//
		m_obj.clusterSource = new ol.source.Cluster({
			distance : m_obj.distance,
			source : m_obj.sourceObject
		});
		//
		m_obj.layer = new ol.layer.Vector({
			source : m_obj.clusterSource,
			style : function(feature) {
				return m_obj.showStyle(feature);
			}
		});
		//
		m_obj.usermap.addLayer(m_obj.layer);
	};
	// Run
	this.InitClusterLayer();
};
// 获取当前图层
rk.clusterLayer.prototype.getLayer = function() {
	var myobj = this;
	return myobj.layer;
};
//
//设置是否显示
rk.clusterLayer.prototype.setVisible =function(visible){
	var myobj = this;
	myobj.layer.setVisible(visible);
};
rk.clusterLayer.prototype.getFeaturesSizeNum = function(features) {
	var myobj = this;
	var sizeNum = 0;
	//
	for ( var indexNum in features) {
		var feature = features[indexNum];
		if (feature == null) {
			continue;
		}
		//
		var featureSizeNum = myobj.pointNumMap[feature.getId()];
		if (featureSizeNum == null) {
			continue;
		}
		//
		sizeNum = sizeNum + featureSizeNum;
	}
	return sizeNum;
};
//
rk.clusterLayer.prototype.showStyle = function(feature) {
	var myobj = this;
	var features = feature.get('features');
	var sizeNum = myobj.getFeaturesSizeNum(features);
	var strSizeNum = (sizeNum > 100 ? "99+" : sizeNum.toString());
	//
	var colorType = rk.clusterColorType[0];
	for ( var index in rk.clusterColorType) {
		var tmpColorType = rk.clusterColorType[index];
		if (tmpColorType.minNum <= sizeNum) {
			colorType = tmpColorType;
		}
		else {
			break;
		}
	}
	//
	var style=null;
	if(messageAccept==false){
		if(myobj.userType=="camera"){
			 style = new ol.style.Style({
				image : new ol.style.Circle({
					radius : 11,
					stroke : new ol.style.Stroke({
						color : '#fff'
					}),
					fill : new ol.style.Fill({
						color : '#0e92a6'
					})
				}),
				text : new ol.style.Text({
					text : strSizeNum,
					fill : new ol.style.Fill({
						color : colorType.textColor
					})
				})
			});
		}
		else if(myobj.userType=="door"){
			 style = new ol.style.Style({
				image : new ol.style.Circle({
					radius : 11,
					stroke : new ol.style.Stroke({
						color : '#fff'
					}),
					fill : new ol.style.Fill({
						color : '#e68717'
					})
				}),
				text : new ol.style.Text({
					text : strSizeNum,
					fill : new ol.style.Fill({
						color : colorType.textColor
					})
				})
			});
		}
	}
	else{
		if(myobj.userType=="camera"){
			var style = new ol.style.Style({
				image : new ol.style.Circle({
				radius : 13,
				stroke : new ol.style.Stroke({
					color : colorType.strokeColor
				}),
				fill : new ol.style.Fill({
					color : colorType.fillColor
				})
			}),
			image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		          anchor: [0.5, 13],
		          anchorXUnits: 'fraction',
		          anchorYUnits: 'pixels',
		          scale:0.9,
		          src: '/public/image/showrealalarm/map_camera.png'
		        })),
			text : new ol.style.Text({
				text : strSizeNum,
				fill : new ol.style.Fill({
					color : colorType.textColor
				})
			})
		});
		}
		else if(myobj.userType=="door"){
		var style = new ol.style.Style({
				image : new ol.style.Circle({
				radius : 13,
				stroke : new ol.style.Stroke({
					color : colorType.strokeColor
				}),
				fill : new ol.style.Fill({
					color : colorType.fillColor
				})
			}),
			image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		          anchor: [0.5, 13],
		          anchorXUnits: 'fraction',
		          anchorYUnits: 'pixels',
		          scale:0.9,
		          src: 'static/image/showrealalarm/map_entranceguard.png'
		        })),
			text : new ol.style.Text({
				text : strSizeNum,
				fill : new ol.style.Fill({
					color : colorType.textColor
				})
			})
		});
		}
	}

	//
	return style;
};
// 添加节点
rk.clusterLayer.prototype.addPointInfo = function(pointId, lonlat, sizeNum,type) {
	var myobj = this;
	var pointFeature = myobj.getFeatureById(pointId);
	if (pointFeature != null) {
		myobj.updatePointInfo(pointId, lonlat, sizeNum);
		return;
	}
	//
	var pointArr = myobj.usermap
			.DisplayToUseTransForm([ lonlat.lon, lonlat.lat ]);
	//
	var pointFeature = new ol.Feature({
		geometry : new ol.geom.Point(pointArr)
	});
	var iconStyle=null;
	if(type==1){
		 iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'static/image/showrealalarm/map_entranceguard.png'
        }))
      });
	}
	else if(type==3){
		 iconStyle = new ol.style.Style({
	        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
	          anchor: [0.5, 46],
	          anchorXUnits: 'fraction',
	          anchorYUnits: 'pixels',
	          src: 'static/image/showrealalarm/map_entranceguard_1.png'
	        }))
	      });
	}
	else if(type==4){
		 iconStyle = new ol.style.Style({
	        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
	          anchor: [0.5, 46],
	          anchorXUnits: 'fraction',
	          anchorYUnits: 'pixels',
	          src: '../../../image/showrealalarm/map_camera_1.png'
	        }))
	      });
	}
	else{
		 iconStyle = new ol.style.Style({
	        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
	          anchor: [0.5, 46],
	          anchorXUnits: 'fraction',
	          anchorYUnits: 'pixels',
	          src: '../../../image/showrealalarm/map_camera.png'
	        }))
	      });
	}
	pointFeature.setStyle(iconStyle);
	pointFeature.setId(pointId);
	//
	myobj.pointNumMap[pointId] = sizeNum;
	//
	myobj.pointTypeMap[pointId] = type;
	//
	myobj.sourceObject.addFeature(pointFeature);
};
// 更新节点
rk.clusterLayer.prototype.updatePointInfo = function(pointId, lonlat, sizeNum) {
	var myobj = this;
	var pointFeature = myobj.getFeatureById(pointId);
	if (pointFeature == null)
		return;
	var pointArr = myobj.usermap
			.DisplayToUseTransForm([ lonlat.lon, lonlat.lat ]);
	var geometry = new ol.geom.Point(pointArr);

	pointFeature.setGeometry(geometry);
	myobj.pointNumMap[pointId] = sizeNum;
	// 刷新数据
	try {
		myobj.clusterSource.refresh();
	}
	catch (e) {
	}

};
// 更新节点数据加1
rk.clusterLayer.prototype.updatePointInfoAddSize = function(pointId) {
	var myobj = this;
	if (myobj.pointNumMap[pointId] == null)
		return;
	myobj.pointNumMap[pointId] = myobj.pointNumMap[pointId] + 1;
	myobj.clusterSource.refresh();
};
// 移除节点
rk.clusterLayer.prototype.removePointInfo = function(pointId) {
	var myobj = this;
	var pointFeature = myobj.getFeatureById(pointId);
	if (pointFeature == null)
		return;
	myobj.pointNumMap[pointId] = null;
	myobj.sourceObject.removeFeature(pointFeature);
	myobj.clusterSource.refresh();// .
};
/**
 * 清空节点
 *
 * @author lhp 2017-4-6 下午2:37:38
 */
rk.clusterLayer.prototype.clearPointInfos = function() {
	var myobj = this;
	myobj.sourceObject.clear();
	myobj.clusterSource.refresh();
}
// 根据id获取数据
rk.clusterLayer.prototype.getFeatureById = function(id) {
	var myobj = this;
	return myobj.sourceObject.getFeatureById(id);
};
// 获取所有的features
rk.clusterLayer.prototype.getFeatures = function() {
	var myobj = this;
	return myobj.sourceObject.getFeatures();
};
