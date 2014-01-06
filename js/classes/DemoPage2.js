define(['Page','io', 'leapmotion'], function(Page, io, leap){
	var DemoPage2 = {}; 
	//Page View 
	DemoPage2 = Page.extend({ 
		className: Page.prototype.className + ' DemoPage2', 
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, {
			'perspective' : '100px', 
			'perspective-origin': '-50% 80%', 
			'-webkit-perspective' : '100px', 
			'-webkit-perspective-origin': '50% 80%', 
			'-moz-perspective' : '100px', 
			'-moz-perspective-origin': '50% 80%', 

			'.Block': {
				'position':'absolute', 
		        "transition": "transform 0s",
		        "-webkit-transition": "-webkit-transform 0s",
		        "-moz-transition": "-moz-transform 0s", 
				'width':'300px', 
				'height':'300px', 
				'perspective-origin':'50%', 
				'-webkit-perspective-origin': '50%',
				'-moz-perspective-origin': '50%', 
				'transform-style': 'preserve-3d', 
				'-webkit-transform-style': 'preserve-3d', 
				'-moz-transform-style': 'preserve-3d', 
				'background-color':'rgba(0,0,0, .5)'
			}
		}),
		socket: io.connect('http://' + window.location.hostname + ':8800'), 
		initialize: function(options){
			var page = this; 
			Page.prototype.initialize.call(this, options); 
			this.leap = new Leap.Controller(); 
			this.leap.on('frame', function(frame){
				page.moveHand(frame); 
				var ret = {
					hands: [], 
					pointables: [], 
					gestures: []
				}; 
				_.each(frame.hands, function(hand){
					//get finger data 
					var fingers = []; 
					_.each(hand.fingers, function(pointable){
						fingers.push({
							id: pointable.id, 
							tipPosition: pointable.tipPosition, 
							direction: pointable.direction
						}); 
					})
					ret.hands.push({ 
						id: hand.id, 
						palmPosition: hand.palmPosition, 
						_rotation: hand._rotation, 
						fingers: fingers
					}); 
				})
				
				page.socket.emit('updateHand_demo2', ret); 
			}); 
			this.socket.on('updateHand_demo2', function(dat){
				page.moveHand(dat); 
			})
			this.leap.connect(); 
		}, 
		getPointablePosition: function(pointable){
			return {
				id: pointable.id, 
				position:{
					x: (pointable.tipPosition[0] * 12),
		        	y: -(pointable.tipPosition[1] * 5),
		        	z: -500 + pointable.tipPosition[2] 
				}, 
				rotation: {
					x: (pointable.direction[2] * 90),
		        	y: (pointable.direction[1] * 90),
		        	z: (pointable.direction[0] * 90),
				}
			}
		},
		moveHand: function(frame){
			var page = this; 
			if(frame.hands && frame.hands.length > 0 && frame.hands[0].fingers && frame.hands[0].fingers.length > 0){
				_.each(frame.hands[0].fingers, function(finger, index){
					var pos = page.getPointablePosition(finger); 
					var target = (index = page.subviews[index])? index: {}; 
					var x = pos.position.x, 
						y = pos.position.y, 
						z = pos.position.z; 
					target.x = x; 
					target.y = y; 
					target.z = z; 
					target.$el.css({
						'-webkit-transform' : 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)' + 'rotateX(' + pos.rotation.x + 'deg)' + 'rotateY(' + pos.rotation.y + 'deg)' + 'rotateX(' + pos.rotation.z + 'deg)',
						'-moz-transform' : 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)' + 'rotateX(' + pos.rotation.x + 'deg)' + 'rotateY(' + pos.rotation.y + 'deg)' + 'rotateX(' + pos.rotation.z + 'deg)',
						'transform' : 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)' + 'rotateX(' + pos.rotation.x + 'deg)' + 'rotateY(' + pos.rotation.y + 'deg)' + 'rotateX(' + pos.rotation.z + 'deg)',
					});
				})
			}
			return this; 
		}
	});  
	return DemoPage2; 
}); 