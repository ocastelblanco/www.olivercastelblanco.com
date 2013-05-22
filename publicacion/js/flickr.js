$(function() {
		
	// Verifica que el browser del usuario tenga @font-face capabilities
	Modernizr.load({
	  test: Modernizr.fontface,
	  yep : 'webfonts/bazar-webfont.css',
	  nope: 'js/no-fontface.js'
	});
	$(window).resize(function(e) {
		$('#cajas').children().remove();
    });
	
	var anchoPlantilla = determinaPlantilla();
	$('.grid_1').watch('width', function() {
		anchoPlantilla = determinaPlantilla();
	}, 1000);
	var subtituloPos = $('#subtitulo').offset().top;
	var api_key = '516c801b319d21342af7881ea6471812';
	var user_id = '97546219%40N00';
	var perms = 'read';
	var secret = 'b6bbc261146d9c6d';
	var api_sig_prev = secret+'api_key'+api_key+'perms'+perms;
	$.getJSON(llamadoFlickr("photosets.getList", api_key, "user_id", user_id), function(datos) {
		for (var i = 0; i<datos.photosets.total; i++){
			var ruta =rutaURL(datos.photosets.photoset[i].farm, datos.photosets.photoset[i].server, datos.photosets.photoset[i].primary, datos.photosets.photoset[i].secret, "n");
			$('#contenido').append('<div class="grid_4 portaAlbumFotos"><div class="album"><div class="img" title="'+datos.photosets.photoset[i].title._content+'" id="'+datos.photosets.photoset[i].id+'" style="background-image: url('+ruta+')"></div><p>'+datos.photosets.photoset[i].title._content+'</p></div></div>');
		}
	}).error(function(){
		$(contenido).html("<div class='grid_12' style='font-size:2em'>A communication error happened. Try reloading the page to see this content.<br>Are you using Internet Explorer? Download the last version of IE <a href='http://windows.microsoft.com/en-us/internet-explorer/download-ie' target='_blank'>clicking here</a>.</div>");
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
			var todasLasFotos;
			$.getJSON(llamadoFlickr("photosets.getPhotos", api_key, "photoset_id", photosetID), function(fotos) {
				todasLasFotos = fotos;
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
					if (anchoPlantilla == '960') {
						subPos = subtituloPos+45;
					} else if (anchoPlantilla == '720') {
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
					var tamano;
					if (anchoPlantilla == '960') {
						tamano = 'b';
					} else if (anchoPlantilla == '720') {
						tamano = 'z';
					} else {
						tamano = 'n';
					}
					var fotoGrande = $(this).children('.fotoAlbum').css('background-image');
					var listaFotos = new Array();
					var num;
					$('.fotoAlbum').each(function(index, element) {
                        listaFotos.push($(this).css('background-image'));
						if (fotoGrande == listaFotos[index]) {
							num = index;
						}
                    });
					var listaOrden = listaFotos.slice(num).concat(listaFotos.slice(0, num));
					var listaNumeros = new Array();
					for (var g = num;g<listaFotos.length;g++) {
						listaNumeros.push(g);
					}
					for (var h = 0;h<num;h++) {
						listaNumeros.push(h);
					}
					$('#cajas').append('<div id="cajaLuz"><div id="portaSlider"><div id="slider"></div><span id="close"></span></div></div>');
					for (var cont in listaOrden) {
						var rutaFoto = listaOrden[cont].replace('url(', '').replace(')', '').replace('_n.jpg', '_'+tamano+'.jpg');
						while (rutaFoto.lastIndexOf('"') > 0) {
							rutaFoto = rutaFoto.replace('"', '');
						}
						$('#slider').append('<div id="cajaImg"><img src="'+rutaFoto+'"><div id="titulo">'+todasLasFotos.photoset.photo[listaNumeros[cont]].title+'</div></div>');
					}
					if (anchoPlantilla == 'mobile') {
						$('#cajaLuz').show('scale', {percent: 100}, 500, function() {
							$('#cajaLuz #portaSlider').append('<div id="instrucciones">Swipe to slide images</div>');
							$('#close').show();
							window.mySwipe = new Swipe(document.getElementById('portaSlider'));
						});
					} else {
						$('#cajaLuz').show('scale', {percent: 100}, 500, function() {
							$('#slider').orbit({
								timer: false,
								pauseOnHover: true,
								captions: false
							});
							$('#close').show();
							$('div.slider-nav span.left').addClass('navLeft');
							$('div.slider-nav span.right').addClass('navRight');
							$('div.slider-nav span.left').mouseenter(function(e) {
								$(this).switchClass('navLeft', 'navLeft0');
							});
							$('div.slider-nav span.left').mouseleave(function(e) {
								$(this).switchClass('navLeft0', 'navLeft');
							});
							$('div.slider-nav span.right').mouseenter(function(e) {
								$(this).switchClass('navRight', 'navRight0');
							});
							$('div.slider-nav span.right').mouseleave(function(e) {
								$(this).switchClass('navRight0', 'navRight');
							});
						});
					}
					$('#cajaLuz, #close').click(function(e) {
						$('#cajaLuz').css('background', 'rgba(0, 0, 0, 0)');
						$('#close').hide();
						$('#cajaLuz').hide('scale', {percent: 0}, 500, function(){
							$('#cajas').children().remove();
						});
					});
					$('#portaSlider').click(function(e) {
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
	function determinaPlantilla() {
		var salida;
		if ($('.grid_1').width() == 60) {
			salida = '960';
		} else if ($('.grid_1').width() == 40) {
			salida = '720';
		} else {
			salida = 'mobile';
		}
		return salida;
	}
});
function rutaURL(farm_id, server_id, id, secret, size) {
	var salida = "http://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+"_"+size+".jpg";
	return salida;
}
function llamadoFlickr(metodo, api_key, extra, extra_id) {
	var salida = "http://api.flickr.com/services/rest/?method=flickr."+metodo+"&api_key="+api_key+"&"+extra+"="+extra_id+"&format=json&nojsoncallback=1";
	return salida;
}