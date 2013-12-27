define(['Page','io', 'leaflet', 'leafletcss'], function(Page, io, leaflet){ 
	var MapPage2 = {}; 

	//Page View 
	MapPage2 = Page.extend({ 
		socket: io.connect('http://' + window.location.hostname + ':8800'),
		className: Page.prototype.className + ' MapPage2', 
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, {
			'.container':{ 
				'width':'100%', 
				'height':'100%' 
			}
		}),
		events: { 
			'click':'addMarker', 
		}, 
		template: function(){
			return _.template('<div class="container"></div>');
		},
		addMarker: function(ev){ 
			console.log('ev from addMarker: ', ev); 
			return this; 
		}, 
		render: function(){
			var page = this; 

			//initialize div
			var renderTest = 
				$.Deferred(function(){
					page.$el.html(page.template()); 
					$('body').append(page.el); 	
					page.renderCSS();
				}).done(function(){
				  	//then add map
					var map = leaflet.map(page.el.firstChild, {
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
					map.on('mousedown', function(ev){
						var latlng = ev.latlng; 
						console.log('ev from map.onclick: ', ev); 
						leaflet.marker([latlng.lat, latlng.lng]).addTo(map); 
						page.socket.emit('draw', {'location': ev.latlng}); 
					})

				});
							
				//initialize geolocation and set center there 
				navigator.geolocation.getCurrentPosition(function(location){ 
					page.center = [location.coords.latitude, location.coords.longitude]; 
					renderTest.resolve(); 
				});			

			return this; 
		},
	});  
	return MapPage2; 
}); 