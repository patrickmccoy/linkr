(function(e,a,g,h,f,c,b,d){if(!(f=e.jQuery)||g>f.fn.jquery||h(f)){c=a.createElement("script");c.type="text/javascript";c.src="http://ajax.googleapis.com/ajax/libs/jquery/"+g+"/jquery.min.js";c.onload=c.onreadystatechange=function(){if(!b&&(!(d=this.readyState)||d=="loaded"||d=="complete")){h((f=e.jQuery).noConflict(1),b=1);f(c).remove()}};a.documentElement.childNodes[0].appendChild(c)}})(window,document,"1.6.1",function($,L){
var uri_base = 'http://localhost:3001';
$.ajax({
	type: "GET",
	url: uri_base+'/api/bookmarklet_add',
	data: { url: window.location.href },
	success: function(data){
		var msg;
		
		if (!data.error) {
			msg = 'The link was successfully added to linkr!';
		} else if (data.error.code == 403) {
			msg = 'The link cannot be added to linkr because you are not authenticated, please <a href="http://linkr.cc/login">login</a> and try again.';
		}
		
		var width = 300,
			height = 50
			container = $('<div>').attr('id','linkr_add_confirm')
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
				.appendTo($('body')).delay(5000).fadeOut('slow');
	},
	dataType: 'jsonp'
});
});