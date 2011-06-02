/**
 *  Configuration Variables
 */

var host = 'localhost',
    port = 3001;


/**
 * Module dependencies.
 */

var express = require('express'),
	mongoose = require('mongoose'),
	komainu = require('komainu');
	
var db = mongoose.connect('mongodb://localhost/linkr');

var app = module.exports = express.createServer();

var sp = komainu.createSecurityProvider();
sp.addCredentials('test', 'test', 'LOGGED_IN_USER'); // test purposes only


/**
 * Models 
 */
 
var users = require('./models/user').Users(db);


/**
 * Security/Authentication Logic
 */
 
sp.on('login', function(req, res, username, password) {

   /*
	* You can now evaluate both the provided username and password
	* against whatever domain user store you need in order to authenticate
	* the login request.
	*/
	
	users.findOne({ email: username }, function(err, user){
		if (!err) {
			
			if (user.authenticate(password)) {
				// set the user in the request object
				var keys = {};
				keys.user = user;
				keys.status = 'OK';
			
				// make sure to emit the next two events to complete the auth chain
				sp.emit('loginSuccess', req, res, username);
				sp.emit('initSession', req, res, username, password, keys);
			} else {
				sp.emit('loginFailure', req, res, username);
		}
		}

	});

   
});


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
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(sp.secure(function(req, res){ return true; }));
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

/**
 * Helper Middleware
 */

var auth = function(req, res) {
	if (req.session.security.keys.status == 'OK') {
		return true;
	} else {
		return false;
	}
}

// Routes

app.get('/', sp.ignore(function(req,res){ return true; }), function(req, res){
	res.render('index', {
		title: 'linkr'
	});
});

app.get('/secure', auth, function(req, res){
	
});

app.all('*', function(req, res) {
	throw new NotFound('Page not found.');
});

app.listen(port,host);
console.log("Express server listening on port %d", app.address().port);
