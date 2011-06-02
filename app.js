/**
 *  Configuration Variables
 */

var host = 'localhost',
    port = 3000;


/**
 * Module dependencies.
 */

var express = require('express'),
	mongoose = require('mongoose');
	
var db = mongoose.connect('mongodb://localhost');

var app = module.exports = express.createServer();


/**
 * Models 
 */
 
var users = require('./models/user').Users(db);


// Configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('view options', {
			layout: true,
			title: 'linkr'
	});
	app.use(express.logger({ format: '":date" ":remote-addr" ":response-time" ":method" ":url" ":status" ":referrer" ":user-agent"' }));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'your secret here' }));
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
  
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
	//app.use(express.errorHandler()); 
});

app.error(function(err, req, res, next) {
	if (err instanceof NotFound) {
		res.render('404', { title: 'linkr: not found', status: 404 });
	} else {
		res.render('500', { title: 'linkr', status: 500 });
	}
});

function NotFound(msg) {
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}
NotFound.prototype.__proto__ = Error.prototype;

// Routes

app.get('/', function(req, res){
	res.render('index', {
		title: 'linkr'
	});
});

app.all('*', function(req, res) {
	throw new NotFound('Page not found.');
});

app.listen(port,host);
console.log("Express server listening on port %d", app.address().port);
