define(['Form'], function(Form){
	var ColorForm = {}; 

	//Page View 
	ColorForm = Form.extend({ 
		className: Form.prototype.className + ' ColorForm',  
		defaultCSS: _.extend({}, Form.prototype.defaultCSS, { 
			'form input[type=submit]':{ 
				'display':'none', 
			}, 
		}), 
		inputs: [ 
			//{type:"color", label: 'background-color as hex', name: "background-color"}, 
			{type:"color", label: 'text-color', name: "color"}, 
			{type:"color", label: 'background-color', name: "background-color"}, 
			{type:"text", label: 'background-image', name: "background-image"}, 
		], 
		header:'Color', 
		setFormData: function(ev, view){ 
			var form = this; 
			if(!view) view = this.page.target; 

			//check text-color, background-color, background-image
			var name, val = null, pseudoClass; 
			if(pseudoclass = form.parent.pseudoClass) pseudoClass = '&:' + pseudoclass;			
			name = 'background-color'; 

			//find that value in the css object of the view 
			if(pseudoclass = view.css.get(pseudoClass)){ 
				val = pseudoclass[name]; 
			}else{ 
				val = view.$el.css(name); 
			} 

			//rgba
			if(val.slice(0, 4) === 'rgba'){
				console.log('rgba!', val); 
			//rgb
			}else if(val.slice(0, 3) === 'rgb'){
				console.log('rgb!', val); 

			//hex
			}else if(val[0] === '#'){
				console.log('hex!', val); 

			}

			//set values 

			//by default checks CSS values 
			/*_.each(this.$el.find('input[type!=submit]'), function(input){ 
				//get the name 
				var name, val = null, pseudoClass; 
				if(pseudoclass = form.parent.pseudoClass) pseudoClass = '&:' + pseudoclass;			
				name = input.name; 

				//find that value in the css object of the view 
				if(pseudoclass = view.css.get(pseudoClass)){ 
					val = pseudoclass[name]; 
				}else{ 
					val = view.$el.css(name); 
				} 
				console.log('name: ', name, 'val for color form', val); 
				//set that value on the input or none (we dont want to accidentally set values on the objects)
				input.value = val || 0; 
			}); */
			return this; 
		}, 
		render: function(){ 
			Form.prototype.render.call(this); 
			this.$el.find('input[type=submit]').attr('disabled', false); 
			return this; 
		} 
	});  
	return ColorForm; 
}); 