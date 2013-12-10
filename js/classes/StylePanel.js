define(['Panel', 'PositionForm', 'ColorForm', 'TransformForm', 'BorderForm', 'ShadowForm', 'MiscCSSForm'], function(Panel){ 
	'use strict'; 
	var StylePanel =  Panel.extend({ 
		className: Panel.prototype.className + ' StylePanel', 
		initialize: function(options){ 
			Panel.prototype.initialize.call(this, options); 

			//initialize basic forms for the panel
			if(!this.model.subcollection){
				this.model.subcollection = new Backbone.Collection([
					//********///
					// THIS NEEDS TO CHANGE. MUST UPDATE HOW TARGETING THE RIGHT BLOCK WORKS. 
					// SHOULD HAVE EDITOR EMIT AN EVENT TO CHANGE TARGET. ALL FORMS SHOULD HAVE A TARGET
					new Backbone.Model({defaultView: 'PositionForm'}, {edit: new Backbone.Model}),
					new Backbone.Model({defaultView: 'ColorForm'}, {edit: new Backbone.Model}),					
					new Backbone.Model({defaultView: 'TransformForm'}, {edit: new Backbone.Model}),
					new Backbone.Model({defaultView: 'BorderForm'}, {edit: new Backbone.Model}),
					new Backbone.Model({defaultView: 'ShadowForm'}, {edit: new Backbone.Model}),
					new Backbone.Model({defaultView: 'MiscCSSForm'}, {edit: new Backbone.Model})
				]);
			} 
		}
	}); 
	return StylePanel; 
}); 