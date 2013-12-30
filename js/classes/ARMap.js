define(['Page', 'io', 'Three', 'shimUserMedia', 'shimRequestAnimationFrame'], function(Page, io){
	var ARMap = {}; 

	//Page View 
	ARMap = Page.extend({ 
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
		}), 
		socket: io.connect('http://' + window.location.hostname + ':8800'), 
		rate: 250, 
		animated: true, 
		initialize: function(options){ 
			var page = this; 
			Page.prototype.initialize.call(this, options); 
			//initialize geolocation and set center there 
			navigator.geolocation.getCurrentPosition(function(location){ 
				page.location = {}; 
				page.location.center = {
					lat: location.coords.latitude, 
					lng: location.coords.longitude
				}; 
				page.setSelfPosition({
					lat: location.coords.latitude, 
					lng: location.coords.longitude
				}); 
				page.camera.position.set(page.location.position.x, page.location.position.y, page.location.position.z)
			});		
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
				page.socket.on('create', function(dat){
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
				}); 

				//start AR 
				page.animate(); 
				$(document).on('mousemove', function(ev){ 
					var position = page.camera.position; 
					var x = ev.pageX, 
						y = ev.pageY; 
					page.camera.position.set(x*10, 0, (y*10 - window.innerWidth/2)); 
				})						
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
			/*_.times(10, function(){
				var cube = new THREE.CubeGeometry(50,50,50); 
				var material = new THREE.MeshLambertMaterial({color: 0xd12b2b}); 
				var mesh = new THREE.Mesh(cube, material); 
				mesh.position.z = Math.random()*-1000; 
				mesh.position.x = Math.random()*1000; 
				mesh.position.y = Math.random()*500; 
				mesh.rotation.set(Math.random()*360, Math.random()*360, Math.random()*360)
				object3d.add(mesh); 
			}); */
			

			//add to scene 
			this.scene.add(object3d); 
			console.log(this.scene); 

			this.$el.append( this.renderer.domElement );

			return this; 
		},
		animate: function(){ 
			var page = this; 

			// trigger the rendering 
			if(page.renderer){ 
				page.renderer.render(page.scene, page.camera); 
			} 
			window.requestAnimationFrame(function(){ 
				page.animate(); 
			}); 
		}, 

		//This sets the page's position in the WORLD, so it has x/y/z coordinates based on latitude/longitude
		setSelfPosition: function(location){ 
			var page = this, 
				lat = location.lat || page.location.center.lat, 
				lng = location.lng || page.location.center.lng,
				position = page.location.position = {}; 

			//set position 
			position.x = Math.cos( lng ) * Math.cos( lat ), 
			position.y = Math.sin( lng ) * Math.cos( lat ), 
			position.z = Math.sin( lat ); 

			return this; 
		},

		//this returns a position relative to the page based on lat/lon. 
		//This means that the position is always relative to (0,0,0), or the page itself. 
		getRelativePosition: function(location, scalar){
			var page = this; 
			var lat = location.lat, 
				lng = location.lng, 
				pagePosition = page.location.position, 
				scalar = scalar || 1; 
				R = 6371; // km for earth Radius
			if(! page.location.position.x) page.setSelfPosition(); 
			return {
				x: (Math.cos( lng ) * Math.cos( page.location.center.lng ) - pagePosition.x)*scalar, 
				y: (Math.sin( lng ) * Math.cos( lat ) - pagePosition.y)*scalar, 
				z: (Math.sin( lat ) - pagePosition.z)*scalar
			}
		},
		getAngle: function(loc1, loc2){ 

		}, 
		getDistance: function(loc1, loc2){ 
			if(!loc1) return; 			
			var page = this; 
			var R = 6371; // km 
			var loc2 = (loc2)? loc2: page.location.center; 

			var lat1 = loc1.lat, 
				lon1 = loc1.lng, 
				lat2 = loc2.lat, 
				lon2 = loc2.lng; 
			var dLat = page.toRad(lat2-lat1);
			var dLon = page.toRad(lon2-lon1);
			var lat1 = page.toRad(lat1);
			var lat2 = page.toRad(lat2);

			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));  
			var d = R * c; 
			return d; 
		}, 
		toRad: function(angle){
			return angle * (Math.PI / 180); 
		}
	});  
	return ARMap; 
}); 