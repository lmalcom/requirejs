define(['Page'], function(Page){ 
	var TimelinePage = Page.extend({ 
		 events: { 
		 	'keydown': 'trackKeys', 
		 	//'mousedown': 'trackKeys' 
		 }, 
		 className: Page.prototype.className + ' TimelinePage', 
		 initialize: function(options){ 
		 	Page.prototype.initialize.call(this, options); 
		 	/*this.model.subcollection = new Backbone.Collection([
		 		new Backbone.Model({ defaultView: ''})
		 	])*/
		 }, 
		 trackKeys: function(ev){
		 	alert('oh heeeey'); 
		 }
	}); 
	return TimelinePage; 
})