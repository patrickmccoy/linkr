var mongoose = require('mongoose');
	
/* database modeling */

function validatePresence(value) {
	return value && value.length;
}

function isValidURL(url){
	if (url && url.length) {
	    var RegExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	
	    if(RegExp.test(url)){
	        return true;
	    } else {
	        return false;
	    }
    } else {
    	return false;
    }
}


var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
  
var Link = new Schema({
	owner 	: { type: ObjectId, validate: [validatePresence, 'an owner is required'] }
  , link 	: { type: String, validate: [isValidURL, 'a link is required'] }
  , read 	: { type: Number, default: 0 }
  , time 	: { type: Date, default: Date.now }
  , visibility 	: { type: String, default: 'private' }
});

Link.virtual('id')
	.get(function() {
		return this._id.toHexString();
	});
	

mongoose.model('Link', Link);


exports.Links = function(db) {
	return db.model('Link');
}