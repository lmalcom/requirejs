var fs 		= require("fs"); 
var db = require("./db.js"); 
var express = require("express"); 
var app = express(); 

//server for socket
var server = require('http').createServer(app); 
server.listen(process.env.PORT || 8801); 
//var io = require('socket.io').listen(server); 
var io = require('socket.io').listen(8800); 
io.set('log level', 1);
io.set('authorization', function (handshakeData, cb) {
    //if(handshakeData.query) console.log(handshakeData.query);
    cb(null, true);
});
var livepage = require("./livepage-module"); 
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
		html = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">'; 
		html += '<script type="text/javascript"> var Settings = ' + JSON.stringify(page) + '</script>'; 
		html += '<script type="text/javascript" src="../js/libs/require.js" data-main = "../js/main.js"></script></head><body></body></html>'; 
		res.send(html); 
	}); 
} 
var createLivepage = function(pageId, res){ 
	//get page settings based on name 
	console.log('pages: ', pages); 
	var html; 
	if(page = pages[pageId]){
		html = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">'; 
		html += '<script type="text/javascript"> var Settings = ' + JSON.stringify(page.state) + '</script>'; 
		html += '<script type="text/javascript" src="../js/libs/require.js" data-main = "../js/main.js"></script></head><body></body></html>'; 
	}else{
		html = '<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>Looks like that page does not exist right now :( </body></html>'; 
	}	
	res.send(html); 
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

//live page 
var pages = {}; 
app.post('/createLive', function(req, res){ 
	var uniqueId = '1234'; 
	var params = {
		io: io, 
		state: req.body, 
		pageId: uniqueId
	}
	pages[uniqueId] = new livepage(params);
	res.send(JSON.stringify({pageId: uniqueId})); 
})
app.get('/live/:pageId', function(req, res){
	createLivepage(req.params.pageId, res); 
})


//STREAMING FROM TWITTER
app.get('/streaming/:query', function(req, res){
	var query = req.params.query; 
	
	 
	//Tell the twitter API to filter on the watchSymbols 
	if(!t.stream){
		t.stream('statuses/filter', { track: [query] }, function(stream) {
		 //destroy in 30 seconds, just testing 
		  setTimeout(stream.destroy, 20000);
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
		  setTimeout(stream.destroy, 20000);
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


//SOCKET IO
io.sockets.on('connection', function(socket){ 
	if(pageId = socket.handshake.query.pageId){ 
		socket.join(pageId); 
		socket.set('pageId', data.pageId); 
	} 
	socket.on('draw', function(data){
		socket.broadcast.emit('create', data); 
	});
	socket.on('changeRoom', function(data){
		console.log('data from change room: ', data); 
		socket.join(data.pageId); 
		socket.set('pageId', data.pageId); 		
	}); 
	socket.on('leaveRoom', function(data){
		socket.leave(data.pageId); 
		socket.set('pageId', null); 
	}); 
	socket.on('add', function(data){
		socket.get('pageId', function(err, pageId){
			if(err) return new Error('Error retrieving pageId', err); 
			//update the current state of the page 
			//pages[pageId].
			socket.broadcast.to(pageId).emit('create', data);
		}); 		
	}); 
	socket.on('update', function(data){
		socket.get('pageId', function(err, pageId){
			if(err) return new Error('Error retrieving pageId', err); 
			//update the current state of the page 
			//pages[pageId].
			socket.broadcast.to(pageId).emit('create', data);
		}); 		
	}); 
});