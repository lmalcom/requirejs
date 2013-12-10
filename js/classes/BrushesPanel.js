define(['Panel', 'RemoveButton', 'ImageBlock', 'TextBlock'], function(Panel, RemoveButton, ImageBlock, TextBlock){ 
	'use strict'; 
	var BrushesPanel =  Panel.extend({ 
		className: Panel.prototype.className + ' BrushesPanel', 
		initialize: function(options){ 
			Panel.prototype.initialize.call(this, options); 

			//initialize basic forms for the panel
			if(!this.model.subcollection){
				this.model.subcollection = new Backbone.Collection([ 
					new Backbone.Model({defaultView: 'StylePanel', pseudoClass: 'none'}),
					new Backbone.Model({defaultView: 'StylePanel', pseudoClass: 'hover'}),
					new Backbone.Model({defaultView: 'StylePanel', pseudoClass: 'active'}),
				]); 
			} 
		}
	}); 
	return BrushesPanel; 
}); 