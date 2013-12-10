define(['Panel', 'RemoveButton', 'ImageBlock', 'TextBlock'], function(Panel, RemoveButton, ImageBlock, TextBlock){ 
	'use strict'; 
	var ObjectContentPanel =  Panel.extend({ 
		className: Panel.prototype.className + ' ObjectContentPanel', 
	}); 
	return ObjectContentPanel; 
}); 