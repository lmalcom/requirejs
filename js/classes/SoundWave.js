define(['Block'], function(Block){ 
	var SoundWave = {}; 

	//Page View 
	SoundWave = Block.extend({ 
		className: Block.prototype.className + ' SoundWave', 
		defaultCSS: _.extend({}, Block.prototype.defaultCSS, { 
			'.btn':{
				'min-width':'40px', 
				'min-height':'40px',
				'max-width':'200px', 
				'max-height':'60px', 
				'background-color':'rgba(250,250,250,.5)', 
				'cursor': 'pointer',
				'-moz-box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)',
				'-webkit-box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)',				
				'box-shadow': '0px 1px 10px 0px rgba(0,0,0, .3)',
				'-webkit-border-radius': '4px',
				'-moz-border-radius': '4px',
				'border-radius': '4px', 
				'border': '0', 
				'display': 'inline-block', 
				'color': '#e8e8e8', 
				'font-size': '18px', 
				'font-weight': 'bold', 
				'font-style': 'normal', 
				'line-height': '40px', 
				'text-decoration': 'none', 
				'text-align': 'center', 
				'text-shadow': '1px 1px 0px #000', 
				'&:hover': {
					'background-color': 'rgba(26, 42, 43, 1)',  
				}, 
				'&:active':{
					'-webkit-transition': 'all 0s', 
					'-moz-transition': 'all 0s',
					'transition':' all 0s',
					'bottom': '1px',
				}
			}
		}), 
		events:{
			'click .playBtn':'playSound', 
			'click .pauseBtn':'pauseSound', 
			'click .stopBtn':'stopSound'
		},
		initialize: function(options){ 
			Block.prototype.initialize.call(this, options); 
			// Fix up prefixing 
			window.AudioContext = window.AudioContext || window.webkitAudioContext; 
			this.context = new AudioContext(),
			this.startTime = 0, 
			this.startOffset = 0; 
		},
		options: {
			src: '../../sounds/07 - Janelle Monae -Tightrope (feat. Big Boi).mp3', 
			animated: true
		}, 
		template: function(dat){
			return _.template('<a class= "btn playBtn"> Play </a> <a class=" btn pauseBtn"> Pause </a> <a class=" btn stopBtn"> Stop </a>'); 
		},
		loadSound: function(url) {
			var page = this; 
		  	var request = new XMLHttpRequest();
		  	request.open('GET', (url || page.options.src), true);
		  	request.responseType = 'arraybuffer';

		  	// Decode asynchronously
		  	request.onload = function() {
		    	page.context.decodeAudioData(request.response, function(buffer) {
		      		page.buffer = buffer;
		      		page.playSound(); 
		    	}, function(err){
		    		console.log(err); 
		    	});
		  	}
		  	request.send();
		}, 
		playSound: function(ev) {
		  var source = this.source = this.context.createBufferSource(); // creates a sound source
		  source.buffer = this.buffer;          // tell the source which sound to play
		  source.connect(this.context.destination);  // connect the source to the context's destination (the speakers)
		  source.start(0, this.startOffset % this.buffer.duration);         // play the source now
		  this.startTime = this.context.currentTime; // set start time for pausing later 
		  return this;                               // note: on older systems, may have to use deprecated noteOn(time);
		}, 
		//can add in fade out sound effects 
		pauseSound: function(ev){
		  	this.source.stop(0);

		  	// Measure how much time passed since the last pause.
		  	this.startOffset += this.context.currentTime - this.startTime;
		  	this.options.animated = false; 

			return this; 
		},
		//can add in fade out sound effects 
		stopSound: function(ev){
			this.source.stop(0); 
			this.startOffset = 0; 
			this.options.animated = false; 
			return this; 
		},
		render: function(){
			Block.prototype.render.call(this); 
			this.loadSound(); 
			return this; 
		}, 

	});  
	return SoundWave; 
}); 