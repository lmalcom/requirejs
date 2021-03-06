define(['jquery', 'underscore', 'backbone', 'less','Block', 'Panel','Page', 'DefaultRouter', 'io', 'jquery.hammer'], function($, _, Backbone, less, Block, Panel, Page, Router, io){
	'use strict'; 

	var Controller; 
	Controller = Backbone.Model.extend({ 
		defaults: { 
			classes: { 
					Block:Block, 
					Panel:Panel, 
					Page: Page
				}, 
			modules: [] 
		}, 
		socket: io.connect('http://' + window.location.hostname + ':8800', {query: 'test=ohheeeey'}),
		initialize: function( attributes ){ 
			var controller = window.controller = this; 
			//set up metadata 

			//initialize timeline 

			//start modules and set up events
			$('body').append('<div id="modules"></div>'); 

			Backbone.Model.prototype.initialize = function(attributes, options){
				if(options && options.subcollection) this.subcollection = options.subcollection; 
			}

			//load the page 
			controller.loadPage(Settings, function(){
				//initialize router with pages 
				controller.set({router: new Router({parent: controller})}); 
				Backbone.history.start({pushState: true, hashChange: false}); 
			}); 			

			//set up local storage
			//this.loadStorage(); 			

		},	
		createModel: function( child ){ 
			var controller, klass, options, model; 
			controller = this; 

			//load class 
			klass = controller.get('classes')[(child.className)] || Backbone.Model; 

			//create collections first 
			if( child.options && child.options.subcollection){ 
				child.options.subcollection = controller.createModelCollection(child.options.subcollection); 
			} 

			//create object and set settings/options 
			model = new klass(child.settings || {}, child.options || {}); 
			return model; 
		}, 
		createView: function(model, props){ 
			var controller, klass, options, view; 
			controller = this; 

			//load class 
			//klass = controller.getClass(props.className || model.get('defaultView') || 'Block', function(){}); 
			klass = controller.get('classes')[ props.className || model.get('defaultView') || 'Block' ]; 
			//create collections first 
			if( props && props.subviews){ 
				props.subviews = controller.createViewCollection(model, props.subviews); 
			} 

			//create object and set settings/options 
			options = _.extend({}, props, {model: model}); 
			//delete className property so that it doesn't overwrite the prototype classname 
			if(options.className) delete options.className
			view = new klass(options); 
			return view; 
		},
		//takes the state JSON and creates a page collection 
		//this does NOT put it on the page, it only creates the collection 
		initializeState: function( json, parent ){ 
			var controller, model, view, ret; 
			controller = this, 
			ret = {}; 
			//console.log('dat from initialize State', json); 
			//add model and view 
			ret.model = controller.createModel(json.modelProps || {}); 
			ret.view = controller.createView(ret.model, _.extend({}, json.viewProps, {parent: parent})); 

			//load collection 
			if(json.subcollection){ 
				var arr = [], modarr = [], viewarr = []; 

				//get models and views from substates 
				_.each(json.subcollection, function(substate){ 
					arr.push(controller.initializeState(substate, ret.view)); 
				}); 

				//then separate them
				_.each(arr, function(substate){ 
					modarr.push(substate.model); 
					viewarr.push(substate.view); 
				}) 

				ret.subcollection = arr; 
				ret.model.subcollection = new Backbone.Collection(modarr); 
				ret.view.subviews = viewarr; 
			}			
			return ret; 
		}, 		
		//retrieve a json object with the page state from localstorage or the server 
		loadState: function( name, location, callback ){ 
			var controller = this; 

			//find reference to state 
			if(location === 'local'){ 
				controller.loadFile( name, location, callback ); 
			}else if(location === 'server') { 
				$.ajax({
					data: json, 
					url:'/load' + controller.baseUrl, 
					success: function(res){
						console.log('oh hey we saved to the server!', res); 
					}, 
					error: function(err){
						console.log('Error: ', err); 
					}
				}); 				
			}else{ 
				throw new Error('Wrong type of location'); 
			} 
		}, 
		saveState: function( page, name, location, callback ){ 
			var controller, pageOb, state,json, blob; 
			controller = this; 
			//get the reference to the page that we are saving 
			if(page){ 
				//if a number is given, find it in the collection, else it should be an object 
				pageOb = (typeof page === 'number')? this.collection.at(page): page; 
			}else{ 
				//else the default is the first in the collection 
				pageOb = this.collection.at(0); 
			} 

			//save the state data to JSON 
			state = pageOb.get('page').view.saveState(); 
			json = JSON.stringify(state); 
			blob = new Blob([json], {type: "application/json"}); 

			//LOCAL STORAGE
			if(location && location === 'local'){
				//save blob to a file 
				controller.saveFile(name, location, blob, callback); 				

			//DATABASE OR SERVER
			}else if(location && location === 'server'){
				state.name = name;
				state._id = pageOb.get('_id'); 
				console.log('json that is being sent over', state);  
				$.ajax({
					data: state,
					method:'POST',  
					url:'/save' /*+ controller.baseUrl*/, 
					success: function(res){
						//send message and route the page
						alert('oh hey we saved to the server! Server says: ' + res); 
						controller.get('router').navigate('/' + name); 
					},
					error: function(err){
						console.log('Error: ', err); 
					}
				}); 

			//TEMP 
			}else{
				return pageOb.view.saveState(); 
			}
			
		}, 
		getClass: function(name, callback, ctx){ 
			var klass, controller; 
			controller = this; 
			//return class if available
			(klass = controller.get('classes')[name])?				
				callback.call(ctx, klass): 			
				this.loadClasses([name], callback, ctx); 
			
			return this; 
		},
		loadClasses: function( classes, callback, ctx ){
				var controller = this, cache = [];

				//require classes
				require(['require'].concat(classes || []), function(require){
					_.each(classes, function(klass){  
						var newClass; 
						newClass = require(klass); 

						controller.get('classes')[klass] = newClass;
						cache.push(newClass); 			
					}); 
					if(callback && typeof callback === 'function') callback.call(ctx || null, cache); 
				});
				return cache; 
		},
		loadPage: function( settings, callback ){
			//adds all of the classes from the settings.classes list, prefixes it with require so we can call them later 
			var controller = this, child; 
			child = settings; 

			//create a reference to all of the classes in the function so we can create objects
			controller.loadClasses(settings.classes, function(classes){
				//create Page model 
				child.page = controller.initializeState(child.page);  
				child.href = child.name; 
				child.page.view.controller = controller; 

				//if on the edit page set everything to null 
				if(settings.name === 'edit' || settings.name === 'edit2'){
					child.name = child.href = null; 
					delete child._id; 
				}

				//start page
				controller.startPage(child.page); 

				//cache page 
				if(controller.collection){ 
					controller.collection.add(child); 
				}else{
					controller.collection = new Backbone.Collection([child]); 
				}	

				if(typeof callback === 'function') callback();  
			}); 			
		}, 	
		loadStorage: function(){
			if(window.webkitStorageInfo){
				window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, 
					function(grantedBytes) {
						window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function(fs){	
							console.log('success in getting local storage'); 
							controller.set({fs: fs}); 
						}, function(err){
							console.log('Error: ', err);
						});
					}, 
					function(err) {
					  console.log('Error: ', err);
					}
				);
			}else if(window.requestFilesystem){
				window.requestFileSystem(PERSISTENT, grantedBytes, 
						function(fs){
							controller.set({fs: fs}); 
							console.log('success in getting local storage'); 
						}, function(err){
							console.log('Error: ', err);
						});
			} 
		},	
		startPage: function( page ){ 
			var controller = this; 
			page = page || this.collection.at(0).get('page'); 

			//render view 
			page.view.render(); 

			return this; 		
		},
		checkFs: function(){
			//check for filesystem
			if(controller.has('fs')){
				return controller.get('fs'); 
			}else{
				return  new Error('Sorry but no filesystem found'); 
			}
		},
		//FS FUNCTIONS 
		loadFile: function( name, location, callback, context ){
			var controller, fs; 
			controller = this; 

			
			fs = this.checkFs(); 
			//load file
			if(location === 'local'){
				fs.root.getFile(name, {}, function(fileEntry) {

			    // Get a File object representing the file,
			    // then use FileReader to read its contents.
			    fileEntry.file(function(file) {
			       var reader = new FileReader();

			       //on loadend use callback 
			       reader.onloadend = function(e) {
			        if(typeof callback === 'function') callback.call(context || controller, this.result); 
			       };

			       reader.readAsText(file);

			    //errors
			    }, function(err){return  new Error('Error: ', err)}); 

			  }, function(err){return  new Error('Error: ', err)}); 
			}
			
		}, 
		saveFile: function( name, location, blob, callback, context ){
			var controller, fs; 
			controller = this; 

			//check necessary params
			if(!name || !location || !blob) return new Error('Name, location, and/or blob not provided'); 
			
			fs = this.checkFs(); 

			//load file
			if(location === 'local'){
				//save JSON to local storate
				fs.root.getFile(name, {create: true}, function(fileEntry) {

				    // Create a FileWriter object for our FileEntry.
				    fileEntry.createWriter(function(fileWriter) { 

				    	fileWriter.onwriteend = function(e) { 
				      		console.log('Write completed.'); 
				      		callback.call(context || null); 
				      	}; 

				      	fileWriter.onerror = function(err) {
				        	console.log('Write failed: ', err);
				     	};

				      	fileWriter.write(blob);

				    }, function(err){
				    	console.log('Error:', err)
				    });

			  }, function(err){
			    	console.log('Error:', err)
			    });
			}
			
		}
	}); 
	
	return Controller; 
}); 