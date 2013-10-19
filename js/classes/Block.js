define(['CSS'], function(CSS){
	//Dependencies and base className */ 
	var Block; 
	Block =  {}

	/*BLOCK is a VIEW*/ 
	Block = Backbone.View.extend({ 
		//BACKBONE PROPERTIES AND FUNCTIONS
			id: function(){return this.className + '_' + this.cid},						
		    className: 'Block', 				
			template: 	_.template(''), 

		//View Properties
			x: 0, 
		    y: 0, 
		    z: 0,
			autohide: false,  
			immutableCSS: false, 
			defaultCSS 	: {
				'display':'inline-block',
				'width':'100%', 
				'height':'100%',
				'transition':'all .5s', 
				'-webkit-transition':'all .5s', 
				'-moz-transition':'all .5s'
			},

		//View Methods
			initialize: function( attributes ){
				var view = this; 
				
				//model events
				this.listenTo(this.model, 'change', this.render); 
				this.listenTo(this.model, 'destroy', this.remove); 

				//general events
				this.on('hide', this.hide, this); 
				this.on('show', this.show, this); 
				this.$el.on('click', function(e){
					view.trigger('click', e, view); 
				}); 

				//initialize css from defaults and attributes, also set parent attribute
				if(attributes){
					this.x = attributes.x || 0; 
					this.y = attributes.y || 0; 
					this.z = attributes.z || 0; 
					this.parent = attributes.parent || null; 
				}
				this.css =  new CSS(((!this.immutableCSS)? (attributes.css || {}) : {}), {parent:view}); 
			},
			hide: function(){
				var view, deferred; 
				view = this; 

				if(view.$el.css('opacity') != 0){
					view.$el.css({'opacity':'0'})

					//on transition end set display to none
					.one('transitionEnd webkitTransitionEnd mozTransitionEnd', function(ev){
						if(ev.originalEvent.propertyName === 'opacity'){
							view.$el.css({
								'display':'none', 
							}); 
						}					
					}); 
				}else{
					view.$el.css({'display':'none'}); 
				}				

				//if the element has a youtube player stop it
				if(player = this.player){
					player.stopVideo(); 
				} 
				return this; 
			}, 
			show: function(){  
				var view, display; 
				view = this, 
				display = this.defaultCSS.display !== 'none'? this.defaultCSS.display : 'inline-block'; 
				this.$el.css({
					'display': display, 
				})
				//on transition end set display to none
				.css({
					'opacity':'1', 
				}); 
			}, 

		//RENDERING FUNCTIONS 
			render: function(){ 
				this.$el.html(this.template(this.model.toJSON())); 
				return this; 
			}, 
			remove: function(){
				Backbone.View.prototype.remove.call(this);

				//remove all event listeners
				this.off(); 

			},
			saveState: function(){
				var state, arr; 
				state = {}; 

				//set model and view
				state.viewProps = this.toJSON(); 
				state.modelProps = this.model.toJSON(); 

				return state; 
			},
			toJSON: function(){ 
				return {
						x: this.x, 
					    y: this.y, 
					    z: this.z,
						autohide: this.autohide,  
						immutableCSS: this.immutableCSS, 
						//get active css but omit the class default CSS
						css: this.css.get('active'), 
						/*css: _.omit(this.css.get('active'), _.keys(this.defaultCSS)), */
						className: this.className
					}
			}
	});	
	return Block; 
}); 