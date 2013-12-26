define(['Form'], function(Form){ 
	var ObjectContentPanel = {}; 

	//Page View 
	ObjectContentPanel = Form.extend({ 
		defaultCSS: _.extend({}, Form.prototype.defaultCSS, { 
			'form':{ 
				'opacity':'1', 
				'max-height':'100%', 
			}, 
		}), 
		className: Form.prototype.className + ' ObjectContentPanel',  
		header: 'Content', 
		inputs: [], 
		getFormData: function(ev){ 
			var ret = {}; 

			//get reference to current view from edit target 
			_.each(this.$el.find('input[type!=submit]'), function(input){ 

				//get the name 
				var name, val; 
				name = input.name, 

				//put in into the return object 
				ret[name] = input.value; 

			}) 
			return ret; 
		}, 
		setFormData: function(ev, view){ 
			//get target default settings 
			var form = this; 
			form.inputs = []; 
			var target = this.page.target; 

			//use those as properties for inputs, must be parsed for type 
			_.each(target.options, function(val, key, list){ 
				var dummy = {}; 
				//if it is a number, use a number type 
				dummy.type = (_.isNumber(val))? 
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
		}, 
		send: function(dat){ 
			var target = this.page.target; 	
			_.each(this.getFormData(), function(val, key, list){ 
				target.options[key] = val;  
			}); 
			target.render(); 
			return this; 
		},
	});  
	return ObjectContentPanel; 
}); 