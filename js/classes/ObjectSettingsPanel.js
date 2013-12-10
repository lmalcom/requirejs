define(['Panel', 'RemoveButton', 'ImageBlock', 'TextBlock'], function(Panel, RemoveButton, ImageBlock, TextBlock){ 
	'use strict'; 
	var ObjectSettingsPanel =  Panel.extend({ 
		className: Panel.prototype.className + ' ObjectSettingsPanel', 
		initialize: function(options){ 
			var edit, inputs; 
			edit = this; 
			Panel.prototype.initialize.call(this, options); 
			//console.log('brush settings in initiliaze: ', this.brushSettings); 
			//initialize basic forms for the edit page
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
	return ObjectSettingsPanel; 
}); 