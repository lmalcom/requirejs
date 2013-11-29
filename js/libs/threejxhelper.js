define(['Threex'], function(Threex){
	var THREE = window.THREE;
	$(function(){
	
	window.markerTest = {}; 
	markerTest.markers	= {};  

	//THREE vars 
	markerTest.scene = new THREE.Scene(); 
	markerTest.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	markerTest.scene.add(markerTest.camera); 
	markerTest.renderer = (!window.WebGLRenderingContext || !document.createElement('canvas').getContext('webgl'))?
		 new THREE.CanvasRenderer():
		 new THREE.WebGLRenderer();
	markerTest.projector = new THREE.Projector(); 
	markerTest.renderer.setSize( window.innerWidth, window.innerHeight );
	markerTest.renderer.domElement.id = 'markerTestRenderer'; 

	// setup lights
	markerTest.scene.add(new THREE.AmbientLight(0xffffff));

	var light	= new THREE.DirectionalLight(0xffffff);
	light.position.set(3, -3, 1).normalize();
	markerTest.scene.add(light);

	var light	= new THREE.DirectionalLight(0xffffff);
	light.position.set(-0, 2, -1).normalize();
	markerTest.scene.add(light);
	document.body.appendChild( markerTest.renderer.domElement );

	markerTest.onCreate	= function(event){ 
		if(this.markers[event.markerId] === undefined){
			var markerId	= event.markerId; 
			markerTest.markers[markerId]= {}; 
			var marker = window.currentMarker = markerTest.markers[markerId]; 

			// create the container object 
			marker.object3d = new THREE.Object3D(); 
			marker.object3d.matrixAutoUpdate = false; 
			markerTest.scene.add(marker.object3d);	
		} 		
	}; 
	//Should we really be deleting these from memory? 
	markerTest.onDelete	= function(event){ 
		/*console.assert(	markerTest.markers[event.markerId] !== undefined ); 
		var markerId	= event.markerId; 
		var marker	= markerTest.markers[markerId]; 
		markerTest.scene.remove( marker.object3d ); 
		delete markerTest.markers[markerId]; */
	}; 
	markerTest.onUpdate	= function(event){ 
		console.log(event); 
		markerTest.renderer.clear(); 
		var markerId	= event.markerId; 
		var marker	= markerTest.markers[markerId];  
		if (markerId === 12 || markerId === 32){		
			var position = marker.object3d.position; 
			//markerTest.camera.lookAt(position); 
		}else{
			marker.object3d.matrix.copy(event.matrix); 	 
		}				
		
		markerTest.camera.matrixWorldNeedsUpdate = true;
		marker.object3d.matrixWorldNeedsUpdate = true;
		//console.log('marker.object3d.position', marker.object3d.position, 'marker.object3d.matrixWorld.getPosition(): ', marker.object3d.matrixWorld.getPosition()); 
	}; 
	markerTest.render = function(){
		markerTest.threexAR.update();
		// trigger the rendering
		markerTest.renderer.autoClear = false;
		//this.renderer.clear();
		markerTest.renderer.render(markerTest.scene, markerTest.camera); 	
		requestAnimationFrame(markerTest.render);
	}

	//THREEx
	window.threshold = 40; 
	markerTest.threexAR	= new THREEx.JSARToolKit({ 
		srcElement	: document.getElementById('markerDetect'), 
		threshold	: threshold, 
		canvasRasterW	: window.innerWidth, 
		canvasRasterH	: window.innerHeight, 
		camera 		: markerTest.camera, 
		debug		: false,
		callback	: function(event){
			//console.log("event", event.type, event.markerId)
			if( event.type === 'create' ){
				markerTest.onCreate(event);
			}else if( event.type === 'delete' ){
				markerTest.onDelete(event);
			}else if( event.type === 'update' ){
				markerTest.onUpdate(event);
				//console.log('updating, event: ', event); 
			}else	console.assert(false, "invalid event.type "+event.type); 
		} 
	}); 
	
	markerTest.render(); 
}); 
})