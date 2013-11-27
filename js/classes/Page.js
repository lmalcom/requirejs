define(['Panel', 'jquery.hammer'], function(Panel){ 
	var Page = {}; 

	//Page View 
	Page = Panel.extend({ 
		name: 'index', 
		className: 'Page',  
		defaultCSS: _.extend({}, Panel.prototype.defaultCSS, { 
			position:'fixed', 
			width	: '100%', 
			height	: '100%', 
			'*':{ 
				'box-sizing': 'border-box', 
				'-moz-box-sizing': 'border-box', 
				'-webkit-box-sizing': 'border-box', 
			} 
		}), 
		render: function(){ 
			//generic render call 
			Panel.prototype.render.call(this); 
			$('body').append(this.el); 
			//this.$el.hammer(); 
			
		    //renderCSS 
			this.renderCSS(); 

			//tell everything that is has it rendered 
			this.trigger('rendered'); 

			return this; 
	   	}, 
		renderCSS 	: function(){	
			//create stylesheet and keep reference to the node 
			if(!this.styleSheet){ 
				var style = document.createElement('style'); 
				style.type = 'text/less';  
				style.id = this.el.id + '_style'; 
				style.innerHTML = 'body {margin:0}' + this.css.renderDefaultCSS() + this.css.render(); 
				this.styleSheet = document.head.appendChild(style); 
			}else{ 
				this.styleSheet.type = 'text/less';  
				this.styleSheet.innerHTML = 'body {margin:0}' + this.css.renderDefaultCSS() + this.css.render();
			}  
			less.refreshStyles(); 
		},  
		saveState: function(){
			var state, classes; 
			state = Panel.prototype.saveState.call(this), 
			classes = [this.className];

			//if collection create an array substates 
			(function addClasses(child){
				if(child.subviews && child.subviews.length > 0){ 
					_.each(child.subviews, function(subview){ 
						classes.push(subview.className); 
						addClasses(subview); 
					}); 
				}
			})(this); 		

			//return the page object as necessary for the settings json object to load the page later 
			return {
				name: this.name, 
				classes: _.uniq(classes), 
				page: state
			}
		}, 
	});  
	return Page; 
}); 