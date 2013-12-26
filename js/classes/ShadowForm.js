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
		events: _.extend({}, Form.prototype.events, {
			'input input[type=number]': 'submit',
		}),
		inputs: [ 
			{type:"number", label: 'horizontal shadow', name: "h-shadow"}, 
			{type:"number", label: 'vertical shadow', name: "v-shadow"}, 
			{type:"number", label: 'blur', name: "blur"}, 
			{type:"number", label: 'spread', name: "spread"}, 
			{type:"color", label: 'color', name: "color"}, 
			{type:"checkbox", label: 'inset', name: "inset"}, 
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
			var form = this, val, vals, horizontalShadow, verticalShadow, blue, spread, color, inset, pseudoClass; 

			//by default checks CSS values 
			//find that value in the css object of the view 
			if(pseudoclass = form.parent.pseudoClass) pseudoClass = '&:' + pseudoclass;	
			if(pseudoclass = view.css.get(pseudoClass)){ 
				val = pseudoclass['box-shadow'] || pseudoclass['-moz-shadow'] || pseudoclass['-webkit-box-shadow']; 
			}else{ 
				val = view.css.get('box-shadow') || view.css.get('-moz-box-shadow') || view.css.get('-webkit-box-shadow');
			} 

			//parse the value for the individual properties 
			if(val){ 
				vals = val.split(" "); 
				valsCopy = vals.slice(0); 

				//first check for color and inset 
				_.each(valsCopy, function(val, index){ 
					//check inset 
					if(val == 'inset'){ 
						form.$el.find('input[name=inset]').prop('checked', true); 
						vals.splice(index); 
					} 
					//if a color property 
					//rgba 
					if(val.slice(0, 4) === 'rgba'){ 
						form.$el.find('input[name=color]').val(val); 
						vals.splice(index); 
					//rgb 
					}else if(val.slice(0, 3) === 'rgb'){ 
						form.$el.find('input[name=color]').val(val); 
						vals.splice(index); 

					//hex 
					}else if(val[0] === '#'){ 
						form.$el.find('input[name=color]').val(val); 
						vals.splice(index); 
					}
				}); 

				//horizontal, vertical, blur, spread
				_.each(vals, function(val, index){
					//console.log('spliced vals: ', vals); 
					//parse number
					val = parseInt(val); 
					switch(index){
						//horizontal (required)
						case 0: 
							form.$el.find('input[name=h-shadow]').val(val); 
							break; 

						//vertical (required)
						case 1: 
							form.$el.find('input[name=v-shadow]').val(val); 
							break; 

						//blur
						case 2: 
							form.$el.find('input[name=blur]').val(val); 
							break; 

						//spread
						case 3: 
							form.$el.find('input[name=spread]').val(val); 
							break; 
					}
				}); 
			}else{
				_.each(this.$el.find('input[type!=submit]'), function(input, index){ 
					//color and inset propertiesvalue 
					input.value = 0; 	
					input.checked = false; 	
				})
			}
			return this; 
		}, 
		submit: function(ev){ 
			var name, formData, target, pageView, ret; 

			//get form data 
			name = ev.target.name; 
			target = this.page.target; 
			pageView = this.page.model.get('page').get('page').view; 
			ret = ""; 

			ret = ret.concat(this.$el.find('input[name=h-shadow]').val() + 'px '); 
			ret = ret.concat(this.$el.find('input[name=v-shadow]').val() + 'px '); 
			ret = ret.concat(this.$el.find('input[name=blur]').val() + 'px '); 
			ret = ret.concat(this.$el.find('input[name=spread]').val() + 'px '); 
			ret = ret.concat(this.$el.find('input[name=color]').val()); 
			if(this.$el.find('input[name=inset]').prop('checked') == true) ret = ret.concat(' inset');

			if(pseudo = this.parent.pseudoClass){ 
				target.css.get('&:'+ pseudo)[name] = ret; 
				pageView.renderCSS(); 
			}else{
				target.css.set({
					'box-shadow': ret, 
					'-moz-shadow': ret, 
					'-webkit-box-shadow': ret, 
				});
				target.$el.css({
					'box-shadow': ret, 
					'-moz-shadow': ret, 
					'-webkit-box-shadow': ret, 
				}); 
			}

			return this; 
		},
		render: function(){ 
			Form.prototype.render.call(this); 
			this.$el.find('input[type=submit]').attr('disabled', false); 
			return this; 
		} 
	});  
	return ShadowForm; 
}); 