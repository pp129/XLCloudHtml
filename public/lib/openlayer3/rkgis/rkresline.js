var rk = rk==null?{}:rk;
/*
*  创建静态路径线
*/ 
rk.resline = function(usermap, layer, options){
	  /**
	   * @private
	   * @type {对象自己}
	   */
	   var m_obj = this;
	   this.className = "resline";
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
	   this.lineLayer = options.lineLayer;
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
	  this.InitResLine = function(){
			m_obj.headoptions = {src:options.headsrc, offsetY:options.headoffsetY,anchor:options.headanchor};
			
			m_obj.tailoptions = {id:options.id, src:options.tailsrc,text:options.text, offsetY:options.tailoffsetY,anchor:options.tailanchor};
			if(m_obj.rkimagehead == null){
				m_obj.rkimagehead = new rk.image(m_obj.usermap, options.lineLayer, m_obj.headoptions);			
				m_obj.rkimagetail = new rk.image(m_obj.usermap, m_obj.layer, m_obj.tailoptions);
			}
			m_obj.rkline = new rk.line(usermap, options.lineLayer, IsDefRK(options.options)?options.options:{});
			m_obj.rkline.SetGeometryFn(function(){
				m_obj.UpdateFirstLastLonlat();
			});
	  };
	  //Run
	  this.InitResLine();
};
//隐藏轨迹
rk.resline.prototype.hideTrajectory = function(){
	var myobj = this;
	myobj.rkline.remove();
	myobj.rkimagehead.remove();
};
//显示轨迹
rk.resline.prototype.showTrajectory = function(){
	var myobj = this;
	myobj.rkline.show();
	myobj.rkimagehead.show();
};
//移除路线
rk.resline.prototype.removeLine= function(){
	var myobj = this;
	myobj.rkline.remove();
	myobj.rkimagehead.remove();
	myobj.rkimagetail.remove();
};
//显示路线
rk.resline.prototype.showLine= function(){
	var myobj = this;
	myobj.rkline.show();
	myobj.rkimagehead.show();
	myobj.rkimagetail.show();
};
//添加路线坐标
rk.resline.prototype.AddLinePoint = function(lonlat){
	var myobj = this;
	myobj.rkline.AddLinePoint(lonlat);
	myobj.UpdateFirstLastLonlat();
};
//添加数组
rk.resline.prototype.AddLinePoints = function(pointarrs){
	var myobj = this;
	myobj.rkline.AddLinePoints(pointarrs);
	myobj.UpdateFirstLastLonlat();
};
//更新头尾节点位置
rk.resline.prototype.UpdateFirstLastLonlat = function(){
	var myobj = this;
	var headCoordinate = myobj.rkline.getFirstCoordinate();
	myobj.rkimagehead.UpdateCoordinate(headCoordinate);
	var tailCoordinate = myobj.rkline.getLastCoordinate();
	myobj.rkimagetail.UpdateCoordinate(tailCoordinate);
};
//获取路线对象
rk.resline.prototype.GetRkLine = function(){
	return this.rkline;
};
//获取开始图标对象
rk.resline.prototype.GetFirstRkImage = function(){
	return this.rkimagehead;
};
//获取结束图标对象
rk.resline.prototype.GetLastRkImage = function(){
	return this.rkimagetail;
};
//获取最近对象的距离
rk.resline.prototype.GetMinDistance = function(rkstaticobj){
	var myobj = this;
	var tailCoordinate = myobj.rkline.getLastCoordinate();
	var closestPoint = rkstaticobj.GetRkLine().getClosestPoint(tailCoordinate);
	return (ol.tool.Distance(tailCoordinate[0], tailCoordinate[1],closestPoint[0], closestPoint[1]));
};
