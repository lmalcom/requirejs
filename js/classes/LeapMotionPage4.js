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
			var person = this.createPerson(); 
			this.scene.add(person); 
			this.playerModel = person; 
			this.rightleg = person.children[0].children[0]; 
			this.leftleg = person.children[0].children[1]; 
			_.each(person.children[0].children, function(child){
				console.log(child); 
				if(child.material) child.material.color.setRGB(Math.random(), Math.random(), Math.random()); 
			}); 			
			person.position.setX(0); 
			person.position.setZ(-250);  

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
	});  
	return LeapMotionPage4; 
}); 