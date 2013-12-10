define(['Panel', 'RemoveButton', 'ImageBlock', 'TextBlock'], function(Panel, RemoveButton, ImageBlock, TextBlock){ 
	'use strict'; 
	var DescriptionPanel =  Panel.extend({ 
		className: Panel.prototype.className + ' DescriptionPanel', 
		defaultCSS: _.extend({}, Panel.prototype.defaultCSS, { 
			'backgroud-image': 'url("images/menu.svg")' 
		}),  
		initialize: function(options){ 
			Panel.prototype.initialize.call(this, options); 

			//initialize basic forms for the panel
			if(!this.model.subcollection){ 
				this.model.subcollection = new Backbone.Collection([ 
					new Backbone.Model({defaultView: 'ImageBlock', src:null, alt: null}),
					new Backbone.Model({defaultView: 'TextBlock', text:options.text}),
					new Backbone.Model({defaultView: 'RemoveButton'}),
				]), 
			} 
		}
	}); 
	return DescriptionPanel; 
}); 