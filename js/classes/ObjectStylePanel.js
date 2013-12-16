define(['Panel', 'RemoveButton', 'ImageBlock', 'TextBlock'], function(Panel, RemoveButton, ImageBlock, TextBlock){ 
	'use strict'; 
	var ObjectStylePanel =  Panel.extend({ 
		className: Panel.prototype.className + ' ObjectStylePanel', 
		defaultCSS: _.extend({}, Panel.prototype.defaultCSS, { 
			'overflow-y':'auto', 
			'.Form':{ 
				'height':'auto', 
				'float':'left' 
			}, 
			'.TextBlock':{ 
				'height':'auto', 
				'a':{ 
					'width':'33.33333%' 
				} 
			} 
		}), 
		events: _.extend({}, Panel.prototype.events, {
			'click a':'setPseudoClass',
		}),
		initialize: function(options){ 
			Panel.prototype.initialize.call(this, options); 

			//initialize basic forms for the panel
			if(!this.model.subcollection){
				this.model.subcollection = new Backbone.Collection([ 
					new Backbone.Model({defaultView: 'TextBlock', inputs:[
						{text: 'baseCSS', type:'a'},
						{text: 'hover', type:'a'},
						{text: 'active', type:'a'},
					]}),
					new Backbone.Model({defaultView: 'PositionForm'}), 
					new Backbone.Model({defaultView: 'ColorForm'}),	
					new Backbone.Model({defaultView: 'TransformForm'}), 
					new Backbone.Model({defaultView: 'BorderForm'}), 
					new Backbone.Model({defaultView: 'ShadowForm'}), 
					new Backbone.Model({defaultView: 'MiscCSSForm'}) 
				]); 
			} 
		}, 
		setPseudoClass: function(ev){
			var txt = ev.target.innerHTML; 
			if(txt === 'baseCSS') this.pseudoClass = null; 
			else this.pseudoClass = txt; 
			console.log('pseudoClass', this.pseudoClass);
			return this; 
		}
	}); 
	return ObjectStylePanel; 
}); 