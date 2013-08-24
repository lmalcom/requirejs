require.config({
	baseUrl:'./js/classes', 
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
		}
	]
}); 
require(['Controller'], function(controller){

	//start module 
	controller.loadPage(Settings); 
}); 
