var rk = rk==null?{}:rk;
/*
*  创建静态路径线
*/ 
rk.staticline = function(usermap, layer, options){
	  /**
	   * @private
	   * @type {对象自己}
	   */
	   var m_obj = this;
	   this.className = "staticline";
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
	   this.rkpointhead = null;
	   this.rkpointtail = null;
	   this.headoptions = null;
	   this.tailoptions = null;
	   this.updateStatus = false;
	  //  
	  this.InitStaticLine = function(){
			m_obj.headoptions = {
					id:("pt_head_"+(new Date()).getTime()),
					radius:IsDefRK(options.radius)?options.radius:5,
					radiusstrokecolor:IsDefRK(options.color)?options.color:"green",
					radiusfillcolor:"rgba(0, 255, 0, 0.5)"
			};
			
			m_obj.tailoptions = {
					id:("pt_tail_"+(new Date()).getTime()),
					radius:IsDefRK(options.radius)?options.radius:5,
					radiusstrokecolor:IsDefRK(options.color)?options.color:"green",
					radiusfillcolor:"rgba(255, 0, 0, 0.5)"
			};
			
			m_obj.rkline = new rk.line(usermap, layer, options);
			m_obj.rkline.SetGeometryFn(function(){
				m_obj.UpdateFirstLastLonlat();
				m_obj.updateStatus = true;
			});
	  };
	  //Run
	  this.InitStaticLine();
};
//移除路线
rk.staticline.prototype.GetUpdateStatus = function(){
	var value =this.updateStatus ;
	this.updateStatus = false;
	return value;
};
//移除路线
rk.staticline.prototype.removeLine= function(){
	var myobj = this;
	myobj.rkline.remove();
	myobj.rkpointhead.remove();
	myobj.rkpointtail.remove();
};
//显示路线
rk.staticline.prototype.showLine= function(){
	var myobj = this;
	myobj.rkline.show();
	myobj.rkpointhead.show();
	myobj.rkpointtail.show();
};
//添加路线坐标
rk.staticline.prototype.AddLinePoint = function(lonlat){
	var myobj = this;
	myobj.rkline.AddLinePoint(lonlat);
	myobj.UpdateFirstLastLonlat();
};
//添加数组
rk.staticline.prototype.setDataPoint = function(pointarrs){
	var myobj = this;
	myobj.rkline.setDataPoint(pointarrs);
	myobj.UpdateFirstLastLonlat();
	myobj.updateStatus = false;
};
//添加数组
rk.staticline.prototype.AddLinePoints = function(pointarrs){
	var myobj = this;
	myobj.rkline.AddLinePoints(pointarrs);
	myobj.UpdateFirstLastLonlat();
	myobj.updateStatus = false;
};

//更新头尾节点位置
rk.staticline.prototype.UpdateFirstLastLonlat = function(){
	var myobj = this;
	//
	if(myobj.rkpointhead == null){
		myobj.rkpointhead = new rk.point(myobj.usermap, myobj.layer, myobj.headoptions);
	}
	//
	if(myobj.rkpointtail == null){
		myobj.rkpointtail = new rk.point(myobj.usermap, myobj.layer, myobj.tailoptions);
	}
	var headCoordinate = myobj.rkline.getFirstCoordinate();
	myobj.rkpointhead.UpdateCoordinate(headCoordinate);
	var tailCoordinate = myobj.rkline.getLastCoordinate();
	myobj.rkpointtail.UpdateCoordinate(tailCoordinate);
};
//获取路线对象
rk.staticline.prototype.GetRkLine = function(){
	return this.rkline;
};
//获取路线对象
rk.staticline.prototype.GetFirstRkPoint = function(){
	return this.rkpointhead;
};
//获取路线对象
rk.staticline.prototype.GetLastRkPoint = function(){
	return this.rkpointtail;
};
//获取最近对象的距离
rk.staticline.prototype.GetMinDistance = function(coordinate){
	var myobj = this;
	var closestPoint =myobj.rkline.getClosestPoint(coordinate);
	return (ol.tool.Distance(coordinate[0], coordinate[1],closestPoint[0], closestPoint[1]));
};
//获取路线长度
rk.staticline.prototype.getDistance =function(){
	var myobj = this;
	return myobj.rkline.getDistance();
};
//
rk.staticline.prototype.along = function(runDis){
	var myobj = this;
	return myobj.rkline.along(runDis);
};
//启用编辑线位置
rk.staticline.prototype.EnableEditLine = function(){
	var myobj = this;
	myobj.rkline.EnableEditLine();
};
//关闭编辑线位置
rk.staticline.prototype.DisableEditLine = function(){
	var myobj = this;
	myobj.rkline.DisableEditLine();
};
//更新线的样式
rk.staticline.prototype.UpdateLineStyle = function(options){
	var myobj = this;
	if(IsDefRK(options.color)){
		myobj.headoptions.radiusstrokecolor=options.color;
		myobj.tailoptions.radiusstrokecolor=options.color;
	}
	myobj.rkline.UpdateStyle(options);
	myobj.rkpointhead.UpdateStyle(myobj.headoptions);
	myobj.rkpointtail.UpdateStyle(myobj.tailoptions);
};
