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
		events: _.extend({}, Form.prototype.events, { 
			'input input[type=number]': 'submit', 
		}), 
		inputs: [ 
			{type:"color", label: 'text-color', name: "color"}, 
			{type:"color", label: 'background-color', name: "background-color"}, 
			{type:"text", label: 'background-image', name: "background-image"}, 
		], 
		header:'Color', 
		setFormData: function(ev, view){ 
			var form = this; 
			_.each(['color','background-color'], function(name){ 
				form.setColor(name, view); 
			}); 
			return this; 
		}, 
		render: function(){ 
			Form.prototype.render.call(this); 
			this.$el.find('input[type=submit]').attr('disabled', false); 
			return this; 
		}, 
		submit: function(ev){ 
			var name, formData, target, pageView, form = this; 
			alert('oh heeeey from the color form!'); 

			//get form data 
			target = this.page.target; 
			pageView = this.page.model.get('page').get('page').view; 
			_.each(['background-color', 'color'], function(name){ 
				var ret = "rgba("; 
				ret = ret.concat(form.$el.find('input[name=' + name + '-r]').val() + ', '); 
				ret = ret.concat(form.$el.find('input[name=' + name + '-g]').val() + ', '); 
				ret = ret.concat(form.$el.find('input[name=' + name + '-b]').val() + ', '); 
				ret = ret.concat(form.$el.find('input[name=' + name + '-alpha]').val() + ')'); 
				if(pseudo = this.parent.pseudoClass){ 
					target.css.get('&:'+ pseudo)[name] = ret; 
					pageView.renderCSS(); 
				}else{ 
					target.css.set(name, ret); 
					target.$el.css(name, ret); 
				} 
			}); 
			this.setFormData(null, target); 

			return this; 
		},
	});  
	return ColorForm; 
}); 