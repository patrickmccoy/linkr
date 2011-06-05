require('joose');
require('joosex-namespace-depended');
require('hash');

var mongoose = require('mongoose');
	
/* database modeling */

function Capitalize (v) {
	return v.replace(/^\w/, function($0) { return $0.toUpperCase(); })
}

function validatePresence(value) {
	return value && value.length;
}

function toLower (v) {
  return v.toLowerCase();
}

function VerifyEmail(v) {
	var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return v && v.length && pattern.test(v);
}

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
  

var User = new Schema({
	email	  : { type: String, validate: [VerifyEmail, 'an email is required'], set: toLower, index: { unique: true } }
  , first     : { type: String, validate: [validatePresence, 'a first name is required'], set: Capitalize }
  , last      : { type: String, validate: [validatePresence, 'a last name is required'], set: Capitalize }
  , role 	  : { type: String }
  , pass	  : { type: String, validate: [validatePresence, 'a password is required'] }
  , salt	  : { type: String }
  
});


User.virtual('id')
	.get(function() {
		return this._id.toHexString();
	});
	
User.virtual('name')
	.get(function() {
		return this.first.toString() + ' ' + this.last.toString();
	});

User.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.pass = this.encryptPassword(password);
	})
	.get(function() { return this._password; });

User.method('encryptPassword', function(password) {
	return Hash.rmd160(this.salt+password);
});

User.method('authenticate', function(plainText) {
	return this.encryptPassword(plainText) === this.pass;
});

User.method('makeSalt', function() {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split(''),
    	length = 10,
    	str = '';
    	
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
});

mongoose.model('User', User);


exports.Users = function(db) {
	return db.model('User');
}