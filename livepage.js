var livepage = function(dat){
	this.io = dat.io; 
	this.page = dat.page; 
} 
livepage.prototype = {
	attributes: {}, 
	html: function(){}, 
	getState: function(){
		return this.page; 
	}, 
	updatePage: function(page){
		this.page = page; 
	}
}
module.exports. = livepage; 