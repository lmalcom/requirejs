define(['Page', 'leaflet', 'leafletcss'], function(Page, leaflet){
	var MapPage = {}; 

	//Page View 
	MapPage = Page.extend({ 
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, {
			'.leaflet-container':{
				'width':'100%', 
				'height':'100%'
			}
		}),
		render: function(){
			var div = document.createElement('div'); 
			var map = leaflet.map(div, {
			    center: [51.505, -0.09], 
			    zoom: 13 
			}); 
			leaflet.tileLayer('http://{s}.tile.cloudmade.com/00db66cadc3b44be8bec857f3e13a959/997/256/{z}/{x}/{y}.png', {
			    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
			    maxZoom: 18
			}).addTo(map);

			var myIcon = L.divIcon({className: 'my-div-icon'});
			// you can set .my-div-icon styles in CSS

			leaflet.marker([50.505, 30.57], {icon: myIcon}).addTo(map);

			$('body').append(this.$el.append(div)); 
			this.renderCSS(); 

			return this; 
		}
	});  
	console.log('leaflet', leaflet); 
	return MapPage; 
}); 