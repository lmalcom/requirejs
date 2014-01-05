define(['LeapMotionPage','dancer', 'tween'], function(LMP){ 
	var LeapMotionPage3 = {}; 
	//Page View 
	LeapMotionPage3 = LMP.extend({ 
		defaultCSS: _.extend({}, LMP.defaultCSS, { 
			'background':'url("images/black_lozenge.png")' 
		}), 
		className: LMP.prototype.className + ' LeapMotionPage3', 
		initialize: function(options){ 
			var page = this; 
			LMP.prototype.initialize.call(this, options); 
			this.ids = {}; 
			this.socket.on('updateHand', function(dat){ 
				page.moveCharacter(dat); 
			}); 
			// Fix up prefixing 
			window.AudioContext = window.AudioContext || window.webkitAudioContext; 
			this.context = new AudioContext(); 
			var analyser = this.analyser = this.context.createAnalyser(); 
			this.startTime = 0, 
			this.startOffset = 0; 
			this.loadSound('../../sounds/100_BrazilianVinyl.ogg'); 
			

			$(document).on('click', function(ev){ 
				


				/*var difAngle = {angle: 0}; 
				var tween3 = page.tween3 = new TWEEN.Tween(difAngle).to({angle: Math.PI*4}, 2000); 
				tween3.onUpdate(function(){ 
					_.each(page.scene3.children, function(child, index){ 
						var angle = index*Math.PI/10 + difAngle.angle;
						child.position.set(100*Math.cos(angle), 0, -150 + 100*Math.sin(angle)); 
					}); 
				}); */ 
				tween.start(); 
				// tween3.start(); 
			}); 
		},
		diffAngle: 0, 
		currentFrame: 0, 
		currentFrameNumber: 0, 
		loadSound: function(url) {
			var page = this; 
		  	var request = new XMLHttpRequest();
		  	request.open('GET', (url || page.options.src), true);
		  	request.responseType = 'arraybuffer';

		  	// Decode asynchronously
		  	request.onload = function() {
		    	page.context.decodeAudioData(request.response, function(buffer) {
		      		page.buffer = buffer;
		      		//page.playSound(); 
		    	}, function(err){
		    		console.log(err); 
		    	});
		  	}
		  	request.send();
		}, 
		playSound: function(ev) {
		  	var source = this.source = this.context.createBufferSource(); // creates a sound source
		  	source.buffer = this.buffer;          // tell the source which sound to play
		  	source.start(0);  // play the source now
		  	source.connect(this.analyser);
		  	this.analyser.connect(this.context.destination);
		  	this.startTime = this.context.currentTime; // set start time for pausing later 
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
		getHandPos: function(hand){
			return {
				id: hand.id, 
				position:{
					x: (hand.palmPosition[0] * 3),
		        	y: ((hand.palmPosition[1] * 3) - 200),
		        	z: ((hand.palmPosition[2] * 3) - 500),
				}, 
				rotation: {
					x: (hand._rotation[2] * 90),
		        	y: (hand._rotation[1] * 90),
		        	z: (hand._rotation[0] * 90),
				}
			}
		},
		getPointablePosition: function(pointable){
			return {
				id: pointable.id, 
				position:{
					x: (pointable.tipPosition[0] * 3),
		        	y: (pointable.tipPosition[1] * 3),
		        	z: (pointable.tipPosition[2] * 3) - 500,
				}, 
				rotation: {
					x: -(pointable.direction[2] * 90),
		        	y: -(pointable.direction[1] * 90),
		        	z: (pointable.direction[0] * 90),
				}
			}
		},
		moveCharacter: function(frame){
			var page = this; 

			//create hand blocks
			if(frame.hands.length > 0){
				page.moveCamera(page.getHandPos(frame.hands[0])); 
				if(hand = frame.hands[1]) page.moveBody(page.getHandPos(hand)); 				
			}
			
			if(frame.pointables.length == 2){
				page.moveLegs(page.getPointablePosition(frame.pointables[0]), page.getPointablePosition(frame.pointables[1])); 
			}	

			return this; 
		},
		moveBody: function(handPos){ 
			this.playerModel.rotation.setY(handPos.rotation.y/10); 
			this.playerModel.position.setY(handPos.position.y/10); 
			this.playerModel.position.setZ(handPos.position.z/2);
			return this; 
		},
		moveCamera: function(handPos){
			this.camera.position.setX(handPos.position.x*5); 
			this.playerModel.position.setX(handPos.position.x*5); 
		},
		moveLegs: function(pos1, pos2){
			this.leftleg.rotation.setZ(pos1.rotation.z); 
			this.rightleg.rotation.setZ(pos2.rotation.z); 

			return this; 
		}, 
		setGestures: function(frame){ 
			var page = this; 
			function onCircle(gesture){
				if(page.scene3.visible && !page.scene3Animating){ 
					var difAngle = {angle: 0}; 
					var tween3 = page.tween3 = new TWEEN.Tween(difAngle).to({angle: Math.PI*2/5}, 9000); 
					tween3.onUpdate(function(){ 
						_.each(page.scene3.children, function(child, index){ 
							var angle = index*Math.PI/10 + difAngle.angle;
							child.position.set(100*Math.cos(angle), 0, -150 + 100*Math.sin(angle)); 
						}); 
					}); 
					tween3.onComplete(function(){ 
						page.scene3Animating = false; 
					}) 
					var currentColor = page.playerModel.children[0].children[0].material.color; 
					var from = {
						z: 0, 
						r: currentColor.r, 
						g: currentColor.g, 
						b: currentColor.b
					};  
					var tween = page.tween = new TWEEN.Tween(from).to({
						z: Math.PI*2, 
						r: Math.random(), 
						g: Math.random(), 
						b: Math.random()
					}, 9000); 
					tween.onUpdate(function(){ 
						page.playerModel.rotation.setZ(from.z); 					
						_.each(page.playerModel.children[0].children, function(appendage){
							if(material = appendage.material) material.color.setRGB(from.r, from.g, from.b); 
							
						})
					}); 
					page.playSound(); 

					/*var posZ = {z: -500}; 
					var tween2 = page.tween2 = new TWEEN.Tween(posZ).to({z: -600}, 500); 
					tween2.onUpdate(function(){ 
						_.each(page.scene2.children, function(child){ 
							child.position.setZ(posZ.z + Math.random()*50); 
						}); 
					}); */

					//tween2.start(); 
					tween.start(); 
					tween3.start(); 
					page.scene3Animating = true; 					
				} 
			}
			function onSwipe(gesture){
				if(gesture.type !== 'swipe') return; 
				if(page.fading) return; 

				fadeFrame(gesture.direction[0]); 
			} 
			function fadeFrame(direction){ 
				//tween an animation to turn opacity of currect frame to 0 and next to 1 
				var currentFrameNumber = page.currentFrameNumber; 
				var from = {x: 0}; 
				var tween = new TWEEN.Tween(from).to({x: -750}, 2000); 

				tween.onUpdate(function(){ 
					if(direction > 0){ 
						page.scene.position.setX(page.scene.position.x + from.x); 
						/*page.playerModel.position.setX(from.x); 
						page.scene2.position.setX(from.x + 500); 
						page.scene3.position.setX(from.x + 1000); */
					}else{ 
						page.scene.position.setX(page.scene.position.x - from.x); 
						/*page.playerModel.position.setX(from.x); 
						page.scene2.position.setX(from.x + 500); 
						page.scene3.position.setX(from.x + 1000); */
					} 
				}); 
				tween.onComplete(function(){ 
					if(direction > 0 && page.currentFrameNumber < 2) page.currentFrameNumber++; 
					else if(direction < 0 && page.currentFrameNumber > 0) page.currentFrameNumber--; 
					page.fading = false; 
				}) 
				tween.start(); 
				page.fading = true; 
			}
			_.each(frame.gestures, function(gesture){
				switch(gesture.type){
					case 'circle': 
						onCircle(gesture); 
					/*case 'swipe': 
						onSwipe(gesture); */
				}
			});
			/*if(this.playerModel.visible){ 

			}else if(this.scene2.visible){ 

			}else */
		}, 
		createPerson: function(scene, x, y, z){			
			var charMaterial = new THREE.MeshLambertMaterial({color: 0xd12b2b});			
			var headgroup = new THREE.Object3D();
			var upperbody = new THREE.Object3D();
			
			// Left leg
			var leftleggeo = new THREE.CubeGeometry(4, 12, 4);
			for(var i=0; i < 8; i+=1) {
				leftleggeo.vertices[i].y -= 6;
			}
			var leftleg = new THREE.Mesh(leftleggeo, charMaterial);
			leftleg.position.z = -2;
			leftleg.position.y = -6;	
			
			
			// Right leg
			var rightleggeo = new THREE.CubeGeometry(4, 12, 4);
			for(var i=0; i < 8; i+=1) {
				rightleggeo.vertices[i].y -= 6;
			}
			var rightleg = new THREE.Mesh(rightleggeo, charMaterial);
			rightleg.position.z = 2;
			rightleg.position.y = -6;
			
			
			// Body
			var bodygeo = new THREE.CubeGeometry(4, 12, 8);
			var bodymesh = new THREE.Mesh(bodygeo, charMaterial);
			upperbody.add(bodymesh);
			
			
			// Left arm
			var leftarmgeo = new THREE.CubeGeometry(4, 12, 4);
			for(var i=0; i < 8; i+=1) {
				leftarmgeo.vertices[i].y -= 4;
			}
			var leftarm = new THREE.Mesh(leftarmgeo, charMaterial);
			leftarm.position.z = -6;
			leftarm.position.y = 4;
			leftarm.rotation.x = Math.PI/32;
			upperbody.add(leftarm);

			
			// Right arm
			var rightarmgeo = new THREE.CubeGeometry(4, 12, 4);
			for(var i=0; i < 8; i+=1) {
				rightarmgeo.vertices[i].y -= 4;
			} 
			var rightarm = new THREE.Mesh(rightarmgeo, charMaterial); 
			rightarm.position.z = 6; 
			rightarm.position.y = 4; 
			rightarm.rotation.x = -Math.PI/32; 
			upperbody.add(rightarm); 

			
			//Head 
			var headgeo = new THREE.CubeGeometry(8, 8, 8); 
			var headmesh = new THREE.Mesh(headgeo, charMaterial); 
			headmesh.position.y = 2; 
			headgroup.add(headmesh); 
			headgroup.position.y = 8; 

			//model 
			var playerModel = new THREE.Object3D();	
			playerModel.add(leftleg); 
			playerModel.add(rightleg);			
			playerModel.add(upperbody); 
			playerModel.add(headgroup);			
			playerModel.position.set(0, 6, 0); 
			playerModel.rotation.set(0, -Math.PI/2, 0); 
			
			//group
			var playerGroup = new THREE.Object3D();			
			playerGroup.add(playerModel);	
			return playerGroup; 
		}, 
		createScene: function(){ 
			var page = this; 

			//THREE vars 
			this.scene = new THREE.Scene(); 
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 ); 
			this.camera.position.set(0, 25, 0); 
			this.scene.add(this.camera); 
			this.renderer = (!window.WebGLRenderingContext || !document.createElement('canvas').getContext('webgl'))? 
				 new THREE.CanvasRenderer(): 
				 new THREE.WebGLRenderer();  
			//this.renderer = new THREE.CanvasRenderer(); 
			this.renderer.setSize( window.innerWidth, window.innerHeight ); 
			this.renderer.domElement.id = 'ARPageRenderer'; 
			this.renderer.setClearColorHex( 0x191919, 0); 

			// setup lights 
			this.scene.add(new THREE.AmbientLight(0xffffff)); 

			var light	= new THREE.DirectionalLight(0xffffff); 
			light.position.set(3, -3, 1).normalize(); 
			this.scene.add(light); 

			var light	= new THREE.DirectionalLight(0xffffff); 
			light.position.set(-0, 2, -1).normalize(); 
			this.scene.add(light);	

			//add to scene 
			//this.createPerson(this.scene); 
			var person = this.createPerson(); 
			this.scene.add(person); 
			this.playerModel = person; 
			this.rightleg = person.children[0].children[0]; 
			this.leftleg = person.children[0].children[1]; 
			// this.playerModel.visible = false; 

			//scene 2 
			var scene2 = page.scene2 = new THREE.Object3D(); 
				_.times(20, function(n){ 
					var angle = Math.PI + 10*n; 
					var brick = new THREE.CubeGeometry(50,50,50); 
					var material = new THREE.MeshLambertMaterial; 
					material.color.setRGB(Math.random(), Math.random(), Math.random()); 
					var mesh = new THREE.Mesh(brick, material); 
					mesh.position.set(20*n*Math.cos(angle + 10*n), 20*n*Math.sin(angle + 10*n), -400); 
					scene2.add(mesh); 
				}); 
			scene2.position.setX(500); 
			this.scene.add(scene2); 

			// scene2.visible = false; 

			//scene 3
			var scene3 = page.scene3 = new THREE.Object3D(); 
				_.times(30, function(n){ 
					var person = page.createPerson(); 
					var angle = n*Math.PI/15;
					var radius = 100; 
					var cz = -150; 
					// person.position.set(100*Math.cos(angle), 0, -150 + 100*Math.sin(angle));
					person.position.setPositionFromMatrix( new THREE.Matrix4().translate({x: radius*Math.cos(angle), y: 0, z: cz + radius*Math.sin(angle)}));
					scene3.add(person); 
				});
			this.scene.add(scene3); 

			this.$el.append( this.renderer.domElement );
			this.renderCSS(); 

			return this; 
		},
		emitHands: function(frame){
			var hands = []; 
			var pointables = []; 
			_.each(frame.hands, function(hand){
				hands.push({
					id: hand.id, 
					palmPosition: hand.palmPosition, 
					_rotation: hand._rotation
				}); 
			})
			_.each(frame.pointables, function(pointable){
				pointables.push({
					id: pointable.id, 
					tipPosition: pointable.tipPosition, 
					direction: pointable.direction
				}); 
			})
			page.socket.emit('updateHand', {hands: hands, pointables: pointables}); 
		},
		animate: function(){ 
			var page = this; 

			if(this.options.animated){ 

				//get leap motion frame 
				var frame = page.frame = page.leap.frame(); 
				if(frame.hands.length > 0){ 					
					//page.createHand(frame); 
					page.moveCharacter(frame); 
					page.emitHands(frame); 
				}
				if(frame.gestures.length > 0){
					page.setGestures(frame); 
				}

				// trigger the rendering 
				if(page.renderer){ 
					page.renderer.clear(); 
					page.renderer.render(page.scene, page.camera); 
				} 

				//move scene 3 
				if(page.options.freqDomain){
					_.each(page.scene2.children, function(child, index){ 
						child.position.setZ(-freqDomain[index]*2); 
					}); 
				}
				TWEEN.update(); 
				page.analyseSound(); 
				setTimeout(function(){
					window.requestAnimationFrame(function(){ 
						page.animate(); 
					}); 
				}, page.options.rate); 				
			}			
		}, 
	});  
	return LeapMotionPage3; 
}); 