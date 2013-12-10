define(['Button'], function(Button){ 
	'use strict'; 
	var RemoveButton =  Button.extend({ 
		className: Button.prototype.className + ' RemoveButton', 
		defaultCSS: _.extend({}, Button.prototype.defaultCSS, {
			'color': 'red', 
			'font-size': '1.5em', 
		}), 
		template: _.template('X'), 
		emit: function(event){ 
			this.trigger('remove', event); 
			return this; 
		}
	}); 	
	return RemoveButton; 
}); 