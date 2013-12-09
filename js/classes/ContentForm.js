define(['Form'], function(Form){
	var ContentForm = {}; 

	//Page View 
	ContentForm = Form.extend({ 
		events: _.extend({}, Form.prototype.events, {
			'change input[type=range]':'setVal', 
		}),
		className: Form.prototype.className + ' ContentForm',  
		header: 'Content', 
		inputs: [  
			{type:"text", label: 'Image link', name: "image-link"}, 
			{type:"file", label: 'image', name: "image"}, 
			{type:"text", label: 'Youtube Video Link', name: "video"}, 
			{type:"textarea", label: 'text', name: "text"},
		],
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
		send: function(dat){ 
			var target = this.model.get('edit').target; 
			target.css.set(dat); 
			target.$el.css(dat); 
			return this; 
		},
	});  
	return ContentForm; 
}); 