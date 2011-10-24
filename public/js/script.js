/* Author: 

*/

$('#add_link_modal').modal({ backdrop: true });

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
    var length = 65;
    
	if (link_html.length > length) {
		link_html = link_html.substring(0,length)+'...';
	}
	return link_html;
}

/**
 * Render and show a modal window with an add link form in it
 */
var addLink = function(form, modal) {
	if (form.find('input#url').length) {
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: '/api/link',
			data: form.serialize(),
			beforeSend: function() {
				modal.modal('hide');
				modal.find("input#url").val("");
			},
			success: function(data) {
				var link = renderLink(data);
				addLinkToPage(link);
			}
		});
    }
}

/**
 * Render a link from JSON and return a jQuery object of that rendered link for placing on the page
 */
var renderLink = function(data) {
	var container = $('<div>').attr('id',data.id).addClass('row'),
		time = $('<span>').addClass('span3'),
		link_container = $('<span>').addClass('span8'),
		link = $('<a>').addClass('linkr_link').attr('target','_blank'),
		handle = $('<span>').addClass('pull-right').addClass('sortable_handle').addClass('ui-icon').addClass('ui-icon-arrowthick-2-n-s');

	time.html(niceTime(data.created));
	
	// put the link together
	var link_html = data.title ? data.title : data.url;
	
	link_html = trimLinkLength(link_html);
	
	link.attr('href', data.readLink).html(link_html);
	
	link.click(function(e){
    	e.preventDefault();

    	if (window.location.pathname == '/home') {
    	    container.remove();
        }
    	window.open(data.readLink);

    });
    
    container.data({link: data});
	
	/* Put it all together */
	link_container.append(link);
	container.append(time)
			 .append(link_container)
			 .append(handle);
	
	return container;
}

var addLinkToPage = function(renderedLink) {
	var linkContainer = $('div#links .span12'),
		linkHeader = $('div#links_header');

	if (window.location.pathname == '/home/archive') {
		linkHeader.after(renderedLink);
	} else {
		linkContainer.append(renderedLink);
	}
	
}

/**
 * Fetch the links from the API and render them on the page
 */
var fetchAndRenderAllLinks = function(options) {
    // default options
    options.api_url = options.api_url || '/api';
    
    var title = $("title"),
        title_text = title.text(),
        banner = $(".content #banner"),
        banner_text = banner.text(),
        active_page_nav = $(".topbar ul.nav .active a"),
        active_page_text = active_page_nav.text();
    
    $.ajax({
          url: options.api_url 
        , dataType: 'json'
        , success: function(data) {
            data.items.forEach(function(link){
                addLinkToPage(renderLink(link));
            });
            
            // update the nav and title to show the total number of items
            var displayed_items = " ("+ data.totalItems +")";
            title.text(title_text+displayed_items);
            banner.text(banner_text+displayed_items);
            active_page_nav.text(active_page_text+displayed_items);
        }
        
    });
}

// show the bookmarklets div
$('a#bookmarklet_show').click(function(e){
	e.preventDefault();
	
	$('div#bookmarklets').toggle(400);
});

/**
 * render the links
 */
if (window.location.pathname == '/home') {
    fetchAndRenderAllLinks({ api_url: '/api' });
} else if (window.location.pathname =='/home/archive') {
    fetchAndRenderAllLinks({ api_url: '/api/archive' });
}

/**
 * Sortable link order on /home
 */

var get_link_position = function (element) {
	var number_of_header_nodes = 1,
		position = 0,
		count = 0,
		curr = element,
		prev = element.prev();
		
	while (prev.length != 0) {
		curr = prev;
		prev = prev.prev();
		count++;
	}
	
	// calculate the position
	position = count - number_of_header_nodes;
	
	return position;
}

// wrap it all in an if to make sure we are only doing this on the right page
if (window.location.pathname == '/home') {
	$('#links').sortable({    containment: 'parent'
							, handle: 'span.sortable_handle'
							, items: 'div.link'
							, revert: true
							, update: function (e, ui) {
								var position = get_link_position(ui.item),
									id = ui.item.attr('id');
								
								$.ajax({
									url: '/api/link/'+id+'/position',
									data: { position: position },
									dataType: 'json',
									type: 'POST'
								});
							}
						 });
	$('div.link').disableSelection();
}












