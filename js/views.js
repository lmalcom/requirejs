/*BLOCK: base class*/ 
var BlockView = Backbone.View.extend({ 
	//BACKBONE PROPERTIES AND FUNCTIONS 
		template	: _.template(''), 
		className  	: 'block', 
		initialize  : function(){ 
						if(!document.on){ 
							_.extend(document, Backbone.Events); 
						} 
						//set references to this view in the model 
						this.el.id = this.model.cid; 
					    this.model.set({elView: this, $el : this.$el, el: this.el});
					 }, 
	//RENDERING FUNCTIONS 
		render 		: function(){ 
						this.$el.html(this.template(this.model.toJSON())); 
						return this; 
					}, 
}); 

/*Block Types*/ 
var VideoView = BlockView.extend({ 
	className   : BlockView.prototype.className + ' videoView',  
	initialize	: function(){ 
					BlockView.prototype.initialize.call(this); 
					//when everything has been put into the DOM load the player 
					document.on('rendered', this.createPlayer, this); 
				  }, 
	createPlayer: function(){ 
					this.model.createPlayer(); 
	}, 
	playVideo	: function(){ 
					if(this.model.get('player')){ 
						this.model.get('pleyer').playVideo(); 
					} 
				  } 
}); 

var TextView = BlockView.extend({
	className   : BlockView.prototype.className + ' textView',
	template	: _.template('<% if(title){ print("<h2>" + title + "</h2>")} %><p><%= text %></p>'),
}); 

var ImageView = BlockView.extend({
	className   : BlockView.prototype.className + ' imageView',
	template	: _.template('<img style="width:100%; height:100%;" src="<%= image %>">'), 
}); 

var LinkableImageView = ImageView.extend({
	className   : BlockView.prototype.className + ' linkableImageView',
	template	: _.template('<a href="<%= linkURL %>" target="_blank"> <img style="width:100%; height:100%;" src="<%= imageURL %>"> </a>'), 
}); 

/** Panel View **************************************************************/ 
var PanelView = BlockView.extend({ 
	//BACKBONE PROPERTIES AND FUNCTIONS 
		className 	: BlockView.prototype.className + ' panel', 
		//RENDERING FUNCTIONS FOR THINGS WITH COLLECTIONS 
		render 	    : function(){ 
						//check special properties 
						this.renderType(); 
						
						//render data from the blocks 
						if(this.model.get('collection')){ 
							this.model.get('collection').each(this.renderBlock, this); 
						}else if(this.model.get('block')){ 
							this.renderBlock(this.model.get('block')); 
						}else{ 
							var fail = new Text({text:'Looks like this panel is empty...'}); 
							var soHard = new TextView({model:fail}); 
							this.$el.append(soHard.render().el); 
						} 						
						return this; 
					 }, 
		renderBlock	: function(block){ 
						var view = block.get('view'); 
						var blockView = new view({model:block}); 
					    this.$el.append(blockView.render().el); 
				      }, 
		renderType : function(){ 
						//if there is a collection, change the css of the blocks according to the display type of the panel. 
						if(this.model.get('collection')){ 
							switch(this.model.get('display').type){
								case 'rows': 	
									//change css of blocks to be in rows 
									this.model.setRows(); 			
									break; 
								case 'columns':
									this.model.setColumns(); 
									break;
								case 'grid':
									this.model.setGrid();  
								case 'inline': 
									this.model.setInline(); 
							}; 				 							
						} 							
					  }			
}); 

var DialogView = PanelView.extend({ 
	//BACKBONE PROPERTIES AND FUNCTIONS 
		events	 	 : { 
							'mousedown' : 'preDrag', 
							'mouseup'	: 'endDrag', 
					   }, 
		className 	 : PanelView.prototype.className + ' dialog', 
		initialize   : function(){ 
							PanelView.prototype.initialize.call(this); 
					    	//initialize position 
							this.changePosition(); 
						    $(document).on('mousemove', function(e){ 
						    	document.posX = e.pageX; 
						    	document.posY = e.pageY; 
						    	document.trigger('moving'); 
						    });
						    $(document).scroll(function(e){
						    	window.scrolling = true; 
						    	console.log('scrolling!'); 
						    })
						    document.on('moving', this.drag, this); 
						}, 

	//RENDERING FUNCTIONS 
		changePosition 	: function(){ 
							this.model.changePosition(); 
						 }, 
		preDrag 	: function(e){  
						if(e.which === 1){
							offsetX = parseFloat(this.model.get('x') - e.pageX); 
							offsetY = parseFloat(this.model.get('y') - e.pageY);  
							this.model.set({isDragging : true, offsetX : offsetX, offsetY: offsetY});	 
					  	}	
					  },
		drag 		: function(){
						this.model.drag(document.posX, document.posY); 
		}, 
		endDrag		: function(){
						this.model.set({isDragging: false}); 
		}, 
	}); 

var ControllerView = Backbone.View.extend({
	className 	: 'controller',  
	initialize	: function(){
					BlockView.prototype.initialize.call(this);					
				  },
	render 		: function(){ 
					//reset controller view
					this.$el.empty(); 
					//render data from the blocks 
					if(collection = this.model.get('collection')){ 
						this.model.get('collection').each(this.renderBlock, this); 
					}else if(this.model.get('block')){ 
						this.renderBlock(this.model.get('block')); 
					}else{ 
						var fail = new Text({text:'Looks like this panel is empty...'}); 
						var soHard = new TextView({model:fail}); 
						this.$el.append(soHard.render().el); 
					} 		
				    $('body').append(this.el); 
				    
				    //renderCSS
					this.renderCSS(); 
					less.refreshStyles(); 

					//tell everything that the page has been rendered
					//document.trigger('rendered'); 
			   	  }, 
	renderCSS 	: function(){					
					//create stylesheet and keep reference to the node
					if(!this.styleSheet){
						var style = document.createElement('style'); 
						style.type = 'text/less';  
						style.id = this.el.id + '_style'; 
						style.innerHTML = 'body {margin:0}' + this.model.get('css').render(); 
						this.styleSheet = document.head.appendChild(style); 
					}else{
						this.styleSheet.type = 'text/less';  
						this.styleSheet.innerHTML = 'body {margin:0}' + this.model.get('css').render();
					} 
					less.refreshStyles(); 
					//document.trigger('rendered'); 
				},  	
	renderBlock	: function(block){ 
						var view = block.get('view'); 
						var blockView = new view({model:block}); 
					    this.$el.append(blockView.render().el); 
				      }, 
});  

/*VIEW FUNCTIONS*/
