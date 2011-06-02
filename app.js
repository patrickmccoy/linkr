/**
 *  Configuration Variables
 */

var host = 'localhost',
    port = 3001;


/**
 * Module dependencies.
 */

var express = require('express'),
	mongoose = require('mongoose');
	
var db = mongoose.connect('mongodb://localhost/linkr');

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
	app.use(express.session({ secret: 'keyboard cat' }));
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

var auth = function(req, res, next) {
	if (req.session.security && (req.session.security.status == 'OK')) {
		next();
	} else {
		res.redirect('/login');
	}
}

// Routes

app.get('/', function(req, res){
	res.render('index', {
		title: 'linkr'
	});
});

app.get('/secure', auth, function(req, res){
	res.render('index', {
		title: 'linkr secure page'
	})
});

app.get('/login', function(req, res){
	res.render('login', {
		title: 'linkr'
	})
});

app.post('/login', function(req, res){
	users.findOne({ email: req.body.email }, function(err, user){
		if (!err) {
			
			if (user.authenticate(req.body.password)) {
				// set the user in the request object
				var security = {};
				security.user = user;
				security.status = 'OK';
				security.role = user.role;
			
				req.session.security = security;
				res.redirect('/secure');
				
			} else {
				res.redirect('back');
		}
		}

	});

});

app.all('*', function(req, res) {
	throw new NotFound('Page not found.');
});

app.listen(port,host);
console.log("Express server listening on port %d", app.address().port);
