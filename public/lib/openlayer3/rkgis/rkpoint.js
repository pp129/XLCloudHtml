var rk = rk==null?{}:rk;
/*
*  创建点
*/ 
rk.point = function(usermap, layer, options){
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
	   this.layer = layer;
	   /**
	   * @private
	   * @type {点对象}
	   */
	   this.pointFeature = null;
	  /**
	   * @private
	   * @type {点样式对象}
	   */
	   this.style = null;
	   /**
	   * @private
	   * @type {点文本样式对象}
	   */
	   this.styletext = null;
	   //基础属性值
	    this.id =  IsDefRK(options.id)?options.id:("pt_"+(new Date()).getTime());
	    this.radius = IsDefRK(options.radius)?options.radius:10;
	    this.radiusfillcolor = IsDefRK(options.radiusfillcolor)?options.radiusfillcolor:'rgba(255, 0, 0, 0.1)';
		this.radiusstrokecolor = IsDefRK(options.radiusstrokecolor)?options.radiusstrokecolor:'red';
		this.radiusstrokewidth = IsDefRK(options.radiusstrokewidth)?options.radiusstrokewidth:2;
		this.pointArr =  IsDefRK(options.lonlat)?[options.lonlat.lon,options.lonlat.lat]:[0,0];
	   /**
	    * @public 
	    * 初始化函数
	    */
	   this.InitPoint = function(){
			//
			if(m_obj.pointArr.length > 0){
				m_obj.pointArr = m_obj.usermap.DisplayToUseTransForm(this.pointArr);
			}
			//
			m_obj.pointFeature =new ol.Feature({
			  geometry: new ol.geom.Point(m_obj.pointArr),
			  name: options.name,
			  type:options.type
			});
			m_obj.pointFeature.setId(m_obj.id);
			//
		    m_obj.styletext = new ol.style.Text({
				textAlign: IsDefRK(options.textAlign)?options.textAlign:"center",
				textBaseline: IsDefRK(options.textBaseline)?options.textBaseline:"bottom",
				font: IsDefRK(options.font)?options.font:"normal 12px Arial",
				text: IsDefRK(options.text)?options.text:"",
				fill: new ol.style.Fill({color: IsDefRK(options.color)?options.color:"red"}),
				stroke: new ol.style.Stroke({
						color: IsDefRK(options.strokecolor)?options.strokecolor:"#FFFFFF", 
						width: IsDefRK(options.strokewidth)?options.strokewidth:"3"
				}),
				offsetX: IsDefRK(options.offsetX)?options.offsetX:0,
				offsetY: IsDefRK(options.offsetY)?options.offsetY:-10,
				rotation: IsDefRK(options.rotation)?options.rotation:0
			  });
			  //
			  m_obj.style = new ol.style.Style({
				  image: new ol.style.Circle({
					radius:  m_obj.radius,
					fill: new ol.style.Fill({color: m_obj.radiusfillcolor}),
					stroke: new ol.style.Stroke({color:  m_obj.radiusstrokecolor, width:  m_obj.radiusstrokewidth})
				  }),
				  text:  m_obj.styletext
			  });
			  //
			  m_obj.pointFeature.setStyle(m_obj.style);
			  m_obj.layer.addFeature(m_obj.pointFeature); 
	   };
	   //Run
	   this.InitPoint();
};
//更新节点到图层
rk.point.prototype.updateToLayer = function(){
	var myobj = this;
	if(myobj.pointFeature != null){
		var tmpFeature = myobj.layer.getFeatureById( myobj.pointFeature.getId());
		if(tmpFeature == null){
			 m_obj.layer.addFeature(myobj.pointFeature); 
		}
	}
};
//更新点样式
rk.point.prototype.UpdateStyle = function(options){
		var myobj = this;
		  
	    myobj.radius = IsDefRK(options.radius)?options.radius:myobj.radius;
	    myobj.radiusfillcolor = IsDefRK(options.radiusfillcolor)?options.radiusfillcolor:myobj.radiusfillcolor;
		myobj.radiusstrokecolor = IsDefRK(options.radiusstrokecolor)?options.radiusstrokecolor:myobj.radiusstrokecolor;
		myobj.radiusstrokewidth = IsDefRK(options.radiusstrokewidth)?options.radiusstrokewidth:	myobj.radiusstrokewidth;
		 //
		 myobj.style = new ol.style.Style({
				  image: new ol.style.Circle({
					radius:  myobj.radius,
					fill: new ol.style.Fill({color: myobj.radiusfillcolor}),
					stroke: new ol.style.Stroke({color:  myobj.radiusstrokecolor, width:  myobj.radiusstrokewidth})
				  }),
				  text:  myobj.styletext
		});
		//
	   myobj.pointFeature.setStyle(myobj.style);
};
//更新文本样式
rk.point.prototype.UpdateTextStyle = function(options){
		var myobj = this;
		  
	    myobj.styletext = new ol.style.Text({
				textAlign: IsDefRK(options.textAlign)?options.textAlign:"center",
				textBaseline: IsDefRK(options.textBaseline)?options.textBaseline:"bottom",
				font: IsDefRK(options.font)?options.font:"normal 12px Arial",
				text: IsDefRK(options.text)?options.text:"",
				fill: new ol.style.Fill({color: IsDefRK(options.color)?options.color:"red"}),
				stroke: new ol.style.Stroke({
						color: IsDefRK(options.strokecolor)?options.strokecolor:"#FFFFFF", 
						width: IsDefRK(options.strokewidth)?options.strokewidth:"3"
				}),
				offsetX: IsDefRK(options.offsetX)?options.offsetX:0,
				offsetY: IsDefRK(options.offsetY)?options.offsetY:-10,
				rotation: IsDefRK(options.rotation)?options.rotation:0
		});
		 //
		 myobj.style = new ol.style.Style({
				  image: new ol.style.Circle({
					radius:  myobj.radius,
					fill: new ol.style.Fill({color: myobj.radiusfillcolor}),
					stroke: new ol.style.Stroke({color:  myobj.radiusstrokecolor, width:  myobj.radiusstrokewidth})
				  }),
				  text:  myobj.styletext
		});
		//
	   myobj.pointFeature.setStyle(myobj.style);
};
//更新位置
rk.point.prototype.UpdateLonLat = function (lonlat){
	var myobj = this;
	myobj.pointArr =  IsDefRK(lonlat)?[lonlat.lon,lonlat.lat]:[];
	//
	if(myobj.pointArr.length > 0){
		myobj.pointArr = myobj.usermap.DisplayToUseTransForm(myobj.pointArr);
		var geometry =  new ol.geom.Point(myobj.pointArr);
		myobj.pointFeature.setGeometry(geometry);
	}
};
//更新位置
rk.point.prototype.UpdateCoordinate = function (coordinate){
	var myobj = this;
	myobj.pointArr =  IsDefRK(coordinate)?coordinate:[];
	//
	if(myobj.pointArr.length > 0){
		var geometry =  new ol.geom.Point(myobj.pointArr);
		myobj.pointFeature.setGeometry(geometry);
	}
};
//启用编辑坐标
rk.point.prototype.EnableEditPoint = function(){
	var myobj = this;
	myobj.usermap.EableEditFeature(myobj.pointFeature);
	
};
//获取节点坐标
rk.point.prototype.GetLonLat = function(){
	var myobj = this;
	var point = myobj.pointFeature.getGeometry().getFirstCoordinate();
	    point = myobj.usermap.UseToDisplayTransForm(point);
	return {lon:point[0],lat:point[1]};
};
//关闭编辑坐标
rk.point.prototype.DisableEditPoint = function(){
	var myobj = this;
	myobj.usermap.DisableEditFeature();
};
//移除feature
rk.point.prototype.remove = function(){
	var myobj = this;
	myobj.layer.removeFeature( myobj.pointFeature);
};
//显示feature
rk.point.prototype.show = function(){
	var myobj = this;
	myobj.layer.addFeature( myobj.pointFeature);
};