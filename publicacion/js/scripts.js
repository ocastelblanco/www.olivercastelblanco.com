$(function() {
	// Verifica que el browser del usuario tenga @font-face capabilities
	Modernizr.load({
	  test: Modernizr.fontface,
	  yep : 'webfonts/bazar-webfont.css',
	  nope: 'js/no-fontface.js'
	});
});