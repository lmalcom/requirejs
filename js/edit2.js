var State = Backbone.Model.extend({ 
	defaults:{},
	url:'/saveState', 
	initialize:function(attributes){  
		this.set({ 
			timeStamp : new Date 
		}) 
	}, 
	exportHTML : function(){ 
		var parent = this; 
		var coll = this.get('collection'); 
		var HTML = '<html><head><style>' +  $('style').text()  + '</style></head><body><div id="' + controller.cid + '">'; 

		//add html text from each block
		coll.each(function(block){
			HTML += block.exportHTML(); 
		});

		HTML += '</div></body></html>'; 

		/*send HTML through AJAX*/
		var data = {
			htmlText : HTML
		}
		$.ajax({ 
			type:'POST', 
			url:'/save', 
			data: JSON.stringify(data), 
			success: function(response){ 
				console.log('success!', response); 
			}, 
			error : function(error){
				console.log('error', error); 
			}, 
			contentType: "application/json; charset=utf-8",
    		dataType: "json"
		}); 
	},
	render: function(){
		//create a controller
		//give the collection to the controller 
		//render the controller in a new window
	}
}); 

var TextAreaView = BlockView.extend({
	tagName : 'textArea',
	className: BlockView.prototype.className + ' textArea'
}); 
var TextArea = Block.extend({
	defaults : _.extend({}, Block.prototype.defaults, {
		view: TextAreaView, 
		defaultCSS: _.extend({}, Block.prototype.defaults.css, {
			'background':'rgba(150,150,150, .7)',  
		})
	}), 
}); 

var FieldsetView = BlockView.extend({
	className: BlockView.prototype.className + ' fieldset',
	events : {
		'click legend':'toggleHide',
	},
	template : function( form ){
		//set css form
		if(this.model.get('parent').get('edit') == 'css'){
			_.extend(form, {pseudoClass:this.model.get('parent').get('pseudoClass')}); 
			return _.template('<form><fieldset><legend> <% if(pseudoClass){ print ( pseudoClass )}else{print("CSS:")}  %></legend> <div class="fields"><% for(var prop in form){ %><%= prop %> : <input name=<%= prop %> type="text"><br> <% } %>  </fieldset></div></form>', form); 
		
		//set content form
		}else if(this.model.get('parent').get('edit') == 'content'){
			return _.template('<form><fieldset><legend> Content:</legend> <div class="fields"><% for(var prop in form){ %><%= prop %> : <input name=<%= prop %> type="text"><br> <% } %>  </fieldset></div></form>', form); 
		}		
	}, 
	toggleHide: function(){
		if(this.$el.find('div').css('display') == 'none'){
			this.$el.find('div').fadeIn(); 
		}else{
			this.$el.find('div').fadeOut(); 
		}
	},
	render   : function(){
		var form; 

		//set css form
		if(this.model.get('parent').get('edit') == 'css'){
			form = _.omit(this.model.get('css').toJSON(), 'parent', 'active'); 

		//set content form
		}else if(this.model.get('parent').get('edit') == 'content'){
			form = {
				video: '', 
				image:'', 
				text:'', 
			}
		}
		this.$el.html(this.template( {form: form} )); 
		return this; 
	},
	objectifyForm : function(){
		var ob = {};
	    var a = this.$el.children('form').serializeArray();
	    //put peices of array into the object
	    $.each(a, function() {
	    	//check that it has a name property
	        if (ob[this.name] !== undefined) {
	        	//reject arrays
	            if (!ob[this.name].push) {
	            	//if its not null
	            	if(ob[this.name] != null){
	            		//set property
	            		ob[this.name] = [ob[this.name]];
	            	}
	                
	            }
	            ob[this.name].push(this.value || '');
	        } else {
	            ob[this.name] = this.value || '';
	        }
	    });

	    //delete blank values
		for(var prop in ob){
			if(ob[prop] == null || ob[prop] == ''){
				delete ob[prop];
			}
		}
	    return ob;
	}
}); 
var Fieldset = Block.extend({
	defaults: _.extend({}, Block.prototype.defaults, {
		view: FieldsetView, 
		defaultCSS: {
			'max-height':'300px', 
			'overflow-y':'auto', 
		},
	})
}); 

var FormView = PanelView.extend({
	className: PanelView.prototype.className + ' form', 
	//TEMPLATE
	//should have form as the tagname, and the type should
	//be determined by the type in the model (text, file, date etc)
	//type should be an array of strings that will be placed into the template (forEach create a new input) 
	events : { 
		'click .button' : 'change',
	}, 
	change : function(event){ 
		var parent = this; 
		switch($(event.target).text()){ 
			case 'save': 
				this.changeContent(event); 
			case 'clear': 
				this.model.clearFormData(); 
		}	
	}, 
	changeContent: function(event){
		console.log('saving content'); 
		if(this.model.get('edit') == 'css'){
			this.model.changeCSS(); 
		}else{
			this.model.changeContent(event); 
		}
	}
	
}); 
var Form = Panel.extend({ 
	defaults: _.extend({}, Panel.prototype.defaults, { 
		view:FormView, 
		defaultCSS : _.extend({}, Panel.prototype.defaultCSS, { 
			'min-width':'260px',
			'position':'relative', 
			'-webkit-box-shadow': '3px 0px 15px 2px rgba(10, 10, 10, .4)', 
			'box-shadow': '3px 0px 15px 2px rgba(10, 10, 10, .4)', 
		})
	}), 
	initialize: function( attributes ){ 
		var coll = []; 
		coll.push(new Fieldset); 
		coll.push(new RedButton({ 
					text:'save', 
					css:{ 
						'position':'absolute', 
						'right':'15px', 
						'top':'0',
						'line-height':'2.3' 
					}
				})); 
		/*coll.push(new RedButton({ 
					text:'clear', 
					css:{ 
						'position':'absolute', 
						'right':'60px', 
						'top':'0',
						'line-height':'2.3' 
					}
				})); */
		this.set({collection : new Backbone.Collection(coll)}); 
		Panel.prototype.initialize.call(this, attributes); 	
	},
	changeCSS: function(){ 
		//compile the form data as a object, reject null values
		if(this.get('edit') === 'css'){
			//get form
			var css = {}; 

			//keep pseudoClass and form object as a key value pair
			if(this.has('pseudoClass')){
				css[this.get('pseudoClass')] = this.get('collection').at(0).get('elView').objectifyForm(); 
			
			//otherwise just fill the object with the key value pairs of the form
			}else{
				css = this.get('collection').at(0).get('elView').objectifyForm(); 
			}	
			//set it as the css for the current block 
			var block = window.controller.get('current'); 
			console.log(css); 
			block.trigger('changeCSS', css); 
		}	
	}, 
	changeContent: function(){ 
		if(this.get('edit') == 'content'){
			//get form
			var content = this.get('collection').at(0).get('elView').objectifyForm(); 		

			//set it as the css for the current block 
			var block = window.controller.get('current'); 
			block.trigger('changeContent', content); 
		} 
	}, 
	clearFormData: function(){ 
		this.get('$el').find('input').val(''); 
	}, 
	setFormData: function(){ 
		//Current is either an editable block (has a block) or a panel (and has a collection) 
		var block = (window.controller.get('current').has('block'))? window.controller.get('current').get('block') : window.controller.get('current'); 
		
		//edit CSS 
		if(this.get('edit') === 'css'){ 
			//clear out form 
			this.clearFormData(); 
			var parent = this; 

			//get active CSS properties 
			var active = block.get('css').get('active'); 

			// find properties in the children and set them 
			if(pseudo = this.get('pseudoClass')){ 
				if(pseudoCSS = active[pseudo]){  
					_.each(pseudoCSS, function(value, key, list){ 
						parent.get('$el').find('input[name="'+ key +'"]').val(value); 
					}); 
				} 
			}else{ 
				_.each(active, function(value, key, list){ 
					parent.get('$el').find('input[name="'+ key +'"]').val(value); 
				}); 
			}
		
		//else edit content (only for editable blocks)
		}else{
			var parent = this;
			var props = _.extend({
				'video':'', 
				'image':'', 
				'text':''
			},_.pick(block.toJSON(), 'video', 'image', 'text')); 
			_.each(props, function(value, key, list){
				parent.get('$el').find('input[name="'+ key +'"]').val(value || '');
			}); 
		}
		
	},
}); 

var FormContainerView = PanelView.extend({
	className: PanelView.prototype.className + ' formContainer', 
	events: _.extend({}, PanelView.prototype.events, {
		'click > .button':'checkButton'
	}), 
	checkButton : function(event){
		if($(event.target).text() == 'Save State'){
			controller.saveState(); 
		}else if($(event.target).text() == 'Export Page'){
			controller.exportHTML(); 
		}else if($(event.target).text() == 'Hide Editing Panel'){
			this.hide(); 
		}
	},
}); 
var FormContainer = Panel.extend({
	defaults:_.extend({}, Panel.prototype.defaults, {
		view: FormContainerView, 
		defaultCSS: _.extend({}, Panel.prototype.defaults.css, { 
			'display':'none', 
			'width':'auto', 
			'height':'100%',
			'width':'260px', 
			'min-width':'260px',
			'min-height':'0',
			'position':'absolute', 
			'transition':'none',
			'-webkit-transition':'none',
			'overflow':'auto', 
			'background-color':'rgba(0,0,0,.2)', 
			'color':'rgb(200,200,200)',
			'z-index':'1000', 
			'overflow':'visible', 
			'-webkit-box-shadow': '3px 0px 15px 2px rgba(10, 10, 10, .4)', 
			'box-shadow': '3px 0px 15px 2px rgba(10, 10, 10, .4)', 
			'legend:hover' : {
				'cursor':'pointer'
			}	
		}), 
		display: { 
			type:'rows', 
			distribution:'even'
		} 
	}), 
	initialize: function( attributes ){
		Panel.prototype.initialize.call(this, attributes); 
		document.on('clear', this.hide, this); 

		//COLLECTION OF FORMS
		//if attributes has different types of editing options, should create a mini panel for them 
		//Example forms: css, content, script 
		var coll = []; 

		//create forms for each type of edit to be made 
		if(attributes){ 			
			if(attributes.edit.css){ 
				coll.push(new Form({edit:'css'})); 		
				coll.push(new Form({edit:'css', pseudoClass:'&:hover'})); 		
				coll.push(new Form({edit:'css', pseudoClass:'&:active'}));
			} 
			if(attributes.edit.content) coll.push(new Form({edit:'content'})); 
			if(attributes.edit.script) coll.push(new Form({edit:'script'})); 		
		}	
		//create options buttons above
		coll.push(new RedButton({
			text:'Save State', 
			css : {
				'position':'absolute', 
				'left':'0', 
				'bottom':'0',
				'line-height':'2.5',
				'font-size':'.8em', 
			}
		})); 
		coll.push(new RedButton({
			text: 'Export Page', 
			css : {
				'position':'absolute',
				'left':'80px', 
				'max-width':'60px', 
				'bottom':'0',
				'font-size':'.8em', 
			}
		})); 
		coll.push(new RedButton({
			text: 'Hide Panel', 
			css : {
				'position':'absolute',
				'left':'150px', 
				'max-width':'60px', 
				'bottom':'0',
				'font-size':'.8em', 
			}
		})); 

		this.set({
			collection : new Backbone.Collection(coll)
		}); 
	}, 
	updateFormData: function(){
		//EACH set form data from current
		this.get('collection').each(function(block){
			if(block.setFormData) block.setFormData(); 
		})
	}
}); 

/*************************/ 
var EditableBlockView = DialogView.extend({ 
	className: 'editableBlock', 
	events : _.extend({}, DialogView.prototype.events, { 
		'contextmenu' : 'setEditable',
	}), 
	initialize: function(attributes){
		DialogView.prototype.initialize.call(this, attributes); 
		//set content if the model is already set
		if(this.model.has('video')){
			this.model.createVideo(this.model.get('video'));
		}else if(this.model.has('image')){
			this.model.createImage(this.model.get('image')); 
		}else if(this.model.has('text')){
			this.model.createText(this.model.get('text')); 
		}
	},
	setEditable : function(event){
		event.preventDefault(); 
		if(event.currentTarget == this.el){
			var contr = window.controller; 
			contr.set({current:this.model}); 	
			contr.showEditingPanel(); 
			event.stopPropagation(); 
		}
	}, 
}); 

var EditableBlock = Dialog.extend({ 
	defaults: _.extend({}, Dialog.prototype.defaults, { 
		view:EditableBlockView,
		isResizeable: true, 
		defaultCSS: _.extend({}, Dialog.prototype.defaults.defaultCSS, { 
			'width':'auto', 
			'height':'auto', 
			'min-height':'0', 
			'min-width':'0',
			'max-height':'auto', 
			'max-width':'auto'
		}), 
		isClose:false, 
	}), 
	initialize : function(attributes){ 
		Dialog.prototype.initialize.call(this, attributes); 
		this.set({block:new Block({
			css: {
				'width':'200px', 
				'height':'200px', 
				'max-height':'100%', 
				'max-width':'100%', 
				'text-align':'center',
				'border':'1px black dotted', 
				'background':'rgba(100, 100, 100, .7)', 
				'z-index':'0', 
				/*'overflow':'auto', 
				'resize':'both', */
				'&:hover':{ 
					'background':'rgba(0,0,20,1)', 
					'color':'white'
				}
			}
		})}); 
		//Events for changes CSS
		this.on('changeCSS', function(css){
			 this.changeCSS(css); 
		}); 

		//Events for changing content
		this.on('changeContent', function(content){
			this.changeContent(content); 
		}); 
	}, 
	changeCSS :  function(css){ 
		var block = this.get('block'); 
		//create an animation for visual feedback
		block.get('$el').css(css); 
		//set properties within the model for rerendering
		block.get('css').set(css); 
		//remove properties after feedback
		block.get('css').removeInlineStyles(); 

		//SPECIAL PARAMS that need to be changed in the dialog as well

		//change z-index of container as well so that it actually seems to work
		if (css['z-index']) this.get('$el').css({'z-index' : css['z-index']}); 
		//position 
		if (css['position']) this.get('$el').css({'z-index' : css['position']}); 		
	}, 
	changeContent: function(content){ 
		if(content){
			if(vid = content['video']){ 
				this.createVideo( vid ); 

			}else if(img = content['image']){ 
				this.createImage( img ); 

			}else if(text = content['text']){
			 	this.createText( text ); 

			}
		}else {
			this.createText( 'no content' ); 
		} 
		this.get('block').get('elView').render(); 
	}, 
	createVideo: function( video ){ 
		var block = this.get('block');
		block.set({video : video }); 
		block.createPlayer  =  Video.prototype.createPlayer, 
		block.onPlayerStateChange = Video.prototype.onPlayerStateChange; 
		block.loadVideo = Video.prototype.loadVideo; 
		block.stopVideo = Video.prototype.stopVideo; 
		document.on('rendered',this.setPlayer, this); 

		//unset other block attributes
		if(block.has('image')){ 
			block.unset('image'); 
		}else if(block.has('text')){
			block.unset('text'); 
		}
	},
	createImage: function( img ){
		var block = this.get('block');
		block.set({image:img}); 
		block.get('elView').template = ImageView.prototype.template; 

		//unset other block attributes
		if(block.has('video')){
			block.unset('video'); 
		}else if(block.has('text')){
			block.unset('text'); 
		}
	},
	createText: function( text ){
		var block = this.get('block');
		block.set({text:text, title:null}); 
		block.get('elView').template = TextView.prototype.template; 

		//unset other block attributes
		if(block.has('image')){
			block.unset('image'); 
		}else if(block.has('video')){
			block.unset('video'); 
		}
	},
	checkCoordinates : function(event){
		var ulX = this.get('x'); 
		var ulY = this.get('y'); 
		var brX = this.get('x') + this.get('$el').width(); 
		var brY = this.get('y') + this.get('$el').height(); 
		if( (ulX < event.pageX ) && (brX > event.pageX) && (ulY < event.pageY ) && (brY > event.pageY) ) {
			this.set({isClose:true}); 
		}else{
			this.set({isClose:false}); 
		}
	}, 
	exportHTML : function(){
		var block = this.get('block'); 
		var x = this.get('x'); 
		var y = this.get('y'); 
		//for videos copy the video id into the iframe, required because this does NOT use the JS api 
		if(block.has('video')){ 
			var HTMLstring = '<div id="' + this.cid + '" style="-webkit-transform : translate(' + x + 'px, ' + y + 'px); -moz-transform : translate(' + x + 'px, ' + y + 'px);"><div id="' + block.cid +  '"><iframe frameborder="0" style="width:100%; height:100%"  allowfullscreen="1" title="YouTube video player" src="http://www.youtube.com/embed/' + block.get('video') + '?autoplay=1&wmode=transparent"></iframe></div></div>'
			return HTMLstring; 
		}else{ 			
			var HTMLstring = '<div id="' + this.cid + '" style="-webkit-transform : translate(' + x + 'px, ' + y + 'px); -moz-transform : translate(' + x + 'px, ' + y + 'px);"><div id="' + block.cid +  '">' + block.get('el').innerHTML + '</div></div>'
			return HTMLstring; 
		} 
	},
	setPlayer : function(){
		if(this.get('block') && this.get('block').createPlayer){
			this.get('block').createPlayer();  
		}
	},
	highlight : function(){
		this.get('$el').css({
					'-webkit-box-shadow': '0px 0px 10px 5px rgba(100, 100, 150, 1)', 
					'box-shadow': '0px 0px 10px 5px rgba(100, 100, 150, 1)', 
				}); 
	}, 
	unhighlight : function(){
		this.get('$el').css({
					'-webkit-box-shadow': 'none', 
					'box-shadow': 'none', 
				}); 
	}
}); 

/*************************************************/ 
var EditablePanelView = DialogView.extend({
	events : EditableBlockView.prototype.events, 
	setEditable : EditableBlockView.prototype.setEditable,
	check : EditableBlockView.prototype.check
}); 
var EditablePanel = Dialog.extend({ 
	defaults : {
		view : EditablePanelView,
		defaultCSS : _.extend({}, Dialog.prototype.defaults.defaultCSS, {
			'width':'auto', 
			'height':'auto', 
			'max-height':'auto', 
			'max-width':'auto', 
			'min-height':'0', 
			'min-width':'0',
			'border':'1px black dotted', 
			'background':'rgba(50, 50, 50, .7)', 
			'padding':'10px', 
			'z-index':'0', 
			'&:hover':{ 
				'background':'rgba(0,0,20,1)', 
				'color':'white'
			}
		}) 
	}, 
	initialize: function( attributes ){ 
		Panel.prototype.initialize.call(this, attributes); 
		//Events for changes CSS 
		this.on('changeCSS', function(css){ 
			 this.changeCSS(css); 
		}); 
	}, 
	changeCSS :  function(css){ 
		//create an animation for visual feedback
		this.get('$el').css(css); 
		//set properties within the model for rerendering
		this.get('css').set(css); 		
		//remove properties after feedback
		this.get('css').removeInlineStyles('-webkit-transform', 'transform'); 
	}, 
	exportHTML : function(){
		var coll = this.get('collection'); 
		var x = this.get('x'); 
		var y = this.get('y'); 
		//render out each block HTML	
		var HTMLstring = '<div id="' + this.cid + '" style="-webkit-transform : translate(' + x + 'px, ' + y + 'px); -moz-transform : translate(' + x + 'px, ' + y + 'px);">';
		
		coll.each(function(block){
			HTMLstring += block.exportHTML(); 
		}); 

		HTMLstring += '</div>'
		return HTMLstring; 
	},
	checkCoordinates: EditableBlock.prototype.checkCoordinates
}); 

/***************************************************/
var EditControllerView = ControllerView.extend({ 
	events : { 
		'click':'addBlock', 
		'contextmenu' : 'showEditingPanel', 
		'mouseup .editableBlock' : 'joinChildren' 
	}, 

	//create block centered on that spot 
	addBlock : function(event){ 
		//add model to collection 
		if(event.target === this.el){ 
			//clear out other 
			document.trigger('clear'); 
			var block = new EditableBlock({ 
				x:event.pageX - 100, y:event.pageY - 100, 
			}) 
			bv = new EditableBlockView({model:block}); 
			this.model.get('collection').add(block); 
			$(this.el).append(bv.render().el); 
 
			//add CSS 
			this.renderCSS(); 
		} 
	}, 
	joinChildren: function(){ 
		this.model.joinChildren(event); 
	}, 
	showEditingPanel: function(event){ 
		event.preventDefault(); 
		this.model.showEditingPanel(event); 
	}, 
}); 
var EditController = Controller.extend({ 
	defaults: _.extend({}, Controller.prototype.defaults, { 
		view : EditControllerView, 
	}), 
	initialize: function(attributes){ 
		Controller.prototype.initialize.call(this, attributes);
		this.on('childIsDragging', this.highlight, this); 
		this.on('showEditingPanel', this.showEditingPanel, this); 
		window.controller = this; 		

		this.set({
			collection : new Backbone.Collection([new FormContainer({
													edit: {
														css:true, 
														content:true
													}, 
												})
						]), 
			states : new Backbone.Collection
		})		
	},  
	highlight: function(){
		this.get('collection').each(function(block){ 
			//highlight if 
			if(block.get('isClose') == true){ 
				block.get('collection').at(0).highlight(); 
			}else{ 
				//if(block !== controller.get('form')){
					//block.get('collection').at(0).unhighlight(); 
				//}				
			} 
		}); 
	}, 
	joinChildren : function(){ 

		this.get('collection').each(function(block){ 
			if(block.checkCoordinates) block.checkCoordinates(event); 
		}); 

		var closeChildren = this.get('collection').where({ 
			isClose: true 
		}); 

		//if two or more children are close together, add them 
		if(closeChildren.length > 1){  
			this.createPanel(closeChildren); 
		} 
	}, 
	createPanel: function(closeChildren){ 
		var coll = this.get('collection'), controller = this, parent, editablePanel; 

		_.each(closeChildren, function(block, index, list){ 
			//check to make sure they are not already in a panel 
			if(block.has('collection')){ 
				parent = block; 
				list.splice(index, 1);  
				return; 
			} 
		}) 
		if(parent){ 
			//put everyone into the same panel
			editablePanel = parent; 
			editablePanel.get('collection').add(closeChildren); 
		}else{
			//create a new one
			var editablePanel = new EditablePanel({
				x : closeChildren[0].get('x'), 
				y : closeChildren[0].get('y'), 
				isDraggable:true,
				display: {
					type:'inline'
				}
			}); 
			editablePanel.set({
				collection : new Backbone.Collection(closeChildren), 
			}); 
			//editablePanel.changePosition(); 
		}

		//dont allow inner panels to move around (for now)
		editablePanel.get('collection').each(function(block){
			block.set({
				isDraggable:false, 
				x:0, 
				y:0
			}); 
			//change the dialogs to no longer be absolute to not 
			block.get('css').set({
				'position':'relative'
			}); 
		})

		//fix the window's collection 
		window.controller.get('collection').remove(closeChildren); 
		window.controller.get('collection').add(editablePanel); 
		//rerender controller collection 
		window.controller.get('elView').render(); 
	}, 
	exportHTML : function(){ 
		console.log('exporting!!'); 
		if(this.get('states').length > 0 ){ 
			state = this.get('states').at(this.get('states').length - 1); 
			state.exportHTML(); 
		} 
	},
	showEditingPanel: function(event){ 
		var form = this.get('collection').at(0); 
		form.updateFormData();
		form.show();
	}, 
	saveState: function(){ 
		console.log('saving state'); 
		var coll = this.get('collection').clone(); 

		//get rid of the forms
		coll.remove(coll.at(0)); 

		//temp save
		var state = new State ({collection: coll}, {urlRoot:'/saveState'});
		this.get('states').add(state); 

		//save to server 
		//state.save(); 
	}, 
	loadState: function(){ 
		var coll = this.get('collection'), 
		states = this.get('states'); 
		var latestState = states.at(states.length - 1), 
		stateColl = latestState.get('collection'); 

		//reset collection and fill with the blocks in the collection 
		coll.reset([coll.at(0)]);
		coll.add(stateColl.slice(0, stateColl.length)); 
		this.get('elView').render();  
	}
}); 

/*FUNCTIONS************************************/

/*setup for the page!!!************************/ 
$(document).ready(function(){ 
	var controller = new EditController({
		edit : {
			css:true, 
			content:true
		}
	}); 
	var cv = new EditControllerView({model:controller}); 
	cv.render(); 
}) 