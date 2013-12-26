define(['Form'], function(Form){
	var PositionForm = {}; 

	//Page View 
	PositionForm = Form.extend({ 
		defaultCSS: _.extend({}, Form.prototype.defaultCSS, {
			'form input[type=submit]':{
				'display':'none',
			}
		}),
		events: _.extend({}, Form.prototype.events, {
			'input input[type=number]': 'submit',
		}),
		className: Form.prototype.className + ' PositionForm',  
		inputs: [  
			{type:"number", label: 'x', name:'x', min: '-9999', max: '9999'}, 
			{type:"number", label: 'y', name:'y', min: '-9999', max: '9999'}, 
			{type:"number", label: 'z', name:'z', min: '-9999', max: '9999'}, 
			{type:"number", label: 'min-width', name:'min-width', min: '-9999', max: '9999'}, 
			{type:"number", label: 'width', name:'width', min: '0', max: '9999'}, 
			{type:"number", label: 'max-width', name:'max-width', min: '0', max: '9999'},  
			{type:"number", label: 'min-height', name:'min-height', min: '0', max: '9999'}, 
			{type:"number", label: 'height', name:'height', min: '0', max: '9999'}, 
			{type:"number", label: 'max-height', name:'max-height', min: '0', max: '9999'}, 
		],
		header:'Position and Size', 
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

				if(name === 'x' || name === 'y' || name === 'z') val = view[name]; 

				//set that value on the input or none (we dont want to accidentally set values on the objects)
				input.value = parseInt(val); 
			}) 
			return this; 
		}, 
		render: function(){ 
			Form.prototype.render.call(this); 
			this.$el.find('input[type=submit]').attr('disabled', false); 
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

			
			//target.css.inline();
			this.page.moveEditBox(target); 

			return this; 
		}
	});  
	return PositionForm; 
}); 