define(['Page', 'io', 'leapmotion','Three', 'shimUserMedia', 'shimRequestAnimationFrame', ], function(Page, io, leap){
	var LeapMotionPage = {}; 
	//Page View 
	LeapMotionPage = Page.extend({ 
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, { 
			'#ARPageRenderer': { 
				"position":"absolute", 
				"left":0, 
				"z-index":100,
			}, 
		}), 
		socket: io.connect('http://' + window.location.hostname + ':8800'), 
		options:{
			rate: 50, 
			animated: true, 
		},		
		initialize: function(options){ 
			var page = this; 
			Page.prototype.initialize.call(this, options); 
			//initialize geolocation and set center there 
			var leap = this.leap = new Leap.Controller(); 
			leap.connect(); 

			this.socket.on('changeCameraPos', function(pos){
				console.log('oh hey', pos); 
				if(page.camera) page.camera.position.set(pos.position.x*10, pos.position.y*10, pos.position.z*10); 
			}); 
		},
		leapToScene: function( frame , leapPos ){
		    var iBox = frame.interactionBox;

		    var left = iBox.center[0] - iBox.size[0]/2;
		    var top = iBox.center[1] + iBox.size[1]/2;

		    var x = leapPos[0] - left;
		    var y = leapPos[1] - top;

		    x /= iBox.size[0];
		    y /= iBox.size[1];

		    x *= this.$el.width();
		    y *= this.$el.height();

		    return [ x , -y ];
		},
		getHandPos: function(hand){
			return {
				position:{
					x: (hand.palmPosition[0] * 3),
		        	y: -((hand.palmPosition[1] * 3) - 400),
		        	z: -((hand.palmPosition[2] * 3) - 200),
				}, 
				rotation: {
					x: (hand._rotation[2] * 90),
		        	y: (hand._rotation[1] * 90),
		        	z: (hand._rotation[0] * 90),
				}
			}
		},
		render: function(){ 
			window.page = this; 
			//start module 	
			var page = this; 
			$('body').append(page.el); 
			
			//if mobile 
			if(window.innerWidth < 800){ 
				//create two boxes if on a small device 
				var box = $('<div id="cube" class="btn"><p> Make a Cube! </p></div>'); 
				var sphere = $('<div id="sphere" class="btn"><p> Make a Sphere! </p></div>');  

				page.$el.append(box).append(sphere); 
				$('.btn').on('mousedown', function(ev){ 
					//emit a box or sphere 
					page.socket.emit('draw', {type: ev.target.id}); 
				}); 
			}else{ 
				//otherwise render the AR projection 
				//initialize THREE scene 
				var THREE = window.THREE; 
				page.createScene(); 

				//show the video stuff 
				/*var video = document.createElement('video'); 
				page.$el.append(video); 
				navigator.getUserMedia({video:true}, function(stream) { 
					var videoEl 	= video; 
					videoEl.width	= 320; 
					videoEl.height	= 240; 
					videoEl.loop	= true; 
					videoEl.volume	= 0; 
					videoEl.autoplay= true; 
					videoEl.controls= true; 
					videoEl.src 	= window.URL.createObjectURL(stream); 
				}, function(error) { 
					alert("Couldn't access webcam."); 
				}); */

				//socketio calls
				/*page.socket.on('create', function(dat){
					if(!page.obs) page.obs = []; 
					page.obs.push(dat); 

					//add cube 
					var cube = new THREE.CubeGeometry(50,50,50); 
					var material = new THREE.MeshLambertMaterial({color: 0xd12b2b}); 
					var mesh = new THREE.Mesh(cube, material); 
					var position = page.getRelativePosition(dat.location, 10000)
					mesh.position.z = position.z; 
					mesh.position.x = position.x; 
					mesh.position.y = position.y; 

					//add to scene 
					page.scene.add(mesh); 
				}); */

				//start AR 
				page.animate(); 
				/*$(document).on('mousemove', function(ev){ 
					var position = page.camera.position; 
					var x = ev.pageX, 
						y = ev.pageY; 
					page.camera.position.set(x*10, 0, (y*10 - window.innerWidth/2)); 
				})	*/					
			}
			page.renderCSS();
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

			// setup lights
			this.scene.add(new THREE.AmbientLight(0xffffff));

			var light	= new THREE.DirectionalLight(0xffffff);
			light.position.set(3, -3, 1).normalize();
			this.scene.add(light);

			var light	= new THREE.DirectionalLight(0xffffff);
			light.position.set(-0, 2, -1).normalize();
			this.scene.add(light);

			//3d object to bind objects to 
			var object3d = new THREE.Object3D(); 

			//add cube 
			_.times(100, function(){
				var cube = new THREE.CubeGeometry(50,50,50); 
				var material = new THREE.MeshLambertMaterial({color: 0xd12b2b}); 
				var mesh = new THREE.Mesh(cube, material); 
				mesh.position.z = Math.random()*-1000; 
				mesh.position.x = Math.random()*1000; 
				mesh.position.y = Math.random()*500; 
				mesh.rotation.set(Math.random()*360, Math.random()*360, Math.random()*360)
				object3d.add(mesh); 
			}); 
			

			//add to scene 
			this.scene.add(object3d); 
			console.log(this.scene); 

			this.$el.append( this.renderer.domElement );

			return this; 
		},
		animate: function(){ 
			var page = this; 

			if(this.options.animated){ 

				//get leap motion frame 
				var frame = page.frame = page.leap.frame(); 
				if(frame.hands.length > 0){ 					
					var pos = page.getHandPos(frame.hands[0]); 
					page.camera.position.set(pos.position.x*10, pos.position.y*10, pos.position.z*10); 
					page.socket.emit('changeCameraPos', pos); 
				}

				// trigger the rendering 
				if(page.renderer){ 
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
	return LeapMotionPage; 
}); 