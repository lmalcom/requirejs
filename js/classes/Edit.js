define(['require', 'CSS','Block', 'Panel', 'Page', 'Form', 'ColorForm', 'PublishForm','Button'], function(require, CSS, Block, Panel, Page, Form, ColorForm, PublishForm,Button){ 
	'use strict'; 
	var Edit = Page.extend({ 
		//default settings for adding objects 
		className: 'Edit', 
		events: { 
			'click':'hide', 
			'click .Button':'save' 
		}, 
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, { 
			'@bgcolor': 'rgba(0,0,0, .5)', 
			'background':'@bgcolor', 
			'z-index': '2', 
			'display':'none', 
			'& > .Panel':{ 
				'width':'25%', 
				'height':'100%', 
				'background-color':'darken(@bgcolor, 30%)' 
			}, 
			'.Form:hover':{
				'background-color':'lighten(@bgcolor, 30%)', 
			},
			//the container panel for the buttons
			'.Panel .Panel': {
				'height': '60px', 
				'position':'absolute', 
				'bottom':'0', 
				'left':'0', 
			},
			'.Panel .Panel .Button':{ 
				'position':'relative', 
				'width':'33%', 
				'display':'inline-block'
			}, 
		}), 
		brushSettings: { 
			modelProps: {}, 
			viewProps: { 
				css: { 
					'position':'fixed',
					'width':'200px', 
					'height':'200px', 
					'max-height':'100%', 
					'max-width':'100%', 
					'text-align':'center',
					'border':'1px black dotted', 
					'background-color':'rgba(100, 100, 100, .7)', 
					'z-index':'0', 
					'&:hover':{ 
						'background-color':'rgba(0,0,20,1)', 
						'color':'white'
					},
				}
			}
		}, 
		initialize: function(options){ 
			var edit, inputs; 
			edit = this; 
			Page.prototype.initialize.call(this, options); 

			//initialize basic forms for the edit page
			if(!this.model.subcollection){
				this.model.subcollection = new Backbone.Collection([ 
					new Backbone.Model({defaultView: 'Panel'}, {
							subcollection: new Backbone.Collection([
								new Backbone.Model({defaultView: 'ColorForm', edit: edit}),
								new Backbone.Model({defaultView: 'PublishForm', edit: edit}),  
								new Backbone.Model({defaultView: 'Panel'}, {
									subcollection: new Backbone.Collection([
										new Backbone.Model({text:'Save', defaultView: 'Button', message:'save'}), 
										new Backbone.Model({text:'Load', defaultView: 'Button', message:'load'}), 
										new Backbone.Model({text:'Publish', defaultView: 'Button', message:'publish'}) 
									])
								})
								
							]), 						
					})
				]); 
			}			

			//set listeners for the page and subviews 
			if(this.model.has('page')){ 
				var page; 
				page = this.model.get('page').get('page'); 

				page.view.$el.on('contextmenu', function(event){ 
					event.preventDefault(); 
					Panel.prototype.show.call(edit); 
				}); 
				page.view.$el.on('click', function(){ 
					Panel.prototype.hide.call(edit); 
				});
				edit.listenTo(page.view, 'click', edit.addBlock); 
				_.each(page.view.subviews, function( view ){ 
					edit.listenTo(view, 'click', edit.edit); 
				});
			}

			//event handlers
			//this.listenTo(this.model.subcollection, 'save', this.save); 

		},
		//create block centered on that spot 
		addBlock : function( event, stateJSON ){ 
			if(event.target == this.model.get('page').get('page').view.el){
				//vars
				var state, width, height, pageModel, pageView; 
				pageModel = this.model.get('page').get('page').model; 
				pageView = this.model.get('page').get('page').view; 
				state = stateJSON.viewProps ? stateJSON : this.brushSettings ; 
				width = (state.viewProps && state.viewProps.css && state.viewProps.css.width)? parseFloat(state.viewProps.css.width) : 0; 
				height = (state.viewProps  && state.viewProps.css && state.viewProps.css.height)? parseFloat(state.viewProps.css.height) : 0; 
			
				//create model and view 
				state = controller.initializeState(state); 

				//add to collections 
				if(!pageModel.subcollection) pageModel.subcollection = new Backbone.Collection; 
				pageModel.subcollection.add(state.model); 
				pageView.subviews.push(state.view); 

				//set X/Y 
				state.view.x = event.pageX - width/2; 
				state.view.y = event.pageY - height/2; 

				//listen to object 
				this.listenTo(state.view, 'click', this.edit); 
				this.edit(event, state.view); 

				//render html and css 
				$(pageView.el).append(state.view.render().el); 
				pageView.renderCSS(); 
			}
			
			//return this; 
			return this; 
		}, 
		edit: function(event, view){ 
			this.target = view; 
			this.trigger('change:target', event, view); 
			//insert visual effect for feedback 
			return this; 
		}, 
		//
		showEditingPanel: function(event){ 
			event.preventDefault(); 
			this.model.showEditingPanel(event); 
			return this; 
		}, 
		joinChildren: function(){}, 
		render: function(){ 
			var panel = this; 
			//generic render call 
			Panel.prototype.render.call(this); 

			//but append to modules 
			$('#modules').append(this.el); 

			//render css
			this.renderCSS(); 

			//event handlers for children 
			_.each(this.subviews, function(subview){
				panel.listenTo(subview, 'save', panel.save); 
			})			

			return this; 
	   	}, 
	   	hide: function(ev){ 
	   		if(ev.target === this.el){
	   			Panel.prototype.hide.call(this); 
	   		}
	   		return this; 
	   	}, 
	   	save: function(ev){
	   		var text = $(ev.target).text(); 
	   		if( text === 'Save'){
	   			controller.saveState(null, 'test', 'local', function(){
	   				alert('saved the page state!'); 
	   			}); 
	   		}else if( text === 'Publish'){
	   			console.log('publishing!'); 
	   			this.publish(); 
	   		}else if( text === 'Load' ){ 
				console.log('loading!');
	   		}
	   		return this; 
	   	}, 
	   	load: function(name){
	   		//show loading modal
	   	}, 
	   	publish: function(name){ 
	   		controller.saveState(null, name || 'test', 'server', function(){ 
	   				alert('saved the page state!'); 
	   			}); 
	   		return this; 
	   	}, 
	}); 

	return Edit; 
})