define(['Form'], function(Form){
	var TransformForm = {}; 

	//Page View 
	TransformForm = Form.extend({ 
		className: Form.prototype.className + ' TransformForm', 
		defaultCSS: _.extend({}, Form.prototype.defaultCSS, {
			'form input[type=submit]':{
				'display':'none',
			}
		}),
		events: _.extend({}, Form.prototype.events, {
			'input input[type=number]': 'submit',
		}),
		inputs: [ 
			{type:"number", label: 'matrix', name: "matrix"}, 
			{type:"number", label: 'rotateX', name: "rotateX"}, 
			{type:"number", label: 'rotateY',  name: "rotateY"}, 
			{type:"number", label: 'rotateZ',  name: "rotateZ"}, 
			{type:"number", label: 'skewX', name: "skewX"}, 
			{type:"number", label: 'skewY', name: "skewY"}, 
			{type:"number", label: 'scale', name: "scale"}, 
		],
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
					val = view[name];
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

			if(pseudo = this.parent.pseudoClass){ 
				var dummy = {}; 
				target.css.get('&:'+ pseudo)[name] = formData; 
			}else{
				var dummy = {}; 
				dummy[name] = formData + 'deg'; 
				target[name] = formData; 
				//target.$el.css(dummy); 
			}
			target.$el.css(target.css.transform());
			//this.page.moveEditBox(target); 

			return this; 
		},
		header: 'Transform'
	});  
	return TransformForm; 
}); 