define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){
	'use strict'; 
	var DefaultRouter; 
	DefaultRouter = Backbone.Router.extend({ 
		routes: { 
			':pagename/edit': 'edit', 
			'edit': 'edit', 
			'edit2':'edit2', 
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
			window.controller.getClass('Edit', function(klass){ 
				var editmod, editview, Edit; 
				Edit = (klass instanceof Array)? klass[0]: klass; 
				editmod = new Backbone.Model({page: page || controller.collection.at(0)}); 
				editview = new Edit({model:editmod}); 
				controller.get('modules').push(editview);
				editview.render(); 
			}); 				
		},
		edit2: function(pagename){ 
			var page; 
			pagename = pagename || 'index'; 

			//get the edit object and place it in the modules 
			window.controller.getClass('Edit2', function(klass){ 
				var editmod, editview, Edit; 
				Edit = (klass instanceof Array)? klass[0]: klass; 
				editmod = new Backbone.Model({page: page || controller.collection.at(0)}); 
				editview = new Edit({model:editmod}); 
				controller.get('modules').push(editview);
				editview.render(); 
			}); 				
		},
		live: function(pageId){
	   		//connect to room 
	   		console.log('changing room!', pageId); 
	   		controller.socket.on('create', function(data){
	   			console.log('creating a new thingy...', data); 
	   			//check if class exists, then create 
	   			
	   				controller.getClass(data.viewProps.className, function(){
	   					controller.collection.at(0).get('page').view.addBlock(data); 
	   				})   			
	   		})
	   		controller.socket.emit('changeRoom', {pageId: pageId}); 
	   		return this; 
	   	}, 
	}); 
	return DefaultRouter
})