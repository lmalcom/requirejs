define(['SoundWave', 'shimRequestAnimationFrame'], function(SoundWave){ 
	var SoundVisualizer = {}; 

	//Page View 
	SoundVisualizer = SoundWave.extend({ 
		className: SoundWave.prototype.className + ' SoundVisualizer', 
		defaultCSS: _.extend({}, SoundWave.prototype.defaultCSS, { 
			'canvas':{
				'position':'absolute', 
				'width':'100%', 
				'height':'100%', 
				'left':'0', 
				'top':'0', 
				'z-index':'-1'
			}
		}), 
		events:_.extend({}, SoundWave.prototype.events, {
			
		}),
		initialize: function(options){ 
			SoundWave.prototype.initialize.call(this, options); 			
			var analyser = this.analyser = this.context.createAnalyser();
		},
		template: function(dat){
			var prevTemplate = SoundWave.prototype.template.call(this)(); 
			return _.template(prevTemplate.concat('<canvas class="analyser"></canvas>')); 
		},
		playSound: function(ev) {
		  var source = this.source = this.context.createBufferSource(); // creates a sound source
		  source.buffer = this.buffer;          // tell the source which sound to play
		    		// connect the source to the analyser, then context's destination (the speakers)
		  source.start(0, this.startOffset % this.buffer.duration);  // play the source now
		  source.connect(this.analyser);
		  this.analyser.connect(this.context.destination);
		  this.startTime = this.context.currentTime; // set start time for pausing later 
		  this.options.animated = true; 
		  this.animate(); 		  
		  return this;                               // note: on older systems, may have to use deprecated noteOn(time);
		}, 
		analyseSound: function(){	
			var block = this,	 
				analyser = this.analyser; 
				freqDomain = new Uint8Array(analyser.frequencyBinCount); 

			//analyze
			analyser.getByteFrequencyData(freqDomain); 

			//update data on block
			block.options.freqDomain = freqDomain; 

			return this; 
		},
		animate: function(){ 
			var block = this; 
			if(block.context) block.analyseSound().animation(); 
			if(block.options.animated)
				window.requestAnimationFrame(function(){ 
					block.animate(); 
				}); 
			return this; 			
		}, 
		animation: function(){
			var block = this, 
				analyser = block.analyser; 
			
			//clear canvas
			block.drawContext.clearRect(0,0,100,100);

			//draws a basic audio visualizer
			for (var i = 0; i < analyser.frequencyBinCount; i++) { 
				//get data and define options for box to be drawn (there are 1024)
				var value = block.options.freqDomain[i],  
					percent = value / 256, 
					height = 100 * percent,
					offset = 100 - height - 1,
					barWidth = 100/analyser.frequencyBinCount, 
					hue = i/analyser.frequencyBinCount * 360;

				//draw box 
				block.drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
				block.drawContext.fillRect(i * barWidth, offset, barWidth, height);
			}
			return this; 
		},
		render: function(){
			SoundWave.prototype.render.call(this); 
			this.drawContext = this.$el.find('.analyser')[0].getContext('2d');
			return this; 
		}

	});  
	return SoundVisualizer; 
}); 