var tscriptName = "rkgisapi.js";
var gWebGISVersion = "1.0.0.1@20150228";
/**
  *
  * VERSION OF WEB GIS ENGINE
  *
  */
function GetGisEngineVersion()
{
	return gWebGISVersion;
}

/**
	 * Method: _getScriptLocation
	 * Return the path to this script. This is also implemented in
	 * OpenLayers/SingleFile.js
	 *
	 * Returns:
	 * {String} Path to this script
	 */
function GetCurHost()
{
	var r = new RegExp("(^|(.*?\\/))(" + tscriptName + ")(\\?|$)"),
		s = document.getElementsByTagName('script'),
		src, m, l = "";
	for(var i=0, len=s.length; i<len; i++) {
		src = s[i].getAttribute('src');
		if(src) {
			m = src.match(r);
			if(m) {
				l = m[1];
				break;
			}
		}
	}
	return l;
}
//添加地图相关js
function EnableRkGIS()
{
	var rkgisFiles = 
		[
				"openlayer3/build/ol.js",
				"openlayer3/turf.min.js",
				"rkgis/rkdefault.js",
				"rkgis/rkwebgis.js",
				"rkgis/rklayerVector.js",
				"rkgis/rkpoint.js",
				"rkgis/rkimage.js",
				"rkgis/rkline.js",
				"rkgis/rkcircular.js",
				"rkgis/rkstaticline.js",
				"rkgis/rklineanimation.js",
				"rkgis/rkresline.js",
				"rkgis/rkcluster.js",
				"rkgis/rkhistoryline.js",
				"rkgis/antiTaskRkcluster.js"
		];
	var spath = GetCurHost();
	var scriptTags = new Array(rkgisFiles.length);
	var host = GetCurHost();
	for (var i=0, len=rkgisFiles.length; i<len; i++) {
		scriptTags[i] = "<script src='" + host + rkgisFiles[i] +
							   "'></script>"; 
	}
	if (scriptTags.length > 0) {
		document.write(scriptTags.join(""));
	}
}
// Run Enable Rk GIS Library
EnableRkGIS();