define(['Form'], function(Form){
	var TransformForm = {}; 

	//Page View 
	TransformForm = Form.extend({ 
		className: Form.prototype.className + ' TransformForm',  
		inputs: [ 
			{type:"color", label: 'background-color', src:'images/sample.jpg', name: "background-image"}, 
			{type:"file", label: 'Profile Image', src:'images/sample.jpeg', name: "profileImg"}, 
			{type:"text", label:'Name', text: 'Username', name:'name'}, 
			{type:"text", label:'Organization', text: 'Organization Affiliation', name:'org'}, 
			{type:"textarea", label:'Description', text: 'Description', name:'description'}	
		],
	});  
	return TransformForm; 
}); 