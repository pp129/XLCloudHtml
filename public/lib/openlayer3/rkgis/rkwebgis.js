var rk = rk == null ? {} : rk;

rk.mapgis = function(options) {

	/**
	 * @private
	 * @type {对象自己}
	 */
	var m_obj = this;

	/**
	 * @private
	 * @type {地图对象}
	 */
	this._map = null;
	/**
	 * @private
	 * @type {地图视图对象}
	 */
	this._view = null;
	/**
	 * @private
	 * @type {显示地图dom的ID}
	 */
	this._target = options.target;
	/**
	 * @private
	 * @type {地图点击事件的key}
	 */
	this.mapclickkey = null;
	this.mapmovekkey = null;
	/**
	 * @private
	 * @type {基础图层瓦服务地址}
	 */
	this.serviceURL = IsDefRK(options.serviceURL)
			? options.serviceURL
			: rk.DEFAULT.URL;
	this.serviceSateURL = IsDefRK(options.serviceSateURL)
			? options.serviceSateURL
			: rk.DEFAULT.URL;
	this.overlayURL = IsDefRK(options.overlayURL)
			? options.overlayURL
			: rk.DEFAULT.URL;
	this.isWMS = IsDefRK(options.isWMS) ? options.isWMS : false;
	if(options.hasOwnProperty('mouseWheelZoom')){
	    this.mouseWheelZoom = options.mouseWheelZoom;
    }else{
	    this.mouseWheelZoom = true;
    }
	/**
	 * @private
	 * @type {基础图层对象}
	 */
	this.baseLayer = null;
	this.baseSateLayer = null;
	this.overlayLayer = null;
	/**
	 * @private
	 * @type {默认显示层级}
	 */
	this.defaultzoom = IsDefRK(options.zoom) ? options.zoom : rk.DEFAULT.ZOOM;
	/**
	 * @private
	 * @type {显示最小层级}
	 */
	this.minZoom = IsDefRK(options.minZoom)
			? options.minZoom
			: rk.DEFAULT.MINZOOM;
	/**
	 * @private
	 * @type {显示最大层级}
	 */
	this.maxZoom = IsDefRK(options.maxZoom)
			? options.maxZoom
			: rk.DEFAULT.MAXZOOM;
	/**
	 * @private
	 * @type {旋转角度}
	 */
	this.rotation = IsDefRK(options.rotation)
			? options.rotation
			: rk.DEFAULT.ROTATION;
	/**
	 * @private
	 * @type {版权声明文本}
	 */
	this.attributionText = IsDefRK(options.attributionText)
			? options.attributionText
			: rk.DEFAULT.Attribution;
	/**
	 * @private
	 * @type {中心坐标}
	 */
	this.center = IsDefRK(options.center) ? options.center : rk.DEFAULT.CENTER;
	/**
	 * @private projection = 'EPSG:3857',
	 * @type {瓦片坐标系}
	 */
	this.projection = IsDefRK(options.projection)
			? options.projection
			: rk.DEFAULT.PRO;
	/**
	 * @private displayprojection = 'EPSG:4326'
	 * @type {显示做坐标系}
	 */
	this.displayprojection = IsDefRK(options.displayprojection)
			? options.displayprojection
			: rk.DEFAULT.DISPLAYPRO;
	/*
	 * * 鼠标事件 显示鼠标经过的经纬度
	 */
	this.mousePositionControl = null;
	/**
	 * @private
	 * @type {鼠标移动显示的dom的ID坐标}
	 */
	this.mousetarget = options.mousetarget;
	/*
	 * 鼠标点击获取经纬度 回调函数
	 */
	this.mouseByClickCallbackFn = null;
	/*
	 * 鼠标移动获取经纬度 回调函数
	 */
	this.mouseByMoveCallbackFn = null;
	/*
	 * 编辑对象
	 */
	this.modifyobj = null;
	this.useCollection = null;
	this.usemaplist = null;
	/*
	 * 选中对象
	 */
	this.selectobj = null;
	this.selectCallbackFn = null;
	this.selectPreCallbackFn = null;
	/**
	 * Elements that make up the popup.
	 */
	this.usercontainer = null;
	this.usercontent = null;
	this.usercloser = null;
	this.usercontainerOther = null;
	this.usercontentOther = null;
	this.usercloser = null;
	/**
	 * Create an overlay to anchor the popup to the map.
	 */
	this.useroverlay = null;
	this.useroverlayOther = null;
	// 创建显示经纬度信息控件
	this.CreateMousePositionControl = function() {
		m_obj.mousePositionControl = new ol.control.MousePosition({
					coordinateFormat : ol.coordinate.createStringXY(4),
					projection : 'EPSG:4326',
					target : m_obj.mousetarget,
					undefinedHTML : '&nbsp;'
				});
	};
	// 创建显示框
	this.CreatePopup = function() {
		$(document.getElementById(m_obj._target))
				.append('<div id="userpopup" class="ol-popup"><a href="javascript:void(0)" id="userpopup_closer" class="ol-popup-closer"></a><div id="userpopup_content"></div></div>');
		m_obj.usercontainer = document.getElementById('userpopup');
		m_obj.usercontent = document.getElementById('userpopup_content');
		m_obj.usercloser = document.getElementById('userpopup_closer');
		m_obj.useroverlay = new ol.Overlay({
					element : m_obj.usercontainer,
					positioning:'center-center',
//					autoPan:true,
					offset : [0, -5]
				});
		try {
			m_obj.usercloser.onclick = function() {
				m_obj.usercontainer.style.display = 'none';
				m_obj.usercloser.blur();
				return false;
			};
		} catch (e) {
		}
		//
		m_obj._map.addOverlay(m_obj.useroverlay);
	};

	// 创建显示框Other
	this.CreatePopupOther = function() {
		$(document.getElementById(m_obj._target))
				.append('<div id="userpopupOther" class="ol-popup"><a href="javascript:void(0)" id="userpopupOther_closer" class="ol-popup-closer"></a><div id="userpopupOther_content"></div></div>');
		m_obj.usercontainerOther = document.getElementById('userpopupOther');
		m_obj.usercontentOther = document.getElementById('userpopupOther_content');
		m_obj.usercloserOther = document.getElementById('userpopupOther_closer');
		m_obj.useroverlayOther = new ol.Overlay({
					element : m_obj.usercontainerOther,
					positioning:'center-center',
//					autoPan:true,
					offset : [0, -5]
				});
		try {
			m_obj.usercloserOther.onclick = function() {
				m_obj.usercontainerOther.style.display = 'none';
				m_obj.usercloserOther.blur();
				return false;
			};
		} catch (e) {
		}
		//
		m_obj._map.addOverlay(m_obj.useroverlayOther);
	};
	//
	this.SetFeatrueStyle = function() {
		$(m_obj._map.getViewport()).on('mousemove', function(e) {
			var pixel = m_obj._map.getEventPixel(e.originalEvent);
			var hit = m_obj._map.forEachFeatureAtPixel(pixel, function(feature,
							layer) {
						return true;
					});
			if (hit) {
				document.getElementById(m_obj._target).style.cursor = 'pointer';
			} else {
				document.getElementById(m_obj._target).style.cursor = '';
			}
		});
	};
	/**
	 * @public 初始化函数
	 */
	this.InitMapGis = function() {
		// 创建显示相关
		m_obj._view = new ol.View({
					projection : m_obj.projection,
					center : m_obj.DisplayToUseTransForm([m_obj.center.lon,
							m_obj.center.lat]),
					zoom : m_obj.defaultzoom,
					minZoom : m_obj.minZoom,
					maxZoom : m_obj.maxZoom,
					rotation : m_obj.rotation
				});
		// 创建基础图层
		ol.source.OSM.ATTRIBUTION.c = '&copy; <a href="http://www.ropeok.com">罗普特（厦门）科技集团</a>.';
		var mapLayers = new Array();
		if (m_obj.isWMS) {
			//
			m_obj.baseLayer = new ol.layer.Tile({
						source : new ol.source.TileWMS({
									url : m_obj.serviceURL,
									params : {
										'LAYERS' : 'xmmap:xiamencity',
										"FORMAT" : 'image/jpeg'
									},
									projection : 'EPSG:4326',
									serverType : 'geoserver'
								})
					});
			mapLayers.push(m_obj.baseLayer);
			//
			m_obj.baseSateLayer = new ol.layer.Tile({
						source : new ol.source.TileWMS({
									url : m_obj.serviceSateURL,
									tilePixelRatio : 1,
									hidpi : false,
									params : {
										'LAYERS' : 'Xiamen:xiamen_satellite_Group',
										"FORMAT" : 'image/jpeg',
										'WIDTH' : 256,
										'HEIGHT' : 256,
										'SRS' : 'EPSG:4326',
										VERSION : "1.1.1",
										'TILED' : true
									},
									serverType : 'geoserver',
									projection : 'EPSG:4326'
								}),
						visible : false
					});
			mapLayers.push(m_obj.baseSateLayer);
		} else {
			//
			m_obj.baseLayer = new ol.layer.Tile({
						source : new ol.source.XYZ({
									projection : 'EPSG:4326',
									url : m_obj.serviceURL
								})
                        /*source : new ol.source.OSM({
                            url : m_obj.serviceURL,
                            attributions:[
                                new ol.Attribution({
                                    html:m_obj.attributionText
                                }),
                                ol.source.OSM.ATTRIBUTION
                            ],
                            logo:'baselayer',
                            maxZoom:m_obj.maxZoom
                        })*/
					});
			mapLayers.push(m_obj.baseLayer);
			//
			m_obj.baseSateLayer = new ol.layer.Tile({
						source : new ol.source.XYZ({
									projection : 'EPSG:4326',
									url : m_obj.serviceSateURL
								}),
						visible : false
					});
			mapLayers.push(m_obj.baseSateLayer);
			//
			if (m_obj.overlayURL != null) {
				m_obj.overlayLayer = new ol.layer.Tile({
							source : new ol.source.XYZ({
										logo : 'overlay',
										maxZoom : m_obj.maxZoom,
										url : m_obj.overlayURL
									}),
							opacity : 0.8,
							visible : false
						});
				mapLayers.push(m_obj.overlayLayer);
			}
		}

		m_obj.IsShowSate = false;
		// 创建地图
		m_obj._map = new ol.Map({
					target : m_obj._target,
					layers : mapLayers,
					view : m_obj._view,
					controls : ol.control.defaults({
                        attributionOptions : ({
                            collapsible : true
                        })
                    }).extend([
                        // new ol.control.Attribution({tipLabel:'声明'}),
                        new ol.control.Zoom({
                            zoomInTipLabel : "缩小",
                            zoomOutTipLabel : "放大"
                        }),
                        new ol.control.ScaleLine({
                            units : 'metric'
                        }),
                        new ol.control.ZoomSlider()
							// new ol.control.OverviewMap({tipLabel:'缩略图',
							// collapsed: true}),
							// new ol.control.FullScreen({tipLabel:'全屏'})
                    ]),
                    interactions:ol.interaction.defaults({
                        mouseWheelZoom:m_obj.mouseWheelZoom
                    })
				});
		// 添加鼠标获取经纬度
		if (m_obj.mousetarget != null) {
			m_obj.CreateMousePositionControl();
			m_obj._map.addControl(m_obj.mousePositionControl);
		}
		// 创建显示框
		m_obj.CreatePopup();
		// 创建显示框Other
		m_obj.CreatePopupOther();
		// 创建鼠标在图标上面的样式
		m_obj.SetFeatrueStyle();
		// 解决放大后压缩问题
		var size = m_obj._map.getSize();
		m_obj._map.on("change:size", function(obj) {
					var newsize = m_obj._map.getSize();
					//
					if (size[0] == newsize[0] && size[1] != newsize[1]) {
						m_obj._map.setSize(size);
					}
				});
		// 监听图层
		// m_obj._view.on("change:resolution",function(e){
		// console.log(m_obj._view.getResolution());
		// });
	};
	// run
	this.InitMapGis();
};
//
rk.mapgis.prototype.ChangeMapToSate = function(IsSate) {
	var myobj = this;
	if (IsSate) {
		if (myobj.IsShowSate) {
			return;
		}
		myobj.baseLayer.setVisible(false);
		myobj.baseSateLayer.setVisible(true);
		if (myobj.overlayLayer != null) {
			myobj.overlayLayer.setVisible(true);
		}
		myobj.IsShowSate = IsSate;
		$(".ol-mouse-position").css({
					"color" : "#FFFFFF"
				});
	} else {
		if (!myobj.IsShowSate) {
			return;
		}
		myobj.baseSateLayer.setVisible(false);
		if (myobj.overlayLayer != null) {
			myobj.overlayLayer.setVisible(false);
		}
		myobj.baseLayer.setVisible(true);
		myobj.IsShowSate = IsSate;
		$(".ol-mouse-position").css({
					"color" : "#333333"
				});
	}
};
/*
 * 层级改变绑定函数
 */
rk.mapgis.prototype.BindChangeResolution = function(callbackFn) {
	if (callbackFn == null) {
		return;
	}
	this._view.on("change:resolution", callbackFn);
};
/*
 * 解除层级改变绑定函数
 */
rk.mapgis.prototype.UnBindChangeResolution = function(callbackFn) {
	if (callbackFn == null) {
		return;
	}
	this._view.un("change:resolution", callbackFn);
};
/*
 * 转换坐标系 由显示转系统使用坐标系
 */
rk.mapgis.prototype.DisplayToUseTransForm = function(pointArr) {
	if (this.projection == this.displayprojection) {
		return pointArr;
	}
	return ol.proj.transform(pointArr, this.displayprojection, this.projection);
};
/*
 * 转换坐标系 由系统使用转显示坐标系
 */
rk.mapgis.prototype.UseToDisplayTransForm = function(pointArr) {
	if (this.projection == this.displayprojection) {
		return pointArr;
	}
	return ol.proj.transform(pointArr, this.projection, this.displayprojection);
};
/*
 * 设置鼠标点击回调函数
 */
rk.mapgis.prototype.SetMouseByClickCallbackFn = function(callbackFn) {
	var usemap = this._map;
	var myobj = this;
	this.mouseByClickCallbackFn = callbackFn;
	// 移除事件
	if (this.mapclickkey != null) {
		this._map.unByKey(this.mapclickkey);
		this.mapclickkey = null;
	}
	// 设置事件
	this.mapclickkey = this._map.on('click', function(evt) {
				var coordinate = usemap.getCoordinateFromPixel(evt.pixel);
				coordinate = myobj.UseToDisplayTransForm(coordinate);
				try {
					myobj.mouseByClickCallbackFn({
								lon : coordinate[0],
								lat : coordinate[1]
							});
				} catch (e) {
				}
			});
};
/*
 * 设置鼠标点击回调函数
 */
rk.mapgis.prototype.SetMouseByMoveCallbackFn = function(callbackFn) {
	var myobj = this;
	this.mouseByMoveCallbackFn = callbackFn;
	// 移除事件
	if (this.mapmovekkey != null) {
		this._map.unByKey(this.mapmovekkey);
		this.mapmovekkey = null;
	}
	// 设置事件
	this.mapmovekkey = this._map.on('pointermove', function(evt) {
				var coordinate = myobj._map
						.getEventCoordinate(evt.originalEvent);
				coordinate = myobj.UseToDisplayTransForm(coordinate);
				try {
					myobj.mouseByMoveCallbackFn({
								lon : coordinate[0],
								lat : coordinate[1]
							});
				} catch (e) {
				}
			});
};
// 移动到地图中心
rk.mapgis.prototype.MoveMapCenter = function(lonlat) {
	var myobj = this;
	try {
		var center = [lonlat.lon, lonlat.lat];
		center = myobj.DisplayToUseTransForm(center);// 转换坐标
		myobj._view.setCenter(center);
	} catch (e) {
	}
};
// 获取中心坐标
rk.mapgis.prototype.GetMapCenter = function() {
	var myobj = this;
	try {
		var center = myobj._view.getCenter();
		center = myobj.UseToDisplayTransForm(center);// 转换坐标
		return {
			lon : center[0],
			lat : center[1]
		};
	} catch (e) {
		return null;
	}

};
// 设置层级
rk.mapgis.prototype.setZoom = function(zoomNum) {
	var myobj = this;
	myobj._view.setZoom(zoomNum);
};
// 获取层级
rk.mapgis.prototype.getZoom = function() {
	var myobj = this;
	return myobj._view.getZoom();
};
// 设置旋转角度
rk.mapgis.prototype.setRotation = function(rotation) {
	var myobj = this;
	myobj._view.setRotation(rotation);
};
// 获取旋转角度
rk.mapgis.prototype.getRotation = function() {
	var myobj = this;
	return myobj._view.getRotation();
};
// 获取分辨率
rk.mapgis.prototype.getResolution = function() {
	var myobj = this;
	return myobj._view.getResolution();
};
// 旋转视角围绕一个给定的坐标
rk.mapgis.prototype.rotate = function(rotation, lonlat) {
	var myobj = this;
	try {
		var center = [lonlat.lon, lonlat.lat];
		center = myobj.DisplayToUseTransForm(center);// 转换坐标
		myobj._view.rotate(rotation, center);
	} catch (e) {
	}
};
// 更新显示界面大小
rk.mapgis.prototype.updateSize = function() {
	var myobj = this;
	myobj._map.updateSize();
};
// 获取图层大小
rk.mapgis.prototype.getSize = function() {
	var myobj = this;
	return myobj._map.getSize();
};
// 添加图层
rk.mapgis.prototype.addLayer = function(layer) {
	var myobj = this;
	myobj._map.addLayer(layer);
};
// 删除图层
rk.mapgis.prototype.removeLayer = function(layer) {
	var myobj = this;
	myobj._map.removeLayer(layer);
};
// 添加显示层
rk.mapgis.prototype.addOverlay = function(overlay) {
	var myobj = this;
	myobj._map.addOverlay(overlay);
};
// 移除显示层
rk.mapgis.prototype.removeOverlay = function(overlay) {
	var myobj = this;
	myobj._map.removeOverlay(overlay);
};
// 设置偏移位置
rk.mapgis.prototype.setOverlayOffset = function(offset) {
	var myobj = this;
	if (offset == null) {
		return;
	}
	myobj.useroverlay.setOffset(offset);
};
// 显示弹框
rk.mapgis.prototype.showOverlay = function(lonlat, msg) {
	var myobj = this;
	var coordinate = [lonlat.lon, lonlat.lat];
	coordinate = myobj.DisplayToUseTransForm(coordinate);// 转换坐标
	myobj.useroverlay.setPosition(coordinate);
	myobj.usercontent.innerHTML = msg;
	myobj.usercontainer.style.display = 'block';
	myobj.useroverlay.setPositioning('bottom-left');

	//

//	lonlat.lat = lonlat.lat+0.015;
//	myobj.MoveMapCenter(lonlat);
};
// 移除显示层
rk.mapgis.prototype.hideOverlay = function() {
	var myobj = this;
	myobj.usercontainer.style.display = 'none';
};
//设置偏移位置
rk.mapgis.prototype.setOverlayOffsetOther = function(offset) {
	var myobj = this;
	if (offset == null) {
		return;
	}
	myobj.useroverlayOther.setOffset(offset);
};
// 显示弹框
rk.mapgis.prototype.showOverlayOther = function(lonlat, msg) {
	var myobj = this;
	var coordinate = [lonlat.lon, lonlat.lat];
	coordinate = myobj.DisplayToUseTransForm(coordinate);// 转换坐标
	myobj.useroverlayOther.setPosition(coordinate);
	myobj.usercontentOther.innerHTML = msg;
	myobj.usercontainerOther.style.display = 'block';
	myobj.useroverlayOther.setPositioning('bottom-left');

	//

//	lonlat.lat = lonlat.lat+0.015;
//	myobj.MoveMapCenter(lonlat);
};
// 移除显示层
rk.mapgis.prototype.hideOverlayOther = function() {
	var myobj = this;
	myobj.usercontainerOther.style.display = 'none';
};
// 飞动切换不同位置
rk.mapgis.prototype.flyToBern = function(lonlat, duration, showNum) {
	var myobj = this;
	try {
		var bern = [lonlat.lon, lonlat.lat];
		bern = myobj.DisplayToUseTransForm(bern);// 转换坐标
		var start = +new Date();
		var pan = ol.animation.pan({
					duration : duration,
					source : (myobj._view.getCenter()),
					start : start
				});
		var bounce = ol.animation.bounce({
					duration : duration,
					resolution : showNum * myobj._view.getResolution(),
					start : start
				});
		myobj._map.beforeRender(pan, bounce);
		myobj._view.setCenter(bern);
	} catch (e) {
	}
};
// 旋转反向
rk.mapgis.prototype.spiralToMadrid = function(lonlat, duration, showNum,
		roteteNum) {
	var myobj = this;
	try {
		var bern = [lonlat.lon, lonlat.lat];
		bern = myobj.DisplayToUseTransForm(bern);// 转换坐标
		var start = +new Date();
		var pan = ol.animation.pan({
					duration : duration,
					source : (myobj._view.getCenter()),
					start : start
				});
		var bounce = ol.animation.bounce({
					duration : duration,
					resolution : showNum * myobj._view.getResolution(),
					start : start
				});
		var rotate = ol.animation.rotate({
					duration : duration,
					rotation : -roteteNum * Math.PI,
					start : start
				});
		myobj._map.beforeRender(pan, bounce, rotate);
		myobj._view.setCenter(bern);
	} catch (e) {
	}
};
// 旋转正向
rk.mapgis.prototype.spinToRome = function(lonlat, duration, showNum, roteteNum) {
	var myobj = this;
	try {
		var bern = [lonlat.lon, lonlat.lat];
		bern = myobj.DisplayToUseTransForm(bern);// 转换坐标
		var start = +new Date();
		var pan = ol.animation.pan({
					duration : duration,
					source : (myobj._view.getCenter()),
					start : start
				});
		var bounce = ol.animation.bounce({
					duration : duration,
					resolution : showNum * myobj._view.getResolution(),
					start : start
				});
		var rotate = ol.animation.rotate({
					duration : duration,
					rotation : roteteNum * Math.PI,
					start : start
				});
		myobj._map.beforeRender(pan, bounce, rotate);
		myobj._view.setCenter(bern);
	} catch (e) {
	}
};
// 开始编辑
rk.mapgis.prototype.EableEditFeature = function(feature) {
	var myobj = this;
	if (myobj.modifyobj == null) {
		myobj.useCollection = new ol.Collection();
		myobj.usemaplist = new Array();
		myobj.modifyobj = new ol.interaction.Modify({
					features : myobj.useCollection,
					style : rk.DEFAULT.overlayStyle
				});
		myobj._map.addInteraction(myobj.modifyobj);
	}
	if (IsDefRK(feature) && myobj.usemaplist[feature.getId()] == null) {
		myobj.useCollection.push(feature);
		myobj.usemaplist[feature.getId()] = feature;
	}
};
// 结束编辑
rk.mapgis.prototype.DisableEditFeature = function(feature) {
	var myobj = this;
	if (myobj.modifyobj != null && myobj.usemaplist[feature.getId()] != null) {
		myobj.useCollection.remove(feature);
		myobj.usemaplist[feature.getId()] = null;
	}
};
// 启用选中编辑
rk.mapgis.prototype.SelectEditFeature = function() {
	var myobj = this;
	if (myobj.selectobj == null) {
		return;
	}
	myobj.DisableEditFeature();
	myobj.modifyobj = new ol.interaction.Modify({
				features : myobj.selectobj.getFeatures(),
				style : rk.DEFAULT.overlayStyle
			});
	myobj._map.addInteraction(myobj.modifyobj);
};
// 启用选中
rk.mapgis.prototype.EnableSelectFeature = function(layerTmps, selectFn,
		selectPreFn, style) {
	var myobj = this;
	myobj.DisableSelectFeature();
	myobj.selectCallbackFn = selectFn;
	myobj.selectPreCallbackFn = selectPreFn;
	myobj.selectFeature = new ol.Collection();
	myobj.style = rk.DEFAULT.overlayStyle;
	if (style != null) {
		myobj.style = style;
	}
	myobj.selectobj = new ol.interaction.Select({
				condition : ol.events.condition.click,
				style : myobj.style,
				layers : layerTmps,
				features : myobj.selectFeature
			});
	myobj._map.addInteraction(myobj.selectobj);
	myobj.selectobj.on('select', function(e) {
				// 选中
				if (e.selected.length > 0 && myobj.selectCallbackFn != null) {
					myobj.selectCallbackFn(e.selected);
				}

				// 之前选中的数据
				if (e.deselected.length > 0
						&& myobj.selectPreCallbackFn != null) {
					myobj.selectPreCallbackFn(e.deselected);
				}
			});
};

// 结束选中
rk.mapgis.prototype.DisableSelectFeature = function() {
	var myobj = this;
	if (myobj.selectobj != null) {
		myobj._map.removeInteraction(myobj.selectobj);
		myobj.selectobj = null;
	}
};

/**
 * 清空选中
 *
 * @author lhp 2017-4-6 下午8:02:00
 */
rk.mapgis.prototype.clearSelectFeature = function() {
	var myobj = this;
	if (myobj != null) {
		myobj.selectFeature.clear();
	}
}

rk.mapgis.prototype.distance = function(from, to) {
	var fromTurf = {
		"type" : "Feature",
		"properties" : {},
		"geometry" : {
			"type" : "Point",
			"coordinates" : from
		}
	};
	var toTurf = {
		"type" : "Feature",
		"properties" : {},
		"geometry" : {
			"type" : "Point",
			"coordinates" : to
		}
	};
	var units = "miles";
	var distance = turf.distance(fromTurf, toTurf, units);
	return distance;
};
