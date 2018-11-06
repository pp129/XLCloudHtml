var rk = rk==null?{}:rk;
/*
*  创建图标
*/ 
rk.image = function(usermap, layer, options){
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
	   this.imageFeature = null;
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
	    this.id =  IsDefRK(options.id)?options.id:("img_"+(new Date()).getTime());
	    this.imgrotation = IsDefRK(options.imgrotation)?options.imgrotation:0;
	    this.imgopacity = IsDefRK(options.imgopacity)?options.imgopacity:1;
		this.anchor = IsDefRK(options.anchor)?options.anchor:[0.5, 46];
		this.src =  IsDefRK(options.src)?options.src:'./icon.png';
		
		this.options = options;
		
		this.pointArr =  IsDefRK(options.lonlat)?[options.lonlat.lon,options.lonlat.lat]:[0,0];
	   /**
	    * @public 
	    * 初始化函数
	    */
	   this.InitImage = function(){
			//
			if(m_obj.pointArr.length > 0){
				m_obj.pointArr = m_obj.usermap.DisplayToUseTransForm(this.pointArr);
			}
			//
			m_obj.imageFeature =new ol.Feature({
			  geometry: new ol.geom.Point(m_obj.pointArr),
			  name: options.name,
			  type:options.type
			});
			//m_obj.imageFeature.on('click', function(e){ alert("admin");}, m_obj);
			m_obj.imageFeature.setId(m_obj.id);
			//
		    m_obj.styletext = new ol.style.Text({
				textAlign: IsDefRK(options.textAlign)?options.textAlign:"center",
				textBaseline: IsDefRK(options.textBaseline)?options.textBaseline:"bottom",
				font: IsDefRK(options.font)?options.font:"normal 12px Arial",
				text: IsDefRK(options.text)?options.text:"",
				fill: new ol.style.Fill({color: IsDefRK(options.color)?options.color:"red"}),
				stroke: new ol.style.Stroke({
						color: IsDefRK(options.strokecolor)?options.strokecolor:"#cccccc", 
						width: IsDefRK(options.strokewidth)?options.strokewidth:"3"
				}),
				offsetX: IsDefRK(options.offsetX)?options.offsetX:0,
				offsetY: IsDefRK(options.offsetY)?options.offsetY:-5,
				rotation: IsDefRK(options.rotation)?options.rotation:0
			  });
			  //	  
			 m_obj.style = new ol.style.Style({
			   image: new ol.style.Icon(({
				anchor: m_obj.anchor,
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				opacity: m_obj.imgopacity,
				rotation: m_obj.imgrotation,
				src:IsDefRK(options.src)?options.src:'./icon.png'
			  })),
			  text:m_obj.styletext
			});
			//
			m_obj.imageFeature.setStyle(m_obj.style);
			m_obj.layer.addFeature(m_obj.imageFeature);
	   };
	   //Run
	   this.InitImage();
};
//更新点样式
rk.image.prototype.UpdateStyle = function(options){
		var myobj = this;
		  
	    myobj.imgrotation = IsDefRK(options.imgrotation)?options.imgrotation:myobj.imgrotation;
	    myobj.imgopacity = IsDefRK(options.imgopacity)?options.imgopacity:myobj.imgopacity ;
	    myobj.anchor = IsDefRK(options.anchor)?options.anchor: myobj.anchor ;
	    myobj.src =  IsDefRK(options.src)?options.src:'./icon.png';
		 //
		 myobj.style = new ol.style.Style({
				image: new ol.style.Icon(({
					anchor: myobj.anchor,
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					opacity: myobj.imgopacity,
					rotation: myobj.imgrotation,
					src: IsDefRK(options.src)?options.src:'./icon.png'
			    })),
				  text:  myobj.styletext
		});
		//
	   myobj.imageFeature.setStyle(myobj.style);
};
//更新文本样式
rk.image.prototype.UpdateTextStyle = function(options){
		var myobj = this;
		  
	    myobj.styletext = new ol.style.Text({
				textAlign: IsDefRK(options.textAlign)?options.textAlign:"center",
				textBaseline: IsDefRK(options.textBaseline)?options.textBaseline:"bottom",
				font: IsDefRK(options.font)?options.font:"normal 12px Arial",
				text: IsDefRK(options.text)?options.text:"",
				fill: new ol.style.Fill({color: IsDefRK(options.color)?options.color:"red"}),
				stroke: new ol.style.Stroke({
						color: IsDefRK(options.strokecolor)?options.strokecolor:"#cccccc", 
						width: IsDefRK(options.strokewidth)?options.strokewidth:"3"
				}),
				offsetX: IsDefRK(options.offsetX)?options.offsetX:0,
				offsetY: IsDefRK(options.offsetY)?options.offsetY:-45,
				rotation: IsDefRK(options.rotation)?options.rotation:0
		});
		 //
		 myobj.style = new ol.style.Style({
				image: new ol.style.Icon(({
					anchor: myobj.anchor,
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					opacity: myobj.imgopacity,
					rotation: myobj.imgrotation,
					src: IsDefRK(options.src)?options.src:'./icon.png'
			    })),
				  text:  myobj.styletext
		});
		//
	   myobj.imageFeature.setStyle(myobj.style);
};
//更新位置
rk.image.prototype.UpdateLonLat = function (lonlat){
	var myobj = this;
	myobj.pointArr =  IsDefRK(lonlat)?[lonlat.lon,lonlat.lat]:[];
	//
	if(myobj.pointArr.length > 0){
		myobj.pointArr = myobj.usermap.DisplayToUseTransForm(myobj.pointArr);
		var geometry =  new ol.geom.Point(myobj.pointArr);
		myobj.imageFeature.setGeometry(geometry);
	}
};
//更新位置
rk.image.prototype.UpdateCoordinate = function (coordinate){
	var myobj = this;
	myobj.pointArr =  IsDefRK(coordinate)?coordinate:[];
	//
	if(myobj.pointArr.length > 0){
		var geometry =  new ol.geom.Point(myobj.pointArr);
		myobj.imageFeature.setGeometry(geometry);
	}
};
//更新位置
rk.image.prototype.UpdateText = function (text){
	var myobj = this;
	myobj.imageFeature.getStyle().getText().setText(text);
};
//获取节点坐标
rk.image.prototype.GetLonLat = function(){
	var myobj = this;
	var point  =  myobj.imageFeature.getGeometry().getFirstCoordinate();
	    point= myobj.usermap.UseToDisplayTransForm(point);
	return {lon:point[0],lat:point[1]};
};
//旋转
rk.image.prototype.UpdateRotation = function(imgrotation){
		var myobj = this;
		if(IsDefRK(imgrotation)){
			var iconFeature =myobj.layer.getFeatureById(myobj.id);
			var iconStyle = iconFeature.getStyle().getImage();
			iconStyle.setRotation(imgrotation);
		}
};
//启用编辑图标位置
rk.image.prototype.EnableEditImage = function(){
	var myobj = this;
	myobj.usermap.EableEditFeature(myobj.imageFeature);
	
};
//关闭编辑图标位置
rk.image.prototype.DisableEditImage = function(){
	var myobj = this;
	myobj.usermap.DisableEditFeature();
};
//移除feature
rk.image.prototype.remove = function(){
	var myobj = this;
	if( myobj.imageFeature != null){
		myobj.layer.removeFeature(myobj.imageFeature);
	}
};
//显示feature
rk.image.prototype.show = function(){
	var myobj = this;
	myobj.layer.addFeature(myobj.imageFeature);
};