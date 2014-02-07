define(['Block'], function(Block){ 
	var Panel = {}; 

	Panel = Block.extend({ 
		className: 'Panel', 
		initialize: function(options){
			Block.prototype.initialize.call(this, options); 
			this.subviews = []; 
		},
		render: function(){ 	
			var panel = this; 		
			//render data from the blocks 
			if( this.model.subcollection ){ 
				//this.model.subcollection.each(this.renderBlock, this); 
				_.each(this.model.subcollection.models, function(model){
					panel.renderBlock(model); 
				}); 
			}/*else{ 
				this.$el.html('<p>Looks like this panel is empty...</p>'); 
			} 	*/	
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
	   				//add to el 
		   			panel.$el.append(newView.render().el); 
		   			return newView; 
	   			}, panel); 
	   		}else{ 
	   			//otherwise just have it render itself 
	   			var page = null; 
	   			if(!view.page){ 
	   				page = 	(view.parent && !view.parent.parent)? view.parent: 
	   						(panel.page)? panel.page: 
	   						panel; 
	   			} 
	   			 
	   			view.page = page; 
	   			panel.$el.append(view.render().el); 
		   		return view; 
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
			this.$el.empty(); 
			_.each(this.subviews, function(view){ 
				view.remove(); 
			}); 
			this.subviews = []; 
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
	return Panel; 
}); 