define(['Form'], function(Form){ 
	var ShadowForm = {}; 

	//Page View 
	ShadowForm = Form.extend({ 
		className: Form.prototype.className + ' ShadowForm',  
		defaultCSS: _.extend({}, Form.prototype.defaultCSS, { 
			'form input[type=submit]':{ 
				'display':'none', 
			} 
		}), 
		inputs: [ 
			{type:"number", label: 'horizontal shadow', name: "h-shadow"}, 
			{type:"number", label: 'vertical shadow', name: "v-shadow"}, 
			{type:"number", label: 'blur', name: "blur"}, 
			{type:"number", label: 'spread', name: "spread"}, 
			{type:"color", label: 'color', name: "color"}, 
		], 
		header:'Shadows', 
		/*setFormData: function(ev, view){ 
			var form = this; 

			//by default checks CSS values
			_.each(this.$el.find('input[type!=submit]'), function(input){
				//get the name
				var name, val = null, pseudoClass; 
				if(pseudoclass = form.parent.pseudoClass) pseudoClass = '&:' + pseudoclass;			

				//find that value in the css object of the view
				if(pseudoclass = view.css.get(pseudoClass)){
					val = pseudoclass['box-shadow']; 
				}else{
					val = view.css.get('box-shadow');
				}

				//set that value on the input or none (we dont want to accidentally set values on the objects)
				input.value = parseInt(val); 
			}) 
			return this; 
		}, */
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
		render: function(){ 
			Form.prototype.render.call(this); 
			this.$el.find('input[type=submit]').attr('disabled', false); 
			return this; 
		} 
	});  
	return ShadowForm; 
}); 