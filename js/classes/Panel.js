define(['require','Block'], function(require, Block){ 
	var Panel = {}; 

	Panel = Block.extend({ 
		className: 'panel', 
		subviews: [], 
		render 		: function(){ 

			//reset page view
			this.clear(); 

			//render data from the blocks 
			if( this.model.collection.length > 0 ){
				this.model.collection.each(this.renderBlock, this); 

			}else{ 
				var fail = new Text({text:'Looks like this panel is empty...'}); 
				var soHard = new TextView({model:fail}); 
				this.$el.append(soHard.render().el); 
			} 		
		    return this; 
	   	}, 	
	   	clear: function(){
			this.$el.empty(); 
			_.each(this.subviews, function(view){
				view.remove(); 
			}); 
			this.subviews = []; 
	   	}, 
		renderBlock	: function( block ){ 
			var klass, view;

			//get class 
			klass = block.get('defaultView') || Block; 
			
			//create view 
			var view = new klass({model:block}); 
			this.subviews.push(view); 

			//add to el
		    this.$el.append(view.render().el); 
	    }, 
	}); 
	return Panel; 
}); 