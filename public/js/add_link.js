(function(e,a,g,h,f,c,b,d){if(!(f=e.jQuery)||g>f.fn.jquery||h(f)){c=a.createElement("script");c.type="text/javascript";c.src="http://ajax.googleapis.com/ajax/libs/jquery/"+g+"/jquery.min.js";c.onload=c.onreadystatechange=function(){if(!b&&(!(d=this.readyState)||d=="loaded"||d=="complete")){h((f=e.jQuery).noConflict(1),b=1);f(c).remove()}};a.documentElement.childNodes[0].appendChild(c)}})(window,document,"1.6.1",function($,L){
var uri_base = 'http://localhost:3001',
	link_addr = window.location;
$.ajax({
	url: uri_base+'/api/link',
	type: 'POST',
	data: { url: link_addr },
	success: function(data){
		alert('Page added to linkr!');
	},
	dataType: 'jsonp'
});
});