define(['SoundVisualizer','processing'], function(SV){ 
	var SoundProcessing = {}; 
	//Page View 
	SoundProcessing = SV.extend({ 
		className: SV.prototype.className + ' SoundProcessing', 
		defaultCSS: _.extend({}, SV.prototype.defaultCSS, { 
			
		}), 
		playSound: function(ev) { 
		  var source = this.source = this.context.createBufferSource(); // creates a sound source 
		  source.buffer = this.buffer;          // tell the source which sound to play 
		  source.connect(this.analyser);		// connect the source to the analyser 
		  this.analyser.connect(this.context.destination); //then to the context's destination, the speakers 

		  source.start(0, this.startOffset % this.buffer.duration);  // play the source now		
		  this.startTime = this.context.currentTime; // set start time for pausing later 
		  this.options.animated = true;  		  
		  return this;                               // note: on older systems, may have to use deprecated noteOn(time);
		}, 
		render: function(){ 
			SV.prototype.render.call(this); 
			var block = this; 
			var analyser = this.analyser; 
			var pjs = this.processing = new Processing(this.$el.find('.analyser')[0]); 
			
			pjs.setup = function(){
				pjs.size(window.innerWidth, window.innerHeight); 
				pjs.frameRate(30); 
				pjs.background(100); 
			}; 
			pjs.draw = function(){
				if(block.options.animated){
					pjs.background(100); 
					block.analyseSound(); 
					if(block.options.freqDomain){
						var len = analyser.frequencyBinCount; 
						while(len--) block.blockTemplate(pjs, len); 
					}	
				}	
			}; 
			pjs.setup(); 
			return this; 
		}, 
		blockTemplate: function(pjs, i){
			var block = this; 
			var analyser = this.analyser; 
			//get data and define options for box to be drawn (there are 1024)
			var value 	= block.options.freqDomain[i],  
				percent = value / 256, 
				height 	= pjs.height * percent; 
				offset 	= pjs.height - height - 1; 
				barWidth= pjs.width/analyser.frequencyBinCount; 
			pjs.fill(255); 
			pjs.stroke(100); 
			pjs.ellipse(i * barWidth, offset, barWidth, height); 
		}

	});  
	return SoundProcessing; 
}); 