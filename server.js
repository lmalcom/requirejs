var fs 		= require("fs"); 
var db = require("./db.js"); 
var express = require("express"); 
var app = express();

//server for socket
var server = require('http').createServer(app); 
server.listen(process.env.PORT || 8801); 
var io = require('socket.io').listen(server); 
//var io = require('socket.io').listen(8800); 
io.set('log level', 1);


var twitter = require('twitter'); 
var t = new twitter({
    consumer_key: 'N5iOjfKyXjIh0ToHVPRGIQ',           // <--- FILL ME IN
    consumer_secret: 'D7RDJjNsVuozQtq2TQBhHVyW5ehhnmZdSchwIbhsAk',        // <--- FILL ME IN
    access_token_key: '1110718519-EdtUXf4gudvkynHjpx5Lt4LvR3MycHUHfDRJ7WU',       // <--- FILL ME IN
    access_token_secret: 'bqOctAhzULJ4r3bkw1Vvya0qy8alp2Ak6pYfsklDtqc'     // <--- FILL ME IN
});

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
app.get('/disconnect', function(req, res){
	if(t.stream && t.stream.destroy) t.stream.destroy(); 
	res.send('killed the request'); 
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

app.get('/streaming/:query', function(req, res){
	var query = req.params.query; 
	
	 
	//Tell the twitter API to filter on the watchSymbols 
	if(!t.stream){
		t.stream('statuses/filter', { track: [query] }, function(stream) {
		 //destroy in 30 seconds, just testing 
		  setTimeout(stream.destroy, 60000);
		  //We have a connection. Now watch the 'data' event for incomming tweets.
		  stream.on('data', function(tweet) {		 	
		    //This variable is used to indicate whether a symbol was actually mentioned.
		    //Since twitter doesnt why the tweet was forwarded we have to search through the text
		    //and determine which symbol it was ment for. Sometimes we can't tell, in which case we don't
		    //want to increment the total counter...
		    var claimed = false;
		 
		    //Make sure it was a valid tweet
		    if (tweet.text !== undefined) {
		 
		      //We're gunna do some indexOf comparisons and we want it to be case agnostic.
		      var text = tweet.text.toLowerCase();
		 
		      //Send to all the clients
		      io.sockets.emit('tweet', tweet);
		    }
		  });
		  
		});
	}else{
		//We have a connection. Now watch the 'data' event for incomming tweets. 
		t.stream('statuses/filter', { track: [query] }, function(stream) { 
		  console.log('now streaming!'); 
		  //destroy in 30 seconds, just testing 
		  setTimeout(stream.destroy, 60000);
		  //We have a connection. Now watch the 'data' event for incomming tweets.
		  stream.on('data', function(tweet) {
		 
		    //This variable is used to indicate whether a symbol was actually mentioned.
		    //Since twitter doesnt why the tweet was forwarded we have to search through the text
		    //and determine which symbol it was ment for. Sometimes we can't tell, in which case we don't
		    //want to increment the total counter...
		    var claimed = false;
		 
		    //Make sure it was a valid tweet
		    if (tweet.text !== undefined) {
		 
		      //We're gunna do some indexOf comparisons and we want it to be case agnostic.
		      var text = tweet.text.toLowerCase();
		 
		      //Send to all the clients
		      io.sockets.emit('tweet', tweet);
		    }

		  });
		});
	}
	res.send('streaming!'); 
}); 
io.sockets.on('connection', function(socket){
	socket.on('draw', function(data){
		console.log('from the socket', data); 
		socket.broadcast.emit('create', data)
	});
});