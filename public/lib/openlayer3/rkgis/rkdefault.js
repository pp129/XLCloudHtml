var rk = rk==null?{}:rk;

rk.DEFAULT ={};
rk.DEFAULT.Attribution = "ROPEOK";
rk.DEFAULT.URL = "";
rk.DEFAULT.PRO ="EPSG:3857";
rk.DEFAULT.DISPLAYPRO = "EPSG:4326";
rk.DEFAULT.ZOOM = 10;
rk.DEFAULT.MINZOOM = 9;
rk.DEFAULT.MAXZOOM = 18;
rk.DEFAULT.ROTATION = 0;
rk.DEFAULT.CENTER = {lon:118.1,lat:24.4};
function IsDefRK(obj){
   if(obj == null || typeof(obj) == "undefined"){
     return false;
   }
   return true;
}
//
rk.DEFAULT.overlayStyle = (function() {
  /* jshint -W069 */
  var styles = {};
  styles['Polygon'] = [
    new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.5]
      })
    }),
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 1],
        width: 5
      })
    }),
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 153, 255, 1],
        width: 3
      })
    })
  ];
  styles['MultiPolygon'] = styles['Polygon'];

  styles['LineString'] = [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [255, 255, 255, 1],
        width: 5
      })
    }),
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [0, 153, 255, 1],
        width: 3
      })
    })
  ];
  styles['MultiLineString'] = styles['LineString'];

  styles['Point'] = [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: [0, 153, 255, 1]
        }),
        stroke: new ol.style.Stroke({
          color: [255, 255, 255, 0.75],
          width: 1.5
        })
      }),
      zIndex: 100000
    })
  ];
  styles['MultiPoint'] = styles['Point'];

  styles['GeometryCollection'] = styles['Polygon'].concat(styles['Point']);

  return function(feature, resolution) {
    return styles[feature.getGeometry().getType()];
  };
  /* jshint +W069 */
})();