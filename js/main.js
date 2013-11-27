require.config({
	baseUrl:'../js/classes', 
	shim : {
		underscore : 
		{
			exports:'_'
		}, 
		backbone: 
		{
	      deps: ["underscore", "jquery"],
	      exports: "Backbone"
	    }
	},
	packages: [
		{
			name: 'jquery', 
			location: '../libs', 
			main:'jquery'
		}, 
		{
			name: 'underscore', 
			location: '../libs', 
			main:'underscore'
		}, 
		{
			name: 'backbone', 
			location: '../libs', 
			main:'backbone'
		}, 
		{
			name: 'less', 
			location: '../libs', 
			main:'less'
		},
		{
			name: 'hammer', 
			location: '../libs', 
			main: 'hammer'
		}, 
		{
			name: 'jquery.hammer', 
			location: '../libs', 
			main: 'jquery.hammer'
		}, 
		{
			name: 'youtube', 
			location: '../libs', 
			main: 'iframe_api'
		}, 
		{
			name: 'io', 
			location: 'http://' + window.location.hostname + ':8800', 
			main: 'socket.io/socket.io.js'
		}, 
		{
			name: 'leaflet', 
			location: "http://cdn.leafletjs.com/leaflet-0.7", 
			main: 'leaflet'
		}, 
		{
			name: 'leafletcss', 
			location: '../libs', 
			main: 'leafletcss'
		}, 
	]
}); 
require(['Controller', 'DefaultRouter'], function(Controller, Router){
	//start module 
	window.controller = new Controller; 
	controller.loadPage(Settings); 

	//initialize router with pages 
	controller.set({router: new Router({parent:this})}); 
	Backbone.history.start({pushState: true, hashChange: false}); 
}); 
