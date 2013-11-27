define(['Form'], function(Form){
	var ButtonForm = {}; 

	//Page View 
	ButtonForm = Form.extend({ 
		className: Form.prototype.className + ' ButtonForm',  
		defaultCSS: _.extend({}, Form.prototype.defaulCSS, {
			'width':'50%'
			'height':'50%', 
			'max-height':'100px',
		}),
		toggleActive: function(ev){
			var form = this.$el; 
			console.log('oh hey', form.width()); 
			(form.width() != 50)? 
				form.css({'width': '50px', 'height':'50px', 'padding':'0'}): 
				form.css({'width': '100%', 'height':'auto', 'padding':'15px'}); 
			return this; 
		},
	});  
	return ButtonForm; 
}); 

		