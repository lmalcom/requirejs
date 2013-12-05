define(['Form'], function(Form){ 
	var ClassForm = {}; 

	//Page View 
	ClassForm = Form.extend({ 
		className: Form.prototype.className + ' ClassForm', 
		events: _.extend({}, Form.prototype.events, { 
			'change select':'setClass',  
		}), 
		defaultCSS: _.extend({}, Form.prototype.defaultCSS, { 
			'select': { 
				'width':'100%', 
			}, 
			'.container':{ 
				'border':'1px dotted green', 
				'width':'100%', 
				'height':'200px', 
				'margin-bottom':'10px', 
				'padding':'10px', 
			} 
		}), 
		template: function(dat){ 
			var text, form, listOfClasses; 
			form = this, 

			//need to makea better way of getting the complete class list (ajax call, route could be reusable)
			listOfClasses = ['Animation Form', 'Block', 'Border Form', 'Button', 'Button Form', 'Color Form', 'Content Form', 'Dialog', 'Drawing Page', 'Form', 'Image Block', 'Page', 'Panel', 'Publish Form', 'Text Block', 'Text Form', 'Transform Form', 'Video Block'], 

			//base template 
			text = '<h3 class="header">' + (dat.header || this.header || 'Header') + '</h3>', 
			text +='<div class="container"></div>', 
			text +='<form><select>'; 

			//set list of classes 
			_.each(listOfClasses, function(className, index, list){ 
				text += '<option>' + className + '</option>'; 
			}) 

			//submit button 
			text+= '<input type="submit" class="Button" value="' + (this.submitVal || this.model.get('submitVal') || 'Submit') + '"></input>'; 
			text += '</select></form>'; 
			return _.template(text); 
		}, 
		header:'Select Class', 
		submitVal: 'Submit', 
		setFormData: function(ev, view){ 
			if (view && view.className){ 
				//set selected to the proper class
				this.$el.find('option[value=' + view.className + ']').attr('selected', true); 

				//set the example in the window to be of the right class 
				this.setClass(ev, view.className);
			}
			return this; 
		}, 
		//sets the class of object in the example container
		setClass: function(ev, className){ 
			var name, form, model; 
			form = this, 

			//strip spaces from name 
			name = (className || ev.target.value).replace(/\s+/, ""); 

			//return if the class is the same as the current class 
			if (this.setClass.view && this.setClass.view.className === name) return; 

			//reset model and view 
			if(!this.setClass.model) this.setClass.model = new Backbone.Model; 
			if(this.setClass.view) this.setClass.view.remove(); 
			this.currentClass = name; 

			//replace example container with new class 
			controller.getClass(name, function(klass){ 
				var klass = (klass instanceof Array)? klass[0]: klass; 
				if(typeof klass === 'function'){ 
					form.setClass.view = new klass({model:form.setClass.model}); 
					form.$el.find('.container').html(form.setClass.view.render().el); 
					form.model.get('edit').renderCSS(); 
				} 
			}); 
		}, 
		send: function(){ 
			//get the model/view props for the brush
			this.model.get('edit').brushSettings.viewProps.className = this.currentClass; 
			return this; 
		},
		toggleSubmit: function(){}
	});  
	return ClassForm; 
}); 