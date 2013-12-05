define(['Page', 'io'], function(Page, io){ 
	'use strict;' 
	var DrawingPage = {}; 
	DrawingPage = Page.extend({
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, {
			'border':'1px black dotted', 
			'right':'0', 
			'-moz-user-select': 'none',
		 	'-webkit-user-select': 'none',
		    '-ms-user-select': 'none',
		    'user-select': 'none',
		}),
		events: _.extend({}, Page.prototype.events, {
			'mousedown': 'check', 
			'mouseup'  : 'resolve', 
		}), 
		socket: controller.socket,
		requestAnimationFrame: window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame,
		animated: true, 
		rate: 50, 
		brushSettings: { 
			modelProps: {}, 
			viewProps: { 
				className:"TextBlock", 
				text:"oh heeeeeey", 
				type:"i", 
				css: { 
					'cursor':'pointer',
					'position':'fixed',
					'width':'100px', 
					'height':'100px', 
					'max-height':'100%', 
					'max-width':'100%', 
					'text-align':'center',
					'border':'1px black dotted', 
					'border-radius':'100%', 
					'background-color':'rgb(100, 100, 100)', 
					'z-index':'0', 
					'&:hover':{ 
						'background-color':'rgba(0,0,20,1)', 
						'color':'white' 
					}, 
				} 
			} 
		}, 
		initialize: function(options){
			var page, socket; 
			page   = this, 
			socket = this.socket; 
			

			//generic call 

			Page.prototype.initialize.call(this, options); 

			//set up keyspress array 
			this.keysPressed = {};

			//set up sockets 
		    socket.on('connect', function(){
		    	console.log('connected to socket io!'); 
		        socket.on('tweet', function(tweet){
			    	page.currentTweet = tweet; 
			    });
			    socket.on('create', function(dat){
			    	page.addBlock(dat.ev, dat.state); 
			    })
		      socket.on('disconnect', function(){
		      	console.log('disconnected!'); 
		      });
		    });

		    //initialize streaming 
		    $.get('/streaming/bieber', function(data){
		    	console.log(data); 
		    }); 
		},
		check: function(ev){
			var page = this; 
			if(ev.target === this.el){
				switch(ev.which){
					case 1:
						this.keysPressed['left'] = true; 
					case 2: this.keysPressed['middle'] = true; 
					case 3: this.keysPressed['right'] = true; 
				} 
				this.animated = true; 
				this.animate(); 
			}			
			return this; 
		}, 
		resolve: function(ev){ 
			switch(ev.which){ 
				case 1: this.keysPressed['left'] = false; 
				case 2: this.keysPressed['middle'] = false; 
				case 3: this.keysPressed['right'] = false; 
				this.animated = false; 
			}
			return this; 
		},
		//create block centered on that spot 
		addBlock : function( event, stateJSON ){ 
			//vars
			var state, stateOb, width, height, pageModel, pageView, pageWidth; 
			state  = stateJSON || this.brushSettings; 
			width  = (state.viewProps && state.viewProps.css && state.viewProps.css.width)? parseFloat(state.viewProps.css.width) : 0; 
			height = (state.viewProps  && state.viewProps.css && state.viewProps.css.height)? parseFloat(state.viewProps.css.height) : 0; 
		
			//create model and view 
			stateOb = controller.initializeState(state); 

			//add to collections 
			if(!this.model.subcollection) this.model.subcollection = new Backbone.Collection; 
			this.model.subcollection.add(stateOb.model); 
			this.subviews.push(stateOb.view); 

			//set X/Y 
			stateOb.view.x = event.pageX - width/2 + (this.$el.width() - window.innerWidth); 
			stateOb.view.y = event.pageY - height/2; 

			//move left and increase size by 50px
			pageWidth = this.$el.width(); 
			this.$el.css({width: pageWidth + 50}); 
			this.css.set({width: pageWidth + 50});

			//render html and css 
			this.$el.append(stateOb.view.render().el); 
			this.renderCSS(); 
		
			return this; 
		}, 
		animate: function(){ 
			var page, left, width; 
			page  = this, 
			left  = page.x, 
			width = page.$el.width(); 

			//set tweet text! 
			if(tweet = page.currentTweet){ 
				this.brushSettings.viewProps.text = tweet.text; 
				_.extend(this.brushSettings.viewProps.css, { 
					'color': '#' + tweet.user.profile_text_color, 
					'background-color': '#' + tweet.user.profile_background_color 
				}); 
			}	

			//if dragging the left button add a block at that point
			if(page.keysPressed.left){ 
				page.$el.one('mousemove', function(ev){
					if(ev.target === page.el) page.addBlock(ev); 

					//send data to other sockets 
					page.socket.emit('draw', {ev: {pageX: ev.pageX, pageY: ev.pageY}, state: page.brushSettings}); 
				}); 
			} 

			//check to see if blocks are in viewport, if not delete them 
			_.each(page.subviews, function(block){ 
				if(!block.inViewPort()) page.removeFromCollection(block); 
			}); 

			//if we intend to continue checking and adding boxes 
			if(page.animated){ 
				setTimeout(function(){ 
					page.animate(); 
				}, page.rate); 
			}	
			return this; 
		},
	}); 
	return DrawingPage; 
}); 