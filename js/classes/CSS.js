define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){
		'use strict';  
		var CSS;

		CSS = Backbone.Model.extend({ 
					defaults: {
						'defaultInlineProperties': [], 
					}, 
					initialize: function (attributes, options){ 
						var active; 
						//set initial properties 
						active = _.extend({}, attributes); 
						this.set({active:active}); 
						this.parent = options.parent; 

						//update the active property list on change 
						this.on('change', this.updateCSS, this); 

						//transform changes
						this.parent.on('change', function(){
							this.inline({
								'transform': 'translateX(' + this.parent.x + 'px)', 
								'-webkit-transform': 'translateX(' + this.parent.x + 'px)', 
								'-moz-transform': 'translateX(' + this.parent.x + 'px)'
							}); 
						}, this); 
					},
					transform: function (){
						var ret, parent, x, y, z, rotX, rotY, rotZ, scaleX, scaleY, scaleZ, skewX, skewY; 
						ret = '',
						parent = this.parent, 
						x 	   = parent.x, 
						y 	   = parent.y, 
						z 	   = parent.z, 
						rotX   = parent.rotateX, 
						rotY   = parent.rotateY, 
						rotZ   = parent.rotateZ, 
						scaleX = parent.scaleX, 
						scaleY = parent.scaleY, 
						scaleZ = parent.scaleZ, 
						skewX  = parent.skewX, 
						skewY  = parent.skewY; 

						//transform properties
						if(x !== 0 || y !== 0 || z !== 0) ret += 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px ) '; 

						//rotate properties 
						if(rotX) ret += 'rotateX(' + rotX + 'deg) '; 
						if(rotY) ret += 'rotateY(' + rotY + 'deg) '; 
						if(rotZ) ret += 'rotateZ(' + rotZ + 'deg) '; 

						//scale properties
						if(scaleX || scaleY) ret += 'scale3d(' + (scaleX || 0) + ', ' + (scaleY || 0) + ') '; 

						//skew properties
						if(skewX || skewY) ret += 'skew(' + (skewX || 0) + 'deg, ' + (skewY || 0) + 'deg) '; 

						//return object with domstring for each type of browser
						return {
							'transform': ret, 
							'-webkit-transform': ret, 
							'-moz-transform': ret
						}

					},
					updateCSS: function(){
						this.set({active: _.extend({}, this.get('active'), this.changed)}, {silent:true});
						return this; 
					},
					//removes all inline styles except for those listed in the arguments and default inline propertes
					inline: function(){
						var css, args; 

						//get list of exceptions 	
						args = Array.prototype.slice.call(arguments);
						args.concat(this.get('defaultInlineProperties')); 

						//get properties of exceptions and transform properties
						css = _.extend({}, this.parent.$el.css(args), this.transform());  

						//clear and replace inline style
						this.parent.$el.attr('style', '');
						this.parent.$el.css(css); 

						return this.parent;
					},
					renderDefaultCSS: function(){
						//copy the version for blocks
						var css, CSSstring; 
						css = this; 
						CSSstring = ''; 
						
						if( controller.has('classes') ){
							//print each of the prototype defaultCSS 
							_.each(controller.get('classes'), function(key, value, list){
								CSSstring += css.renderDOMString(key.prototype.defaultCSS, '.' + value, list); 
							}); 
						} 							
						return CSSstring;  
					},
					render : function(){ 
						var css, CSSstring; 
						css = this; 
						CSSstring = '#' + this.parent.id + ' { '; 
						//check that there are active properties to add to the CSS string
						if( css.get('active') !== null ){
							//print each of the active qualities
							_.each(css.get('active'), function(key, value, list){
								CSSstring += css.renderDOMString(key, value, list); 
							}); 
					
						}; 

						//let children define their css as well 
						if( css.parent.subviews && css.parent.subviews.length > 0){ 
							_.each(css.parent.subviews, function(view){ 
								CSSstring += view.css.render(); 
							}); 
						}; 

						//end
						CSSstring += ' } '; 

						//add inline CSS if necessary 
						this.inline(); 
						return CSSstring;  
					}, 
					renderDOMString: function(value, key, list){
						var css = this; 
						//if the value is a string, print it
						if(_.isString(value) || _.isNumber(value)){
							var string = key + ' : ' + value + ' ; ';
							return string; 

						//else if it is an object, wrap the object and print 
						//its properties in the same way 
						}else if(_.isObject(value)){
							var string =  key + ' { '; 
							_.each(value, function(rule, name, list){
								string += css.renderDOMString(rule, name, list); 
							})
							string += ' } '; 

							return string; 
						}			
					},
		}); 

		return CSS; 
	}			
); 