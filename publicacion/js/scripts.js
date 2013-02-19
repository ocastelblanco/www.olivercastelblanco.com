$(function() {
	
	$('#salida').css('display', 'block');
	
	// Verifica que el browser del usuario tenga @font-face capabilities
	Modernizr.load({
	  test: Modernizr.fontface,
	  yep : 'webfonts/bazar-webfont.css',
	  nope: 'js/no-fontface.js'
	});
	$('#contenido .thumb a').css('background-image', function() {
		ajustaRutaThumb($(this));
	});
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
	$('#contenido .thumb a').each(function(e) {
		var obj = $(this);
		var nombre = $(obj).attr('title');
		$.getJSON('portfolio/'+nombre+'/desc.json', function(datos) {
			var titulo = '<div id="titulo">'+$(obj).children('#texto').children('#titulo').html()+'</div>';
			var cliente = '<div id="cliente">'+$(obj).children('#texto').children('#cliente').html()+'</div>';
			var fecha = '<div id="fecha">'+$(obj).children('#texto').children('#fecha').html()+'</div>';
			var tipo = '<div id="tipo">'+$(obj).children('#texto').children('#tipo').html()+'</div>';
			$('#cajas').append('<div id="caja-'+nombre+'" class="lightbox-block"><div id="contenido-'+nombre+'">');
			$('#cajas').append('</div></div>');
			$('#cajas').children('#caja-'+nombre).lightbox();
			var contenido = $('#cajas').children('.lightbox').children('#caja-'+nombre).children('#contenido-'+nombre);
			var sliderInicio = '<div id="portaSlider"><div id="slider'+nombre+'">';
			var sliderInto = '';
			for (var i = 0;i<datos.screens;i++) {
				sliderInto += '<img src="portfolio/'+nombre+'/Screen'+dosDigitos(i+1)+'.jpg">';
			}
			var sliderOut = '</div></div>';
			var slider = sliderInicio+sliderInto+sliderOut;
			$(contenido).html(titulo+slider+'<div id="desc">'+datos.desc+'</div>'+tipo+fecha+cliente);
		}).error(function(){
			$(contenido).html("A communication error happened. Try reloading the page to see this content.");
		}).complete(function() {
			var demora = window.setTimeout(function() {
				$('#slider'+nombre).each(function(index, element) {
					if (!$(this).hasClass('orbit')) {
						$(this).orbit();
					}   
                });
			}, 10000);
		});
    });
	$('#contenido .thumb a').click(function(e) {
		var nombre = $(this).attr('title');
		$('#caja-'+nombre).parent('.lightbox').show();
        return false;
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
		if (ruta.substr(0, ruta.lastIndexOf("img"))) {
			inicio = ruta.substr(0, ruta.lastIndexOf("img"));
		} else {
			inicio = ruta.substr(0, ruta.lastIndexOf("portfolio"));
		}
		var medio = "portfolio/"+destino+"/thumb"+ancho;
		var final = ".png"+ruta.substr(ruta.lastIndexOf(".png")+4);
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