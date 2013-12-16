define(['Form'], function(Form){
	var MiscCSSForm = {}; 

	//Page View 
	MiscCSSForm = Form.extend({ 
		className: Form.prototype.className + ' MiscCSSForm',  
		defaultCSS: _.extend({}, Form.prototype.defaultCSS, {
			'form input[type=submit]':{
				'display':'none',
			}
		}),
		inputs: [ 
			{type:"text", label: 'display', name: "display"}, 
			{type:"text", label: 'cursor', name: "cursor"}, 
			{type:"text", label: 'display', name: "display"}, 
			{type:"text", label: 'display', name: "display"}, 
		],
		header:'Misc. CSS', 
		render: function(){ 
			Form.prototype.render.call(this); 
			this.$el.find('input[type=submit]').attr('disabled', false); 
			return this; 
		} 
	});  
	return MiscCSSForm; 
}); 