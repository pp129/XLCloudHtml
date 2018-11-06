var rk = rk==null?{}:rk;
/*
*  创建静态路径线
*/ 
rk.historyline = function(usermap, layer, options){
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
	   this.rkpointlist = null;
	   this.pointoptions = null;

	  //  
	  this.Inithistoryline = function(){
			m_obj.pointoptions = {	
					radius:5,
					radiusstrokecolor:"green",
					radiusfillcolor:"rgba(0, 255, 0, 1)"};
			m_obj.rkpointlist = new Array();
			m_obj.rkline = new rk.line(usermap, layer, options);
			m_obj.rkline.SetGeometryFn(function(){
				m_obj.UpdateFirstLastLonlat();
			});
	  };
	  //Run
	  this.Inithistoryline();
};
//移除路线
rk.historyline.prototype.removeLine= function(){
	var myobj = this;
	myobj.rkline.remove();
	for(var key in myobj.rkpointlist){
		myobj.rkpointlist[key].remove();
	}
};
//显示路线
rk.historyline.prototype.showLine= function(){
	var myobj = this;
	myobj.rkline.show();
	for(var key in myobj.rkpointlist){
		myobj.rkpointlist[key].show();
	}
};
//添加路线坐标
rk.historyline.prototype.AddLinePoint = function(point){
	var myobj = this;
	myobj.rkline.AddLinePoint(point.lonlat);
	myobj.pointoptions.lonlat =point.lonlat;
	myobj.pointoptions.text = point.text;
	var point =  new rk.point(myobj.usermap, myobj.layer, myobj.pointoptions);
	myobj.rkpointlist.push(point);
	myobj.UpdateFirstLastLonlat();
};
//更新头尾节点位置
rk.historyline.prototype.UpdateFirstLastLonlat = function(){
	var myobj = this;
};
//获取路线对象
rk.historyline.prototype.GetRkLine = function(){
	return this.rkline;
};
//获取路线对象
rk.historyline.prototype.GetRKPointList = function(){
	return this.rkpointlist;
};
