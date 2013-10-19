var fs 		= require("fs"); 
var db = require("./db.js"); 
var express = require("express"); 
var config  = JSON.parse(fs.readFileSync("config.json")); 
var host = config.host; 
var port = config.port; 
var app = express(); 
app.listen(port, host); 
var io = require('socket.io').listen(8800, host); 

var createPage = function(pageName, res){
	//get page settings based on name 
	var html; 
	db.getPage(pageName, function(page){
		html = '<!DOCTYPE html><html><head>'; 
		html += '<script type="text/javascript"> var Settings = ' + JSON.stringify(page) + '</script>'; 
		html += '<script type="text/javascript" src="../js/libs/require.js" data-main = "../js/main.js"></script></head><body></body></html>'; 
		res.send(html); 
	}); 	
}


//basic settings 
app.configure(function(){	
	app.use(express.cookieParser()); 
	app.use(express.session({secret: 'secret variable that gets hashed, omg!'})); 
	app.use(express.bodyParser()); 
	app.use(express.methodOverride()); 
	app.use(app.router); 
	app.use(express.static(__dirname));  
});  

app.get('/', function(req, res){
	createPage('index', res); 
}); 
app.get('/:pageName', function(req, res){
	createPage(req.params.pageName, res); 
}); 
app.get('/:pageName/edit', function(req, res){
	createPage(req.params.pageName, res); 
}); 

//saving 
app.post('/save', function(req, res){
	console.log(req.body); 	
	db.addPage(req.body, function(newPage){
		res.send("Looks like everything worked out! Added a new page to the system!");
	})	
})


