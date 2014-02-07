define(['Panel'], function(Panel){ 
	var KeyFrame =	Panel.extend({ 
		className: Panel.prototype.className + ' KeyFrame', 
		events:{ 
			'click .Button': 'test' 
		}, 
		defaultCSS: _.extend({}, Panel.prototype.defaultCSS, { 
			'height':'auto', 
			'.Button': { 
				'max-width':'100%', 
				'min-height':'70px' 
			}, 
			'.active':{
				'background-color':'red'
			} 

			/*'&:hover':{
				'-webkit-transform':'translateY(-100%)', 
				'-moz-transform':'translateY(-100%)', 
				'transform':'translateY(-100%)', 
			} */ 
		}), 
		initialize: function(options){ 
			Panel.prototype.initialize.call(this, options); 
			var start = this.model.get('start') || 0; 
			var stop = this.model.get('stop') || 10; 

			if(!this.model.subcollection){ 
				this.model.subcollection = new Backbone.Collection([ 
					new Backbone.Model({defaultView: 'Button', text: start}), 
				]); 
			} 
			this.listenTo(this.page, 'addedObject', this.addThing); 
			this.page.keyframes.push(this); 
		}, 
		test: function(ev){ 
			//set active 
			if(this.active){ 
				this.active = false; 
				this.$('.Button').removeClass('active'); 
			}else{ 
				this.active = true; 
				this.$('.Button').addClass('active'); 
				this.page.moveBody(this); 
			} 
		}, 
		addThing: function(ev){ 
			this.model.subcollection.add(new Backbone.Model({defaultView: 'Button', text: 'BlockMan'})); 
			this.render(); 
		} 
	}); 
	return KeyFrame; 
}); 