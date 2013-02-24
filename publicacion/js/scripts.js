$(function() {
	
	$('#salida').css('display', 'block');
	
	// Verifica que el browser del usuario tenga @font-face capabilities
	Modernizr.load({
	  test: Modernizr.fontface,
	  yep : 'webfonts/bazar-webfont.css',
	  nope: 'js/no-fontface.js'
	});
	var ajusteThumbs = setTimeout(function() {
		$('#contenido .thumb a').css('background-image', function() {
			ajustaRutaThumb($(this));
		});
	}, 1000);
	$('#contenido .thumb a').watch('width', function() {
		ajustaRutaThumb($(this));
	}, 100);
	$('#contenido .thumb a #texto').each(function() {
        ocultaTextos($(this));
    });
	$('#contenido .thumb a').mouseenter(function(e) {
        $(this).children('#texto').switchClass('cerrado', 'abierto');
        $(this).children('#texto').children('#indicador').css('border-top', 'none');
		$(this).children('#texto').children('#indicador').css('border-bottom', '0.5em solid white');
        $(this).children('#texto').children('#titulo').switchClass('cerrado', 'abierto', function(){
			muestraTextos($(this).parent());
			$(this).parent().children('#indicador').css('border-top', '0.5em solid white');
			$(this).parent().children('#indicador').css('border-bottom', 'none');
		});
    });
	$('#contenido .thumb a').mouseleave(function(e) {
		ocultaTextos($(this).children('#texto'));
        $(this).children('#texto').switchClass('abierto', 'cerrado');
        $(this).children('#texto').children('#indicador').css('border-top', '0.5em solid white');
		$(this).children('#texto').children('#indicador').css('border-bottom', 'none');
        $(this).children('#texto').children('#titulo').switchClass('abierto', 'cerrado', function() {
			ocultaTextos($(this).parent());
			$(this).parent().children('#indicador').css('border-top', 'none');
			$(this).parent().children('#indicador').css('border-bottom', '0.5em solid white');
		});
    });
	$('#contenido .thumb a').click(function(e) {
		e.preventDefault();
		var obj = $(this);
		var nombre = $(obj).attr('title');
		var ruta = 'portfolio/'+nombre;
		var destino = ruta+'/'+$(obj).attr('href');
		var reqs = new Array();
		$.getJSON(ruta+'/desc.json', function(datos) {
			reqs = datos.req.split(",");
			var titulo = '<div id="titulo">'+$(obj).children('#texto').children('#titulo').html()+'</div>';
			var cliente = '<div id="cliente"><span>Client: </span>'+$(obj).children('#texto').children('#cliente').html()+'</div>';
			var fecha = '<div id="fecha"><span>Date: </span>'+$(obj).children('#texto').children('#fecha').html()+'</div>';
			var tipo = '<div id="tipo"><span>Developed in: </span>'+$(obj).children('#texto').children('#tipo').html()+'</div>';
			var desc = '<div id="desc"><span>Description: </span>'+datos.desc+'</div>';
			var rol = '<div id="rol"><span>Role: </span>'+datos.rol+'</div>';
			var sep = '<div id="sep"></div>';
			var abrir = '<a href="'+destino+'" target="_blank" id="abrir">Open project <span></span></a>';
			$('#cajas').append('<div id="caja-'+nombre+'" class="lightbox-block"><div id="contenido-'+nombre+'">');
			$('#cajas').append('</div></div>');
			// Truco para descubrir si está utilizando mobile.min.css o alguna 720/960.min.css
			if ($('.grid_1').width() < 61) {
				$('#cajas').children('#caja-'+nombre).lightbox();
			} else {
				$('#cajas').children('#caja-'+nombre).wrap('<div class="lightbox" />');
				$('#cajas').children('#caja-'+nombre).addClass('lightbox-block');
				abrir = '<div id="botones"><a href="#" id="cerrar"><span></span> Return</a>'+abrir+'</div>';
			}
			var contenido = $('#cajas').children('.lightbox').children('#caja-'+nombre).children('#contenido-'+nombre);
			var sliderInicio = '<div id="portaSlider"><div id="slider">';
			var sliderInto = '';
			for (var i = 0;i<datos.screens;i++) {
				sliderInto += '<img src="portfolio/'+nombre+'/Screen'+dosDigitos(i+1)+'.jpg">';
			}
			var sliderOut = '</div></div>';
			var slider = sliderInicio+sliderInto+sliderOut;
			$(contenido).html(titulo+slider+sep+rol+desc+tipo+fecha+cliente+abrir);
		}).error(function(){
			$(contenido).html("A communication error happened. Try reloading the page to see this content.");
		}).complete(function() {
			// Truco para descubrir si está utilizando mobile.min.css o alguna 720/960.min.css
			if ($('.grid_1').width() < 61) {
				var bkg = $('#caja-'+nombre).parent('.lightbox').css('background');
				$('#cajas .lightbox').css('background', 'rgba(0, 0, 0, 0)');
				$('#cajas .lightbox').show('scale', {percent: 100}, 500, function() {
					$('#cajas #slider').orbit();
					$(this).css('background', bkg);
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
				$('#cajas .lightbox, .lightbox #close').click(function(e) {
					$('#caja-'+nombre).parent('.lightbox').css('background', 'rgba(0, 0, 0, 0)');
					$(this).hide('scale', {percent: 0}, 500, function(){
						$('#cajas').children().remove();
					});
				});
				$('#caja-'+nombre).click(function(e) {
					e.stopPropagation();
				});
			} else {
				$('#cajas #slider img').wrap('<li style="display: none;" />');
				$('#cajas #slider li:first').css('display', 'block');
				$('#cajas #slider li').wrapAll('<ul />');
				$('#cajas #portaSlider').append('<div id="instrucciones">Swipe to slide images</div>');
				$('#footer').hide();
				$('#cajas .lightbox').show('scale', {percent: 100}, 500, function() {
					window.mySwipe = new Swipe(document.getElementById('slider'));
				});
				$('.lightbox #botones #cerrar').click(function(e) {
					e.preventDefault();
					$('#footer').show();
					$('#cajas .lightbox').hide('scale', {percent: 0}, 500, function(){
						$('#cajas').children().remove();
					});
				});
			}
			var razones = new Array();
			for (var n = 0;n<reqs.length;n++) {
				if (reqs[n].lastIndexOf('Flash') && !jQuery.browser.flash) {
					razones.push(reqs[n]);
				}
				if (reqs[n].lastIndexOf('wider than')) {
					var num = reqs[n].lastIndexOf('px')-(reqs[n].lastIndexOf('wider than ')+11);
					var anchoMin = Number(reqs[n].substr(reqs[n].lastIndexOf('wider than ')+11, num));
					if ($(window).innerHeight()<anchoMin) {
						razones.push(reqs[n]);
					}
				}
			}
			if (razones.length) {
				var texto = "Sorry, I can't show you this project because you must have ";
				texto += razones[0];
				for (n = 1;n<razones.length;n++) {
					if (n == (reqs.length-1)) {
						texto += " and "+razones[n];
						break;
					} else {
						texto += ", "+razones[n];
					}
				}
				texto += ".";
				$('.lightbox #botones #abrir').remove();
				$('.lightbox #botones').append('<div id="fallo">'+texto+'</div>');
			}
		});
    });
	/* Funciones generales */
	function ocultaTextos(obj) {
		$(obj).children('#cliente').hide();
		$(obj).children('#fecha').hide();
		$(obj).children('#tipo').hide();
	}
	function muestraTextos(obj) {
		$(obj).children('#cliente').show();
		$(obj).children('#fecha').show();
		$(obj).children('#tipo').show();
	}
	function ajustaRutaThumb(obj) {
		var ancho = "";
		if($(obj).width() < 300){
			ancho = "-75";	
        }
        $(obj).css('background-image', calculaRutaThumb($(obj).css('background-image'), $(obj).attr('title'), ancho));
	}
	function calculaRutaThumb(ruta, destino, ancho) {
		var inicio;
		var finRuta;
		if (ruta === 'none') {
			inicio = "url(";
			finRuta = ")";
		} else {
			finRuta = ruta.substr(ruta.lastIndexOf(".png")+4);
			if (ruta.substr(0, ruta.lastIndexOf("img"))) {
				inicio = ruta.substr(0, ruta.lastIndexOf("img"));
			} else {
				inicio = ruta.substr(0, ruta.lastIndexOf("portfolio"));
			}
		}
		var medio = "portfolio/"+destino+"/thumb"+ancho;
		var final = ".png"+finRuta;
		var salida = inicio+medio+final;
		return salida;
	}
	function dosDigitos(num) {
		var salida = '';
		if (num < 10) {
			salida = "0"+String(num);
		} else {
			salida = String(num);
		}
		return salida;
	}
});