define(['Block', 'processing'], function(Block){
	//Dependencies and base className */ 
	var ProcessingBlock = {}; 

	/*BLOCK is a VIEW*/ 
	ProcessingBlock = Block.extend({ 
		//BACKBONE PROPERTIES AND FUNCTIONS						
		    className: Block.prototype.className + ' ProcessingBlock', 				
			template: 	_.template(''), 
/*
		//View Methods
			initialize: function( attributes ){
				var view, attrs, options; 
				view = this; 

				//model events
				this.listenTo(this.model, 'change', this.render); 
				this.listenTo(this.model, 'destroy', this.remove); 

				//general events
				this.on('hide', this.hide, this); 
				this.on('show', this.show, this); 

				//set properties onto the view
				this.id = this.el.id =this.el.classList[this.el.classList.length-1] + '_' + this.cid; 
				if(attributes){ 
					var keys = _.omit(attributes, 'model', 'css', 'className'); 
					_.each(keys, function(val, key, list){ 
						view[key] = val; 
					}) 
				}

				//parent page 
				this.page = 
					(function findPage(child){
						return 	(child.parent && child.parent.parent)? findPage(child.parent): 
								(child.parent)? child.parent: 
								child; 
					})(this); 

				//add css 
				attrs = (!attributes.immutableCSS && attributes.css)? attributes.css: {}; 
				options = {parent:view}; 
				this.css =  new CSS(attributes.css, options);
			},*/

		//RENDERING FUNCTIONS
			setup: function(pjs){
				//setup stuff if necessary 				
				return this; 
			}, 
			draw: function(pjs){
				var block = this; 

				//setup the draw loop									
				pjs.fill(200, 100, 100); 
				pjs.rect(block.x, block.y, 100, 100);  
				return this; 
			},
			//rendering sets up the template, need to create "templates" for processing objects 
			render: function(pjs){ 	
				this.x = Math.random()*window.innerWidth, 
				this.y = Math.random()*window.innerHeight; 			
				return this; 
			}, 
	});	
	return ProcessingBlock; 
}); 