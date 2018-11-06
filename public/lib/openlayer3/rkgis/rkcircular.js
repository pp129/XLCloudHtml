var rk = rk==null?{}:rk;
/*
*  创建面
*/ 
rk.circular = function(usermap, layer, options){
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
	   * @type {面对象}
	   */
	   this.circularFeature = null;
	  /**
	   * @private
	   * @type {面样式对象}
	   */
	   this.style = null;
	   /**
	   * @private
	   * @type {面文本样式对象}
	   */
	   this.styletext = null;
	   //基础属性值
	   /**
	   * @private
	   * @type {面对象id}
	   */
	    this.id =  IsDefRK(options.id)?options.id:("circular_"+(new Date()).getTime());
		 /**
	   * @private
	   * @type {面的颜色}
	   */
	    this.color = IsDefRK(options.color)?options.color: 'green';
		this.fillcolor = IsDefRK(options.fillcolor)?options.fillcolor: 'rgba(0, 0, 255, 0.1)';
	    /**
	   * @private
	   * @type {数字数组长度大于0为虚线}
	   */
	    this.lineDash = IsDefRK(options.lineDash)?options.lineDash:[]; 
	    /**
	   * @private
	   * @type {线的宽度}
	   */
		this.width = IsDefRK(options.width)?options.width:4;
		
		this.lonlat =  IsDefRK(options.lonlat)?[options.lonlat.lon, options.lonlat.lat]:[0 , 0];
		this.wgs84Sphere= new ol.Sphere(6378137);
		this.radius = IsDefRK(options.radius)?options.radius:100;
		this.splitnum =  IsDefRK(options.splitnum)?options.splitnum:64;
	   /**
	    * @public 
	    * 初始化函数
	    */
	   this.InitCircular= function(){
			 var polygon = ol.geom.Polygon.circular(m_obj.wgs84Sphere,  m_obj.lonlat, m_obj.radius, m_obj.splitnum);
			 polygon.transform( m_obj.usermap.displayprojection, m_obj.usermap.projection);
			 //
			 m_obj.circularFeature =new ol.Feature({
			   geometry: polygon,
			   name: options.name,
			   type:options.type
			 });
			 m_obj.circularFeature.setId(m_obj.id);
			 //	  
			 m_obj.style = new ol.style.Style({			 
  			        stroke: new ol.style.Stroke({
					color: m_obj.color,
					lineDash: m_obj.lineDash,
					width:  m_obj.width
				  }),
				 fill: new ol.style.Fill({
				  color: m_obj.fillcolor
				})
			});
			//
			m_obj.circularFeature.setStyle(m_obj.style);
			m_obj.layer.addFeature(m_obj.circularFeature); 
	   };
	   //Run
	   this.InitCircular();
};
//更新点样式
rk.circular.prototype.UpdateStyle = function(options){
		var myobj = this;
		  
	    myobj.color = IsDefRK(options.color)?options.color: myobj.color;
	    myobj.lineDash = IsDefRK(options.lineDash)?options.lineDash:myobj.lineDash;
		myobj.width = IsDefRK(options.width)?options.width:myobj.width ;
		myobj.fillcolor = IsDefRK(options.fillcolor)?options.fillcolor: myobj.fillcolor;
		 //
		 myobj.style = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: m_obj.color,
					lineDash: m_obj.lineDash,
					width:  m_obj.width
				  }),
				 fill: new ol.style.Fill({
				  color: m_obj.fillcolor
				})
		});
		//
	   myobj.circularFeature.setStyle(myobj.style);
};
//更新文本样式
rk.circular.prototype.UpdateTextStyle = function(options){
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
				offsetY: IsDefRK(options.offsetY)?options.offsetY:0,
				rotation: IsDefRK(options.rotation)?options.rotation:0
		});
		 //
		 myobj.style = new ol.style.Style({
				  stroke: new ol.style.Stroke({
					color: myobj.color,
					lineDash: myobj.lineDash,
					width:  myobj.width
				  }),
				  fill: new ol.style.Fill({
				  color: m_obj.fillcolor
				 }),
				  text:  myobj.styletext
		});
		//
	   myobj.circularFeature.setStyle(myobj.style);
};
//更新编辑
rk.circular.prototype.UpdateCircular = function(lonlat, radius, splitnum){
		var myobj = this;
		myobj.lonlat =  IsDefRK(lonlat)?[lonlat.lon, lonlat.lat]:myobj.lonlat;
		myobj.radius = IsDefRK(radius)?radius:myobj.radius;
		myobj.splitnum =  IsDefRK(splitnum)?splitnum:myobj.splitnum;
		var polygon = ol.geom.Polygon.circular(m_obj.wgs84Sphere,  m_obj.lonlat, m_obj.radius, m_obj.splitnum);
		polygon.transform( m_obj.usermap.displayprojection, m_obj.usermap.projection);
		myobj.circularFeature.setGeometry(polygon);
};
//移除feature
rk.circular.prototype.remove = function(){
	var myobj = this;
	myobj.layer.removeFeature( myobj.circularFeature);
}
//显示feature
rk.circular.prototype.show = function(){
	var myobj = this;
	myobj.layer.addFeature( myobj.circularFeature);
}