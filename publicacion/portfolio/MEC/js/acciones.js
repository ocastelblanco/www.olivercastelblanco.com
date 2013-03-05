// JavaScript Document
$(function() {
		$('#salida').html('');
	var tiposGrid = Array('grid_6', 'grid_4');
	var gridCaja = Array();
	var nombreCaja = Array();
	var altoCaja = Array();
	var cajaAbierta = '';
	var introAbierta = true;
	var actOpcAbierta = false;
	var listaIconos = Array('.individual','.grupal', '.wiki', '.docs', '.centro', '.tutor', '.foro', '.video', '.chat');
	// Configuración inicial
	$('.panelCerrado').children('#contenido').hide();
	calculaTamano();
	$(window).resize(function(e) {
        calculaTamano();
    });
	fondoBanner();
	$('#actOpc').css('height', '7.5em');
	$('#actOpc').css('cursor', 'pointer');
	$('#actOpc').children('#contenido').hide();
	$('div[id*="caja"]').each(function(index, element) {
		nombreCaja.push($(this));
		altoCaja.push($(this).height());
		for (i=0;i<tiposGrid.length;i++) {
			if ($(this).hasClass(tiposGrid[i])) {
				gridCaja.push(tiposGrid[i]);
			}
		}
		$(this).children('#contenido').hide();
		$(this).css('height', '14.286em');
		$(this).css('cursor', 'pointer');
    });
	// Eventos de clic
	$('div[id*="caja"]').click(function(){
		var gridGrande = 'grid_'+(13-gridCaja.length);
		if (!$(this).hasClass(gridGrande) && !$(this).hasClass('grid_1')) {
			var num = $(this).attr('id').substr(-1)-1;
			abreCaja($(this), num);
			if (introAbierta) {
				cierraIntro();
			}
			cierraActOpc();
		}
		if ($(this).hasClass('grid_1')) {
			var num = $(this).attr('id').substr(-1)-1;
			abreCaja($(this), num);
		}
	});
	$('#intro').click(function(e) {
        if (!introAbierta) {
			cierraCajas();
			cierraActOpc()
			abreIntro();
		}
    });
	$('#actOpc').click(function(e) {
        if (!actOpcAbierta) {
			cierraCajas();
			cierraIntro();
			abreActOpc();
		}
    });
	$('#panel1>#titulo, #panel2>#titulo').click(function(e) {
        $(this).parent().children('#contenido').toggle(500, function() {
			ajustaPaneles();
		});
    });
	// Funciones
	function abreActOpc() {
		$('#actOpc').css('height', '');
		$('#actOpc').css('cursor', 'auto');
		$('#actOpc').children('#contenido').show(500);
	}
	function cierraActOpc() {
		$('#actOpc').css('height', '7.5em');
		$('#actOpc').css('cursor', 'pointer');
		$('#actOpc').children('#contenido').hide(500);
	}
	function cierraIntro() {
		$('#intro #contIntro').css('visibility', 'hidden');
		$('#contenidoModulo').css('margin-top', '-2em');
		$('#intro #contIntro').hide(500, 'easeInOutQuad', function() {
			$('#intro #margen').css('visibility', 'visible');
			$('#intro #margen #triangulo').show();
			$('#intro').css('cursor', 'pointer');
			introAbierta = false;
		});
    }
	function abreIntro() {
		$('#contenidoModulo').css('margin-top', '');
		$('#intro #contIntro').show(500, 'easeInOutQuad', function() {
			$('#intro #margen').css('visibility', 'hidden');
			$('#intro #margen #triangulo').hide();
			$('#intro').css('cursor', 'auto');
			$('#intro #contIntro').css('visibility', 'visible');
			introAbierta = true;
		});
	}
	function cierraCajas() {
		var numCol = 12/nombreCaja.length;
		var ancho = (numCol*$('.grid_1').width())+((numCol-1)*20);
		var destino = 'grid_'+numCol;
		cajaAbierta = '';
		for (var i=0;i<nombreCaja.length;i++) {
			var caja = nombreCaja[i];
			$(caja).children('#titulo').hide();
			$(caja).children('#contenido').hide();
			$(caja).animate({
				width: ancho,
				height: '14.286em'
			}, 500, function() {
				var val = $(this).attr('id').substr(-1)-1;
				$(this).removeClass(gridCaja[val]);
				$(this).addClass(destino);
				$(this).children('#contenido').hide();
				$(this).children('#titulo').show();
				$(this).css('cursor', 'pointer');
				$(this).css('width', '');
				var final = 'caja'+nombreCaja.length;
				if ($(this).attr('id') == final) {
					for (var g=0;g<nombreCaja.length;g++) {
						gridCaja[g] = destino;
					}
				}
			});
		}
	}
	function abreCaja(obj, num) {
		var destino = 'grid_'+(13-nombreCaja.length);
		var origen = gridCaja[num];
		gridCaja[num] = destino;
		cajaAbierta = obj;
		for (var i=0;i<nombreCaja.length;i++) {
			var caja = nombreCaja[i];
			if (i != num) {
				gridCaja[i] = 'grid_1';
			}
			var numCol = Number(gridCaja[i].substr(gridCaja[i].lastIndexOf('_')+1));
			var ancho = (numCol*$('.grid_1').width())+((numCol-1)*20);
			$(caja).children('#titulo').hide();
			$(caja).children('#contenido').hide();
			$(caja).animate({
				width: ancho,
				height: altoCaja[num]
			}, 500, function() {
				var val = $(this).attr('id').substr(-1)-1;
				$(this).removeClass('grid_1 grid_2 grid_3 grid_4 grid_5 grid_6 grid_7 grid_8 grid_9 grid_10 grid_11 grid_12');
				$(this).addClass(gridCaja[val]);
				if ($(this).width() == $('.grid_1').width()) {
					$(this).css('cursor', 'pointer')
					$(this).css('height', '');
					$(this).css('width', '');
				} else {
					grande = $(this);
					$(this).children('#contenido').show();
					$(this).children('#titulo').show();
					$(this).css('cursor', 'auto');
					$(this).css('height', '');
					$(this).css('width', '');
				}
				var final = 'caja'+nombreCaja.length;
				if ($(this).attr('id') == final) {
					for (var g=0;g<nombreCaja.length;g++) {
						var cj = nombreCaja[g];
						$(cj).height($(obj).height());
					}
					$(obj).css('height', '');
				}
			});
		}
	}
	function ajustaPaneles() {
		for (var i=0;i<nombreCaja.length;i++) {
			var obj = nombreCaja[i];
			if ($(obj).attr('id') != $(cajaAbierta).attr('id')) {
				$(obj).height($(cajaAbierta).height());
			}
		}
	}
	function calculaTamano() {
		var ancho = $('.container_12 .grid_1').css('width');
		var anchoNum = ancho.substr(0, ancho.lastIndexOf('px'));
		if (anchoNum > 80) {
			anchoNum = calculaAncho().substr(0, calculaAncho().lastIndexOf('px'));;
		}
		var rejilla = (anchoNum*12)+240;
		var fuente = (rejilla/10)+"px"
		$('body').css('font-size', fuente);
		// Ajusta el tamaño de elementos del Header
		ajusteHeader(rejilla);
		// Cambia el tamaño de las imágenes del intro marcadas con la rejilla correspondiente
		cambiaTamanoImagenes('#intro', rejilla);
		ajusteTablaIconos();
		// Cambia el tamaño de las imágenes del footer marcadas con la rejilla correspondiente
		cambiaTamanoImagenes('#footer', rejilla);
		// Ajusta el tamaño de los páneles
		cambiaTamanoImagenesPaneles(rejilla);
		ajustaPaneles();
	}
	function calculaAncho() {
		var salida = '40px';
		var ancho = window.outerWidth;
		if (ancho > 980 && ancho < 1279) {
			salida = '60px';
		} else if (ancho > 1280) {
			salida = '80px';
		}
		return salida;
	}
	function ajusteHeader(rejilla) {
		var urlLogoMEC = $('#logoMEC').css('background-image');
		var fotoBanner = $('#fotoModulo').css('background-image');
		$('#logoMEC').css('background-image', cambiaImagen(urlLogoMEC, rejilla));
		$('#fotoModulo').css('background-image', cambiaImagen(fotoBanner, rejilla));
		$('#fotoModulo').width(rejilla);
	}
	function cambiaTamanoImagenesPaneles(rejilla) {
		for (var i=0;i<listaIconos.length;i++) {
			var objeto = $(listaIconos[i]+' .before');
			if ($(objeto).css('background-image') != undefined) {
				$(objeto).css('background-image', cambiaImagen($(objeto).css('background-image'), rejilla));
			}
		}
	}
	function cambiaImagen(rutaImagen, rejilla) {
		var pref = rutaImagen.substr(0, rutaImagen.lastIndexOf('-')+1);
		var suf = rutaImagen.substr(rutaImagen.lastIndexOf('-')+1);
		var vr = suf.substr(0, suf.lastIndexOf('.'));
		var ext = suf.substr(suf.lastIndexOf('.'));
		var res = pref+rejilla+ext;
		return res;
	}
	function ajusteTablaIconos() {
		$('#tablaIconos img').css('font-size', $('#tablaIconos').css('font-size'));
	}
	function cambiaTamanoImagenes(selector, rejilla) {
		$(selector+' img').each(function(index, element) {
			var src = $(this).attr('src');
			var pref = src.substr(0, src.lastIndexOf('-')+1);
			var suf = src.substr(src.lastIndexOf('-')+1);
			var vr = suf.substr(0, suf.lastIndexOf('.'));
			var ext = suf.substr(suf.lastIndexOf('.'));
			if (vr == "960" || vr == "720" || vr == "1200") {
				$(this).removeAttr('width');
				$(this).removeAttr('height');
				var newSrc = pref+rejilla+ext;
				$(this).attr('src', newSrc);
			}
		});
	}
	function fondoBanner(){
		var contenido = $('#nombreModulo').children('#titulo').html();
		$('#nombreModulo').prepend('<div id="fondo">'+contenido+'</div>');
	}
});