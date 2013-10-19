var mongo = require("mongodb"), 
uri = process.env.MONGOHQ_URI || 'mongodb://requiretest:testing@paulo.mongohq.com:10055/lmalcom', 
db = null; 
openDB(uri); 

//open any DB 
function openDB(uri){ 
	mongo.connect(uri, {journal:true},function(err, database){ 
		if(err)	console.log('Error connecting to the database! ', err); 
		else{ 
			db = database; 
			console.log('Connected to the database!'); 
		} 
	}); 
}

function findPage(){
	db.collection('pages', function(error, collection){
		collection.find(); 
	}); 
	return this; 
}

function addPage(page, callback){
	db.collection('pages', function(error,collection){
		if(!page || !page.name || !page.page) return 'Page not sent!'; 

		//if there is no _id then check if the name is already taken...
		//if the name is taken do not allow the save
		//else save the page 
		(!page._id)?
			collection.find({name: page.name}).toArray(function(err, pages){				 
				(err) 				? console.log('Error: ', err): 
				(pages.length !== 0)	? console.log("that's already in the db!!!"): 
				collection.save(page, function(err, newPage){
					if(err) console.log('error!:', err); 
					else{
						console.log('you have inserted '+ page.name +' into the database!'); 
						callback(newPage); 
					};
				});
			}): 		

			//otherwise it's already in the DB and we need to update it
			collection.save(page, function(err, newPage){
				if(err) console.log('error!:', err); 
				else{
					console.log('you have inserted '+ page.name +' into the database!'); 
					callback(newPage); 
				};
			});		
	});
}
function getPage(name, callback){
	if(typeof name !== 'string') return new Error('Name is not of proper type'); 
	db.collection('pages', function(error, collection){
		(error)? console.log('this is the collections error: ' + error):	

		//find the page and send it back	
		collection.find({name : name}, function(error, index){
			(error)? console.log('this is the find error: ' + error):				
			index.toArray(function(error, pages){
				(pages.length === 0) ? callback('What are you looking 404? Page not Found :/ '): callback(pages[0]); 						
			})			
		}); 		
	}); 
	return this; 
}

module.exports.addPage = addPage; 
module.exports.getPage = getPage;