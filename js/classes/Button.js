define(['Block'], function(Block){
	'use strict'; 
	var Button =  Block.extend({ 
			className: Block.prototype.className + ' Button', 
			tagName: 'a', 
			events: { 
				'tap': 'emit'
			}, 
			defaultCSS: {
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
				'&:hover': {
					'background-color': 'rgba(26, 42, 43, 1)',  
				}, 
				'&:active':{
					'-webkit-transition': 'all 0s', 
					'-moz-transition': 'all 0s',
					'transition':' all 0s',
					'bottom': '1px',
				}
			},
			template: _.template('<%= typeof text === "undefined" ? "press": text %>'), 
			//buttons trigger events primarily 
			emit: function(event){ 
				this.trigger(this.model.get('message') || 'alert', event); 
				return this; 
			}
		}); 	
	return Button; 
}); 