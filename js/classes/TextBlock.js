define(['Block'], function(Block){ 
	var TextBlock = {}; 

	//Page View 
	TextBlock = Block.extend({ 
		className: Block.prototype.className + ' TextBlock', 
		template: function(dat){
			var type = dat.type ||  this.options.type; 
			var text = dat.text ||  this.options.text;

			return _.template('< ' + type + ' >' + text + '<' + type + '> '); 
		}, 
		template: function(dat){ 
			var template = '', 
				block 	 = this; 

			//if is array 
			if(dat.inputs && _.isArray(dat.inputs)){ 
				_.each(dat.inputs, function(textBlock){ 
					var type = textBlock.type || block.options.type, 
						txt  = textBlock.text || block.options.text; 
					template = template.concat('<' + type + '>' + txt + '</' + type + '>'); 
				})

			//else is a single oject 
			}else{ 

				var type = dat.type || block.options.type, 
					txt  = dat.text || block.options.text,
					res; 
				template = template.concat('<' + type + '>' + txt + '</' + type + '>'); 
			}
			
			return _.template(template); 
		}, 
		options:{
			type: 'p', 
			text: 'You should probably fill this with real text :)', 
		}
		
	});  
	return TextBlock; 
}); 