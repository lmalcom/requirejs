define(['Block', 'youtube'], function(Block, youtube){ 
	var VideoBlock = {}; 

	//Page View 
	VideoBlock = Block.extend({ 
		className: Block.prototype.className + ' VideoBlock', 
		defaultCSS: _.extend({}, Block.prototype.defaultCSS, { 
			'& > iframe':{ 
				'width':'100%', 
				'height':'100%' 
			} 
		}), 
		template: _.template('<div frameborder="0" style=";"></div>'), 
		options:{ 
			video 	:'i3Jv9fNPjgk', 
		}, 
		//controls for player: 0 for no controls, 1 for controls
		controls: 1, 
		allowFullscreen: 1, 
		createPlayer: function(){ 
			var block, div, vid;
			block = this, 
			div = this.el.firstChild, 
			vid = this.model.get('video') || this.video; 
			console.log('using vid: ', vid); 

			//create an empty div for the youtube player to occupy. 
			this.player = new YT.Player(div, { 
				playerVars: {  
					"html5" : 1, 
					"enablejsapi" : 1, 
					"wmode":"transparent", 
					'allowFullscreen': block.allowFullscreen, 
					"controls":block.controls,
						}, 
				events: { 
					'onReady' : function(event){ 
						event.target.loadVideoById(vid); 
					}, 
					'onStateChange' : block.onPlayerStateChange, 
				}
			}); 
		}, 
		onReady : function(event){ 
			event.target.loadVideoById(vid); 
		}, 
		playVideo: function(){ 
			if(this.model.get('player')){ 
				this.model.get('pleyer').playVideo(); 
			} 
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
		render: function(){ 
			var block = this; 
			Block.prototype.render.call(this); 
			console.log('parent node for the video', this); 

			//check to see if it is rendered in order to create the player
			(function check(){ 
				console.log('oh hey!'); 
				if(window.YT && window.YT.loaded && block.el.parentNode) block.createPlayer(); 
				else setTimeout(check, 500); 	
			})()
	
			return this; 
		}
	});  
	return VideoBlock; 
}); 