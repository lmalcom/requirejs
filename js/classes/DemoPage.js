define(['Page'], function(Page){
	var DemoPage = {}; 
	//Page View 
	DemoPage = Page.extend({ 
		defaultCSS: _.extend({}, Page.prototype.defaultCSS, {
			'.FractaLeapMotionPage':{
				'display':'none'
			}
		}),
		events: {
			'keypress': 'changePage'
		}, 
		changePage: function(ev){
			if(ev.keyCode === 114){
				this.$el.find('.LeapMotionPage3').fadeOut(); 
				this.$el.find('.FractaLeapMotionPage').fadeIn(); 
			}
		}
	});  
	return DemoPage; 
}); 