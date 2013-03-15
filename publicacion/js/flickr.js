$(function() {
		
	// Verifica que el browser del usuario tenga @font-face capabilities
	Modernizr.load({
	  test: Modernizr.fontface,
	  yep : 'webfonts/bazar-webfont.css',
	  nope: 'js/no-fontface.js'
	});
	var subtituloPos = $('#subtitulo').offset().top;
	var api_key = '516c801b319d21342af7881ea6471812';
	var user_id = '97546219%40N00';
	var perms = 'read';
	var secret = 'b6bbc261146d9c6d';
	var api_sig_prev = secret+'api_key'+api_key+'perms'+perms;
	//var api_sig = md5(api_sig_prev);
	$.getJSON(llamadoFlickr("photosets.getList", api_key, "user_id", user_id), function(datos) {
		for (var i = 0; i<datos.photosets.total; i++){
			var ruta =rutaURL(datos.photosets.photoset[i].farm, datos.photosets.photoset[i].server, datos.photosets.photoset[i].primary, datos.photosets.photoset[i].secret, "n");
			$('#contenido').append('<div class="grid_4 portaAlbumFotos"><div class="album"><div class="img" title="'+datos.photosets.photoset[i].title._content+'" id="'+datos.photosets.photoset[i].id+'" style="background-image: url('+ruta+')"></div><p>'+datos.photosets.photoset[i].title._content+'</p></div></div>');
		}
	}).error(function(){
		$(contenido).html("A communication error happened. Try reloading the page to see this content.");
	}).complete(function() {
		$('.album').click(function(e) {
			$('.album').unbind('click');
			$(this).addClass('select');
			$('.album').unwrap();
			$('.album').wrapAll('<div id="albumes" class="grid_12 albumesMovil" />');
			$('.album').switchClass('album', 'mini', 1000, function(){
				$(this).children('p').html('');
				$(this).children('.img').css('background-image', $(this).children('.img').css('background-image').replace('_n.jpg', '_s.jpg'));
				$(this).click(function() {
					cambiarAlbum($(this));
				});
				$('.mini').mouseenter(function(e) {
					$('#tooltip span').html($(this).children('.img').attr('title'));
					$('#tooltip').position({
						of: $(this),
						my: 'center bottom',
						at: 'center top-5'
					});
					$('#tooltip').show();
					$('#tooltip').position({
						of: $(this),
						my: 'center bottom',
						at: 'center top-5'
					});
				});
				$('.mini').mouseleave(function(e) {
					$('#tooltip').hide();
				});
			});
			cargarFotosAlbum($(this));
		});
		function cargarFotosAlbum(obj) {
			var photosetID = $(obj).children('.img').attr('id');
			var titulo = $(obj).children('.img').attr('title');
			$('#contenido #subtitulo').html(titulo);
			$.getJSON(llamadoFlickr("photosets.getPhotos", api_key, "photoset_id", photosetID), function(fotos) {
				for (var e=0;e<fotos.photoset.total;e++) {
					var ruta = rutaURL(fotos.photoset.photo[e].farm, fotos.photoset.photo[e].server, fotos.photoset.photo[e].id, fotos.photoset.photo[e].secret, "n");
					$('#contenido').append('<div class="grid_4 portaFoto"><div class="fotoAlbum" id="'+fotos.photoset.photo[e].id+'" style="background-image: url('+ruta+')"></div></div>');
				}
				$('#contenido').append('<div class="grid_4 portaFoto"><br></div>');
			}).error(function(){
				$(contenido).html("A communication error happened. Try reloading the page to see this content.");
			}).complete(function() {
				$(window).scroll(function(e) {
					var subPos;
					// Truco chambón para averiguar si usa mobile.min.css o 720/960.min.css. Los tamaños se ajustan al ojo.
					if ($('.grid_1').width() == 60) {
						subPos = subtituloPos+45;
					} else if ($('.grid_1').width() == 40) {
						subPos = subtituloPos+34;
					} else {
						subPos = subtituloPos+10;
					}
                    if ($(window).scrollTop() >= subPos) {
						$('#subtitulo').addClass('subtituloFijo');
						$('#albumes').addClass('albumesFijo');
						if ($('#subtitulo').position().left > 195) {
							$('#subtitulo').addClass('ajusteMargenMozillaSubtitulo');
							$('#albumes').removeClass('albumesMovil');
							$('#albumes').addClass('ajusteMargenMozillaAlbumes');
						}
					} else {
						$('#subtitulo').removeClass('subtituloFijo');
						$('#albumes').removeClass('albumesFijo');
						$('#subtitulo').removeClass('ajusteMargenMozillaSubtitulo');
						$('#albumes').removeClass('ajusteMargenMozillaAlbumes');
						$('#albumes').addClass('albumesMovil');
					}
                });
				$('.portaFoto').click(function(e) {
					var fotoGrande = $(this).children('.fotoAlbum').css('background-image').replace('_n.jpg', '_b.jpg')
					fotoGrande = fotoGrande.replace('url(', '')
					fotoGrande = fotoGrande.replace(')', '');
                    $('#cajas').append('<div class="lightbox-block"><img src="'+fotoGrande+'"></div>');
					$('#cajas div').lightbox();
					$('#close').hide();
					$('#cajas .lightbox').show('scale', {percent: 100}, 500, function() {
						$('#close').show();
					});
					$('.lightbox, #close').click(function(e) {
						$('.lightbox').css('background', 'rgba(0, 0, 0, 0)');
						$('#close').hide();
						$('.lightbox-block').hide('scale', {percent: 0}, 500, function(){
							$('#cajas').children().remove();
						});
					});
					$('.lightbox-block').click(function(e) {
						e.stopPropagation();
					});
                });
			});
		}
		function cambiarAlbum(obj) {
			$('.select').removeClass('select')
			$(obj).addClass('select');
			$('#contenido .portaFoto').remove();
			cargarFotosAlbum(obj);
		}
	});
});
function rutaURL(farm_id, server_id, id, secret, size) {
	var salida = "http://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+"_"+size+".jpg";
	return salida;
}
function llamadoFlickr(metodo, api_key, extra, extra_id) {
	var salida = "http://api.flickr.com/services/rest/?method=flickr."+metodo+"&api_key="+api_key+"&"+extra+"="+extra_id+"&format=json&nojsoncallback=1";
	return salida;
}