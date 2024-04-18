var url = require('url');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/db_YoutubeToMP3');
var role = '';
var user = '';

db.serialize(function(){});

exports.login = function (request, response){
        // login.html
	    response.render('login', { title: 'Youtube to MP3', body: 'Please Log In'});
}

exports.entries = function (request, response){
	console.log(role);
	console.log(user);
	if(role != ''){
		db.all(`SELECT title, url FROM videos WHERE username LIKE '${user}'`, function(err, rows){
		console.log(rows);
		response.render('entries', {title : 'Videos:', videoEntries: rows});
		})
	}
	else{
		response.render('Error', {title: 'ERROR: No Login'});
	}
}

exports.authenticate = function (request, response){
	let data = '';
	
	request.on('data', function(chunk) {
		data += chunk; // Append each chunk to the data string
	});
	request.on('end', function() {
		let dataObj = JSON.parse(data);
		console.log(dataObj);
		let authorized = false;
		db.all("SELECT username, password, role FROM users", function(err, rows){
			console.log(user);
			for(var i=0; i<rows.length; i++){
				if(rows[i].username == dataObj.username & rows[i].password == dataObj.password) {
					authorized = true;
					role = rows[i].role;
					user = rows[i].username;
					console.log(role);
					console.log(user);
					console.log("AUTHENTICATION ACCEPTED");
					response.send(JSON.stringify(authorized));
					break;
				}
			}	
		});
	});
}

// function parseURL(request, response){
// 	var parseQuery = true; //parseQueryStringIfTrue
//     var slashHost = true; //slashDenoteHostIfTrue
//     var urlObj = url.parse(request.url, parseQuery , slashHost );
//     console.log('path:');
//     console.log(urlObj.path);
//     console.log('query:');
//     console.log(urlObj.query);
//     //for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
// 	return urlObj;

// }

exports.users = function(request, response){
	// users.html
		console.log(role);
        if(role === 'admin'){
			db.all("SELECT username, password FROM users", function(err, rows){
			console.log(rows);
			response.render('users', {title : 'Users:', userEntries: rows});
			})
		}
		else{
			response.render('Error', {title: 'ERROR: Admin Only'});
		}
}

exports.home = function (request, response){
		console.log(role);
		console.log(user);
        if(role != ''){
			response.render('home', {title: 'Youtube to MP3', body: 'Paste the Youtube link of a video you want converted'});
		}
		else{
			response.render('Error', {title: 'ERROR: No Login'});
		}
}
exports.registration = function(request, response){
    response.render('register', {title: 'Register New User'})
}

exports.addEntry = function(request, response){
	let data = '';
	
	request.on('data', function(chunk) {
		data += chunk; // Append each chunk to the data string
	});
	request.on('end', function() {
		let dataObj = JSON.parse(data);
		console.log(dataObj);
		db.run(`INSERT INTO videos values(?, ?, ?)`, [user, dataObj.url, dataObj.title], function(err){
			if (err) {
				console.error('Error inserting data:', err);
				// Handle error appropriately
			} else {
				console.log('Data inserted successfully');
				// Handle success appropriately
			}
		});
	});	
}