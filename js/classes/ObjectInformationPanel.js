define(['Panel', 'TextBlock', "ObjectPreview"], function(Panel){ 
	'use strict'; 
	var ObjectInformationPanel =  Panel.extend({ 
		className: Panel.prototype.className + ' ObjectInformationPanel', 
		defaultCSS: _.extend({}, Panel.prototype.defaultCSS, { 
			'backgroud-image': 'url("images/menu.svg")', 
			'.TextBlock':{ 
				'height':'auto' 
			}, 
			'.ObjectPreview': { 
				'height':'300px', 
			} 
		}),  
		initialize: function(options){ 
			Panel.prototype.initialize.call(this, options); 

			//initialize basic forms for the panel  
			if(!this.model.subcollection){ 
				this.model.subcollection = new Backbone.Collection([ 
					new Backbone.Model({defaultView: 'TextBlock', text: 'Object Name', type: 'h2'}), 
					new Backbone.Model({defaultView: 'ObjectPreview'}), 
					new Backbone.Model({defaultView: 'TextBlock', inputs: [ 
							{text: 'Id: ', type:'p'}, 
							{text: 'random id', type:'p'}, 
							{text: 'Brushname: ', type:'p'}, 
							{text: 'random brushname', type:'p'}, 
							{text:  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', type: 'p'}, 
					]}), 
				]); 
			} 
		} 
	}); 
	return ObjectInformationPanel; 
}); 