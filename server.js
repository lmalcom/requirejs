var fs 		= require("fs"); 
var db = require("./db.js");
var express = require("express"); 
var config  = JSON.parse(fs.readFileSync("config.json")); 
var host = config.host; 
var port = config.port; 
var app = express(); 
app.listen(port, host); 

var io = require('socket.io').listen(8800, host); 

//basic settings 
app.configure(function(){	
	app.use(express.cookieParser()); 
	app.use(express.session({secret: 'secret variable that gets hashed, omg!'})); 
	app.use(express.bodyParser()); 
	app.use(express.methodOverride()); 
	app.use(app.router); 
	app.use(express.static(__dirname));  
}); 

app.get('/js/settings.json', function(request, response){
	console.log('sending json file'); 
}); 
app.post('/save', function(request, response){
	//get the text from the request 
	var html = request.body.htmlText; 
	//create a file and put text inside 
	fs.writeFile('test.html', html, function(error){
		if(error) throw error; 
		console.log('saved!'); 
		response.send('saved!'); 
	}); 
	//save in folder as 'test' + length of files in the folder 
});
//different types of requests
app.post('/saveState', function(request, response){
	console.log('received a request from POST /saveState', new Date); 
	console.log('request.method', request.method); 
	console.log('request.route.method', request.route.method); 
})
app.get('/saveState', function(request, response){
	console.log('received a request from GET /saveState', new Date); 
	console.log('request.method', request.method); 
	console.log('request.route.method', request.route.method); 
})
app.delete('/saveState', function(request, response){
	console.log('received a request from DELETE /saveState', new Date); 
	console.log('request.method', request.method); 
	console.log('request.route.method', request.route.method); 
})
app.put('/saveState', function(request, response){
	console.log('received a request from PUT /saveState', new Date); 
	console.log('request.method', request.method); 
	console.log('request.route.method', request.route.method); 
})
app.patch('/saveState', function(request, response){
	console.log('received a request from PATCH /saveState', new Date); 
	console.log('request.method', request.method); 
	console.log('request.route.method', request.route.method); 
})

//different types of requests
app.post('/test/:id', function(request, response){
	console.log('received a request from POST /test', new Date); 

	if(id = request.params.id){
		db.addModel(id, request.body);
	}else{
		return 'no id set'
	}	
})
app.get('/test', function(request, response){
	console.log('received a request from GET /test', new Date); 
	console.log('request.method', request.method); 
	console.log('request.route.method', request.route.method); 
})
app.delete('/test', function(request, response){
	console.log('received a request from DELETE /test', new Date); 
	console.log('request.method', request.method); 
	console.log('request.route.method', request.route.method); 
})
app.put('/test', function(request, response){
	console.log('received a request from PUT /test', new Date); 
	console.log('request.method', request.method); 
	console.log('request.route.method', request.route.method); 
})
app.patch('/test', function(request, response){
	console.log('received a request from PATCH /test', new Date); 
	console.log('request.method', request.method); 
	console.log('request.route.method', request.route.method); 
})