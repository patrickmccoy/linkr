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
var links = require('./models/link').Links(db);


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
	//app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
});


/**
 * Error Handling
 */

// NotFound hanldes not found errors
function NotFound(msg) {
	this.name = 'NotFound';
	this.msg = msg;
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}
NotFound.prototype.__proto__ = Error.prototype;

// AuthError handles authentication errors
function AuthError(msg) {
	this.name = 'AuthError';
	this.msg = msg;
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}
AuthError.prototype.__proto__ = Error.prototype;

// APIAuthError handles errors regarding authentication when using the API
// Argument is an object with the HTTP response code and the txt message to display to the user
function APIAuthError(msg) {
	this.name = 'APIAuthError';

	this.msg = msg;
	
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}
APIAuthError.prototype.__proto__ = Error.prototype;

// APINotFound hanldes not found errors for API endpoints
// Argument is an object with the HTTP response code and the txt message to display to the user
function APINotFound(msg) {
	this.name = 'APINotFound';
	this.msg = msg;
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}
APINotFound.prototype.__proto__ = Error.prototype;

// APIError handles general API errors
// Takes either a string, or an object as the single argument with the code and the text
function APIError(msg) {
	this.name = 'APIError';
	if (msg instanceof Object) {
		this.msg = msg;
	} else {
		this.msg = {};
		this.msg.code = 500;
		this.msg.txt = msg;
	}
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}
APIError.prototype.__proto__ = Error.prototype;



// NotFound errors
app.error(function(err, req, res, next) {
	if (err instanceof NotFound) {
		res.header('Content-Type', 'text/html; charset=utf-8');
		res.render('error/404', { title: 'linkr: not found', status: 404, message: err.msg });
	} else {
		next(err);
	}
});

// AuthError errors
app.error(function(err, req, res, next) {
	if (err instanceof AuthError) {
		res.header('Content-Type', 'text/html; charset=utf-8');
		res.render('error/403', { title: 'linkr: forbidden', status: 403, message: err.msg });
	} else {
		next(err);
	}
});

// APIAuthError errors
app.error(function(err, req, res, next) {
	if (err instanceof APIAuthError) {
		var response  = {},
			code = err.msg.code,
			headers = { 'Content-Type': 'application/json; charset=utf-8' };
		
		response.code = code;
		response.error = { msg: err.msg.txt };
		
		// send the response
		res.send(JSON.stringify(response), headers, code);
	} else {
		next(err);
	}
});

// APINotFound errors
app.error(function(err, req, res, next) {
	if (err instanceof APINotFound) {
		var response  = {},
			code = err.msg.code,
			headers = { 'Content-Type': 'application/json; charset=utf-8' };
		
		response.code = code;
		response.error = { msg: err.msg.txt };
		
		// send the response
		res.send(JSON.stringify(response), headers, code);
	} else {
		next(err);
	}
});


// APIError errors
app.error(function(err, req, res, next){
	if (err instanceof APIError) {
		var response  = {},
			code = err.msg.code,
			headers = { 'Content-Type': 'application/json; charset=utf-8' };
		
		response.code = code;
		response.error = { msg: err.msg.txt };
		
		// send the response
		res.send(JSON.stringify(response), headers, code);
	} else {
		next(err);
	}
});

// All other errors
app.error(function(err, req, res, next){
	res.header('Content-Type', 'text/html; charset=utf-8');
	res.render('error/500', { title: 'linkr', status: 500, message: err.msg });
});




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

var APIAuth = function(req, res, next) {
	if (req.session.security && (req.session.security.status == 'OK')) {
		next();
	} else {
		next(new APIAuthError({ code: 403, txt: 'You must authenticate to view this content' }));
	}
}

var restrictTo = function(role) {
  return function(req, res, next) {
    req.session.security.role == role
      ? next()
      : next(new AuthError('You are forbidden to see this page.'));
  }
}

// Routes

app.get('/', function(req, res){
	res.render('index', {
		title: 'linkr'
	});
});

app.get('/create', function(req, res){
	res.render('create', {
		title: 'linkr | create'
	});
});

app.put('/create', function(req, res){
	if (req.body.email && req.body.pass && (req.body.pass === req.body.confirm) && req.body.first && req.body.last) {
		var user = new users();
		user.first = req.body.first;
		user.last = req.body.last;
		user.role = 'user';
		user.email = req.body.email;
		user.password = req.body.pass;
		
		user.save(function(err){
			if (!err) {
				// set the session and redirect
				var security = {};
				security.user = user;
				security.status = 'OK';
				security.role = user.role;
			
				req.session.security = security;
				
				res.redirect('/home');
			} else {
				throw new Error('User Save Error!');
			}
		});
		
	} else  {
		res.redirect('back');
	}
});

app.get('/login', function(req, res){
	res.render('login', {
		title: 'linkr'
	})
});

app.post('/login', function(req, res){
	users.findOne({ email: req.body.email }, function(err, user){
		if (!err && user) {
			
			if (user.authenticate(req.body.password)) {
				// set the user in the request object
				var security = {};
				security.user = {};
				security.user.id = user.id;
				security.status = 'OK';
				security.role = user.role;
			
				req.session.security = security;
				res.redirect('/home');
				
			} else {
				res.redirect('/login');
			}
		} else {
			res.redirect('/login');
		}

	});

});

app.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('home');
});

/**
 * Authenticated Routes
 */
app.get('/home', auth, function(req, res){
	links.find({ owner: req.session.security.user.id, read: 0 }).sort( 'time', 1 ).run(function(err, link){
		if (!err) {
			res.render('home', {
				  title: 'linkr'
				, links: link
			});
		} else {
			var link = [];
			res.render('home', {
				  title: 'linkr'
				, links: link
			});
		}
		
	});
	
});

app.get('/home/add', auth, function(req, res){
	res.render('home/add', {
		title: 'linkr | add'
	});
});

app.put('/home/add', auth, function(req, res){
	var link = new links();
	link.owner = req.session.security.user.id;
	link.link = req.body.url;
	
	link.save(function(err){
		if (!err) {
			res.redirect('/home');
		} else {
			throw new Error('Link Save Error!');
		}
	});
	
});

app.get('/home/archive', auth, function(req, res){
	links.find({ owner: req.session.security.user.id }, [], { sort: { 'time': -1 } }, function(err, link){
		res.render('home', {
			title: 'linkr | link archive'
		  , links: link
		});
	});
});

app.get('/link/:id', auth, function(req, res){
	links.findById(req.params.id, function(err, lnk){
		if (!err && lnk && (lnk.owner == req.session.security.user.id)) {
			lnk.read = 1;
			lnk.readTime = new Date();
			lnk.save(function(err){
				if (!err) {
					res.redirect(lnk.link);
				} else {
					throw new Error('Link Save Error!');
				}
			});
		} else {
		
		}
	});
});

/**
 * API Routes
 */

// Authentication and default content-type header for all api requests
app.all('/api', APIAuth, function(req, res, next){
	res.header('Content-Type', 'application/json; charset=utf-8');
	next();
});
app.all('/api/*', APIAuth, function(req, res, next){
	res.header('Content-Type', 'application/json; charset=utf-8');
	next();
});
 
app.get('/api', function(req, res, next){
	links.find({ owner: req.session.security.user.id, read: 0 }, [], { sort: { 'time': 1 } }).run(function(err, link){
		if (!err && link) {
			var response = { items: [], totalItems: link.length };
			
			link.forEach(function(lnk){
				var return_link = { user: lnk.owner, url: lnk.link, created: Math.floor(lnk.time.getTime()/1000) };
				response.items.push(return_link);
			});
			res.send(JSON.stringify(response));
			
		} else {
			next(new APIError('API Request Failed'));
		}
	});
});

app.get('/api/archive', function(req, res, next){
	links.find({ owner: req.session.security.user.id }, [], { sort: { 'time': -1 } }).run(function(err, link){
		if (!err && link) {
			var response = { items: [], totalItems: link.length };
			
			link.forEach(function(lnk){
				var return_link = { user: lnk.owner, url: lnk.link, read: lnk.read, created: Math.floor(lnk.time.getTime()/1000), readTime: Math.floor(lnk.readTime.getTime()/1000) };
				response.items.push(return_link);
			});
			res.send(JSON.stringify(response));
		} else {
			next(new APIError('API Request Failed'));
		}
	});
});

app.get('/api/latest', function(req, res, next){
	links.findOne({ owner: req.session.security.user.id, read: 0 }, [], { sort: { 'time': 1 } }).run(function(err, lnk){
		if (!err) {
			if (lnk) {
				var response = { user: lnk.owner, url: lnk.link, created: Math.floor(lnk.time.getTime()/1000) };
			
				res.send(JSON.stringify(response));
			} else {
				var response = { user: req.session.security.user.id, error: { type: 'NoContent', msg: 'You have no content to display!' } };
				res.send(JSON.stringify(response));
			}
			
		} else {
			next(new APIError('API Request Failed'));
		}
	});
});

app.get('/api/link/:id', function(req, res, next){
	links.findById(req.params.id, function(err, lnk){
		if (!err) {
			if (lnk){
				if (lnk.owner == req.session.security.user.id) {
					var response = { user: lnk.owner, url: lnk.link, read: lnk.read, created: Math.floor(lnk.time.getTime()/1000) };
				
					res.send(JSON.stringify(response));
				} else {
					next(new APIAuthError({ code: 403, txt: 'You are forbidden from seeing this content' }));
				}
			} else {
				next(new APINotFound({ code: 404, txt: 'No content at this URI endpoint' }));
			}
			
		} else {
			next(new APIError('API Request Failed'));
		}
	});
});



/**
 * Catch-all and show a not found page
 */

app.all('*', function(req, res) {
	throw new NotFound('Page not found.');
});

app.listen(port,host);
console.log("Express server listening on port %d", app.address().port);
