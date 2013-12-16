define(['Form'], function(Form){
	var BorderForm = {}; 

	//should have predetermined types: cirle, trapezoid, or others submitted by the community 

	//Page View 
	BorderForm = Form.extend({ 
		events: _.extend({}, Form.prototype.events, {
			'input input[type=number]': 'submit',
		}),
		defaultCSS: _.extend({}, Form.prototype.defaultCSS, {
			'form input[type=submit]':{
				'display':'none',
			}
		}),
		className: Form.prototype.className + ' BorderForm',  
		header: 'Borders', 
		inputs: [ 
			{type:"number", label: 'border-top-left-radius', name: "border-top-left-radius"}, 
			{type:"number", label: 'border-top-right-radius', name: "border-top-right-radius"}, 
			{type:"number", label: 'border-bottom-left-radius', name: "border-bottom-left-radius"}, 
			{type:"number", label: 'border-bottom-right-radius', name: "border-bottom-right-radius"}, 
		], 
		/*template: function(dat){ 
			var text, form; 
			text = '', 
			form = this;  

			//header is default header for the class, or the header suggested by the model or the default 
			text += '<h3 class="header">' + (this.header || dat.header ||'Header') + '</h3>'; 
			text += '<form class="inactive">'; 
			
			//create labels and inputs for all of the inputs in the array 
			_.each(this.inputs.concat(dat.inputs || []), function(input){ 
				if(input.label) text +=		'<label>' + input.label + ': ( <span id="sliderVal'+ (input.name || '') +'"></span> )</label>'; 		
				text +=		'<input type="range"'; 
				text +=		'name = "' + (input.name || '') + '" min="0" value="0">'; 
				text +=		'</input">'; 
			}); 

			//submit button 
			text+= '<input type="submit" class="Button" value="' + (this.submitVal || this.model.get('submitVal') || 'Submit') + '"></input>'; 
			text += '</form>'; 
			return _.template(text); 
		}, 	*/	
		getFormData: function(ev){ 
			var ret = {}; 

			//get reference to current view from edit target 
			_.each(this.$el.find('input[type!=submit]'), function(input){ 
				//get the name 
				var name, val; 
				name = input.name,

				//get value
				val = input.value + 'px' || null; 

				//put in into the return object 
				ret[name] = val; 

			})
			return ret; 
		}, 
		setFormData: function(ev, view){
			var form = this; 

			//by default checks CSS values
			_.each(this.$el.find('input[type!=submit]'), function(input){
				//get the name
				var name, val = null, pseudoClass; 
				if(pseudoclass = form.parent.pseudoClass) pseudoClass = '&:' + pseudoclass;			
				name = input.name;

				//find that value in the css object of the view
				if(pseudoclass = view.css.get(pseudoClass)){
					val = pseudoclass[name]; 
				}else{
					val = view.css.get(name);
				}

				//set that value on the input or none (we dont want to accidentally set values on the objects)
				input.value = parseInt(val) || 0; 
			}) 
			return this; 
		}, 
		submit: function(ev){ 
			var name, formData, target, pageView; 

			//get form data 
			name = ev.target.name; 
			formData = ev.target.value; 
			target = this.page.target; 
			pageView = this.page.model.get('page').get('page').view; 

			if(name === 'x' || name === 'y' || name === 'z'){ 
				target[name] = formData; 
				target.$el.css(target.css.transform());
			}else if(pseudo = this.parent.pseudoClass){ 
				var dummy = {}; 
				target.css.get('&:'+ pseudo)[name] = formData; 
				pageView.renderCSS(); 
			}else{
				var dummy = {}; 
				dummy[name] = formData + 'px'; 
				target.css.set(dummy);
				target.$el.css(dummy); 
			}
			console.log(dummy); 
			
			//target.css.inline();
			this.page.moveEditBox(target); 

			return this; 
		}
	});  
	return BorderForm; 
}); 