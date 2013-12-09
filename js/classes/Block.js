define(['CSS'], function(CSS){
	//Dependencies and base className */ 
	var Block; 
	Block =  {}

	/*BLOCK is a VIEW*/ 
	Block = Backbone.View.extend({ 
		//BACKBONE PROPERTIES AND FUNCTIONS
			//id: function(){return this.className + '_' + this.cid},						
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
				var view, attrs, options; 
				view = this; 
				//model events
				this.listenTo(this.model, 'change', this.render); 
				this.listenTo(this.model, 'destroy', this.remove); 

				//general events
				this.on('hide', this.hide, this); 
				this.on('show', this.show, this); 
				this.$el.on('mouseover', function(e){
					view.trigger('mouseover', e, view); 
				}); 
				this.$el.on('click', function(e){
					view.trigger('click', e, view); 
				}); 

				//set properties onto the view
				this.id = this.el.id =this.el.classList[this.el.classList.length-1] + '_' + this.cid; 
				if(attributes){ 
					var keys = _.omit(attributes, 'model', 'css', 'className'); 
					_.each(keys, function(val, key, list){ 
						view[key] = val; 
					}) 
				}

				//add css 
				attrs = (!attributes.immutableCSS && attributes.css)? attributes.css: {}; 
				options = {parent:view}; 
				this.css =  new CSS(attributes.css, options);
			},
			inViewPort: function () {
			    var rect = this.el.getBoundingClientRect();

			    return (
			        rect.top >= 0 &&
			        rect.left >= 0 &&
			        rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
			        rect.right <= (window.innerWidth || document. documentElement.clientWidth)
			    );
			},
			hide: function(){
				var view, deferred; 
				view = this; 

				if(view.$el.css('opacity') != 0){

					//on transition end set display to none
					view.$el.on('transitionEnd webkitTransitionEnd mozTransitionEnd', function handle(ev){
						if(ev.originalEvent.propertyName === 'opacity' && ev.originalEvent.target === view.el){
							view.$el.css({'display':'none'}); 
							view.css.set({'display':'none'}); 
							view.$el.off('transitionEnd webkitTransitionEnd mozTransitionEnd', handle); 
						}				
					}); 
					view.$el.css({'opacity':'0'}); 
					view.css.set({'opacity': 0}); 
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
				this.$el.css({'display': display})
						.css({'opacity':'1'}); 
				this.css.set({'display': display, 
							  'opacity':'1'}); 
				return this; 
			}, 

		//RENDERING FUNCTIONS 
			render: function(){ 
				this.$el.html(this.template(this.model.toJSON())); 
				return this; 
			}, 
			/*remove: function(){
				Backbone.View.prototype.remove.call(this);

				//delete references in jquery and DOM 
				delete this.$el; 
				delete this.el;  
			},*/
			saveState: function(){
				var state, arr; 
				state = {}; 

				//set model and view 
				state.viewProps = this.toJSON(); 
				state.modelProps = this.model.toJSON(); 

				return state; 
			}, 
			toJSON: function(){ 
				//return everything except functions... 
				/*var ret = _.omit(this, _.functions(this).concat(['$el', '_events', 'cid', 'defaultCSS', 'el', 'model', 'styleSheet', 'subviews', 'tagName', '_listeningTo'])); 
				ret = _.clone(ret); */
				//return ret; 
				return {
						x: this.x, 
					    y: this.y, 
					    z: this.z,
						autohide: this.autohide,  
						immutableCSS: this.immutableCSS, 
						//get active css but omit the class default CSS
						css: this.css.get('active'), 
						/*css: _.omit(this.css.get('active'), _.keys(this.defaultCSS)), */
						className: this.el.classList[this.el.classList.length-1]
					}
			}
	});	
	return Block; 
}); 