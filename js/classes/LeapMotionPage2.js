define(['LeapMotionPage'], function(LMP){
	var LeapMotionPage2 = {}; 
	//Page View 
	LeapMotionPage2 = LMP.extend({ 	
		initialize: function(options){
			var page = this; 
			LMP.prototype.initialize.call(this, options); 
			this.ids = {}; 
			this.socket.on('updateHand', function(dat){
				page.createHand(dat); 
			}); 
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
		createHand: function(frame){
			var page = this; 

			//create hand blocks
			_.each(frame.hands, function(hand){
				var handPos = page.getHandPos(hand); 
				page.updateBlock(handPos);
			}); 

			//create fingers 
			_.each(frame.pointables, function(pointable){
				var pointablePos = page.getPointablePosition(pointable); 
				page.updateBlock(pointablePos);
			})		

			return this; 		
		},
		updateBlock: function(position){ 
			if(typeof page.ids[position.id] == 'undefined'){
				var cube = new THREE.CubeGeometry(50,50,50); 
				var material = new THREE.MeshLambertMaterial({color: 0xd12b2b}); 
				var mesh = new THREE.Mesh(cube, material); 
				mesh.position.set(position.position.x, position.position.y, position.position.z); 
				mesh.rotation.set(position.rotation.x, position.rotation.y, position.rotation.z); 
				page.ids[position.id] = mesh; 
				page.scene.add(mesh);
			}else{
				var mesh = page.ids[position.id]; 
				mesh.position.set(position.position.x, position.position.y, position.position.z); 
				mesh.rotation.set(position.rotation.x, position.rotation.y, position.rotation.z); 
			}
			return this; 
		},
		createScene: function(){ 

			//THREE vars 
			console.log(THREE); 
			this.scene = new THREE.Scene(); 
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
			this.scene.add(this.camera); 
			/*this.renderer = (!window.WebGLRenderingContext || !document.createElement('canvas').getContext('webgl'))?
				 new THREE.CanvasRenderer():
				 new THREE.WebGLRenderer(); */
			this.renderer = new THREE.CanvasRenderer(); 
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.domElement.id = 'ARPageRenderer'; 
			//this.renderer.autoClear = false; 

			// setup lights
			this.scene.add(new THREE.AmbientLight(0xffffff));

			var light	= new THREE.DirectionalLight(0xffffff);
			light.position.set(3, -3, 1).normalize();
			this.scene.add(light);

			var light	= new THREE.DirectionalLight(0xffffff);
			light.position.set(-0, 2, -1).normalize();
			this.scene.add(light);		

			//add to scene 
			//this.scene.add(object3d); 
			//console.log(this.scene); 

			this.$el.append( this.renderer.domElement );

			return this; 
		},
		animate: function(){ 
			var page = this; 

			if(this.options.animated){ 

				//get leap motion frame 
				var frame = page.frame = page.leap.frame(); 
				if(frame.hands.length > 0){ 					
					//var handPos = page.getHandPos(frame.hands[0]); 
					//page.camera.position.set(pos.position.x*10, pos.position.y*10, pos.position.z*10); 
					page.createHand(frame); 
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
					console.log('frame: ', frame, 'copy: ', {hands: hands, pointables: pointables})
					page.socket.emit('updateHand', {hands: hands, pointables: pointables}); 
				}

				// trigger the rendering 
				if(page.renderer){ 
					//page.renderer.clear(); 
					page.renderer.render(page.scene, page.camera); 
				} 
				setTimeout(function(){
					window.requestAnimationFrame(function(){ 
						page.animate(); 
					}); 
				}, page.options.rate); 				
			}			
		}, 
	});  
	return LeapMotionPage2; 
}); 