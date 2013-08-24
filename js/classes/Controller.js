define(['jquery', 'underscore', 'backbone', 'less','Block', 'Panel','Page'], function($, _, Backbone, less, Block, Panel, Page){
	'use strict'; 

	var Controller; 
	Controller = Backbone.Model.extend({ 
		defaults: { 
			classes: { 
				Block:Block, 
				Panel:Panel, 
				Page: Page 
			} 
		}, 
		initialize: function( attributes ){
			//set up metadata

			//initialize timeline

		},
		loadPage: function( settings ){
			//adds all of the classes from the settings.classes list, prefixes it with require so we can call them later 
			var controller = this; 
			require(['require'].concat(settings.classes || []), function(require){
				var page, mv; 

				//create a reference to all of the classes in the function so we can create objects
				controller.loadClasses(settings.classes); 

				//create Page model 
				page = controller.createModel(settings.page);  
				
				//start page
				controller.startPage(page); 
			}); 

		}, 
		loadClasses: function( classes ){
				var controller = this, cache = {}; 

				_.each(classes, function(klass){ 					

					//require classes 
					cache[klass] = require(klass);					
				}) 
				controller.set({classes: _.extend(controller.get('classes'), cache)}); 
		},
		createCollection: function( collection ){
				//create collection from children 
				var arr, coll, controller; 
				controller = this; 
				arr = []; 

				//create all of the models
				_.each(collection, function (child){

					//make new model and set settings 
					arr.push(controller.createModel(child)); 

				}); 
				
				//create Collection 
				coll = new Backbone.Collection(arr); 

				return coll; 
		},
		createModel: function( child ){ 
				var controller, klass, options, model; 
				controller = this; 

				//load class 
				klass = controller.get('classes')[child.className] || Backbone.Model; 

				//create collections first 
				if( child.options && child.options.collection){ 
					child.options.collection = controller.createCollection(child.options.collection); 
				}

				//create object and set settings/options 
				model = new klass(child.settings, child.options); 
				return model; 
		}, 
		startPage: function( page ){
			var controller = this, view; 

			//create and render view
			view = new Page({model: page}); 
			view.render(); 

			//cache page 
			if(controller.collection){
				controller.collection.add({
					//pageName: 'page_' + cid, 
					model: page, 
					view: view
				}); 
			}else{
				controller.collection = new Backbone.Collection([{
					//pageName: 'page_' + cid, 
					model: page, 
					view: view
				}])
			}			
		}
	}); 
	//return new because there should only be ONE on the page
	return new Controller; 
}); 