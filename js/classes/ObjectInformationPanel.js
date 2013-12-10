define(['Panel', 'RemoveButton', 'ImageBlock', 'TextBlock'], function(Panel, RemoveButton, ImageBlock, TextBlock){ 
	'use strict'; 
	var ObjectInformationPanel =  Panel.extend({ 
		className: Panel.prototype.className + ' ObjectInformationPanel', 
		defaultCSS: _.extend({}, Panel.prototype.defaultCSS, { 
			'backgroud-image': 'url("images/menu.svg")' 
		}),  
		initialize: function(options){ 
			Panel.prototype.initialize.call(this, options); 

			//initialize basic forms for the panel
			if(!options.img) options.img = {src:null, alt: null}; 
			if(!this.model.subcollection){ 
				this.model.subcollection = new Backbone.Collection([ 
					new Backbone.Model(_.extend({}, {defaultView: 'ImageBlock', }, options.img)),
					new Backbone.Model(_.extend({}, {defaultView: 'TextBlock', }, options.img)),
					new Backbone.Model({defaultView: 'RemoveButton'}),
				]);
			} 
		}
	}); 
	return ObjectInformationPanel; 
}); 