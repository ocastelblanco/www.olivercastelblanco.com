$(function() {
	
	$('#salida').css('display', 'block');
	
	// Verifica que el browser del usuario tenga @font-face capabilities
	Modernizr.load({
	  test: Modernizr.fontface,
	  yep : 'webfonts/webfonts.css',
	  nope: 'js/no-fontface.js'
	});
	$(window).resize(function(e) {
		$('#cajas').children().remove();
    });
	$.getJSON('scripts/twitter.php', function(datos) {
		for (var tweet in datos) {
			$('#twitter').append('<div id="trino">'+datos[tweet]+'</div>');
		}
	});
});