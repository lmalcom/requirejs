define(['require', 'CSS','Block', 'Panel'], function(require, CSS, Block, Panel){
	var Page = {}; 

	//Page View
	Page = Panel.extend({ 
		className: 'page',  
		defaultCSS: {
			position:'fixed', 
			width	: '100%', 
			height	: '100%'
		}, 	
		render: function(){ 
						//generic render call 
						Panel.prototype.render.call(this); 
						$('body').append(this.el); 
					    
					    //renderCSS
						this.renderCSS(); 

						//tell everything that is has it rendered? 
						this.trigger('rendered'); 
				   	  }, 
		renderCSS 	: function(){					
						//create stylesheet and keep reference to the node
						if(!this.styleSheet){
							var style = document.createElement('style'); 
							style.type = 'text/less';  
							style.id = this.el.id + '_style'; 
							style.innerHTML = 'body {margin:0}' + this.css.render(); 
							this.styleSheet = document.head.appendChild(style); 
						}else{
							this.styleSheet.type = 'text/less';  
							this.styleSheet.innerHTML = 'body {margin:0}' + this.model.get('css').render();
						} 
						less.refreshStyles(); 
					},  
	});  
	return Page; 
}); 