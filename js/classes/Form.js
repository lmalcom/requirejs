define(['Block'], function(Block){
	var Form = {}; 

	//Page View
	Form = Block.extend({ 
		className: 'Form',  
		events: { 
			'change input[type=file]':'setImage', 
			'click .formImg': 'changeFile', 
			'submit form': 'submit', 
			'keyup input,textarea' : 'toggleSubmit', 
			'blur input, textarea': 'toggleSubmit',
			'click .deletebtn': 'deleteInput', 
			'click .header' : 'toggleActive', 
			'setFormData': 'setFormData'
		},
		defaultCSS: _.extend({}, Block.prototype.defaultCSS, {
			'width'	: '100%', 
			'max-width':'400px', 
			'height'	: 'auto', 
			'padding' : '15px', 
			'color': 'rgb(200,200,200)', 
			'background':'rgba(0,0,0,.75)', 
			'-moz-box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)', 
			'-webkit-box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)', 
			'box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)', 
			'overflow':'hidden',
			'transition':'all .5s', 
			'-webkit-transition':'all .5s', 
			'-moz-transition':'all .5s', 			
			'form':{ 
				'display':'none' 
			}, 
			'input' : { 
				'width':'100%', 
				'display':'block', 
				'margin':'10px auto', 
				'transition':'all .5s', 
				'-webkit-transition':'all .5s', 
				'-moz-transition':'all .5s'
			}, 
			'.header': { 
				'text-align':'center', 
				'margin':'10px 0', 
				'cursor':'pointer', 
			}, 
			'label' : {
				'display':'block', 
				'margin':'10px auto'
			},
			'.FormImg':{
				'display':'block', 
				'min-width':'200px', 
				'min-height':'200px', 
				'text-align':'center'
			}, 
			'input[type=submit]':{
				'position': 'relative'
			},
		}), 	
		initialize: function( options ){
			Block.prototype.initialize.call(this, options); 
			this.el.action = this.model.get('action') || null;
			this.el.enctype = "multipart/form-data"; 
			//this.listenTo(this.model.get('edit'), 'change:target', this.setFormData); 
		}, 
		template: function(dat){
			var text, form; 
			text = '', 
			form = this; 
			if(!this.inputs) return _.template('<i>this form has no inputs</i>'); 

			//header is default header for the class, or the header suggested by the model or the default 
			text += '<h3 class="header">' + (dat.header || this.header ||'Header') + '</h3>'; 
			text += '<form class="inactive">'; 
			
			//create labels and inputs for all of the inputs in the array 
			_.each(this.inputs.concat(dat.inputs || []), function(input){ 
				//wrap each input in a div if toggle state is set 
				//this is so that we can put a +/x button on the right of the input 
				if(input.label) text +=		'<label>' + input.label + '</label>'; 
				if(form.allowToggleState) text+= '<div>'; 						
					text +=		input.type == 'textarea' ? '<textarea ': '<input type="' + (input.type || 'text') + '"'; 
					text +=		'name = "' + (input.name || '') + '"'; 
					text +=		'placeholder="' + (input.text || '') + '"'; 
					text +=		input.type == 'file' ? 'style="display:none">' : '>'; 
					text +=		input.type == 'textarea' ? '</textarea>': '</input">'; 
					if(input.type =='file') text+= '<a class="formImg" style="background-image:url(' + "'" + input.src +"'" + ')"></a>'; 
					if(form.allowToggleState) text+= '<a class="deletebtn">X</a>'; 
				if(form.allowToggleState) text+= '</div>'; 
			}); 

			//submit button
			text+= '<input type="submit" class="Button" disabled="disabled" value="' + (this.submitVal || this.model.get('submitVal') || 'Submit') + '"></input>'; 
			text += '</form>'; 
			return _.template(text); 
		}, 
		//collection of standard editing things 
		inputs: [],
		allowToggleState: false, 
		changeFile: function(ev){ 
			var input = this.$el.find('input[type=file]'); 
			input.trigger('click'); 
			return this; 
		}, 
		setImage: function(ev){ 
			var input, file; 
			input = ev.target; 
			file = input.files[0]; 

			//create a url from the img 
			this.$el.find('.formImg').css('background-image', 'url("' + URL.createObjectURL(file) + '")'); 
			this.toggleSubmit(); 
			return this; 
		}, 
		toggleState: function(targ, len){ 
			var del; 
			del = $(targ).siblings('.deletebtn'); 

			//toggle 
			if(len > 0) { // zero-length string AFTER a trim 
		        del.fadeIn(); 
		    }else{
		    	del.fadeOut(); 
		    }
			return this; 
		}, 
		toggleActive: function(ev){
			var form = this.$el.find('form'); 
			(form.css('display') !== 'none')? form.fadeOut(): form.fadeIn(); 
			return this; 
		},
		toggleSubmit: function(){
			var form, submit, inputs, hasValue;
			form = this; 				
			submit = this.$el.find('input[type=submit]'); 
			inputs = this.$el.find('input[type!=submit], textarea'); 
			hasValue = false; 

			_.each(inputs, function(input){
				var len; 
				len  = $.trim(input.value).length; 

				// zero-length string AFTER a trim
				if(len !== 0) hasValue = true; 
			    form.toggleState(input, len); 
			}); 

			if(!hasValue){
				submit.addClass('disabled');
			    submit.attr('disabled', true); 
			}else{
				submit.removeClass('disabled');
			    submit.attr('disabled', false); 
			}
			return this; 
		},
		deleteInput: function(ev){
			var input, btn, submit; 
			btn = $(ev.target); 				
			btn.siblings('input, textarea').val(''); 
			btn.fadeOut(); 
			this.toggleSubmit(); 
			return this; 
		},
		/*****************/
		/*SETTING AND GETTING DATA: 
		/*setFormData, getFormData, and send should be specified for every form class
		/*This is because their data might be of different types and needs to be collected/sent in different ways
		/*Ex: CSS will alter css objects, content will alter the data on the model etc
		/*Default: CSS, simply because there are more CSS values to modify 
		/*****************/
		getFormData: function(ev){
			var ret = {}; 

			//get reference to current view from edit target 
			_.each(this.$el.find('input[type!=submit]'), function(input){
				//get the name 
				var name, val; 
				name = input.name,

				//get value
				val = input.value || null; 

				//put in into the return object 
				ret[name] = val; 

			})
			return ret; 
		},
		setFormData: function(ev, view){
			var form = this; 
			_.each(this.$el.find('input[type!=submit]'), function(input){
				//get the name
				var name, val; 
				name = (form.model.has('pseudoClass'))?
					'&:' + form.model.get('pseudoClass'):				
					input.name;

				//find that value in the css object of the view
				if(view.css.has(name)){
					if(typeof (view.css.get(name)) === 'object'){
						val = view.css.get(name)[input.name];
					}else{
						val = view.css.get(name);
					}
				}else{
					val = null; 
				}
				//val = view.css.get(name) || null; 

				//set that value on the input or none (we dont want to accidentally set values on the objects)
				input.value = val; 
			})
			return this; 
		}, 
		/*send: function(dat){
			var target = this.model.get('edit').target; 
			target.css.set(dat); 
			target.$el.css(dat); 
			return this; 
		},*/
		send: function(dat){
			var target = this.model.get('edit').target, 
				pageView = this.model.get('edit').model.get('page').get('page').view; 

			if(this.model.has('pseudoClass')){
				var dummy = {}; 
				dummy['&:'+ this.model.get('pseudoClass')] = dat; 
				target.css.set(dummy); 
			}else{
				target.css.set(dat); 
				target.$el.css(dat); 
			}

			pageView.renderCSS(); 
			
			return this; 
		},
		submit: function(ev){ 
			var formData; 
			ev.preventDefault(); 

			//get form data 
			formData = this.getFormData(); 

			//send to action or alternative 
			this.send(formData); 
		}
	});  
	return Form; 
}); 