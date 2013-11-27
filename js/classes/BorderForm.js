define(['Form'], function(Form){
	var BorderForm = {}; 

	//Page View 
	BorderForm = Form.extend({ 
		events: _.extend({}, Form.prototype.events, {
			'change input[type=range]':'setVal', 
		}),
		className: Form.prototype.className + ' BorderForm',  
		header: 'Borders', 
		inputs: [ 
			{type:"range", label: 'border-top-left-radius', name: "border-top-left-radius"}, 
			{type:"range", label: 'border-top-right-radius', name: "border-top-right-radius"}, 
			{type:"range", label: 'border-bottom-left-radius', name: "border-bottom-left-radius"}, 
			{type:"range", label: 'border-bottom-right-radius', name: "border-bottom-right-radius"}, 
		],
		template: function(dat){
			var text, form; 
			text = '', 
			form = this; 
			if(!this.inputs) return _.template('<i>this form has no inputs</i>'); 

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
		}, 		
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
			_.each(this.$el.find('input[type!=submit]'), function(input){ 
				//set min 
				input.max = view.$el.width(); 

				//set default value text
				form.$el.find('#sliderVal' + input.name).text(view.$el.css(input.name) || 'No Value');

				//set value 
				input.value = view.$el.css(input.name); 
			})
			return this; 
		}, 
		setVal: function(ev){
			$(ev.target).parent().find('#sliderVal' + ev.target.name).text(ev.target.value + ' px'); 
			return this; 
		},
	});  
	return BorderForm; 
}); 