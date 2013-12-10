define(['Button'], function(Button){ 
	'use strict'; 
	var ListButton =  Button.extend({ 
		className: Button.prototype.className + ' ListButton', 
		defaultCSS: _.extend({}, Button.prototype.defaultCSS, { 
			'backgroud-image': 'url("images/menu.svg")' 
		}), 
		template: _.template('+'), 
		emit: function(event){ 
			this.trigger('add', event); 
			return this;  
		} 
	}); 
	return ListButton; 
}); 