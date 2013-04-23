// Inserta video en la página de ambientación
$(function() {
	var v = document.createElement("video"); // Se verifica que el browser tenga capacidad HTML5
	if (!v.play || navigator.appName == 'Microsoft Internet Explorer') { // Se usa Flash, con el reproductor JWPlayer
		jwplayer("video").setup({
			flashplayer: "swf/player.swf",
			file: "video/mod01ambientacion.f4v",
			image: "img/fondoVideo320x240.gif"
		});
	}
	$('#video_wrapper').removeAttr('style');
	$('#video_wrapper').addClass('video-para-empezar-modulo01');
	$('#flotante').parent().attr('style', 'z-index: 9999;');
});