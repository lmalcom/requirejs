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
		initialize: function(options){ 
			var page = this; 
			Page.prototype.initialize.call(this, options); 

			//initialize geolocation and set center there 
			navigator.geolocation.getCurrentPosition(function(location){ 
				page.center = [location.coords.latitude, location.coords.longitude]; 
			});
		}, 
		center: [-34.610299, -58.393273699999995], 
		render: function(){
			var page = this; 

			//initialize div
			$('body').append(page.el); 
			page.renderCSS(); 

			//then add map
			var map = leaflet.map(page.el, {
			    center: page.center, 
			    zoom: 13 
			}); 

			//set tile layer
			leaflet.tileLayer('http://{s}.tile.cloudmade.com/00db66cadc3b44be8bec857f3e13a959/997/256/{z}/{x}/{y}.png', {
			    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
			    maxZoom: 18
			}).addTo(map);

			//var myIcon = L.divIcon({className: 'my-div-icon'});
			// you can set .my-div-icon styles in CSS

			leaflet.marker(page.center).addTo(map);
			//leaflet.marker([50.505, -0.09], {icon: myIcon}).addTo(map); 

			return this; 
		}
	});  
	return MapPage; 
}); 