function livepage(options){
	if (!(this instanceof livepage)) return new livepage(options);
	this.io = options.io; 
	this.state = options.state; 
	this.pageId = options.pageId; 
} 
livepage.prototype = {
	attributes: {}, 
	html: function(){}, 
	getState: function(){
		return this.state; 
	}, 
	updatePage: function(state){
		this.state = state; 
	}
}
module.exports = livepage; 