var rk = rk==null?{}:rk;
/*
*  创建静态路径线
*/ 
rk.lineanimation = function(usermap, layer, options){
	  /**
	   * @private
	   * @type {对象自己}
	   */
	   var m_obj = this;
	   this.className = "historyline";
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
	   this.rkline = null;
	   this.rkimagehead = null;
	   this.rkimagetail = null;
	   this.headoptions = null;
	   this.tailoptions = null;
	   //
	   this.lineDataPoint = null;
	   this.speedRun =  IsDefRK(options.speed)?options.speed:4;//千米/每小时
	   this.startTime = null;
	   this.startTimeID = null;
	   this.turfLine = null;
	   this.turfDistance = 0;
	   this.turfCount    = 0;
	   this.turfTotalCount    = 0;
	   this.speedDistance = 0.02;
	   this.queueDataPoints = null;
	  //  
	  this.Initlineanimation = function(){
			m_obj.headoptions = {src:"../images/car.png", offsetY:options.headoffsetY,anchor: IsDefRK(options.headanchor)?options.headanchor:[0, 10]};
			m_obj.tailoptions = {id:options.id, src:"../images/car.png",text:options.text, offsetY:options.tailoffsetY,anchor:IsDefRK(options.tailanchor)?options.tailanchor:[0, 10]};
			if(m_obj.rkimagehead == null){
				m_obj.rkimagehead = new rk.image(m_obj.usermap, m_obj.layer, m_obj.headoptions);	
				m_obj.rkimagetail = new rk.image(m_obj.usermap, m_obj.layer, m_obj.tailoptions);
			}
			m_obj.rkline = new rk.line(usermap, layer, IsDefRK(options.options)?options.options:{color:"red"});
			m_obj.rkline.SetGeometryFn(function(){
				m_obj.UpdateFirstLastLonlat();
			});
	  };
	  //Run
	  this.Initlineanimation();
};
//运行计算线
rk.lineanimation.prototype.moveRunLine = function(objMy){
	if(objMy.turfCount >= objMy.turfTotalCount)
	{
		objMy.stopRunLine();
		return;
	}
	//
	console.log("lineanimation  moveRunLine ");
    var turfPoint = turf.along(objMy.turfLine, objMy.turfCount * objMy.speedDistance, 'kilometers');
    objMy.turfCount ++;
    //console.log(turfPoint);
    objMy.queueDataPoints.push(turfPoint.geometry.coordinates);
    objMy.UpdateFirstLastLonlat();
};
//开始运行线
rk.lineanimation.prototype.startRunLine = function(){
	var myobj = this;
	myobj.startTime = new Date();
	//
	myobj.turfLine = {
			  "type": "Feature",
			  "properties": {},
			  "geometry": {
			    "type": "LineString",
			    "coordinates": myobj.lineDataPoint
			  }
    };
	//
	myobj.turfDistance =  turf.lineDistance(myobj.turfLine, 'kilometers');
	myobj.turfCount    = 0; 
	myobj.turfTotalCount   = myobj.turfDistance / myobj.speedDistance;
	myobj.queueDataPoints  = new Array();
	//
	myobj.startTimeID = window.setInterval(function(){
		myobj.moveRunLine(myobj);
      }, 1000);
	
	myobj.moveRunLine(myobj);
};
//结束运行线
rk.lineanimation.prototype.stopRunLine = function(){
	var myobj = this;
    if(myobj.startTimeID != null){
    	clearInterval(myobj.startTimeID);
    	myobj.startTimeID= null;
    	myobj.startTime = null;
    }
};
//更新坐标
rk.lineanimation.prototype.updateLineDataPoint = function(points){
	 var myobj = this;
	 myobj.lineDataPoint = points;
};
//更新速度
rk.lineanimation.prototype.updateSpeed = function(speed){
	 var myobj = this;
	 myobj.speedRun = speed;
};
//隐藏轨迹
rk.lineanimation.prototype.hideTrajectory = function(){
	var myobj = this;
	myobj.rkline.remove();
	myobj.rkimagehead.remove();
};
//显示轨迹
rk.lineanimation.prototype.showTrajectory = function(){
	var myobj = this;
	myobj.rkline.show();
	myobj.rkimagehead.show();
};
//移除路线
rk.lineanimation.prototype.removeLine= function(){
	var myobj = this;
	myobj.rkline.remove();
	myobj.rkimagehead.remove();
	myobj.rkimagetail.remove();
};
//显示路线
rk.lineanimation.prototype.showLine= function(){
	var myobj = this;
	myobj.rkline.show();
	myobj.rkimagehead.show();
	myobj.rkimagetail.show();
};
//更新头尾节点位置
rk.lineanimation.prototype.UpdateFirstLastLonlat = function(){
	var myobj = this;
	//
	if(myobj.queueDataPoints.length >20)
	{
		myobj.queueDataPoints.shift();
	}
	//
	console.log(myobj.queueDataPoints);
	myobj.rkline.updateDataPoint(myobj.queueDataPoints);
	//
	if(myobj.queueDataPoints.length >= 2)
	{
		var iRotation = myobj.CalculationAngle(myobj.queueDataPoints[0], myobj.queueDataPoints[1]);
		myobj.rkimagetail.UpdateRotation(iRotation);
	}
	var headCoordinate = myobj.rkline.getFirstCoordinate();
	myobj.rkimagetail.UpdateCoordinate(headCoordinate);
	//
	if(myobj.queueDataPoints.length >= 2)
	{
		var iRotation = myobj.CalculationAngle(myobj.queueDataPoints[myobj.queueDataPoints.length-1], myobj.queueDataPoints[myobj.queueDataPoints.length-2]);
		console.log(iRotation);
		myobj.rkimagehead.UpdateRotation(iRotation);
	}
	var tailCoordinate = myobj.rkline.getLastCoordinate();
	myobj.rkimagehead.UpdateCoordinate(tailCoordinate);
};
//获取路线对象
rk.lineanimation.prototype.GetRkLine = function(){
	return this.rkline;
};
//获取开始图标对象
rk.lineanimation.prototype.GetFirstRkImage = function(){
	return this.rkimagehead;
};
//获取结束图标对象
rk.lineanimation.prototype.GetLastRkImage = function(){
	return this.rkimagetail;
};
//获取最近对象的距离
rk.lineanimation.prototype.GetMinDistance = function(rkstaticobj){
	var myobj = this;
	var tailCoordinate = myobj.rkline.getLastCoordinate();
	var closestPoint = rkstaticobj.GetRkLine().getClosestPoint(tailCoordinate);
	return (ol.tool.Distance(tailCoordinate[0], tailCoordinate[1],closestPoint[0], closestPoint[1]));
};

//计算角度
rk.lineanimation.prototype.CalculationAngle = function(curPoint, perPoint){
		if(curPoint == null || perPoint == null || curPoint.length <2 || perPoint.length <2){
			return ;
		}
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
		return dTempCourse;
};
