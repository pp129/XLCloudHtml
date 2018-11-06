var rk = rk==null?{}:rk;
/*
*  创建线
*/ 
rk.line = function(usermap, layer, options){
	  /**
	   * @private
	   * @type {对象自己}
	   */
	   var m_obj = this;
	   this.className = "line";
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
	   * @type {线对象}
	   */
	   this.lineFeature = null;
	  /**
	   * @private
	   * @type {线样式对象}
	   */
	   this.style = null;
	   /**
	   * @private
	   * @type {线文本样式对象}
	   */
	   this.styletext = null;
	   //基础属性值
	   /**
	   * @private
	   * @type {线对象id}
	   */
	    this.id =  IsDefRK(options.id)?options.id:("line_"+(new Date()).getTime());
		 /**
	   * @private
	   * @type {当前角度值}
	   */
	   this.curangle = 0;
		 /**
	   * @private
	   * @type {线的颜色}
	   */
	    this.color = IsDefRK(options.color)?options.color: 'green';
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
		/*
		*
		*/
		this.GeometryCallBackFn = IsDefRK(options.GeometryCallBackFn)?options.GeometryCallBackFn:null;
	   /**
	    * @public 
	    * 初始化函数
	    */
	   this.InitLine= function(){
			//
			 m_obj.lineFeature =new ol.Feature({
			   geometry:m_obj.setDataPoint(IsDefRK(options.lonlatArrs)?options.lonlatArrs:[]),
			   name: options.name,
			   type:options.type
			 });
			 m_obj.lineFeature.setId(m_obj.id);
			 m_obj.lineFeature.getGeometry().on("change",m_obj.ChangeGeometryFn, m_obj);
			 //	  
			 m_obj.style = new ol.style.Style({			 
  			        stroke: new ol.style.Stroke({
					color: m_obj.color,
					lineDash: m_obj.lineDash,
					width:  m_obj.width
				  })
			});
			//
			m_obj.lineFeature.setStyle(m_obj.style);
			m_obj.layer.addFeature(m_obj.lineFeature); 
	   };
	   //Run
	   this.InitLine();
};
//有更新节点事件
rk.line.prototype.ChangeGeometryFn= function(event){
	var myobj = this;
    if(myobj.GeometryCallBackFn != null){
        myobj.GeometryCallBackFn(event);
    }
};
//设置回调函数
rk.line.prototype.SetGeometryFn= function(fn){
	var myobj = this;
    myobj.GeometryCallBackFn = fn;
};
//更新点样式
rk.line.prototype.UpdateStyle = function(options){
		var myobj = this;
		  
	    myobj.color = IsDefRK(options.color)?options.color: 'green';
	    myobj.lineDash = IsDefRK(options.lineDash)?options.lineDash:[];
		myobj.width = IsDefRK(options.width)?options.width:4;
		 //
		 myobj.style = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: myobj.color,
					lineDash: myobj.lineDash,
					width:  myobj.width
				  })
		});
		//
	   myobj.lineFeature.setStyle(myobj.style);
};
//更新文本样式
rk.line.prototype.UpdateTextStyle = function(options){
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
				offsetY: IsDefRK(options.offsetY)?options.offsetY:-45,
				rotation: IsDefRK(options.rotation)?options.rotation:0
		});
		 //
		 myobj.style = new ol.style.Style({
				  stroke: new ol.style.Stroke({
					color: myobj.color,
					lineDash: myobj.lineDash,
					width:  myobj.width
				  }),
				  text:  myobj.styletext
		});
		//
	   myobj.lineFeature.setStyle(myobj.style);
};
//添加节点位置
rk.line.prototype.AddLinePoint = function (lonlat){
	var myobj = this;
	if( IsDefRK(lonlat)){
		myobj.pointArr = myobj.usermap.DisplayToUseTransForm([lonlat.lon,lonlat.lat]);
		var linestr = myobj.lineFeature.getGeometry();
		myobj.CalculationAngle(myobj.pointArr, linestr.getLastCoordinate());
		linestr.appendCoordinate(myobj.pointArr);
	}
};
//获取路线长度
rk.line.prototype.getDistance = function(){
	 var myobj = this;
	 var turfLine = {
			  "type": "Feature",
			  "properties": {},
			  "geometry": {
			    "type": "LineString",
			    "coordinates":myobj.getDataPoint()
			  }
			};
	 return turf.lineDistance(turfLine, 'kilometers').toFixed(3);
};
//
rk.line.prototype.along = function(runDis){
	var myobj = this;
	 var turfLine = {
			  "type": "Feature",
			  "properties": {},
			  "geometry": {
			    "type": "LineString",
			    "coordinates":myobj.getDataPoint()
			  }
			};
	 var length = turf.lineDistance(turfLine, 'kilometers').toFixed(3);
	 var point = null;
	 if(length == runDis){
		 point= myobj.usermap.UseToDisplayTransForm(myobj.getLastCoordinate());
	 }else{
		 point=turf.along(turfLine,runDis, 'kilometers').geometry.coordinates;
	 }
	 return {lon:point[0],lat:point[1]};
};
//获取路线最后一次旋转角度
rk.line.prototype.GetRotationAngle = function(){
	return this.curangle;
};
//计算角度
rk.line.prototype.CalculationAngle = function(curPoint, perPoint){
		if(curPoint == null || perPoint == null || curPoint.length <2 || perPoint.length <2){
			return ;
		}
		var myobj = this;
		var  dLonDiff = curPoint[0] - perPoint[0];
		var  dLatDiff = curPoint[1] - perPoint[1];
		var dTempCourse = 0;
		//
		if(dLonDiff == 0){
			dTempCourse = 0;
			if(dLatDiff > 0){
				dTempCourse = 90;
			}
			if(dLatDiff < 0){
				dTempCourse = 270;
			}
		}
		//
		if(dLatDiff == 0){
			dTempCourse = 0;
			if(dLonDiff > 0){
				dTempCourse = 180;
			}
		}
		if((dLatDiff != 0) && (dLonDiff != 0)){
			dTempCourse =Math.abs((Math.atan(dLatDiff/dLonDiff)/Math.PI)*180);
			if((dLatDiff >0) && (dLonDiff > 0)){
				dTempCourse = 180 - dTempCourse;
			}
			if((dLatDiff <0) && (dLonDiff > 0)){
				dTempCourse = 180 + dTempCourse;
			}
			if((dLatDiff < 0) && (dLonDiff < 0)){
				dTempCourse =360 - dTempCourse;
			}
		}
		myobj.curangle = dTempCourse;
		return myobj.curangle;
};
//设置点数组
rk.line.prototype.AddLinePoints = function(pointarrs){
	var myobj = this;
	var usegeometry = null;
	if(pointarrs != null){
		usegeometry = new ol.geom.LineString(pointarrs);
		usegeometry.transform(myobj.usermap.displayprojection, myobj.usermap.projection);
		var listpoints = usegeometry.getCoordinates();
		var linestr = myobj.lineFeature.getGeometry();
		//
		for(var key in listpoints){
			linestr.appendCoordinate(listpoints[key]);
		}
	}
};
//旋转
rk.line.prototype.UpdateRotation = function(imgrotation){
		var myobj = this;
		if(IsDefRK(imgrotation)){
			myobj.style.f.i=imgrotation;
			myobj.imageFeature.setStyle(myobj.style);
		}
};
//设置点数组
rk.line.prototype.setDataPoint = function(pointarrs){
	var myobj = this;
	var usegeometry = null;
	if(pointarrs != null){
		usegeometry = new ol.geom.LineString(pointarrs);
		usegeometry.transform(myobj.usermap.displayprojection, myobj.usermap.projection);
		
	}else{
		usegeometry =  new ol.geom.LineString([]);
	}
	return usegeometry;
};

//设置点数组
rk.line.prototype.updateDataPoint = function(pointarrs){
	var myobj = this;
	var usegeometry = null;
	if(pointarrs != null){
		usegeometry = new ol.geom.LineString(pointarrs);
		usegeometry.transform(myobj.usermap.displayprojection, myobj.usermap.projection);
		
	}else{
		usegeometry =  new ol.geom.LineString([]);
	}
	myobj.lineFeature.setGeometry(usegeometry);
};
//获取节点数据
rk.line.prototype.getDataPoint = function (){
		var myobj = this;
		var usegeometry = myobj.lineFeature.getGeometry().clone();
		usegeometry.transform(myobj.usermap.projection, myobj.usermap.displayprojection);
		return usegeometry.getCoordinates();
};
//获取原始数据数组
rk.line.prototype.getCoordinates = function (){
		var myobj = this;
		return  myobj.lineFeature.getGeometry().getCoordinates();
};
//获取原始数据数组长度
rk.line.prototype.getLength = function (){
		var myobj = this;
		return  myobj.lineFeature.getGeometry().getCoordinates().length;
};
//获取最后一个节点原始数据
rk.line.prototype.getLastCoordinate = function (){
		var myobj = this;
		return  myobj.lineFeature.getGeometry().getLastCoordinate();
};
//获取第一个节点原始数据
rk.line.prototype.getFirstCoordinate = function (){
		var myobj = this;
		return  myobj.lineFeature.getGeometry().getFirstCoordinate();
};
//启用编辑线位置
rk.line.prototype.EnableEditLine = function(){
	var myobj = this;
	myobj.usermap.EableEditFeature(myobj.lineFeature);
};
//关闭编辑线位置
rk.line.prototype.DisableEditLine = function(){
	var myobj = this;
	myobj.usermap.DisableEditFeature(myobj.lineFeature);
};
//移除feature
rk.line.prototype.remove = function(){
	var myobj = this;
	myobj.layer.removeFeature( myobj.lineFeature);
};
//显示feature
rk.line.prototype.show = function(){
	var myobj = this;
	myobj.layer.addFeature( myobj.lineFeature);
};
//获取最近点
rk.line.prototype.getClosestPoint = function(coordinate){
	var myobj = this;
	var geometry = myobj.lineFeature.getGeometry();
	var closestPoint = geometry.getClosestPoint(coordinate);
	return closestPoint;
};
