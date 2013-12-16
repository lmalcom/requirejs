define(['Panel', 'RemoveButton', 'ImageBlock', 'TextBlock'], function(Panel, RemoveButton, ImageBlock, TextBlock){ 
	'use strict'; 
	var BrushesPanel =  Panel.extend({ 
		className: Panel.prototype.className + ' BrushesPanel', 
		initialize: function(options){ 
			Panel.prototype.initialize.call(this, options); 

			//initialize basic forms for the panel
			if(!this.model.subcollection){
				this.model.subcollection = new Backbone.Collection([
					new Backbone.Model({defaultView: 'Panel'}, {
							subcollection: new Backbone.Collection([
								new Backbone.Model({defaultView: 'ObjectInformationPanel'}),
								new Backbone.Model({defaultView: 'ObjectContentPanel'}),
								new Backbone.Model({defaultView: 'ObjectStylePanel'}),
							]), 	
					}), 
					new Backbone.Model({defaultView: 'Panel'}, {
							subcollection: new Backbone.Collection([
								new Backbone.Model({defaultView: 'Button', text: 'Info'}),
								new Backbone.Model({defaultView: 'Button', text: 'Content'}),
								new Backbone.Model({defaultView: 'Button', text: 'Style'}),
							]), 						
					})
				]);	
			}
		}
	}); 
	return BrushesPanel; 
}); 