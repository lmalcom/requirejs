define(['Block'], function(Block){ 
	var TextBlock = {}; 

	//Page View 
	TextBlock = Block.extend({ 
		className: Block.prototype.className + ' TextBlock',  
		template: _.template('< <%= type %> > <%= text %> < <%= type %> > '), 
		template: function(dat){ 
			var template, type, txt; 
			template = '', 
			type = dat.type || this.type, 
			txt  = dat.text || this.text; 

			template += '<' + type + '>' + txt + '</' + type + '>'; 
			return _.template(template); 
		}, 
		type: 'p', 
		text: 'You should probably fill this with real text :)', 
	});  
	return TextBlock; 
}); 