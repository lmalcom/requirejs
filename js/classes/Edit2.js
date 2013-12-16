define(['require', 'CSS','Block', 'Panel', 'Page', 'Form', 'ColorForm', 'BorderForm', 'PublishForm','Button', 'LiveButton', 'ObjectSettingsPanel', 'BrushesPanel', 'MetaSettingsPanel', 'LiveSettingsPanel'], function(require, CSS, Block, Panel, Page, Form, ColorForm, BorderForm, PublishForm, Button, LiveButton){ 
	'use strict'; 
	var Edit2 = Page.extend({ 
		//default settings for adding objects 
		className: 'Edit2', 
		events: { 
			'contextmenu':'hide', 
			'click .Button':'save', 
			'click #delete': 'deleteBlock', 
			'click .LiveButton': 'live', 
			'mousedown #editBox': 'dragEditBox'
		}, 
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, { 
			'@bgcolor': 'rgba(0,0,0, .5)', 
			'background':'@bgcolor', 
			'z-index': '2', 
			'display':'none', 
			'&>.Panel':{
				'float':'left', 
			},
			'.Button':{
				'border-radius':'0', 
				'user-select':'none'
			},
			//header panel
			'.Panel:nth-child(1)':{ 
				'width':'100%', 
				'height':'50px', 
				'.Block, .Panel':{
					'position':'relative', 
					'float': 'left', 
				},
				'.Button':{
					'width':'125px', 
					'min-width':'0',
				}, 
				//text header with edit and meta
				'.Panel':{
					'width': (window.innerWidth - 500) + 'px',
					'text-align':'center', 
					'background-color':'rgba(0,0,0,.5)', 
					'color':'rgb(175,175,175)',
					'p':{
						'margin':0, 
					}, 
					'h2':{ 
						'margin':'auto auto' 
					}, 
					'.TextBlock a': { 
						'margin-right': '15px' 
					}, 
					'.TextBlock a:hover':{ 
						'cursor': 'pointer', 
						'color':'rgb(50,50,150)' 
					}, 
				} 
			}, 
			//body panel
			'.Panel:nth-child(2)':{ 
				'& > .Panel':{ 
					'float':'left', 
					'height':'100%', 
				}, 
				//side panel
				'.Panel:nth-child(1)':{ 
					'width':'250px', 
					'overflow':'hidden', 
					//container panel that is as long as all of the panels inside (needed to create moving animation)
					'.Panel':{ 
						'position':'relative', 
						'float':'left', 
						'width':'500%', 
						'height':'100%', 
						//each panel inside 
						'.Panel':{
							'width':'250px',
						}, 
						'.ObjectSettingsPanel, .BrushesPanel':{
							'.Panel':{
								'width':'100%', 
							},
							//display area for info/content/style settings 
							'& > .Panel:nth-child(1)':{ 
								'height':'85%', 
								'width':'300%',  
								'& > *':{ 
									'height':'100%', 
									'width':'250px', 
									'float':'left', 
									'padding':'10px', 
									'p':{ 
										'text-align':'left' 
									} 
								} 
							},
							//buttons for info/content/style
							'.Panel:nth-child(2)':{
								'height':'15%', 
								'.Button':{
									'margin':0, 
									'width': (1/3)*100 + '%',
									'max-height':'100%'
								}
							},
						}, 
					},
				}, 
				//space for page
				'.Panel:nth-child(2)':{
					'width': window.innerWidth - 250 + 'px', 
				}, 
			},
			'*':{
				'transition':'all .25s', 
				'-webkit-transition':'all .25s', 
				'-moz-transition':'all .25s', 
				'box-sizing': 'border-box',
				'-moz-box-sizing': 'border-box',
				'-webkit-box-sizing': 'border-box',
			}, 
			'#delete':{
				'position':'absolute', 
				'background-color':'rgba(150,50,50,.8)', 
				'border-radius':'100%', 
				'text-align':'center', 
				'-moz-box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)', 
				'-webkit-box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)', 
				'box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)', 
				'-webkit-transition': 'none', 
				'-moz-transition': 'none', 
				'transition': 'none', 
			}, 
			'#delete:hover':{
				'background-color':'rgba(170,20,20,1)'
			}, 
			'#delete:active':{
				'background-color':'rgba(170,20,20,1)', 
				'height':'40px', 
				'-webkit-transform':'translateY(1px)', 
				'-moz-transform':'translateY(1px)', 
				'transform':'translateY(1px)'
			}, 
			'#editBox':{
				'position':'absolute', 
				'-moz-box-shadow': '0px 0px 20px 4px #77979A',
				'-webkit-box-shadow': '0px 0px 20px 4px #77979A',
				'box-shadow': '0px 0px 20px 4px #77979A',
				'cursor':'pointer', 
				'background-color':'rgba(60, 190, 231, 0.42)', 
				'user-select':'none',
				'-webkit-transition': 'none', 
				'-moz-transition': 'none', 
				'transition': 'none', 
			}, 
			'#editBox:hover':{
				'-moz-box-shadow': '0px 0px 48px 4px rgb(119, 151, 154)',
				'-webkit-box-shadow': '0px 0px 48px 4px rgb(119, 151, 154)',
				'box-shadow': '0px 0px 48px 4px rgb(119, 151, 154)',
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
					'background-color':'#ffb1fd', 
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
								new Backbone.Model({defaultView: 'Button', text: 'Current'}),
								new Backbone.Model({defaultView: 'Button', text: 'Brushes'}),
								new Backbone.Model({defaultView: 'Panel'}, {subcollection: new Backbone.Collection([
									new Backbone.Model({defaultView: 'TextBlock', inputs: [{text: 'Header', type:'h2'}, {text: 'edit name', type: 'a'}, {text: 'meta', type: 'a'}] }), 
								])}),
								new Backbone.Model({defaultView: 'Button', text: 'Publish'}),
								new Backbone.Model({defaultView: 'Button', text: 'Live'}),
							]), 						
					}), 
					new Backbone.Model({defaultView: 'Panel'}, {
							subcollection: new Backbone.Collection([
								new Backbone.Model({defaultView: 'Panel'}, {
									subcollection: new Backbone.Collection([
										new Backbone.Model({defaultView: 'Panel'}, {
											subcollection: new Backbone.Collection([
												//new Backbone.Model({defaultView: 'CurrentObjectPanel'}),
												new Backbone.Model({defaultView: 'ObjectSettingsPanel'}),
												new Backbone.Model({defaultView: 'BrushesPanel'}),												
												new Backbone.Model({defaultView: 'MetaSettingsPanel'}),
												new Backbone.Model({defaultView: 'PublishSettingsPanel'}),
												new Backbone.Model({defaultView: 'LiveSettingsPanel'}),
												]), 
										}), 
									]), 
								}), 
								new Backbone.Model({defaultView: 'Panel'})
							]), 
					}), 
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
					edit.listenTo(view, 'mouseover', edit.edit); 
				}); 
			} 

			//event handlers 
			//this.listenTo(this.model.subcollection, 'save', this.save); 
		}, 
		//create block centered on that spot 
		addBlock : function( event, stateJSON ){ 
			if(event.target == this.model.get('page').get('page').view.el){ 
				//vars
				//console.log('brush settings: ', this.brushSettings); 
				var state, stateOb, width, height, pageModel, pageView; 
				pageModel = this.model.get('page').get('page').model; 
				pageView  = this.model.get('page').get('page').view; 
				state 	  = stateJSON.viewProps ? _.extend({}, stateJSON) : _.extend({}, this.brushSettings); 
				width 	  = (state.viewProps && state.viewProps.css && state.viewProps.css.width)? parseFloat(state.viewProps.css.width) : 0; 
				height 	  = (state.viewProps  && state.viewProps.css && state.viewProps.css.height)? parseFloat(state.viewProps.css.height) : 0; 
			
				//create model and view 
				state.viewProps.parent = pageView; 
				stateOb = controller.initializeState(state); 
				

				//add to collections 
				if(!pageModel.subcollection) pageModel.subcollection = new Backbone.Collection; 
				pageModel.subcollection.add(stateOb.model); 
				pageView.subviews.push(stateOb.view); 

				//set X/Y 
				state.viewProps.x = event.pageX - width/2; 
				state.viewProps.y = event.pageY - height/2; 
				stateOb.view.x = event.pageX - width/2; 
				stateOb.view.y = event.pageY - height/2; 

				//listen to object 
				this.listenTo(stateOb.view, 'mouseover', this.edit); 
				this.edit(event, stateOb.view); 

				//render html and css 
				$(pageView.el).append(stateOb.view.render().el); 
				pageView.renderCSS(); 

				this.trigger('addBlock', state); 
			} 
			return this; 
		}, 
		deleteBlock: function(ev){ 
			var pageModel = this.model.get('page').get('page').model, 
				pageView = this.model.get('page').get('page').view; 

			//create visual feedback 
			$(ev.target).css('opacity', 0); 
			this.target.$el.fadeOut(); 

			//remove from view and model collections 
			pageModel.subcollection.remove(this.target.model); 
			pageView.removeFromCollection(this.target); 
			this.trigger('deleteBlock'); 

			return this; 

		}, 
		edit: function(event, view){ 		

			//trigger change event 
			this.moveEditBox(view).trigger('change:target', event, view); 			

			return this; 
		}, 
		moveEditBox: function(view){
			if(view) this.target = view; 
			var position = this.target.$el.offset(), 
				deleteBtn = this.$el.find('#delete'), 
				box = this.$el.find('#editBox'), 
				posy = position.top - 20, //20 is half of X button width and height 
				posx = position.left + this.target.$el.width() - 20; 
				if(view) this.target = view; 

			//insert X for deleting 
			deleteBtn.css({top:posy, left:posx}); 

			//shaded box for outline 
			box.css({
				'-webkit-transform' : 'translate(' + position.left + 'px, ' + position.top + 'px)',
				'-moz-transform' : 'translate(' + position.left + 'px, ' + position.top + 'px)',
				width:this.target.$el.width(), 
				height: this.target.$el.height()
			}); 
			return this; 
		},
		dragEditBox: function(ev){ 
			var edit = this; 
			var target = this.target; 
			var offsetX = parseFloat(target.x - ev.pageX); 
			var offsetY = parseFloat(target.y - ev.pageY);  
			var box = this.$el.find('#editBox');
			var deleteBtn = this.$el.find('#delete'); 

			//temporarily set their position transition to none 
			target.$el.css({
				'-webkit-transition': 'none', 
				'-moz-transition': 'none', 
				'transition': 'none', 
			}); 
			deleteBtn.css({'opacity': 0});

			function drag(newEv){ 
				var newX = newEv.pageX; 
				var newY = newEv.pageY; 
				var diffX = newX + offsetX; 
				var diffY = newY + offsetY;
				target.x = diffX; 
				target.y = diffY; 
				target.$el.css({
					'-webkit-transform' : 'translate(' + diffX + 'px, ' + diffY + 'px)',
					'-moz-transform' : 'translate(' + diffX + 'px, ' + diffY + 'px)',
					'transform' : 'translate(' + diffX + 'px, ' + diffY + 'px)',
				});
				box.css({
					'-webkit-transform' : 'translate(' + diffX + 'px, ' + diffY + 'px)',
					'-moz-transform' : 'translate(' + diffX + 'px, ' + diffY + 'px)',
				}); 
			}
			$(document).on('mousemove', drag)
			$(document).one('mouseup', function(){
				box.attr('style', ''); 
				edit.moveEditBox(); 
				deleteBtn.css({'opacity': 1});
				target.css.inline(); 
				$(document).off('mousemove', drag); 
			})
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

			//add modify box
			this.$el.append('<div id="editBox"></div><a id="delete" class="Button">X</a>'); 

			//render css
			this.renderCSS(); 

			//event handlers for children 
			_.each(this.subviews, function(subview){
				panel.listenTo(subview, 'save', panel.save); 
			})			

			return this; 
	   	}, 
	   	hide: function(ev){ 
	   		ev.preventDefault(); 
	   		//if(ev.target === this.el){
	   			Panel.prototype.hide.call(this); 
	   		//}
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
	   	live: function(ev){ 
	   		console.log('oh hey, creating a live page.......'); 
	   		//create a unique id 
	   		var edit = this, 
	   			page = this.model.get('page').get('page'), 
	   			json = page.view.saveState(); 

	   		$.ajax({
	   			type:'POST', 
				data: json, 
				url:'/createLive', 
				success: function(res){
					var res = JSON.parse(res), 
					pageId = res.pageId; 
					controller.get('router').navigate('/live/' + pageId, {trigger:true}); 

					edit.on('addBlock', function(state){
						controller.socket.emit('add', state); 
					})
				}, 
				error: function(err){
					console.log('Error: ', err); 
				}
			}); 	   		

	   		

	   		//set socket to send data to server when creating blocks 
	   	}, 
	   	publish: function(name){ 
	   		controller.saveState(null, name || 'test', 'server', function(){ 
	   				alert('saved the page state!'); 
	   			}); 
	   		return this; 
	   	}, 
	}); 

	return Edit2; 
})