(function(e,a,g,h,f,c,b,d){if(!(f=e.jQuery)||g>f.fn.jquery||h(f)){c=a.createElement("script");c.type="text/javascript";c.src="http://ajax.googleapis.com/ajax/libs/jquery/"+g+"/jquery.min.js";c.onload=c.onreadystatechange=function(){if(!b&&(!(d=this.readyState)||d=="loaded"||d=="complete")){h((f=e.jQuery).noConflict(1),b=1);f(c).remove()}};a.documentElement.childNodes[0].appendChild(c)}})(window,document,"1.6.1",function($,L){
var uri_base = 'http://localhost:3001';
$.getJSON(uri_base+'/api/latest?callback=?',function(data){
	if (!data.error) {
		window.location = uri_base+data.readLink;
	} else {
		var msg;
		if (data.error.code == 204) {
			msg = data.error.msg;
		} else if (data.error.code == 403) {
			msg = 'The next link cannot be found, maybe you need to <a href="http://linkr.cc/login">login?</a>';
		} else {
			msg = 'Something went wrong while processing your request. Please try again!';
		}
		
		var width = 300,
			height = 50
			container = $('<div>').attr('id','linkr_error_box')
				.css('font-size','14px')
				.css('text-align','center')
				.css('background-color','#f99')
				.css('position','absolute')
				.css('margin','0 auto 0 auto')
				.css('padding','5px 10px 5px 10px')
				.css('top','0')
				.css('left','40%')
				.css('width',width+'px')
				.css('height',height+'px')
				.html(msg)
				.appendTo($('body')).delay(5000).fadeOut('slow');;
	}
});
});

