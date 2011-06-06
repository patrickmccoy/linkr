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
  , readTime: { type: Date, default: Date.now }
  , time 	: { type: Date, default: Date.now }
  , visibility 	: { type: String, default: 'private' }
});

Link.virtual('id')
	.get(function() {
		return this._id.toHexString();
	});
	
Link.virtual('niceTime').get(function(){
	var day = this.time.getDate(),
		month = this.time.getMonth()+1,
		year = this.time.getFullYear(),
		hour = this.time.getHours(),
		min = this.time.getMinutes(),
		meridian = (hour < 12) ? 'am' : 'pm';
	
	hour = hour % 12;
	
	if (hour == 0) {
		hour = 12;
	}
	
	if (hour < 10) {
		hour = '0'+hour;
	}
	if (min < 10) {
		min = '0'+min;
	}
	if (month < 10) {
		month = '0'+month;
	}
	if (day < 10) {
		day = '0'+day;
	}
	
	return month+'/'+day+'/'+year+' '+hour+':'+min+' '+meridian;
});


mongoose.model('Link', Link);


exports.Links = function(db) {
	return db.model('Link');
}