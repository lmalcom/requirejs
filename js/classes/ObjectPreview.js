define(['Block'], function(Block){ 
	var ObjectPreview = {}; 

	//Page View 
	ObjectPreview = Block.extend({ 
		className: Block.prototype.className + ' ObjectPreview ', 
		events: _.extend({}, Block.prototype.events, { 
			'change select':'setClass',  
		}), 
		defaultCSS: _.extend({}, Block.prototype.defaultCSS, { 
			'max-height':'200px', 
			'padding':'10px', 
			'.container':{ 
				'border':'1px dotted green', 
				'width':'100%', 
				'height':'100%'
			} 
		}), 
		template: _.template('<div class="container"></div>'), 
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
			var state = this.setClass.view.saveState(); 
			this.model.get('edit').brushSettings = state; 
			console.log('brush Settings: ', this.model.get('edit').brushSettings); 
			return this; 
		},
	});  
	return ObjectPreview; 
}); 