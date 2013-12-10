define(['Button'], function(Button){ 
	'use strict'; 
	var AddButton =  Button.extend({ 
		className: Button.prototype.className + ' AddButton', 
		defaultCSS: _.extend({}, Button.prototype.defaultCSS, {
			'color': 'green', 
			'font-size': '1.5em', 
		}),
		template: _.template('+'), 
		emit: function(event){ 
			this.trigger('add', event); 
			return this; 
		}
	}); 	
	return AddButton; 
}); 