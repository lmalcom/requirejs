define(['Form'], function(Form){ 
	var PublishForm = {}; 

	//Page View 
	PublishForm = Form.extend({ 
		className: Form.prototype.className + ' PublishForm ', 
		inputs: [ 
			//{type:"color", label: 'background-color as hex', name: "background-color"}, 
			{type:"text", label:'Name of Page', text: 'Publish', name:'name'} 
		], 
		header:'Publish', 
		submitVal: 'Create Page', 
		setFormData: function(ev, view){ 
			this.$el.find('input[type!=submit]').val(this.model.get('edit').model.get('page').get('name')); 
			return this;  
		}, 
		send: function(){
			this.model.get('edit').publish($.trim(this.$el.find('input[type!=submit]').val())); 
			return this; 
		},
	});  
	return PublishForm; 
}); 