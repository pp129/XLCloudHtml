var rk = rk==null?{}:rk;
/*
*  图层创建管理
*/ 
rk.layerVector = function(usermap, options){
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
   * @type {地图图层对象}
   */
   this.layer = null;
   /**
   * @private
   * @type {地图资源对象}
   */
   this.source = null;
   /*
   * @public 
   * 初始化函数
   */
   this.InitLayer = function(){

		m_obj.source = new ol.source.Vector({logo:IsDefRK(options.logo)? options.logo: ''});		
		m_obj.layer  = new ol.layer.Vector({source: m_obj.source});
		//
		if(IsDefRK(options.visible)){
			m_obj.layer.setVisible(options.visible);
		}
		//
		if(IsDefRK(options.opacity)){
			m_obj.layer.setOpacity(options.opacity);
		}
		//
		if(IsDefRK(options.minResolution)){
			m_obj.layer.setMinResolution(options.minResolution);
		}
		//
		if(IsDefRK(options.maxResolution)){
			m_obj.layer.setMaxResolution(options.maxResolution);
		}
		m_obj.usermap.addLayer(m_obj.layer);
   };
   //run
   this.InitLayer();
};
//添加单个
rk.layerVector.prototype.addFeature = function(feature){
		var myobj = this;
		myobj.source.addFeature(feature);
};
//添加数组
rk.layerVector.prototype.addFeatures = function(features){
		var myobj = this;
		myobj.source.addFeatures(features);
};
//清空feature
rk.layerVector.prototype.clear = function(){
		var myobj = this;
		myobj.source.clear();
};
//遍历每一个feature
rk.layerVector.prototype.forEachFeature = function(callback, opt_this){
		var myobj = this;
		myobj.source.forEachFeature(callback, opt_this);
};
//得到接近特征所提供的坐标。feature
rk.layerVector.prototype.getClosestFeatureToCoordinate = function(lonlat){
		var myobj = this;
		var coordinate = [lonlat.lon, lonlat.lat];
		// coordinate = myobj.usermap.DisplayToUseTransForm(coordinate);//转换坐标
		 var featrue = myobj.source.getClosestFeatureToCoordinate(coordinate);
		 var distance = 0;
		 if(featrue != null){
			 var closestPoint = featrue.getGeometry().getFirstCoordinate();
			 closestPoint =  myobj.usermap.UseToDisplayTransForm(closestPoint);//转换坐标
			 distance = myobj.usermap.distance(closestPoint, coordinate);
		 }
		 var result = {featrue:featrue,distance:distance};
		return result;
};
//根据id获取数据
rk.layerVector.prototype.getFeatureById = function(id){
	var myobj = this;
	return myobj.source.getFeatureById(id);
};
//获取所有的features
rk.layerVector.prototype.getFeatures = function(){
	var myobj = this;
	return myobj.source.getFeatures();
};
//获取在这个经纬范围的feature
rk.layerVector.prototype.getFeaturesAtCoordinate = function(lonlat){
	var myobj = this;
	var coordinate = [lonlat.lon, lonlat.lat];
	coordinate = myobj.usermap.DisplayToUseTransForm(coordinate);//转换坐标
	return myobj.source.getFeaturesAtCoordinate(coordinate);
};
//移除
rk.layerVector.prototype.removeFeature = function(feature){
	var myobj = this;
	var tmpfeature = myobj.getFeatureById(feature.getId());
	//
	if(tmpfeature != null){
		return myobj.source.removeFeature(feature);
	}
};
//获取图层透明度
rk.layerVector.prototype.getOpacity =function(){
	var myobj = this;
	return myobj.layer.getOpacity();
};
//获取图层数据源
rk.layerVector.prototype.getSource =function(){
	var myobj = this;
	return myobj.layer.getSource();
};
//获取图层样式
rk.layerVector.prototype.getStyle =function(){
	var myobj = this;
	return myobj.layer.getStyle();
};
//获取图层是否透明
rk.layerVector.prototype.getVisible =function(){
	var myobj = this;
	return myobj.layer.getVisible();
};
//设置透明值
rk.layerVector.prototype.setOpacity =function(opacity){
	var myobj = this;
    myobj.layer.setOpacity(opacity);
};
//设置图层样式
rk.layerVector.prototype.setStyle =function(style){
	var myobj = this;
	myobj.layer.setStyle(style);
};
//设置是否显示
rk.layerVector.prototype.setVisible =function(visible){
	var myobj = this;
	myobj.layer.setVisible(visible);
};