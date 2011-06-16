/* Author: 

*/

/**
 * Format a unix timestamp to look nice
 */
var niceTime = function(timestamp) {
	var date = new Date(timestamp*1000);
	
	var day = date.getDate(),
		month = date.getMonth()+1,
		year = date.getFullYear(),
		hour = date.getHours(),
		min = date.getMinutes(),
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
var renderLink = function(link) {
	var container = $('<div>').addClass('link'),
		time = $('<span>').addClass('time'),
		link_container = $('<span>').addClass('link'),
		link = $('<a>').addClass('linkr_link').attr('target','_blank');
		
	time.html(niceTime(link.created));
	
	link.attr('href',link.url);
	link.html(link.url);
	
	/* Put it all together */
	link_container.append(link);
	container.append(time)
			 .append(link_container);
	
	return container;
}

var addLinkToPage = function(renderedLink) {
	var linkContainer = $('div#links');
	
	linkContainer.append(renderedLink);
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




















