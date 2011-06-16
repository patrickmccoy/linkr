/* Author: 

*/


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
 * Render and show a modal window with an add link form in it
 */
var showAddLink = function() {

	

	var form = $('<form>').attr('id','add_link_ajax'),
		method = $('<input>').attr('type','hidden').attr('name','_method').val('post'),
		title = $('<p>').html('Add a link to read later:'),
		url_container = $('<p>').html('<label for="url">URL: </label>'),
		url = $('<input>').attr('id','url').attr('type','url').attr('name','url').attr('required','required').attr('placeholder','http://www.google.com');
		
	url_container.append(url);
	
	form.append(method)
		.append(title)
		.append(url_container);

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
	
	link.attr('href', data.url).html(data.url);
	
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


$('.linkr_link').click(function(e){
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


















