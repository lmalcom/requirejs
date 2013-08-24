//Video Summary Model/View: This is a different way of viewing the videos that does not result in a player. The view will simply display a thumbnail of the video and by default is to be displayed horizontally with a width of 150px and will be a list-item(li), which can be modified. The reason for using a new model instead of the old video model is because we would have to set the 'view' property for each of the models to be this new View. For memory purposes it would be best to create a prototype that does this. 
var VideoSummaryView = BlockView.extend({
	tagName : 'li', 
	events  : {
				'click' : 'changeVideo'
	}, 
	className: BlockView.prototype.className +' videoSummary',
	template: _.template('<figure><img src="http://img.youtube.com/vi/<%= video %>/1.jpg"><figCaption class="hoverText"><%= text %></figCaption></figure>'), 
	changeVideo : function(){
		this.model.get('parent').playVideo(this.model.get('video')); 
	}
}); 

var VideoSummary = Block.extend({
	defaults : _.extend({}, Block.prototype.defaults, {
			view  : VideoSummaryView, 
			video : 'i3Jv9fNPjgk', 
			text  : 'this is hover text', 
			defaultCSS: _.extend({}, Block.prototype.defaults.defaultCSS, {
							width 	: '150px', 
							height 	:'100%', 
							float 	: 'left', 
							display : 'inline-block', 
							padding : '5px', 
							background: 'rgba(0,0,0,.8)',
							cursor 	: 'pointer', 
							'&:hover & .hoverText': {
								color:'green'
							},
							'figure': {
								display:'block', 
								width: '100%', 
								height:'100%', 
								margin:'0'
							},
							'figure .hoverText': {
								'width':'100%', 
								'height':'100%', 
								'position':'absolute', 
								'background-color':'rgba(0,0,0,.9)',
								'top':0, 
								'line-height':'6',
								'color':'white',
								'text-align':'center', 
								'opacity':0, 
								'transition':'all 1s', 
								'-webkit-transition':'all .5s', 
								'-moz-transition':'all 1s', 
							}, 
							'figure .hoverText:hover':{
								'opacity':1
							}
					}),	
		})
}); 


//Slider Panel View: this is a view and NOT a model because it is only a way of displaying the playlist and does not have any new properties outside of those from a panel. The playlist property is within the parent dialog and the dialog creates the collection for this view. 


var SliderView = PanelView.extend({ 
		//template : _.template(),  
		className		: PanelView.prototype.className + ' slider', 
		events 			: { 
							'click .prev': 'prev', 
							'click .next': 'next', 
						  }, 
		render 			: function(){ 
							//this.$el.css(this.model.get('css')); 

							//this will eventually be a button class 
							this.$el.append('<a class="prev"> < </a>'); 
							//this is the inside of the slider 
							if(this.model.get('collection')){ 
								this.$el.append(this.renderListItems()); 
							} 
							//this will eventually be a button class 
							this.$el.append('<a class="next"> > </a>'); 
							return this; 
						  },
		renderListItems : function(){
			var model = this.model; 
			var collection = model.get('collection'); 

			//gets the width of the items and sets the width of the container ul to be that + 50px so that it causes smooth transitions when resizing. Otherwise the boxes would show up only when the size of the space could contain the box, and thus making it pop into place. 
			var list = $('<ul class="slide" style="position:absolute; margin:0; padding:0; text-align:center; width:' + (collection.length*parseInt(collection.at(0).get('css').width) + 50) +'px; height:100%; left:40px; z-index:9" ></ul>'); 

			this.model.get('collection').each(function(block){
				var view = block.get('view'); 
				var blockView = new view({model:block}); 
				list.append(blockView.render().el); 
			}); 
			this.model.set({ body : list }); 
			return list; 
						  },
		prev 			: function(){ 
							this.model.prev(); 
						  }, 
		next 			: function(){ 
								this.model.next(); 
						  }, 
}); 
var Slider = Panel.extend({ 
		defaults : _.extend({}, Panel.prototype.defaults,{ 
						view : SliderView, 
						defaultCSS: _.extend({}, Panel.prototype.defaults.defaultCSS, { 
										background: 'rgb(0,0,0)', 
										margin    : 0, 
										'min-height' : '40px', 
										padding   : 0, 
										'min-height': '90px', 
										'.videoSummary' : {
											width 	: '150px', 
											height 	:'100%', 
											float 	: 'left', 
											display : 'inline-block', 
											padding : '5px', 
											background: 'rgba(0,0,0,.8)',
											cursor 	: 'pointer',
										},
										'.videoSummary:hover':{
											background:'rgba(255,255,255,.8)'
										},
										'.videoSummary:hover  &.hoverText':{
											content:'oh hey!'
										}, 
										'a' : {
											'z-index':'10', 
											'cursor':'pointer', 
											'position':'absolute', 
											'width':'40px', 
											'height':'100%', 
											'background':'rgb(27, 27, 27)', 
											'color':'white', 
											'top':0, 
											'padding':'40px 0',
											'text-align':'center'
										}, 
										'a:hover' : {
											'background' : 'rgb(50,50,50)'
										},
										'.prev' : {
											left:0, 
										},
										'.next' : {
											right:0
										},
									}), 
						display : { 
									type : 'custom', 
								  } 
		}), 
		prev: function(){ 
				var list 	= this.get('$el').children('.slide'); 
				var btnWidth= parseFloat(this.get('$el').children('.prev').css('width')); 
				var size 	= parseFloat(this.get('collection').at(0).get('css').width); 
				var pos 	= parseInt(list.css('left')); 

				if(pos + size <= 0 ){ 
					list.animate({ 
						left: pos + size + 'px' 
					}); 
				}else{ 
					list.animate({ 
						//50 is button width. 
						left: btnWidth + 'px' 
					}); 
				} 
			  }, 
		next: function(){ 
					var $parent = this.get('$el'); 
					var coll = this.get('collection'); 
					var list 	= this.get('$el').children('.slide'); 
					var btnWidth= parseFloat(this.get('$el').children('.prev').css('width')); 
					var size 	= parseFloat(this.get('collection').at(0).get('css').width); 
					var pos 	= parseInt(list.css('left')); 
					var max 	= this.get('collection').length*size - (parseFloat(this.get('$el').width()) + btnWidth*2 + btnWidth);
					//move left if the new position will not make the last object in the list go past the right button 
					if(pos - size >= -max){ 
						list.animate({ 
							left: pos - size + 'px' 
						}); 
					}else if($parent.width() < coll.length*size ){
						list.animate({ 
							left: -max - size + 'px' 
						}); 
					}
		      }, 
}); 

var nytSliderView = SliderView.extend({
		className : 'slider nyt',
}); 
var nytSlider = Slider.extend({
		defaults: _.extend({}, Slider.prototype.defaults,{
				view 	  : nytSliderView, 
			}),	
}); 

/*POPOUT  **********************************************************/
var PopoutView = PanelView.extend({ 
	className		: PanelView.prototype.className + ' popout',
}); 

var Popout = Panel.extend({ 
		defaults : _.extend({}, Panel.prototype.defaults,{ 
			view : PopoutView, 
			defaultCSS  : _.extend({}, Panel.prototype.defaults.defaultCSS, {
						'background': 'inherit', 
						'position':'absolute', 
						'z-index' 	: 9,		
					}), 
			display : { 
						type : 'custom', 
					  }, 
			direction: 'right',
		}), 
}); 

/*HEADER *******************************************************************/ 
var HeaderView = PanelView.extend({ 
	className : PanelView.prototype.className + ' header', 
	render    : function(){ 
					PanelView.prototype.render.call(this); 
					this.$el.children('.textView').children('p').css({margin:0}); 
					return this; 
	}, 	
}); 

var Header = Panel.extend({ 
	defaults : _.extend({}, Panel.prototype.defaults,{ 
		view : HeaderView, 
		defaultCSS: _.extend({}, Block.prototype.defaults.defaultCSS,{ 
					width 	 :'100%', 
					height 	 : '40px', 
					'text-align':'center', 
					position :'absolute', 
					'z-index' 	 : 0,
					top 	 : '-40px', 
					left 	 : 0,
					color 	 : 'rgb(225,225,225)', 
					'font-size' : '1.2em', 
					'line-height':1.5,
					background:'inherit', 
					'border-radius': '6px 6px 0 0', 
					'-moz-border-radius':'6px 6px 0 0', 
				}), 	
	}), 
}); 

/**/ 
/*Buttons */ 
/**/ 
var ButtonView = BlockView.extend({ 
	tagName  : 'a', 
	events   : {
		'click' : 'emit' 
	},
	className: BlockView.prototype.className + ' button', 
	template : _.template('<%= text %>'), 
	emit   : function(event){
		this.model.emit(event); 
	},
	render : function(){ 
				BlockView.prototype.render.call(this); 
				this.$el.html(this.template(this.model.toJSON())); 
				return this; 
			} 
}); 
var Button = Block.extend({
	defaults : _.extend({}, Block.prototype.defaults, {
		view: ButtonView,
		defaultCSS :_.extend({}, Block.prototype.defaults.defaultCSS, {
						'text-align' : 'center', 
						'width' 	  : 'auto', 
						'height' 	  : 'auto', 
						'min-height' : '40px', 
						'min-width'  : '40px', 
						'z-index' 	  : '10px', 
						'position'  : 'absolute',
						'cursor':   	'pointer',
			  }), 
	}),
	emit : function(event){
		if(text = this.get('text')){
			this.get('parent').emit(text, event); 
		}		
	}
}); 
var RedButtonView = ButtonView.extend({ 
	tagName  : 'a', 
	className: ButtonView.prototype.className + ' redbutton moreInfo',
}); 
var RedButton = Button.extend({ 
	defaults : _.extend({}, Button.prototype.defaults, { 
		view: RedButtonView, 
		defaultCSS: _.extend({}, Button.prototype.defaults.defaultCSS, {
				'-moz-box-shadow' 		: 'inset 0px 1px 0px 0px #f29c93',
				'-webkit-box-shadow'	: 'inset 0px 1px 0px 0px #f29c93',
				'box-shadow' 			: 'inset 0px 1px 0px 0px #f29c93',
				'background-image' 		: '-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #fe1a00), color-stop(1, #ce0100) )',
				'background-image' 		: '-moz-linear-gradient( center top, #fe1a00 5%, #ce0100 100% )',
				'background-color' 		: '#fe1a00',
				'-moz-border-radius'	:' 6px',
				'-webkit-border-radius' : '6px',
				'border-radius' 		: '6px',
				'border':'1px solid #d83526',
				'color'					:'#ffffff', 
				'font-family'			:'arial',
				'font-size'				:'15px',
				'font-weight'			:'bold',
				'text-decoration'		:'none',	
				'text-shadow'			:'1px 1px 0px #b23e35',
				'&:hover' : {
									'background':'-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #ce0100), color-stop(1, #fe1a00) )',
									'background':'-moz-linear-gradient( center top, #ce0100 5%, #fe1a00 100% )',
									'filter':"progid:DXImageTransform.Microsoft.gradient(startColorstr='#ce0100', endColorstr='#fe1a00')",
									'background-color':'#ce0100'
				}
			  }), 
	}),
}); 
var BlackButtonView = ButtonView.extend({
	tagName  : 'a', 
	className: ButtonView.prototype.className + ' blackbutton moreInfo',
}); 
var BlackButton = Button.extend({
	defaults : _.extend({}, Button.prototype.defaults, { 
		view: BlackButtonView, 
		defaultCSS : _.extend({}, Button.prototype.defaults.defaultCSS, {
				'-moz-box-shadow': 'inset 0px 1px 0px 0px #707070',
				'-webkit-box-shadow': 'inset 0px 1px 0px 0px #707070',
				'box-shadow': 'inset 0px 1px 0px 0px #707070',
				'background-image': '-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #525252), color-stop(1, #383838) )',
				'background': '-moz-linear-gradient( center top, #525252 5%, #383838 100% )',
				'filter': "progid:DXImageTransform.Microsoft.gradient(startColorstr='#525252', endColorstr='#383838')",
				'background-color': '#525252',
				'-moz-border-radius':' 6px',
				'-webkit-border-radius': '6px',
				'border-radius': '6px',
				//'border': '1px solid #dcdcdc',
				'color': '#fcfcfc',
				'font-family': 'arial',
				'font-size':' 15px',
				'font-weight': 'bold',
				'padding':' 10px 6px',
				'text-decoration': 'none',
				'text-shadow': '1px 1px 0px #4d4d4d',
				'&:hover':{
					'background-image' :'-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #383838), color-stop(1, #525252) )',
					'background':'-moz-linear-gradient( center top, #383838 5%, #525252 100% )',
					'filter':"progid:DXImageTransform.Microsoft.gradient(startColorstr='#383838', endColorstr='#525252')",
					'background-color':'#383838'
				}, 
				'&:active':{
					top:'1px'
				},
			  }), 
	}),
}); 

var CloseButtonView = ButtonView.extend({ 
	className: ButtonView.prototype.className + ' close', 
	events  : { 
				'click' : 'close' 
			  }, 
	close 	: function(){ 
				this.model.get('parent').emit('close'); 
			  } 
}); 
var RedCloseButton = RedButton.extend({ 
	defaults: _.extend({}, RedButton.prototype.defaults, { 
				view:CloseButtonView, 
				defaultCSS: _.extend({}, RedButton.prototype.defaults.defaultCSS, { 
						width : 'auto', 
						height: 'auto', 
						padding:'4px 8px', 
						'min-width':0, 
						'min-height':0, 
						right:'-20px', 
						top:'-50px', 
						'background-color' 		: '#fe1a00',
						'-moz-border-radius'	:' 100px',
						'-webkit-border-radius' : '100px',
						'border-radius' 		: '100px',
					  }), 	
				text:'X', 
			}), 
}); 
var BlackCloseButton = BlackButton.extend({ 
	defaults: _.extend({}, BlackButton.prototype.defaults, { 
				view:CloseButtonView, 
				defaultCSS : _.extend({}, BlackButton.prototype.defaults.defaultCSS, { 
							width : 'auto', 
							height: 'auto', 
							padding:'4px 8px', 
							'min-width':0, 
							'min-height':0, 
							right:'-20px', 
							top:'-50px', 
							'-moz-border-radius'	:' 100px',
							'-webkit-border-radius' : '100px',
							'border-radius' 		: '100px',
							'&:hover':{
								'background-image' :'-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #383838), color-stop(1, #525252) )',
								'background':'-moz-linear-gradient( center top, #383838 5%, #525252 100% )',
								'filter':"progid:DXImageTransform.Microsoft.gradient(startColorstr='#383838', endColorstr='#525252')",
								'background-color':'#383838'
							}, 
							'&:active':{
								top:'-49px'
							}, 	
						  }),
				text:'X', 
			}), 
}); 

/**/ 
/* New York Times, class Dialog */ 
/**/ 
var nytDialogView = DialogView.extend({ 
	className: DialogView.prototype.className + ' nyt', 
	events   : _.extend({}, DialogView.prototype.events, { 
				'click .moreInfo'     : 'moreInfo' 
	}), 
	render : function(){ 
		this.model.constructPlaylist(); 
		DialogView.prototype.render.call(this); 
		return this; 
	}, 	
	moreInfo: function(){
		this.model.emit('moreInfo'); 
		if(this.$el.children('.header').children('.moreInfo').text() == 'More Info'){
			this.$el.children('.header').children('.moreInfo').text('Less Info'); 
		}else if(this.$el.children('.moreInfo')){
			this.$el.children('.header').children('.moreInfo').text('More Info'); 
		}
	},
}); 

var nytDialog = Dialog.extend({ 
		defaults 	: _.extend({}, Dialog.prototype.defaults, { 
							view:nytDialogView, 
							display : { 
										type  		: 'rows', 
										distribution:  75, 
									  }, 
							defaultCSS: _.extend({}, Dialog.prototype.defaults.defaultCSS, { 
										background:'#0A0A0A', 
										padding   : 0, 
										overflow  : 'visible', 
										height 		: '66%', 
									  }), 	
							isExtended : false, 
					  }), 
		initialize 	: function(attributes){ 
							Dialog.prototype.initialize.call(this, attributes); 
							if(attributes && attributes.playlist){ 
								//create playlist 
								this.playlist = attributes.playlist; 
							}else{ 
								this.playlist = new Array(); 
							} 
							//set popout
							this.on('moreInfo', this.extend, this); 
						}, 
		playVideo  	: function(video){ 
									//set video for video player 
									if(collection = this.get('collection')){ 
										collection.each(function(block){ 
											if(block.has('player')){ 
												block.loadVideo(video); 
											} 
										}); 
									}else if(block = this.get('block')){ 
										if(block.has('player')){ 
											block.loadVideo(video); 
										} 
									} 
									//set playlist panel to move to video index 
					}, 
		stopVideo  	: function(){ 
						//set video for video player 
						if(collection = this.get('collection')){ 
							collection.each(function(block){ 
								if(block.has('player')){ 
									block.stopVideo(); 
								} 
							}); 
						}else if(block = this.get('block')){ 
							if(block.has('player')){ 
								block.stopVideo(); 
							} 
						} 
		}, 
		constructPlaylist : function(){ 
								if(this.get('playlist') !==  null && this.get('collection')){
									//get references for playlist view 
									playlistModels = this.get('collection').where({ 
											'view' : nytSliderView 
										}); 
									if(this.get('playlist') && this.get('playlist').length > 1){
										//initialize playlist collection
										coll = new Backbone.Collection; 
										var parent = this; 
										//add videos to the playlist
										_.each(this.get('playlist'), function(video, index, list){
											coll.add(new VideoSummary({video:video, index:index, parent:parent})); 
										}); 

										//set each of the playlist views in the dialog
										_.each(playlistModels, function(model){
												model.set({collection:coll}); 
											}); 
									}									
								} 
						 }, 
		extend  		: function(){
			//set direction
			var isExtended = this.get('isExtended'); 
			var dialog = this; 
			if(collection = this.get('collection')){
				collection.each(function(block){
					dialog.extendBlock(block, isExtended); 
				}); 
			}else if(block = this.get('block')){
				dialog.extendBlock(block, isExtended); 
			}
			//reset extended prop
			this.set({isExtended: !isExtended}); 
		}, 
		extendBlock : function(block, isExtended){
			if(isExtended){
				//changes specific blocks if they are absolutely positioned
				if(block.get('$el').hasClass('popout')){
					block.get('$el').css({right:0});
				}else if(block.get('$el').hasClass('close')){
					block.get('$el').css({right:'-15px'}); 
				}else if(block.get('$el').hasClass('videoView')){
					//nothin
				}
				else{ 
					block.get('$el').css({width:'100%'}); 
				}
			}else{ 
				if(block.get('$el').hasClass('popout')){ 
					block.get('$el').css({right:'-50%'}); 
				}else if(block.get('$el').hasClass('close')){ 
					block.get('$el').css({right:'-54%'}); 
				}else if(block.get('$el').hasClass('videoView')){ 
					//nothin 
				}else{ 
					block.get('$el').css({width:'150%'}); 
				} 
			} 
		} 
}); 



var nytHeaderView = HeaderView.extend({ 
		className : HeaderView.prototype.className + ' nyt', 
}); 
var nytHeader = Header.extend({ 
		defaults: _.extend({}, Header.prototype.defaults,{ 
			view 	  : nytHeaderView, 
		}),	
}); 


/**********************************************/
/*Functions for making dialogs*/
/**********************************************/

//create a dialog with just a video inside of it 
function createVideoDialog(video){ 
	var dialog = new Dialog({
			block:new Video({video:video}), 
			css : {background:'rgba(0,0,0,.5)'}
		}); 
	dv = new DialogView({model:dialog}); 
	$('body').append(dv.render().el); 
	createSheet(dv);
	less.refreshStyles();
	return dialog; 
} 
//create a dialog with just text inside of it 
function createTextDialog(text, title){ 
	var dialog = new Dialog({block:new Text({text:text, title:title})}); 
	dv = new DialogView({model:dialog}); 
	$('body').append(dv.render().el); 
	createSheet(dv);
	less.refreshStyles();
	return dialog; 
} 
//create a dialog with just an image inside of it 
function createImageDialog(image){ 
	var dialog = new Dialog({block:new Image({image:image})}); 
	dv = new DialogView({model:dialog}); 
	$('body').append(dv.render().el); 
	createSheet(dv);
	less.refreshStyles();
	return dialog; 
} 
//create a dialog with video and text using the VideoDialog Model 
function createVideoTextDialog(video, text, title){ 
	var dialog = new nytDialog({ 
							collection : new Backbone.Collection([ 
											new Video({video:video}), 
											new nytHeader({ 
												collection: new Backbone.Collection([ 
														new Text({ 
																text:title, 
																css:{padding:0, 'pointer-events':'none'} 
														}), 
										 		]), 
										 		css: {padding:'5px', width:'150%'}
											}),
										 	new Text({
										 			text:text, 
										 			css:{
										 				position:'absolute', 
										 				left:'100%', 
										 				height:'100%', 
										 				width:'50%', 
										 				color:'rgb(150,150,150)'
										 			}
										 		})
							]), 
						}); 
	dv = new DialogView({model:dialog}); 
	$('body').append(dv.render().el); 
	createSheet(dv);
	less.refreshStyles();
	return dialog; 
} 

//create a grid of images. Specify the number and a photo. If no photo is specified then the default image will be used. 
function createGridDialog(num, image){ 
	//create array for the collection 
	var images = new Array(); 
	for(var i = 0; i < num; i++){ 
		if(image){ 
			images.push(new Image({image:image})); 
		}else{ 
			images.push(new Image); 
		} 
	} 

	var dialog = new Dialog({
						collection 	: new Backbone.Collection(images),
						display 	: {type:'grid'}, 
						css 		: {background:'rgba(0,0,0,.5)'}
					 }); 
	var dv = new DialogView({model:dialog}); 
	$('body').append(dv.render().el); 
	createSheet(dv);
	less.refreshStyles();
	return dialog; 
} 

function createGridDialog2(images, numPerRow){
	var coll = new Backbone.Collection; 
	for(var i = 0; i < images.length; i++){
		var image = images[i]; 
		coll.add(new LinkableImage({
					imageURL : image.imageURL, 
					title : image.title, 
					linkURL : image.linkURL
				})
		); 
	}
	var pan = new Panel({
					collection:coll,
					display:{type:'grid', perRow:numPerRow},
					//css:{}   add css options here if you'd like  (position, bg color etc, width/height of the panel is important so the images inside don't get distorted)
				}); 
	var pv = new PanelView({model:pan}); 
	$('body').append(pv.render().el); 
}

function createNytDialog(listofplay){ 
	var coll; 
	//listofplay = ['i3Jv9fNPjgk', 'DOdwSquHorw', 'WfVWgTL-Py4']; 
	if(listofplay && listofplay.length > 1){
		coll =  new Backbone.Collection([ 
					new Video({css:{'max-height':'75%'}}), 
					new nytSlider, 
					new Popout({ 
							block: new Text({
										text:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',css:{color:'rgb(175,175,175)'}
									}), 
							css:{right:0, top:0, height:'75%', width:'50%', 'box-shadow':0, '-webkit-box-shadow':0}
						}), 
					new nytHeader({ 
							collection: new Backbone.Collection([ 
									new Text({ 
											text:'this is the header text ', 
											css:{padding:0, 'pointer-events':'none'} 
									}), 
									new BlackButton({ 
											text:'More Info', 
											css  : { 
												'right': '10px', 
												'top': '5px', 
												'border-radius': '6px', 
												'-moz-border-radius':'6px', 
												'-webkit-border-radius':'6px',
												'min-height':'20px', 
												'height':'30px', 
												'padding':'6px'
											} 
									}), 
								]), 
							css: {'padding':'5px'}, 
						}), 
					new BlackCloseButton({css:{right:'-20px'}})
		]); 
	}else if(listofplay){
		coll =  new Backbone.Collection([ 
					new Video({video:listofplay[0]}), 
					new Popout({ 
							block: new Text({text:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',css:{color:'rgb(175,175,175)'}}), 
							css:{right:0, top:0, width:'50%', 'box-shadow':0, '-webkit-box-shadow':0}}), 
					new nytHeader({ 
							collection: new Backbone.Collection([ 
									new Text({ 
											text:'this is the header text ', 
											css:{padding:0, 'pointer-events':'none'} 
									}), 
									new BlackButton({ 
											text:'More Info', 
											css  : { 
												'right': '10px', 
												'top': '5px', 
												'border-radius': '6px', 
												'-moz-border-radius':'6px', 
												'-webkit-border-radius':'6px',
												'min-height':'20px', 
												'height':'30px', 
												'padding':'6px'
											} 
									}), 
								]), 
							css: {'padding':'5px'}, 
						}), 
					new BlackCloseButton({css:{right:'-20px'}})
		]); 
	} else{
		coll =  new Backbone.Collection([ 
					new Video, 
					new Popout({ 
							block: new Text({text:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',css:{color:'rgb(175,175,175)'}}), 
							css:{'right':'0', 'top':'0', 'width':'40%', 'box-shadow':0, '-webkit-box-shadow':0}}), 
					new nytHeader({ 
							collection: new Backbone.Collection([ 
									new Text({ 
											text:'this is the header text ', 
											css:{padding:0, 'pointer-events':'none'} 
									}), 
									new BlackButton({ 
											text:'More Info', 
											css  : { 
												'right': '10px', 
												'top': '5px', 
												'border-radius': '6px', 
												'-moz-border-radius':'6px', 
												'-webkit-border-radius':'6px',
												'min-height':'20px', 
												'height':'30px', 
												'padding':'6px'
											} 
									}), 
								]), 
							css: {'padding':'5px'}, 
						}), 
					new BlackCloseButton({css:{right:'-20px'}})
		]); 
	}
	var d = new nytDialog({
			collection: coll, 
			playlist: listofplay, 
			css : {background:'#1b1b1b'},
			x : 100, 
			y : 100
		}); 
	var dv = new nytDialogView({model:d});
	$('body').append(dv.render().el); 
	createSheet(dv);
	less.refreshStyles();  
	return d;
}
function createNytDialog2(){ 
	var coll =  new Backbone.Collection([ 
					new Video, 
					new nytSlider, 
					new Popout({ 
							block: new Text({text:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?', css:{color:'rgb(175,175,175)'}}), 
							css:{'right':0, 'top':0, 'height':'75%', 'width':'50%', 'box-shadow':0, '-webkit-box-shadow':0}}), 
					new nytHeader({ 
							collection: new Backbone.Collection([
											new Text({ 
													text:'this is the header text ', 
													css:{'padding':0, 'pointer-events':'none'} 
											}), 
											new RedButton({
													text:'More Info',
													css  : {
														right: 0,
														top: 0, 
														'border-radius': '0 6px 0 0',
													} 
											}), 
										]), 
						}),
					new RedCloseButton({css:{right:'-20px'}})
		]); 
	var d = new nytDialog({
			collection: coll, 
			playlist: ['i3Jv9fNPjgk', 'DOdwSquHorw', 'WfVWgTL-Py4'], 
			css : {background:'#1b1b1b'},
			x : 100, 
			y : 100
		}); 
	var dv = new nytDialogView({model:d});
	$('body').append(dv.render().el); 
	createSheet(dv);
	less.refreshStyles();  
	return d;
}

function createNytDialog3(){ 
	var coll =  new Backbone.Collection([ 
					new nytSlider, 
					new Video, 					
					new Popout({ 
							block: new Text({text:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?', css:{color:'rgb(175,175,175)'}}), 
							css:{right:0, top:'25%', height:'75%', width:'50%', 'box-shadow':0, '-webkit-box-shadow':0}}), 
					new nytHeader({ 
							collection: new Backbone.Collection([
											new Text({ 
													text:'this is the header text ', 
													css:{padding:0, 'pointer-events':'none'} 
											}), 
											new RedButton({
													text:'More Info',
													css  : {
														right: 0,
														top: 0, 
														'border-radius': '0 6px 0 0',
													} 
											}), 
										]), 
						}),
					new RedCloseButton({css:{right:-20}})
		]); 
	var d = new nytDialog({
			collection: coll, 
			playlist: ['i3Jv9fNPjgk', 'DOdwSquHorw', 'WfVWgTL-Py4'], 
			css : {background:'#1b1b1b'},
			x : 100, 
			y : 100, 
			display: {
				type:'rows', 
				distribution: 25
			}
		}); 
	var dv = new nytDialogView({model:d});
	$('body').append(dv.render().el); 
	createSheet(dv);
	less.refreshStyles();  
	return d;
}
function createNytDialog4(){ 
	var coll =  new Backbone.Collection([ 
					new nytSlider, 
					new Video, 					
					new Popout({ 
							block: new Text({text:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?', css:{color:'rgb(175,175,175)'}}), 
							css:{right:0, top:'25%', height:'75%', width:'50%', 'box-shadow':0, '-webkit-box-shadow':0}}), 
					new nytHeader({ 
							collection: new Backbone.Collection([
											new Text({ 
													text:'this is the header text ', 
													css:{padding:0, 'pointer-events':'none'} 
											}), 
											new RedButton({
													text:'More Info',
													css  : {
														right: 0,
														top: 0, 
														'border-radius': '0 6px 0 0',
													} 
											}), 
										]), 
						}),
					new RedCloseButton({css:{right:'-20px'}}) 
		]); 
	var d = new nytDialog({
			collection: coll, 
			playlist: ['i3Jv9fNPjgk', 'DOdwSquHorw', 'WfVWgTL-Py4'], 
			css : {
					background:'rgb(0,0,0)', 
					border:'1px rgba(0,0,0,.7)',
				},
			x : 100, 
			y : 100, 
			display: {
				type:'rows', 
				distribution: 25
			}
		}); 
	var dv = new nytDialogView({model:d});
	$('body').append(dv.render().el); 
	createSheet(dv);
	less.refreshStyles();  
	return d;
} 

function createCrazyDialog(videos){ 
	//create array for the collection 
	var coll = new Backbone.Collection; 
	if(videos && videos.length > 1){ 
		for(var i = 0; i < videos.length; i++){ 
			coll.add(new Video({video: videos[i]})); 
		} 
	}else{ 
		coll.add(new Video({video: videos[i] || new Video})); 
	} 

	var dialog = new nytDialog({ 
						collection 	: coll,
						display 	: {type:'grid'}, 
						css 		: {
										'background':'rgb(150,150,150)', 
										'-webkit-perspective':'0', 
										'perspective':'0', 
										'.videoView':{
											'border-right':'rgba(0,0,0,1)'
										},
										'.videoView:hover':{
											'transform':'rotate3d(.2,1,.2,30deg)',
											'-webkit-transform':'rotate3d(0,1,0,360deg)', 
											'background-color': 'rgb(170,170,170)'
										},
										'&:hover':{ 
											'perspective':'500px', 
											'webkit-perspective':'500px', 
											'background':'rgb(100,100,0)', 
											'transform':'rotate3d(.2,1,.2,30deg)', 
											'-webkit-transform':'rotate3d(.2,1,.2,30deg)', 
										} 
						} 							
	}); 
	var dv = new DialogView({model:dialog}); 
	$('body').append(dv.render().el); 
	createSheet(dv); 
	less.refreshStyles(); 
	return dialog; 
} 

function createCrazyDialog2(videos){ 
	//create array for the collection 
	var coll = new Backbone.Collection; 
	if(videos && videos.length > 1){ 
		for(var i = 0; i < videos.length; i++){ 
			coll.add(new VideoSummary({
				video: videos[i], 
				css : {
					'transform':'rotateZ(10deg)', 
					'-webkit-transform':'',
				}, 
			})); 
		} 
	}else{ 
		coll.add(new VideoSummary({video: videos[i] || new Video})); 
	} 

	var dialog = new nytDialog({ 
						collection 	: coll, 
						display 	: {type:'grid'}, 
						css 		: {
										'background':'rgb(150,150,150)', 
										'-webkit-perspective':'0', 
										'perspective':'0', 
										'.videoView':{
											'border-right':'rgba(0,0,0,1)'
										},
										'.videoView:hover':{
											'transform':'rotate3d(.2,1,.2,30deg)',
											'-webkit-transform':'rotate3d(0,1,0,360deg)', 
											'background-color': 'rgb(170,170,170)'
										},
										'&:hover':{ 
											'perspective':'500px', 
											'webkit-perspective':'500px', 
											'background':'rgb(100,100,0)', 
											'transform':'rotate3d(.2,1,.2,30deg)', 
											'-webkit-transform':'rotate3d(.2,1,.2,30deg)', 
										} 
						} 	
	}); 
	var dv = new DialogView({model:dialog}); 
	$('body').append(dv.render().el); 
	createSheet(dv); 
	less.refreshStyles(); 
	return dialog; 
}

function createSheet(parent){
	var style = document.createElement('style'); 
	style.type = 'text/less';  
	style.id = parent.el.id; 
	style.innerHTML = parent.model.get('css').render(); 
	document.head.appendChild(style); 
}