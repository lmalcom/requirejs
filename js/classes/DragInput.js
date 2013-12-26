define(['Block'], function(Block){ 
	var DragInput = {}; 

	//Drag view, only works for numbers  
	DragInput = Block.extend({ 
		className: Block.prototype.className + ' DragInput', 
		template: _.template('< <%= type %> > <%= text %> < <%= type %> > '), 
		label:'X', 
		template: function(dat){ 
			var txt = ''; 
			txt.concat('<p>' + (dat.label || this.label) + '</p><input name=' + (dat.label || this.label) + ' type="number" placeholder min="-9999" max="9999">'); 
			
			return _.template(template); 
		},  
	});  
	return DragInput; 
}); 