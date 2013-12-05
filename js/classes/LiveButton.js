define(['Button'], function(Button){ 
	'use strict'; 
	var Button =  Button.extend({ 
			className: Button.prototype.className + ' LiveButton',  
			defaultCSS: { 
				'position':'absolute', 
				'min-width':'40px', 
				'min-height':'40px', 
				'max-width':'200px', 
				'max-height':'60px', 
				'background-color':'rgba(250,250,250,.5)', 
				'cursor': 'pointer', 
				'-moz-box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)', 
				'-webkit-box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)', 
				'box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)', 
				'-webkit-border-radius': '4px', 
				'-moz-border-radius': '4px', 
				'border-radius': '4px', 
				'border': '0', 
				'display': 'inline-block', 
				'color': '#e8e8e8', 
				'font-size': '18px', 
				'font-weight': 'bold', 
				'font-style': 'normal', 
				'line-height': '40px', 
				'text-decoration': 'none', 
				'text-align': 'center', 
				'text-shadow': '1px 1px 0px #000', 
				'bottom':'0', 
				'right':'0', 
				'&:hover': { 
					'background-color': 'rgba(26, 42, 43, 1)', 
				}, 
				'&:active':{ 
					'-webkit-transition': 'all 0s', 
					'-moz-transition': 'all 0s', 
					'transition':' all 0s', 
					'bottom': '1px', 
					'color':'rgb(150,40,40)'
				} 
			},
			template: _.template('Live'), 
			//buttons trigger events primarily 
			emit: function(event){ 
				this.trigger(this.model.get('message') || 'alert', event); 
				return this; 
			}
		}); 	
	return Button; 
}); 