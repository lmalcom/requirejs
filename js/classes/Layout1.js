define(['Page', 'KeyFrame','leapmotion', 'tween' ,'Three', 'shimUserMedia', 'shimRequestAnimationFrame'], function(Page, KeyFrame, leap){ 
	var LeapMotionPage3 = {}; 
	//Page View 
	LeapMotionPage3 = Page.extend({ 
		events: _.extend({}, Page.prototype.events, { 
			'keydown': 'changePage', 
			'click > .Panel:nth-child(1) .Button:nth-child(1)': 'createBlock', 
			'click .Panel:nth-child(1) .Button:nth-child(2)': 'play', 
		}), 
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, { 
			'background':'url("images/black_lozenge.png")', 
			'#ARPageRenderer': { 
				"position":"absolute", 
				"left":0, 
				"top":0, 
				"z-index":0, 
			}, 
			'& > .Panel:nth-child(1)': { 
				'top':0, 
				'right':0, 
				'display':'block', 
				'z-index':1, 
				'position':'absolute', 
				'width':'auto' 
			}, 
			'& > .Panel:nth-child(2)': {
				'bottom':0,
				'right':0, 
				'display':'block', 
				'z-index':1, 
				'position':'absolute', 
				'height':'70px', 
				'background-color': 'rgba(0, 0, 0, .25)'
			}, 
			'.KeyFrame':{
				'width':(100/3) + '%', 
				'border':'1px grey solid'
			}
		}),
		options:{
			rate: 1000/60, 
			animated: true, 
		},	
		className: Page.prototype.className + ' Layout1', 
		initialize: function(options){ 
			var page = this; 
			Page.prototype.initialize.call(this, options); 

			//leap motion
			var leap = this.leap = new Leap.Controller({enableGestures: true}); 
			leap.connect(); 

			//sockets 
			controller.socket.on('updateHand', function(dat){ 
				page.moveCharacter(dat); 
			}); 
			controller.socket.on('changePage', function(dat){
				page.changePage(); 
			}); 
			if(!this.model.subcollection){ 
				this.model.subcollection = new Backbone.Collection([ 

					//Buttons 
					new Backbone.Model({defaultView: 'Panel'}, { 
							subcollection: new Backbone.Collection([ 
								new Backbone.Model({defaultView: 'Button', text: 'New Block Man'}), 
								new Backbone.Model({defaultView: 'Button', text: 'Play'}), 
							]), 
					}), 

					//timeline 
					new Backbone.Model({defaultView: 'Panel'}, { 
							subcollection: new Backbone.Collection([ 
								new Backbone.Model({defaultView: 'KeyFrame', start: 1}),
								new Backbone.Model({defaultView: 'KeyFrame', start: 2}),
								new Backbone.Model({defaultView: 'KeyFrame', start: 3}),
							]), 
					}), 
					//new Backbone.Model({defaultView: 'LiveButton'}), 
				]); 
			} 

			this.objects = []; 
			this.keyframes = []; 
			//socketio stuff 
			/*page.leap.on('frame', function(frame){
				var ret = {
					hands: [], 
					pointables: [], 
					gestures: []
				}; 
				_.each(frame.hands, function(hand){
					ret.hands.push({
						id: hand.id, 
						palmPosition: hand.palmPosition, 
						_rotation: hand._rotation
					}); 
				})
				_.each(frame.pointables, function(pointable){
					ret.pointables.push({
						id: pointable.id, 
						tipPosition: pointable.tipPosition, 
						direction: pointable.direction
					}); 
				})
				_.each(frame.gestures, function(gesture){
					ret.gestures.push({
						type: gesture.type
					})
				}); 
				
				page.socket.emit('updateHand', ret); 
			})*/
			$(document).on('keypress', function(ev){                
                if(ev.keyCode === 51 || ev.which === 51){
                    page.socket.emit('changePage', {}); 
                    page.changePage(); 
                } 
            }) 
		}, 
		diffAngle: 0, 
		currentFrame: 0, 
		currentFrameNumber: 0, 
		createBlock: function(ev){
			var person = this.createPerson(); 
			var personOb = {mesh: person, keyframes:[{},{},{}]}; 
			this.scene.add(person); 
			_.each(person.children[0].children, function(child){ 
				if(child.material) child.material.color.setRGB(Math.random(), Math.random(), Math.random()); 
			}); 
			person.position.setX(0); 
			person.position.setZ(-250);  
			this.objects.push(personOb); 
			this.person = personOb; 
			this.trigger('addedObject'); 
		}, 
		play: function(person){ 
			_.each(this.objects, function(person){
				console.log('person!: ', person); 
				var key1 = _.clone(person.keyframes[0]), 
					key2 = _.clone(person.keyframes[1]), 
					key3 = _.clone(person.keyframes[2]); 

				var tween1 = new TWEEN.Tween(key1).to(key2, 2000)
					.onStart(function(){ 
						page.animating = true; 
					}) 
					.onUpdate(function(){ 
						//move camera from -200 to 1000 
						person.mesh.position.setX(key1.x); 
						person.mesh.position.setY(key1.y); 
						person.mesh.position.setZ(key1.z); 
					}) 
					.onComplete(function(){ 

					}) 
					.start(); 

				var tween2 = new TWEEN.Tween(key2).to(key3, 2000)
					.onStart(function(){
						
					})
					.onUpdate(function(){ 
						person.mesh.position.setX(key2.x); 
						person.mesh.position.setY(key2.y); 
						person.mesh.position.setZ(key2.z);  
					})
					.delay(2000)
					.start(); 
			})
		},
		changePage: function(ev){
			window.location.href = 'http://dataroper.com/fractaleap'; 
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
					x: (pointable.tipPosition[0] * 6), 
		        	y: (pointable.tipPosition[1] * 3/5), 
		        	z: (pointable.tipPosition[2] * 3) - 500, 
				}, 
				rotation: { 
					x: -(pointable.direction[2] * 90), 
		        	y: -(pointable.direction[1] * 90), 
		        	z: (pointable.direction[0] * 90), 
				} 
			} 
		}, 
		setKeyFrame: function(frame){
			_.each(this.keyframes, function(keyframe, index){
				if(keyframe.active) page.moveCharacter(index);  
			})
		},
		moveCharacter: function(index){ 
			var page = this; 
			//create hand blocks 
			if(page.frame.hands.length > 0 && this.person){  
				page.moveBody(page.getHandPos(page.frame.hands[0]), index); 
			} 

			return this; 
		}, 
		moveBody: function(handPos, index){ 
			if(handPos && handPos.position){
				this.person.mesh.position.setX(handPos.position.x); 
				this.person.mesh.position.setY(handPos.position.y); 
				this.person.mesh.position.setZ(handPos.position.z); 

				if(_.isNumber(index)) this.person.keyframes[index] = { 
					x: handPos.position.x, 
					y: handPos.position.y, 
					z: handPos.position.z 
				}
			}			
					
			return this; 
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
				 new THREE.WebGLRenderer({ alpha: true });  
			//this.renderer = new THREE.CanvasRenderer(); 
			this.renderer.setSize( window.innerWidth, window.innerHeight ); 
			this.renderer.domElement.id = 'ARPageRenderer'; 
			this.renderer.setClearColor( 0x191919, 0); 

			// setup lights 
			this.scene.add(new THREE.AmbientLight(0xffffff).cameraVisible = true); 

			var light	= new THREE.DirectionalLight(0xffffff);
			light.cameraVisible = true 
			light.position.set(3, -3, 1).normalize(); 
			this.scene.add(light); 

			var light	= new THREE.DirectionalLight(0xffffff); 
			light.cameraVisible = true 
			light.position.set(-0, 2, -1).normalize(); 
			this.scene.add(light);	

			this.$el.append( this.renderer.domElement );

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
					//page.emitHands(frame); 
					page.setKeyFrame(frame); 
				} 

				// trigger the rendering 
				if(page.renderer){ 
					page.renderer.clear(); 
					page.renderer.render(page.scene, page.camera); 
				} 
				
				TWEEN.update(); 
				setTimeout(function(){ 
					window.requestAnimationFrame(function(){ 
						page.animate(); 
					}); 
				}, page.options.rate); 				
			}			
		}, 

		//NO LONGER USED...this is an example of the animation. Should be able to create tweens for each of the objects 
		start: function(){ 
			var page = this; 
			page.animating = true; 
			page.playerModel.position.set(0, 0 , -250); 

			//move camera 3 times 
			setTimeout(function(){
				page.camera.position.set(Math.random()*-500, Math.random()*500, Math.random()*1000); 
				page.camera.lookAt(new THREE.Vector3(page.playerModel.position.x, page.playerModel.position.y, page.playerModel.position.z)); 
			}, 1000); 

			setTimeout(function(){
				page.camera.position.set(Math.random()*500, Math.random()*-1000, Math.random()*1000); 
				page.camera.lookAt(new THREE.Vector3(page.playerModel.position.x, page.playerModel.position.y, page.playerModel.position.z)); 
			}, 3000); 

			setTimeout(function(){
				page.camera.position.set(Math.random()*-1500, Math.random()*500, Math.random()*1000); 
				/*page.playerModel.position.setX(Math.random()*-500); 
				page.playerModel.position.setY(Math.random()*500); */
				page.camera.lookAt(new THREE.Vector3(page.playerModel.position.x, page.playerModel.position.y, page.playerModel.position.z)); 
				//page.camera.target.position.copy( page.playerModel.position ); 
			}, 4000); 

			//camera tween 
			var start = Date.now()/1000; 
			var from = { 
				angle: 0, 
				camera: 0, 
			}; 
			var to = { 
				angle: 4*Math.PI, 
				camera: 1700, 
			}; 
			var tween = page.tween3 = new TWEEN.Tween(from).to(to, 20000)
				.onStart(function(){ 
					page.scene2Animating = true; 
				})
				.onUpdate(function(){ 
					//move camera from -200 to 1000 
					var radius = 900; 
					page.playerModel.position.setY(from.camera + 50); 
					//page.camera.position.set(-750, from.camera, 0); 
					page.camera.position.set(-250 + radius*Math.cos(from.angle), from.camera, - 250 + radius*Math.sin(from.angle));
					page.camera.lookAt(new THREE.Vector3(page.scene2.position.x, page.playerModel.position.y, page.scene2.position.z)); 


					//move 
					//var currentTime = Date.now()/1000 - start; 
				}) 
				.onComplete(function(){ 
					page.playerModel.position.setY(from.camera + 50); 
					page.animating = false; 
					page.scene2Animating = false; 
				}) 
				.delay(4000)
				.start(); 

			//space tween 
			var currentColor = page.playerModel.children[0].children[0].material.color; 
			var from2 = {
				z: 0, 
				r: currentColor.r, 
				g: currentColor.g, 
				b: currentColor.b
			};  
			var tween2 = page.tween = new TWEEN.Tween(from2).to({
					z: Math.PI*2, 
					r: Math.random(), 
					g: Math.random(), 
					b: Math.random()
				}, 1000)
				.onStart(function(){
					
				})
				.onUpdate(function(){ 
					page.playerModel.rotateZ(from2.z); 					
					_.each(page.playerModel.children[0].children, function(appendage){
						if(material = appendage.material) material.color.setRGB(from2.r, from2.g, from2.b); 
					}); 
				})
				.onComplete(function(){
					page.playSound();
				})
				.delay(10000)
				.start();  
			return this; 
		}, 
		render: function(){ 
			window.page = this; 
			//start module 	
			var page = this; 
			Page.prototype.render.call(this); 
			$('body').append(page.el); 
			
			page.createScene(); 

			//start AR 
			page.animate();
			page.renderCSS();
			return this; 
		}, 
	});  
	return LeapMotionPage3; 
}); 