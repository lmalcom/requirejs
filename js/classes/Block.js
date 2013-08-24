define(['require', 'CSS', 'Block'], function(require, CSS){
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
				'width':'100%', 
				'height':'100%',
				'transition':'all .5s', 
				'-webkit-transition':'all .5s', 
				'-moz-transition':'all .5s'
			},

		//View Methods
			initialize: function( attributes ){
				//important events
				var view = this; 
				//model events
				this.model.on('change', this.render, this); 
				this.model.on('destroy', this.remove, this); 

				//general events
				this.on('hide', this.hide, this); 
				this.on('show', this.show, this); 

				//initialize css from defaults and attributes, also set parent attribute
				this.css =  new CSS(_.extend(
									{parent:view}, 
									this.defaultCSS, 
									((!this.immutableCSS)? attributes.model.css || {} : {})
							)); 

			},
			klass: function(){
				return this;
			}, 

			hide: function(){
				this.get('$el').fadeOut(); 
				if(player = this.get('player')){
					player.stopVideo(); 
				} 
			}, 

			show: function(){  
				this.get('$el')
					.css({'display': 'inline-block'})
					.delay(100)
					.css({
					'opacity':1, 
					'-webkit-opacity':1,
					'-moz-opacity':1,
					})
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

				//remove references from model 
				this.model.off('destroy', this.remove, this); 
				this.model.off('change', this.render, this);

				//delete references in jquery and DOM 
				delete this.$el; 
				delete this.el;  

			},
	});			
	return Block; 
}); 