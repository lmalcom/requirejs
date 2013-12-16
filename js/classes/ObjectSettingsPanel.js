define(['Panel', 'RemoveButton', 'ImageBlock', 'TextBlock'], function(Panel, RemoveButton, ImageBlock, TextBlock){ 
	'use strict'; 
	var ObjectSettingsPanel =  Panel.extend({ 
		className: Panel.prototype.className + ' ObjectSettingsPanel', 
		defaultCSS: _.extend({}, Panel.prototype.defaultCSS, {
			'.active':{
				'background-color':'rgba(60, 190, 231, 0.42)'
			}, 
		}),
		events: {
			'click .Button': 'move'
		},
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
		}, 
		move: function(ev){
			var text = ev.target.innerHTML; 
			if ( text === 'Info'){
				this.$el.find('.Panel > .ObjectInformationPanel,.ObjectContentPanel,.ObjectStylePanel').css({
					'transform':'translateX(0)',
					'-webkit0transform':'translateX(0)',
					'-moz-transform':'translateX(0)',
				}); 
				this.$el.find('.Button').removeClass('active'); 
				this.$el.find('.Panel:nth-child(2) > .Button:nth-child(1)').addClass('active'); 
			}else if( text === 'Content'){
				this.$el.find('.Panel > .ObjectInformationPanel,.ObjectContentPanel,.ObjectStylePanel').css({
					'transform':'translateX(-250px)',
					'-webkit0transform':'translateX(-250px)',
					'-moz-transform':'translateX(-250px)',
				}); 
				this.$el.find('.Button').removeClass('active'); 
				this.$el.find('.Panel:nth-child(2) > .Button:nth-child(2)').addClass('active'); 
			}else if( text === 'Style'){
				this.$el.find('.Panel > .ObjectInformationPanel,.ObjectContentPanel,.ObjectStylePanel').css({
					'transform':'translateX(-500px)',
					'-webkit0transform':'translateX(-500px)',
					'-moz-transform':'translateX(-500px)',
				}); 
				this.$el.find('.Button').removeClass('active'); 
				this.$el.find('.Panel:nth-child(2) > .Button:nth-child(3)').addClass('active'); 
			}
		}
	});	
	return ObjectSettingsPanel; 
}); 