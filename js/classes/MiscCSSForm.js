define(['Form'], function(Form){
	var MiscCSSForm = {}; 

	//Page View 
	MiscCSSForm = Form.extend({ 
		className: Form.prototype.className + ' MiscCSSForm',  
		inputs: [ 
			//{type:"color", label: 'background-color as hex', name: "background-color"}, 
			{type:"text", label: 'background-color as rgb', name: "background-color"}, 
		],
		header:'Color', 
		render: function(){ 
			Form.prototype.render.call(this); 
			this.$el.find('input[type=submit]').attr('disabled', false); 
			return this; 
		} 
	});  
	return MiscCSSForm; 
}); 