define(['Page', 'io', 'Three', 'Threex', 'shimUserMedia', 'shimRequestAnimationFrame'], function(Page, io){
	var ARPage = {}; 

	//Page View 
	ARPage = Page.extend({ 
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, {
			'video': {
				'width':"100%", 
				'height':"100%", 
				'position':'fixed', 
				'z-index':-1,
			},
			'#ARPageRenderer': {
				"position":"absolute", 
				"left":0, 
				"z-index":100,
			}, 
			'.btn': {
				'width':'200px',
				'height':'200px', 
				'display':'inline-block',
				'float':'left',
				'margin':'10px',
				'border':'1px dotted rgba(0,0,0,.3)',
				'background-color':'rgba(0,0,0,.5)',
			},
			'.btn:hover': {
				'background-color':'rgba(0,0,0,.8)',
			}
		}), 
		socket: io.connect('http://' + window.location.hostname),
		threshold: 40, 
		markers:{}, 
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
				var video = document.createElement('video'); 
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
				}); 

				//THREEx
				page.threexAR	= new THREEx.JSARToolKit({ 
					srcElement	:  video, 
					threshold	:  page.threshold, 
					canvasRasterW: page.$el.width(), 
					canvasRasterH: page.$el.height(), 
					camera 		:  page.camera, 
					debug		:  false,
					callback	:  function(event){
						( event.type === 'create' )? page.createMarker(event):
						( event.type === 'delete' )? page.deleteMarker(event):
						( event.type === 'update' )? page.updateMarker(event): 
							console.log('event of unknows type: ', event); 
					} 
				}); 	

				//socketio calls
				page.socket.on('create', function(dat){
					console.log('got something from socketio!', dat); 
					if(marker = page.currentMarker){
						//add cube 
						var geometry = (dat.type === 'cube')? 
							new THREE.CubeGeometry(50,50,50): 
							new THREE.SphereGeometry(50); 
						var material = new THREE.MeshLambertMaterial({color: 0xd12b2b}); 
						var mesh = new THREE.Mesh(geometry, material); 
						mesh.position.z = Math.random()*200; 
						mesh.position.x = Math.random()*200; 
						mesh.position.y = Math.random()*200; 
						marker.object3d.add(mesh); 
					}
				}); 

				//start AR 
				page.animate(); 							
			}
			page.renderCSS();
		}, 
		createScene: function(){ 

			//THREE vars 
			console.log(THREE); 
			this.scene = new THREE.Scene(); 
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
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

			this.$el.append( this.renderer.domElement );

			return this; 
		},
		createMarker: function(ev){ 
			if(this.markers[ev.markerId] === undefined){ 
				var markerId	= ev.markerId; 
				var marker = this.currentMarker = this.markers[markerId]= {}; 

				//3d object to bind objects to 
				marker.object3d = new THREE.Object3D(); 
				marker.object3d.matrixAutoUpdate = false; 

				//add cube 
				var cube = new THREE.CubeGeometry(50,50,50); 
				var material = new THREE.MeshLambertMaterial({color: 0xd12b2b}); 
				var mesh = new THREE.Mesh(cube, material); 
				mesh.position.z = 200; 
				marker.object3d.add(mesh); 

				//add to scene 
				this.scene.add(marker.object3d); 
			} 
		}, 
		updateMarker: function(ev){ 
			this.renderer.clear(); 
			var markerId	= ev.markerId; 
			var marker	= this.markers[markerId]; 
			marker.object3d.matrix.copy(ev.matrix); 
			
			this.camera.matrixWorldNeedsUpdate = true; 
			marker.object3d.matrixWorldNeedsUpdate = true; 
			return this; 
		}, 
		deleteMarker: function(ev){ 

		}, 
		animate: function(){ 
			var page = this; 
			if(page.threexAR) page.threexAR.update(); 
			// trigger the rendering 
			if(page.renderer){
				page.renderer.autoClear = false; 
				//this.renderer.clear(); 
				page.renderer.render(page.scene, page.camera); 
			}
			window.requestAnimationFrame(function(){
				page.animate(); 
			}); 
		}
	});  
	return ARPage; 
}); 