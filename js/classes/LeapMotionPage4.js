define(['LeapMotionPage3'], function(LMP){ 
	var LeapMotionPage4 = {}; 
	//Page View 
	LeapMotionPage4 = LMP.extend({ 
		events: _.extend({}, LMP.prototype.events, {
			'keydown': 'changePage'
		}), 
		defaultCSS: _.extend({}, LMP.defaultCSS, { 
			'background':'url("images/black_lozenge.png")', 
			'.btn': {
				'width':'200px',
				'height':'200px', 
				'display':'inline-block',
				'float':'left',
				'margin':'10px',
				'border':'1px dotted rgba(0,0,0,.3)',
				'background-color':'rgba(200,200,200,.5)',
			},
			'.btn:hover': {
				'background-color':'rgba(0,0,0,.8)',
			}
		}), 
		initialize: function(options){
			var page = this; 
			LMP.prototype.initialize.call(this, options); 
			$(document).on('keypress', function(ev){                
                if(ev.keyCode === 32 || ev.which === 32){
                    page.startScene(); 
                    page.socket.emit('start'); 
                }
            }); 
			page.socket.on('start', function(dat){
				page.startScene(); 
			})
		},
		className: LMP.prototype.className + ' LeapMotionPage4', 
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

				//socketio calls
				page.socket.on('create', function(dat){
					console.log('got something from socketio!', dat); 
					if(scene = page.scene){
						//add cube 
						var geometry = (dat.type === 'cube')? 
							new THREE.CubeGeometry(50,50,50): 
							new THREE.SphereGeometry(50); 
						var material = new THREE.MeshLambertMaterial({color: 0xd12b2b}); 
						material.color.setRGB(Math.random(), Math.random(), Math.random())
						var mesh = new THREE.Mesh(geometry, material); 
						mesh.position.z = Math.random()*2000; 
						mesh.position.x = Math.random()*2000; 
						mesh.position.y = Math.random()*2000; 
						page.scene2.add(mesh); 
					}
				}); 

				//start AR 
				page.animate(); 							
			}
			page.renderCSS();
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

			//add to scene 
			/*var person = this.createPerson(); 
			this.scene.add(person); 
			this.playerModel = person; 
			this.rightleg = person.children[0].children[0]; 
			this.leftleg = person.children[0].children[1]; 
			_.each(person.children[0].children, function(child){
				console.log(child); 
				if(child.material) child.material.color.setRGB(Math.random(), Math.random(), Math.random()); 
			}); 			
			person.position.setX(0); 
			person.position.setZ(-250);  */

			/*var loader = new THREE.JSONLoader();
			loader.load( '3dmodels/sami/sami.js', function ( geo ) {
				material = new THREE.MeshLambertMaterial({color: 0xd12b2b});	
				var mesh = new THREE.Mesh(geo, material); 
				mesh.position.z = -250;
				mesh.rotation.z = 180; 
				page.scene.add( mesh );
				page.playerModel = mesh; 
			} );*/

			var loader = new THREE.JSONLoader();
			loader.load( '3dmodels/sami2/sami2.js', function ( geo, material ) {
				console.log(geo, material); 	
				var mesh = new THREE.Mesh(geo, new THREE.MeshFaceMaterial( material )); 
				mesh.position.z = -250;
				mesh.rotation.z = 180; 
				mesh.rotation.set(30,0,180); 
				mesh.scale.set(10,10,10); 
				page.scene.add( mesh );
				page.playerModel = mesh; 
			} );

			//scene 2 
			var scene2 = page.scene2 = new THREE.Object3D(); 
			_.times(10, function(n){ 
				var angle = Math.PI + 10*n; 
				var brick = new THREE.CubeGeometry(Math.random()*150, Math.random()*150, Math.random()*150);
				//var brick = new THREE.SphereGeometry(Math.random()*150); 
				var material = new THREE.MeshLambertMaterial; 
				material.color.setRGB(Math.random(), Math.random(), Math.random()); 
				var mesh = new THREE.Mesh(brick, material); 
				mesh.position.set(20*n*Math.cos(angle + 10*n), 20*n*Math.sin(angle + 10*n), 0); 
				scene2.add(mesh); 
			}); 
			scene2.position.setX(0); 
			scene2.position.setY(1000); 
			scene2.position.setZ(-500); 
			this.scene.add(scene2); 

			// scene2.visible = false; 

			//scene 3 
			var scene3 = page.scene3 = new THREE.Object3D(); 
				_.times(20, function(n){ 
					var person = page.createPerson(); 
					var angle = n*Math.PI*2/10; 
					var radius = 100; 
					var cz = -150; 
					// person.position.set(100*Math.cos(angle), 0, -150 + 100*Math.sin(angle));
					person.position.set(radius*Math.cos(angle), 0, cz + radius*Math.sin(angle));
					scene3.add(person); 
				});
			scene3.position.setX(0); 
			this.scene.add(scene3); 

			this.$el.append( this.renderer.domElement );
			this.renderCSS(); 

			return this; 
		},
		setGestures: function(){}, 
		startScene: function(ev){ 
			var from = {
				z: 0
			};  
			var tween = new TWEEN.Tween(from)
				.to({z: Math.PI*2}, 500)
				.onUpdate(function(){ 
					page.playerModel.rotateZ(from.z); 					
				})
				.onComplete(function(){

				})
				.start()
			if(!page.animating) page.start();  					
		}, 
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
					page.camera.position.set(-250 + radius*Math.cos(from.angle), from.camera, -250 + radius*Math.sin(from.angle));
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
			var currentColor = page.playerModel.color; 
			var from2 = {
				z: 0
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
				})
				.onComplete(function(){
					page.playSound();
				})
				.delay(10000)
				.start();  
			return this; 
		},
		moveLegs: function(){ }, 
	});  
	return LeapMotionPage4; 
}); 