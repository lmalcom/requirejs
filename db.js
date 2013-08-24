var mongo = require("mongodb"), 
MongoClient = mongo.MongoClient, 
host = "127.0.0.1", 
port = mongo.Connection.DEFAULT_PORT, 
db;

//console.log(mongo.Server); 
//var server = new MongoServer; 
var mongoclient = new MongoClient(new mongo.Server(host, port), {journal:true})
openDB('css'); 

//open any DB 
function openDB(dbName){
	mongoclient.open(function(error, dbOb){
		if(error){
			console.log('error connecting to the database!'); 
		}else{
			db = (typeof dbName === 'string') ? mongoclient.db(dbName) : 'default'; 
		}
	}); 
}

function addUser(user){
	db.collection('user', function(error,collection){
		if(!user || !user.username || !user.password || !user.email){
			return 'Error, there are no users'
		}
		collection.insert({
			username  : user.username,
			password :user.password,
			email : user.email
		}, function(){
			console.log('you have entered '+ user.username +' into the database! Their email is: ' + user.email);
		});
	});
}

function findUser(user, callback){
	db.collection('user', function(error, collection){
		if(error){
			console.log('this is the collections error: ' + error); 
		}else{
			collection.find({'username' : user.toString()}, function(error, index){
				if(error){
					console.log('this is the find error: ' + error); 
				}else{
					//if no user return false
					index.toArray(function(error, users){
						if (users.length == 0){
							console.log('user not found'); 
							callback(false); 
						}else{
							//return user object 
							callback(users[0]);    
						}
					});  
				}
			}); 
		}
	}); 
}

function verifyUser(username, password, callback){
	//first find user
	var status = findUser(username, function(user){
		if(user){
			//check password
			callback(user.password == password); 
		}else{
			callback(false); 
		}
	}); 
	return status; 
}

function addModel(id, model){
	console.log('received model data'); 
	console.log(id, model); 
	console.log(db); 
	db.collection('block', function(error,collection){
		if(error){
			return 'Error: ' + error
		}
		collection.insert({
			Model : id,
			Settings : model
		}, function(){
			console.log('you have entered id: '+ id +' into the database!');
		});
	});
}

module.exports.addUser = addUser; 
module.exports.findUser = findUser; 
module.exports.verifyUser = verifyUser; 
module.exports.addModel = addModel; 
 
