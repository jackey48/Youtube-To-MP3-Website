var https = require('https');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/db_YoutubeToMP3');

var  app = express(); //create express middleware dispatcher

const MIME_TYPES = {
	'css': 'text/css',
	'gif': 'image/gif',
	'htm': 'text/html',
	'html': 'text/html',
	'ico': 'image/x-icon',
	'jpeg': 'image/jpeg',
	'jpg': 'image/jpeg',
	'js': 'application/javascript',
	'json': 'application/json',
	'png': 'image/png',
	'svg': 'image/svg+xml',
	'txt': 'text/plain'
  }

const PORT = process.env.PORT || 3000

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); //use hbs handlebars wrapper

app.locals.pretty = true; //to generate pretty view-source code in browser

//read routes modules
var routes = require('./routes/index');

//some logger middleware functions
function methodLogger(request, response, next){
		   console.log("METHOD LOGGER");
		   console.log("================================");
		   console.log("METHOD: " + request.method);
		   console.log("URL:" + request.url);
		   next(); //call next middleware registered
}
function headerLogger(request, response, next){
		   console.log("HEADER LOGGER:")
		   console.log("Headers:")
           for(k in request.headers) console.log(k);
		   next(); //call next middleware registered
}

//register middleware with dispatcher
//ORDER MATTERS HERE
//middleware
app.use(express.static(__dirname + '/public', { 
	setHeaders: (res, path, stat) => {  //This bullshit courtesy of ChatGPT
		if(path.endsWith('.js')){
			res.set('Content-Type', 'application/javascript')
		}
	}	
}))

app.get('/login', routes.login);
//app.use(routes.authenticate); //authenticate user
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(methodLogger);
//routes
app.get('/home', routes.home);
app.get('/users', routes.users);
app.get('/register', routes.registration);
app.get('/entries', routes.entries);

//API Call
app.get('/download', function(request, response){
	console.log('Request Received');
	console.log(request.query);
	let key = Object.keys(request.query)[0];
	let url = request.query[key];
	console.log(key);
	console.log(url);
	
	const options = {
		method: 'GET',
		hostname: 'youtube-mp3-downloader2.p.rapidapi.com',
		port: null,
		path: '/ytmp3/ytmp3/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D' + url,
		headers: {
			'X-RapidAPI-Key': '3e5eb8d741msh21486d440770961p15b4d4jsn89fe17c29233',
			'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
		}
	};

	https.request(options, function (res) {
		const chunks = [];

		res.on('data', function (chunk) {
			chunks.push(chunk);
		});

		res.on('end', function () {
			const body = Buffer.concat(chunks);
			console.log(body.toString());
			response.send(body.toString());
		});
	}).end();
});

//Posts
app.post('/authenticate', routes.authenticate);
app.post('/addEntry', routes.addEntry);

app.post('/register', function(request, response){
	let data = '';
	
	request.on('data', function(chunk) {
        data += chunk; // Append each chunk to the data string
    });
	request.on('end', function() {
		let dataObj = JSON.parse(data)
		console.log(dataObj);
		let authorized = true;
		db.all("SELECT username FROM users", function(err, rows){
			console.log(rows);
			for(var i=0; i<rows.length; i++){
				if(rows[i].username == dataObj.username) {
					authorized = false;
					console.log("USERNAME TAKEN");
				}
			}	
			if(authorized === true){
				console.log("PREPARING TO INSERT");
				db.run(`INSERT INTO users values(?, ?, 'guest')`, [dataObj.username, dataObj.password], function(err){
					if (err) {
						console.error('Error inserting data:', err);
						// Handle error appropriately
					} else {
						console.log('Data inserted successfully');
						// Handle success appropriately
					}
				});
			}
			response.writeHead(200, {
				"Content-Type": MIME_TYPES["json"]
			})
			let respond = {
				signal: authorized
			}
			response.end(JSON.stringify(respond))
		});
	});
});

//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
		console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
		console.log(`To Test:`)
		console.log('user: jackey48 password: magicword48')
		console.log('http://localhost:3000/login')
		console.log('http://localhost:3000/home')
		console.log('http://localhost:3000/entries')
		console.log('http://localhost:3000/users')
	}
})
