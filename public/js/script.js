/* Author: 

*/


/**
 * returns string
 * this function returns the time difference between two times in words, Facebook style
 */
function nice_time_format(date) {

	var d = new Date(date*1000),
		n = new Date(),
		days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
		months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	
	if(!date) { return "No date provided"; }
	
	var periods         = ["second", "minute", "hour", "day"],
		lengths         = ["60","60","24","7"];
	
	var now             = Math.round(new Date().getTime()/1000),
		unix_date       = date;
	
	// check validity of date
	if(!unix_date) { return "Bad date"; }
	
	// state the tense
	// is it future date or past date
	if(now > unix_date) {    
		var difference    = now - unix_date,
			tense         = "ago";
	
	} else {
		var difference    = unix_date - now,
			tense         = "from now";
	}
	
	for( var j = 0; difference >= lengths[j] && j < lengths.length-1; j++) {
		difference /= lengths[j];
	}
	
	difference = Math.round(difference);
	
	/* we never want to return 0 seconds, it looks funny */
	if ((j == 0) && (difference < 30)) {
		return "seconds ago";
	}
	
	if(difference != 1) {
		periods[j] += "s";
	}
	
	
	
	var ret_val = difference+' '+periods[j]+' '+tense;
	
	/* If the return is days, we do some special processing */
	if (j == 3) {
		
		if (difference == 1) {
			if (tense == 'ago') { ret_val = 'Yesterday'; }
			else { ret_val = 'Tomorrow'; }
		} else if (difference < 7) {
			if (tense != 'ago') { ret_val = 'Next '+days[d.getDay()]; }
			else { ret_val = days[d.getDay()]; }
		} else {
			if ((d.getFullYear() === n.getFullYear()) && (tense == 'ago')) {
				ret_val = months[d.getMonth()]+' ';
				if (d.getDate() < 10) {
					ret_val += '0'+d.getDate();
				} else {
					ret_val += d.getDate();
				}
			} else {
				ret_val = months[d.getMonth()]+' ';
				if (d.getDate() < 10) {
					ret_val += '0'+d.getDate();
				} else {
					ret_val += d.getDate();
				}
				
				ret_val += ', '+d.getFullYear();
			}
		
		}
		
		var hour = (d.getHours() % 12),
			min = d.getMinutes(),
			meridian = (d.getHours() < 12) ? 'am' : 'pm';
		

		if (hour == 0) {
			hour = 12;
		}
		if (min < 10) {
			min = '0'+min;
		}
		
		ret_val += ' at '+hour+':'+min+meridian;
	}
	
	return ret_val;
}

/**
 * Format a unix timestamp to look nice
 */
var niceTime = function(timestamp) {
	var nice_date = new Date(timestamp*1000);
	
	var day = nice_date.getDate(),
		month = nice_date.getMonth()+1,
		year = nice_date.getFullYear(),
		hour = nice_date.getHours(),
		min = nice_date.getMinutes(),
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
}


/**
 * Trim the length of a link and add an elipsis if its over a specified length
 */ 
var trimLinkLength = function(link_html) {
	if (link_html.length > 100) {
		link_html = link_html.substring(0,100)+'...';
	}
	return link_html;
}

/**
 * Render and show a modal window with an add link form in it
 */
var showAddLink = function() {

	var form = $('<form>').attr('id','add_link_ajax'),
		method = $('<input>').attr('type','hidden').attr('name','_method').val('post'),
		title = $('<p>').html('Add a link to read later:'),
		url_container = $('<p>').html('<label for="url">URL: </label>'),
		url = $('<input>').attr('id','url').attr('type','url').attr('name','url').attr('required','required').attr('placeholder','http://www.google.com'),
		hint = $('<p>').addClass('hint').html('Press ENTER to save your URL');
		
	url_container.append(url);
	
	form.append(method)
		.append(title)
		.append(url_container)
		.append(hint);

	/* add the submit functionality to the form */
	form.submit(function(e){
			e.preventDefault();
			
			$.ajax({
				type: 'POST',
				url: '/api/link',
				data: $(this).serialize(),
				success: function(data) {
					var link = renderLink(data);
					modal_add.hideAndUnload(addLinkToPage(link));
				},
				dataType: 'json'
			});
		});
	
	var modal_add = new Boxy(form, { title: 'Add a link', modal: true });

}

/**
 * Render a link from JSON and return a jQuery object of that rendered link for placing on the page
 */
var renderLink = function(data) {
	var container = $('<div>').addClass('link'),
		time = $('<span>').addClass('time'),
		link_container = $('<span>').addClass('link'),
		link = $('<a>').addClass('linkr_link').attr('target','_blank');

	time.html(niceTime(data.created));
	
	// put the link together
	var link_html = data.title ? data.title : data.url;
	
	link_html = trimLinkLength(link_html);
	
	link.attr('href', data.url).html(link_html);
	
	/* Put it all together */
	link_container.append(link);
	container.append(time)
			 .append(link_container);
	
	return container;
}

var addLinkToPage = function(renderedLink) {
	var linkContainer = $('div#links'),
		linkHeader = $('div#links_header');

	if (window.location.pathname == '/home/archive') {
		linkHeader.after(renderedLink);
	} else {
		linkContainer.append(renderedLink);
	}
	
}

$('a.linkr_link').each(function(i, link){
	link_html  = trimLinkLength($(this).html());
	$(this).html(link_html);
});

$('a.linkr_link').click(function(e){
	e.preventDefault();
	
	var container = $(this).parent().parent(),
		location = $(this).attr('href');
	
	container.remove();
	window.open(location);
	
});

$('a#add_link').click(function(e){
	e.preventDefault();
	
	/* open a new boxy with the add link form in it */
	showAddLink();
});

$('form#add_link_ajax').submit(function(e){
	e.preventDefault();
	
	$.ajax({
		type: 'POST',
		url: '/api/link',
		data: $(this).serialize(),
		success: function(data) {
			window.location = '/home';
		},
		dataType: 'json'
	});
});

// show the bookmarklets div
$('a#bookmarklet_show').click(function(e){
	e.preventDefault();
	
	$('div#bookmarklets').toggle(400);
});













