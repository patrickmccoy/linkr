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

var restrictTo = function(role) {
  return function(req, res, next) {
    req.session.security.role == role
      ? next()
      : next(new Error('Unauthorized'));
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
		if (!err) {
			
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
				res.redirect('back');
			}
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
	links.find({ owner: req.session.security.user.id }, function(err, link){
		res.render('home', {
			title: 'linkr | link archive'
		  , links: link
		});
	});
});

app.get('/link/:id', auth, function(req, res){
	links.findById(req.params.id, function(err, lnk){
		if (!err && (lnk.owner == req.session.security.user.id)) {
			lnk.read = 1;
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
 
app.get('/api', auth, function(req, res){
	links.find({ owner: req.session.security.user.id, read: 0 }).sort( 'time', 1 ).run(function(err, link){
		if (!err) {
			var response = { items: [], totalItems: link.length };
			
			link.forEach(function(lnk){
				var return_link = { user: lnk.owner, url: lnk.link, created: Math.floor(lnk.time.getTime()/1000) };
				response.items.push(return_link);
			});
			res.send(JSON.stringify(response));
		} else {
			throw new Error('API Request Failed');
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
