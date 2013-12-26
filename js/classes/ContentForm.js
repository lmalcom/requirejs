define(['Form'], function(Form){
	var ContentForm = {}; 

	//Page View 
	ContentForm = Form.extend({ 
		className: Form.prototype.className + ' ContentForm',  
		header: 'Content', 
		inputs: [],
		/*getFormData: function(ev){ 
			//get target default settings 
			var form = this; 
			form.inputs = []; 
			var target = this.page.target; 

			//use those as properties for inputs, must be parsed for type 
			_.each(target.options, function(val, key, list){
				var dummy = {}; 
				//if it is a number, use a number type
				dummy.type = (_.isNumber(parseFloat(val)))?
					'number':
					'text';
				dummy.label = key; 
				dummy.name = key; 
				dummy.text = dummy.value = val; 
				form.inputs.push(dummy); 
			});

			//rerender 
			form.render(); 
			return this; 			
		}, */ 
		setFormData: function(ev, view){ 
			//get target default settings 
			console.log('oh heeeeye from the content form'); 
			var form = this; 
			form.inputs = []; 
			var target = this.page.target; 

			//use those as properties for inputs, must be parsed for type 
			_.each(target.options, function(val, key, list){ 
				var dummy = {}; 
				//if it is a number, use a number type 
				dummy.type = (_.isNumber(parseFloat(val)))? 
					'number': 
					'text'; 
				dummy.label = key; 
				dummy.name = key; 
				dummy.text = dummy.value = val; 
				form.inputs.push(dummy); 
			});
			console.log('content form', form.inputs); 
			//rerender 
			form.render(); 
			return this; 		
		}, 
		send: function(dat){ 
			var target = this.page.target; 
			target.css.set(dat); 
			target.$el.css(dat); 
			return this; 
		},
	});  
	return ContentForm; 
}); 