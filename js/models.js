/******************************************************/
/* Blocks: */
/******************************************************/

/**/ 
/* Block: This is the base class for every object. It specifies CSS rules, position and other base properties. */
/**/ 

var Block = Backbone.Model.extend({ 
	defaults:{ 
		//SPECIAL PROPERTIES AND FUNCTIONS 
		x 			: 0, 
	    y 			: 0, 
		autohide	: false, 
		view 		: BlockView, 
		defaultCSS 	: {
						'width':'100%', 
						'height':'100%',
						'transition':'all .5s', 
						'-webkit-transition':'all .5s', 
						'-moz-transition':'all .5s'
		} 
	}, 
	url : function(){
		return this.cid; 
	},
	initialize	: function(attributes){ 
		if(!document.on){ 
			_.extend(document, Backbone.Events); 
		} 
		this.on('close', this.remove, this); 
		this.on('hide', this.hide, this); 
		this.on('show', this.show, this); 

		//initialize css from defaults and attributes, also set parent attribute
		if(attributes && attributes.css){ 
			var cssOb = _.extend({parent:this}, this.get('defaultCSS'), attributes.css); 
		}else{ 
			var cssOb = _.extend({parent:this}, this.get('defaultCSS')); 
		} 
		this.set({css :  new CSS(cssOb)}); 
	},  
	hide 	  : function(){
		this.get('$el').fadeOut(); 
		if(player = this.get('player')){
			player.stopVideo(); 
		} 
	}, 
	show 	  : function(){  
		this.get('$el')
			.css({'display': 'inline-block'})
			.delay(100)
			.css({
			'opacity':1, 
			'-webkit-opacity':1,
			'-moz-opacity':1,
			})
	}, 
	remove 	: function(){
		var elView = this.get('elView'); 
		this.get('$el').fadeOut(function(){
			elView.remove(); 
		}); 
	}
}); 

var Video = Block.extend({ 
	defaults: _.extend({}, Block.prototype.defaults, { 
					view	: VideoView, 
					video 	:'i3Jv9fNPjgk', 
				  }), 
	createPlayer: function(){ 
					var el = this.get('el'); 
					var block = this; 
					var vid = this.get('video'); 
					//create an empty div for the youtube player to occupy.
					el.innerHTML = '<div frameborder="0" style="width:100%; height:100%;"></div>'; 
					this.set({ 
						player : new YT.Player(el.firstChild, { 
										playerVars: {  
											"html5" : 1, 
											"enablejsapi" : 1, 
											"wmode":"transparent", 
											'allowFullscreen': 1, 
												}, 
										events: { 
											'onReady' : function(event){ 
															event.target.loadVideoById(vid); 
												}, 
											'onStateChange' : block.onPlayerStateChange, 
												}
								})
					}); 
				  },
	initialize : function( attributes ){
		Block.prototype.initialize.call(this, attributes); 
		document.on('rendered', this.createPlayer, this); 
	},
	onPlayerStateChange : function(){

	}, 
	loadVideo : function(id){
		if(id &&  this.get('player')){
				this.get('player').loadVideoById(id); 
		}		
	}, 
	stopVideo : function(){
		if(this.get('player')){
			this.get('player').stopVideo(); 
		}	
	}, 
}); 
var Text = Block.extend({
	defaults: _.extend({}, Block.prototype.defaults, {
		view 	: TextView,
		text 	:'One fine body of text',
		title   :'',
		defaultCSS: { 
					 'text-indent' : 10, 
					 'overflow-y':'auto'	
				    }, 
		}), 
}); 
var Image = Block.extend({ 
	defaults: _.extend({}, Block.prototype.defaults, { 
		view 	: ImageView, 
		image 	:'images/sample.jpeg', 
	}), 
}); 
var LinkableImage = Image.extend({ 
	defaults: _.extend({}, Image.prototype.defaults, { 
		view 	:LinkableImageView, 
	}) 
}); 

/*PANEL MODEL ****************************************************************/
var Panel = Block.extend({ 
	defaults: _.extend({}, Block.prototype.defaults, { 
		//SPECIAL PROPERTIES AND FUNCTIONS 
		view 		: PanelView, 
		display		: { //this would split up all of the blocks/panels a certain way without having to set the css to do this. Custom could be the default to put whatever you want in. 
						type : 'rows', 
						distribution : 66, 
					  }, 
		defaultCSS 	: { 
						'-webkit-box-shadow': '3px 0px 15px 2px rgba(10, 10, 10, .4)', 
						'box-shadow': '3px 0px 15px 2px rgba(10, 10, 10, .4)', 
						'width'	:'100%', 
						'height'	:'100%', 
						'display'	: 'inline-block', 
						'overflow': 'hidden', 
						'padding' : '10px', 
						'position': 'relative', 
						'background':'inherit', 
						'z-index' 	: '10', 
						'-moz-box-sizing' 	: 'border-box', 
						'-webkit-box-sizing': 'border-box', 
						'box-sizing' 		: 'border-box', 
						'-webkit-transition' : 'all .5s ease', 
						'-moz-transition' 	  : 'all .5s ease', 
						'transition' 		  : 'all .5s ease', 
						'.block': {
							'width'	:'100%', 
							'height'	:'100%', 
							'display'	: 'inline-block', 
							'overflow': 'hidden', 
							'padding' : '10px', 
							'position': 'relative', 
							'background':'inherit', 
							'z-index' 	: '10', 
							'-moz-box-sizing' 	: 'border-box', 
							'-webkit-box-sizing': 'border-box', 
							'box-sizing' 		: 'border-box', 
							'-webkit-transition' : 'all .5s ease', 
							'-moz-transition' 	  : 'all .5s ease', 
							'transition' 		  : 'all .5s ease', 
						}
					  }, 
	}), 
	initialize  : function(attributes){ 
					Block.prototype.initialize.call(this, attributes); 
					var parent = this; 
					//set parent attribute 
					if(attributes){ 
						//SET CSS 
						if(collection = attributes.collection) { 
								collection.each(function(block){ 
									block.set({parent:parent}); 
								})
								collection.on('change', function(){ 
									collection.each(function(block){ 
										if(!block.has('parent')) block.set({parent:parent}); 
									}) 
								}) 
						}else if(block = attributes.block){ 
							block.set({parent:parent}); 
						} 
					}
					this.on('change', function(){
						if(collection = this.get('collection')){
							collection.each(function(block){ 
								if(!block.has('parent')) block.set({parent:parent}); 
							}) 
						}else if(block = this.get('block')){
							if(!block.has('parent')) block.set({parent:parent}); 
						}
					}) 					
	}, 
	rejectAbsolute: function(collection){
					//reject absolutely position objects and those with autohide:true
						var coll = collection.reject(function(block){ 
							if(block.get('css').get('active').position){ 
								if(block.get('css').get('active').position == 'absolute' || block.get('autohide')) return true; 								
							}else{ 
								return false; 
							} 
						});  	
						return coll; 
	},
	setRows		: function(){ //set things into rows 
					if(collection = this.get('collection')){ 
						//reject absolutely position objects and those with autohide:true
						var coll = this.rejectAbsolute(collection); 

						//set the size of the main row/column
						var sizeMain = this.get('display').distribution == 'even' ? 100/coll.length : this.get('display').distribution; 
						var sizeRemainder = 100 - sizeMain; 	
						if(coll.length > 1){
							_.each(coll, function(block, index, list){
								if(index === 0){
									var css = {
										width : '100%',
										height : sizeMain + '%',
									}; 
									block.get('css').set(css); 
								}else{
									var css = {
										width : '100%',
										height : sizeRemainder/(coll.length - 1) + '%',
									}; 
									block.get('css').set(css); 
								}		
							}); 
						}else{
							var css = {
								display : 'inline-block',
								width : '100%',
								height : '100%',
							}; 
							coll[0].get('css').set(css); 
						}						
					}						
				  }, 
	setColumns	: function(){
					if(collection = this.get('collection')){
						//set the size of the main row/column
						var sizeMain = this.get('display').distribution == 'even' ? 100/collection.length : this.get('display').distribution; 
						var sizeRemainder = 100 - sizeMain; 

						//reject absolutely position objects and those with autohide = true
						var coll = this.rejectAbsolute(collection); 		

						if(coll.length > 1){
							//render collection
							_.each(coll, function(block, index, list){
								if(index === 0){ 
									block.get('css').set({ 
										//display : 'inline-block', 
										'float' : 'left', 
										'width' : sizeMain + '%', 
									}); 
								}else{ 
									block.get('css').set({ 
										//display : 'inline-block', 
										float : 'left', 
										width : sizeRemainder/(coll.length - 1) + '%', 
									}); 
								} 
							}); 
						}else{ 
							coll[0].get('css').set({ 
								display : 'inline-block', 
								width : '100%', 
								height : '100%', 
							}); 
						} 
					} 
	}, 
	setGrid 	: function(){ 
					if(collection = this.get('collection')){ 
												
						var len = this.get('collection').length, width, height; 
						//set size of boxes 
						if(perRow = this.get('display').perRow){ 
							width = height = perRow;							
						}else{
							//find closest square and round up for equal sizing 
							width = height = Math.ceil(Math.sqrt(len));
						}

						//reject absolutely position objects and those with autohide = true
						var coll = this.rejectAbsolute(collection); 

						//set sizes 
						_.each(coll, (function(block){ 
							block.get('css').set({ 
								'float' : 'left', 
								'width' : 100/width + '%', 
								'height' : 100/height + '%', 
								'position':'relative'
							}); 
						})); 						
					} 
	}, 
	setInline: function(){
				if(collection = this.get('collection')){ 
												
						var len = this.get('collection').length; 
						//reject absolutely position objects and those with autohide = true
						var coll = this.rejectAbsolute(collection); 

						//set sizes 
						_.each(coll, (function(block){ 
							block.get('css').set({ 
								'float' : 'left', 
								'position':'relative', 
								'display':'inline-block'
							}); 
						})); 						
					} 
	},
	emit 	  : function(name, event){ 
					if(collection = this.get('collection')){ 
						collection.each(function(block){ 
							block.trigger(name, event); 			
						}); 
					}else if(block = this.get('block')){
						block.trigger(name, event); 
					}
					this.trigger(name, event); 
	},
	
}); 

/*DIALOG MODEL ***************************************************************/
var Dialog = Panel.extend({ 
	defaults: _.extend({}, Panel.prototype.defaults, { 
		//SPECIAL PROPERTIES AND FUNCTIONS 
		view 		: DialogView,
		isResizeable: false, 
		isDraggable : true, 
		isDragging	: false, 
		offsetX		: 0, 
		offsetY		: 0, 
		titleBar 	: 'This is the title',
		//Dialogs have special CSS 
		defaultCSS 	: _.extend({}, Panel.prototype.defaults.css, { 
						'width':'60%', 
						'height':'40%', 
						'min-width':'400px',
						'max-width':'600px', 
						'min-height':'300px', 
						'max-height':'400px',
						'position':'absolute', 
						'-webkit-transition' : 'all .5s, -webkit-transform 0', 
						'-moz-transition' 	  : 'all .5s, -moz-transform 0', 
						'transition' 		  : 'transform 0',
						'-webkit-user-select': 'none',
						'-moz-user-select': 'none',    
						'-ms-user-select': 'none',  
						'user-select'   : 'none'
					  })
	}),
	changePosition	: function(){ 
		if(this.get('isDraggable') === true){
			this.get('$el').css({
				'-webkit-transform' : 'translate(' + this.get('x') + 'px, ' + this.get('y') + 'px)',
				'-moz-transform' : 'translate(' + this.get('x') + 'px, ' + this.get('y') + 'px)',
			});
		}		
	}, 
	drag 			: function(mouseX, mouseY){
						if(this.get('isDragging') === true && this.get('isDraggable') === true ){
							var model = this; 
							this.set({x : mouseX + this.get('offsetX'), y : mouseY + this.get('offsetY')});
							this.changePosition(); 
							//cancel out video player events while dragging 
							if(vids = $('.videoView')){
								vids.css({'pointer-events' : 'none'})
							}
							//let parent know that we are dragging 
							if(parent = this.get('parent')){
								parent.trigger('childIsDragging', mouseX, mouseY); 
							}
						}else{
							//put them back
							if(vids = this.get('$el').children('.videoView')){
								vids.css({'pointer-events' : 'all'})
							}
						}
	}, 
	resize: function(){
		if(this.get('isResizeable') === true){
			//
		}
	}
}); 

/*CONTROLLER MODEL ***********************************************************/
var Controller = Backbone.Model.extend({
		defaults: {
			view 		: ControllerView, 
			defaultCSS 	: {
							position:'fixed', 
							width	: '100%', 
							height	: '100%'
						  }, 	
		}, 
		initialize:function( attributes ){
			Block.prototype.initialize.call(this, attributes); 
		}, 
		emit : Panel.prototype.emit
		
}); 