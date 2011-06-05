/* Author: 

*/


$('.linkr_link').click(function(e){
	e.preventDefault();
	
	var container = $(this).parent().parent(),
		location = $(this).attr('href');
	
	container.remove();
	window.open(location);
	
});




















