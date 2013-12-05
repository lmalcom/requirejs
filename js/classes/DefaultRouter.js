define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){
	'use strict'; 
	var DefaultRouter; 
	DefaultRouter = Backbone.Router.extend({ 
		routes: { 
			':pagename/edit': 'edit', 
			'edit': 'edit', 
			'live/:pageId': 'live', 
		}, 
		initialize: function(options){ 
			this.parent = options.parent; 
		}, 
		edit: function(pagename){ 
			var page; 
			pagename = pagename || 'index'; 

			//find page that is in the url 
			page = _.each(controller.collection, function(p){ 
				if(p && p.has('href') && p.get('href') === pagename) return p 
			}); 

			//get the edit object and place it in the modules 
			controller.getClass('Edit', function(Edit){ 
				var editmod, editview; 
				editmod = new Backbone.Model({page: page || controller.collection.at(0)}); 
				editview = new Edit[0]({model:editmod}); 
				controller.get('modules').push(editview);
				editview.render(); 
			}); 				
		},
		live: function(pageId){
	   		//connect to room 
	   		console.log('changing room!', pageId); 
	   		controller.socket.on('create', function(data){
	   			console.log('creating a new thingy...', data); 
	   			controller.collection.at(0).get('page').view.addBlock(data); 
	   		})
	   		controller.socket.emit('changeRoom', {pageId: pageId}); 
	   		return this; 
	   	}, 
	}); 
	return DefaultRouter
})