define(['Panel', 'processing'], function(Panel){ 
	var ProcessingPanel = {}; 

	ProcessingPanel = Panel.extend({ 
		tagName: 'canvas', 
		className: Panel.prototype.className + ' ProcessingPanel', 
		options: {
			animated: true
		}, 		
		initialize: function(options){ 
			window.panel = this; 
			Panel.prototype.initialize.call(this, options); 
			this.processing = new Processing(this.el); 
			var arr = []; 
			var num = Math.floor(Math.random()*50); 
			console.log(num); 
			_.times(num, function(){
				arr.push(new Backbone.Model({defaultView: 'ProcessingBlock'}))
			})
			this.model.subcollection = new Backbone.Collection(arr); 
		}, 
		setup: function(){
			var panel = this,
				pjs = panel.processing; 

			//pjs setup 
			pjs.setup = function(){
				pjs.size(window.innerWidth, window.innerHeight); 
				pjs.frameRate(30); 
				pjs.background(100); 
				_.each(this.subviews, function(subview){
					subview.setup(pjs); 
				}); 
			}; 
			return this; 
		}, 
		draw: function(){
			var panel = this,
				pjs = panel.processing; 
			//setup the draw loop
			pjs.draw = function(){
				if(panel.options.animated){
					pjs.background(100); 
					_.each(panel.subviews, function(subview){
						subview.draw(pjs); 
					}); 
				}else{
					pjs.noLoop(); 
				}
			}; 
			return this; 
		},
		startProcessing: function(){
			var pjs = this.processing; 
			//start off the canvas
			pjs.setup(); 
			return this; 
		},
		render: function(pjs){ 	
			var panel = this; 		
			//render data from the blocks 
			if( this.model.subcollection ){ 
				//this.model.subcollection.each(this.renderBlock, this); 
				_.each(this.model.subcollection.models, function(model){ 
					panel.renderBlock(model); 
				}); 
			}
			panel.setup().draw().startProcessing(); 
		    return this; 
	   	}, 	
	   	renderBlock	: function( model ){ 
	   		var view, panel; 
	   		panel = this; 
	   		view = false; 

	   		//return the view that matches that model 
	   		_.each(this.subviews, function(subview){ 
	   			(subview.model === model) ? view = subview : false; 
	   		}); 
	   		//create view if it doesn't already exist and append to this
	   		if(!view){ 
	   			this.createView( model, null, function( newView ){
	   				//render
		   			newView.render(); 
	   			}, panel); 
	   		}else{ 
	   			//otherwise just have it rerender itself 
	   			if(!view.page){ 
	   				view.page = (view.parent && !view.parent.parent)? view.parent: 
		   						(panel.page)? panel.page: 
		   						panel; 
	   			} 	   			 
	   			view.render(); 
	   		} 		   			    
	    }, 
	    createView: function( model, options, callback, ctx ){ 
	    	var panel = this; 
			//get class 
			var klass = this.defaultSubview || model.get('defaultView') || 'Block'; 
			controller.getClass(klass, function(classOb){ 

				//returned object is either the object or an array with one object 
				var view, options, page; 
				page = (this.parent && this.parent.page)? this.parent.page: this; 
				view = classOb[0] || classOb; 
				options = _.extend({},options, {model:model, parent:panel, page:page}); 

				view = new view(options); 
				panel.subviews.push(view); 

				//callback 
				if(callback && typeof callback === 'function') callback.call(ctx || null, view); 

			}, this); 

			return this; 
	    }, 
	   	clear: function(){ 
			_.each(this.subviews, function(view){ 
				view.remove(); 
			}); 
			this.subviews = []; 
			return this; 
	   	}, 
	   	removeFromCollection: function(view){
	   		var panel = this; 
	   		_.each(this.subviews, function(subview, index){
	   			if(subview === view){
	   				//remove from panel view and model 
	   				panel.subviews.splice(index, 1); 	

	   				//remove view and model
	   				view.model.destroy(), 
	   				view.remove(); 	 
	   			}
	   		})
	   		return this; 
	   	},
		saveState: function(){ 
			var state, arr; 
			state = {}, 
			arr   = []; 

			//set model and view 
			state.viewProps  = this.toJSON(); 
			state.modelProps = this.model.toJSON(); 

			//if collection create an array substates 
			if(this.subviews.length > 0){ 
				_.each(this.subviews, function(subview){ 
					arr.push(subview.saveState()); 
				}) 
				state.subcollection = arr; 
			} 

			return state
		}, 
	}); 
	return ProcessingPanel; 
}); 