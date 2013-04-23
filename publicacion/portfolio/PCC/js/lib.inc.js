// Librería general jQuery
/*
------------> Log


*/
// ------------- Librerías generales para todo el aplicativo
var demoraAparicion = 500;
var menuPlegado;
var parametros = {};
var elementosFijos = '<div id="selector-contenedor"></div>\n<div id="menuPpal"></div>\n<div id="menuSec"></div>';
var esIE7 = $('html').hasClass('ie7');
var esIE6 = $('html').hasClass('ie6');
$(function() {
	// Genera un mensaje de alerta si el navegador utilizado es IE6
	if (esIE6) {
		var contIE6 = '<p style="text-align: center">La versión de su navegador no permite visualizar correctamente este contenido.';
		contIE6 += '<br>Le recomendamos actualizarlo, <a href="http://windows.microsoft.com/es-ES/internet-explorer/products/ie/home">haciendo clic en este vínculo</a></p>';
		$('body').prepend(contIE6);
	}
	// Determina si esta va a ser o no la primera página DEL MÓDULO para desplegar o no el elemento accionPCC
	menuPlegado = !paginaInicial;
	if(getUrlVars()["mp"]) {
		// Si se recibe una variable GET 'mp' con cualquier valor, se parte del hecho de que el menú principal debe iniciar plegado.
		menuPlegado = true;
	}
	// Inyecta los elementos fijos (paginador, menú principal y menu secundario) y crea los contenidos de dichos elementos
	$('body').append(elementosFijos);
	creaMenuPpal();
	creaMenuSec();
	// Ajusta el scroll de las páginas, dependiendo del tamaño interno de la ventana de navegador
	ajustaScroll();
	// Crea un Tooltip para el cuadro negro y el creador del selector de páginas
	$('#accionPCC, #pagSelector, #pagAtras, #pagSiguiente, #menuPpal a, #menuSec a').tipTip();
	// Ubica la flecha dentro del cuadro negro de acción
	$('#accionPCC #flecha').position({
		of: $('#accionPCC'),
		my: "right bottom",
		at: "right bottom",
		offset: "-13, -17",
		collision: "none, none"
	});
	// Ubica el #accionPCC
	ubicarAccionPCC();
	// Ubica el #menuPpal
	ubicarMenuPpal();
	// Ubica el #menuSec
	ubicarMenuSec();
	// El menu secundario SIEMPRE inicia oculto
	$('#menuSec').hide();
	// Ubica, si existe, un div flotante en la celda indicada
	ubicarObjetoFlotante();
	// Genera el detector de click sobre el cuadro negro con el logo de PCC
	$('#accionPCC a').click(function(e) {
		if ($('#menuPpal').css('display') != 'none') {
			$('#menuSec').hide();
			ocultarMenuPpal(demoraAparicion)
		} else {
			desplegarMenuPpal(demoraAparicion);
		}
		return false;
	});
	// Ajusta la posición del #pie
	$('#pie').position({
		of: $('#contenido'),
		my: "left top",
		at: "left bottom",
		offset: "0, 9",
		collision: "none, none"
	});
	// Crea y ajusta el tamaño del selector. Oculta el paginador de manera automática.
	crearSelector(paginas, numPagina);
	ubicarSelector();
	$('#selector-contenedor').hide();
	// Si esta es la página inicial, se oculta el paginador y el menú principal con animación
	if (!menuPlegado) {
		$('#selector-contenedor').show();
		ocultarPaginador(demoraAparicion, demoraAparicion);
		$('#menuPpal').show();
		ocultarMenuPpal(demoraAparicion, demoraAparicion);
	} else { // Si el menú está plegado debe ser visible y #accionPCC no debe estar activo
		$('#menuPpal').show();
		$('#accionPCC a').unbind('click');
		$('#accionPCC a').css('cursor', 'text');
	}
	// Crea el listener para el click sobre el ícono de mostrar selector
	$('#pagSelector').click(function(e) {
		mostrarPaginador(demoraAparicion);
		return false;
	});
	// Vincula las acciones de click al botón que oculta el selector
	$('#selector-botonCerrar').click(function(e) {
		ocultarPaginador(demoraAparicion);
		return false;
	});
	// Detector de click sobre elemento del Menú principal que dispara el menú de lecciones
	$('#menuPpal .submenu').click(function() {
		animaSeleccionMenu($(this));
		if ($('#menuSec').css('display') == 'none') {
			$('#menuSec').show();
			ubicarMenuSec();
			$('#menuSec').show('slide', {direction: 'left'}, demoraAparicion);
		} else {
			ubicarMenuSec();
			$('#menuSec').hide('slide', {direction: 'left'}, demoraAparicion);
		}
		return false;
	});
	// Detector de click sobre elementos diferentes al menú de lecciones
	$('#menuPpal a').not('.submenu').click(function() {
		var vinculo = $(this).attr('href');
		parametros = {mp: true};
		var params = "?" + $.param(parametros);
		vinculo += params;
		var margen = '-10';
		if (esIE7) {
			margen = '0';
		}
		animaSeleccionMenu($(this));
		$('#menuSec').hide();
		if (!menuPlegado) {	// Oculta el menú
			menuPlegado = true;
			// Elimina el 'click' del elemento negro
			$('#accionPCC a').unbind('click');
			$('#accionPCC a').css('cursor', 'text');
			$('#accionPCC').animate({
				left: margen
				}, demoraAparicion
			);
			$('#menuPpal').animate({
				left: $('#contenido').offset().left
				}, demoraAparicion*1.5,
				function () {
					window.location.href = vinculo;
				}
			);
		}
		return false;
	});
	// Detector de click sobre elementos del menú de lecciones
	$('#menuSec a').click(function() {
		animaSeleccionLecciones(this);
		return false;
	});
	// Se activa si el usuario modifica el tamaño de la ventana del navegador
	$(window).resize(function(e) {
		// Ubica el #accionPCC
		ubicarAccionPCC();
		// Ubica el #menuPpal
		ubicarMenuPpal();
		// Ubica el #menuSec
		ubicarMenuSec();
		// Ajusta el scroll de la página, dependiendo del tamaño interno de la ventana
		ajustaScroll();
		// Ubica, si existe, un div flotante en la celda indicada
		ubicarObjetoFlotante();
		// Ubica el paginador dentro de la página
		$('#selector-contenedor').show();
		ubicarSelector();
		$('#selector-contenedor').hide();
	});
});
// ----------------      Funciones       ----------------------//
function animaSeleccionMenu(seleccion) {
	var vinculo = $(seleccion).attr('href');
	parametros = {mp: true};
	var params = "?" + $.param(parametros);
	vinculo += params;
	$(seleccion).animate({
		backgroundColor: "rgb(163,178,49)",
		borderBottomColor: "rgb(163,178,49)",
		borderTopColor: "rgb(163,178,49)"},
		demoraAparicion,
		function() {
			$(seleccion).addClass('vinculoOprimido');
	});
	$('#menuPpal a').not(seleccion).animate({
		backgroundColor: "rgb(238,128,40)",
		borderBottomColor: "rgb(255,255,255)",
		borderTopColor: "rgb(238,128,40)"},
		demoraAparicion,
		function() {
			$('#menuPpal a').not(seleccion).removeClass('vinculoOprimido');
			window.location.href = vinculo;
	});
}
function animaSeleccionLecciones(seleccion) {
	var vinculo = $(seleccion).attr('href');
	if (menuPlegado) {
		parametros = {mp: true};
		var params = "?" + $.param(parametros);
		vinculo += params;
	}
	$(seleccion).animate({
		backgroundColor: "rgb(238,128,40)",
		borderTopColor: "rgb(238,128,40)"},
		demoraAparicion,
		function() {
			$(seleccion).addClass('leccionOprimido');
	});
	$('#menuSec a').not(seleccion).animate({
		backgroundColor: "rgb(163,178,49)",
		borderTopColor: "rgb(163,178,49)"},
		demoraAparicion,
		function() {
			$('#menuPpal a').not(seleccion).removeClass('leccionOprimido');
			window.location.href = vinculo;
	});
}
function desplegarMenuPpal(duracion) {
	$('#menuPpal').show('slide', {direction: 'left'}, duracion);
}
function ocultarMenuPpal(duracion, delay) {
	$('#menuPpal').delay(delay).hide('slide', {direction: 'left'}, duracion);
}
// ----------------------------------------------------------------------------------------------- Funciones que crean, ubican, ajustan y animan el Selector de páginas inferior -------------- V
function mostrarPaginador(duracion) {
	if ($('#selector-contenedor').css('display') == "none") {
		$('#selector-contenedor').show('slide', {direction: 'down'}, duracion);
	} else {
		ocultarPaginador(duracion);
	}
}
function ocultarPaginador(duracion, delay) {
	$('#selector-contenedor').delay(delay).hide('slide', {direction: 'down'}, duracion);
}
function ubicarSelector() {
	$('#selector-contenedor').position({
		of: $('#pie'),
		my: "center bottom",
		at: "center top"
	});
}
function crearSelector(numPags, pagActual) {
	var params = "";
	if (menuPlegado) {
		parametros = {mp: true};
		params = "?" + $.param(parametros);
	}
	var prefijo = "";
	var anchoTotal = 11 + 9; // Ancho de el selectorPaginas_inicio.png mas el ancho de selectorPaginas_final.png
	var anchoBotones = 0; // Ancho de la sección de botones representado por #selector-botonesPaginas o #selector-bordeSuperior
	var botonCerrar = '<a id="selector-botonCerrar" href="#"><img id="background" src="img/selectorPaginas_btnCerrar.png" /></a>';
	var cuerpoSelector = '<div id="selector-cuerpoSelector"><span id="selector-inicio"><img id="background" src="img/selectorPaginas_inicio.png" /></span><span id="selector-final"><img id="background" src="img/selectorPaginas_final.png" /></span><div id="selector-bordeSuperior"><img id="background" src="img/selectorPaginas_supFinal.png" /></div>';
	var botonesPaginas = '<div id="selector-botonesPaginas">';
	pagActual = Number(pagActual);
	numPags = Number(numPags);
	for (var i = 1;i < (numPags + 1);i++) {
		prefijo = "mod"+dosDigitos(numModulo)+"lec"+dosDigitos(numLeccion)+"pag";
		if (i == pagActual && i == numPags) {
			botonesPaginas += '<span id="selector-pagActual">'+dosEspaciosIE7(i)+'<img id="background" src="img/selectorPaginas_pagActual.png" /></span>';
			anchoBotones += 28; // Mas el ancho del selectorPaginas_pagActual.png
		} else if (i == numPags){
			botonesPaginas += '<a href="'+prefijo+dosDigitos(i)+'.html"'+params+'>'+dosEspaciosIE7(i)+'<img id="background" src="img/selectorPaginas_otraPag.png" /></a>';
			anchoBotones += 28; // Mas el ancho del selectorPaginas_otraPag.png
		} else if (i == pagActual) {
			botonesPaginas += '<span id="selector-pagActual">'+dosEspaciosIE7(i)+'<img id="background" src="img/selectorPaginas_pagActual.png" /></span><span id="selector-interPags"></span>';
			anchoBotones += 28 + 7; // Mas el ancho del selectorPaginas_pagActual.png mas el ancho de selector-interPags.png
		} else {
			botonesPaginas += '<a href="'+prefijo+dosDigitos(i)+'.html'+params+'">'+dosEspaciosIE7(i)+'<img id="background" src="img/selectorPaginas_otraPag.png" /></a><span id="selector-interPags"></span>';
			anchoBotones += 28 + 7; // Mas el ancho del selectorPaginas_otraPag.png mas el ancho de selector-interPags.png
		}
	}
	botonesPaginas += '</div>';
	cuerpoSelector += botonesPaginas+'</div>';
	if (numPags > 0) {
		$('#selector-contenedor').html(botonCerrar+cuerpoSelector);
		anchoTotal += anchoBotones;
		$('#selector-botonCerrar').css('width', anchoTotal+'px');
		$('#selector-contenedor').css('width', anchoTotal+'px');
		$('#selector-bordeSuperior').css('width', anchoBotones+'px');
		// ---------------------------> Ajusta las flechas atrás y siguiente, así como la numeración de páginas
		$('#numPagina').html(pagActual+" de "+numPags);
		if (pagActual > 1) {
			$('#pagAtras').attr('href', prefijo+dosDigitos(pagActual-1)+'.html'+params);
		} else {
			$('#pagAtras').css('visibility', 'hidden');
		}
		if (pagActual < numPags) {
			$('#pagSiguiente').attr('href', prefijo+dosDigitos(pagActual+1)+'.html'+params);
		} else {
			$('#pagSiguiente').css('visibility', 'hidden');
		}
	} else {
		$('#pagSelector').hide();
		$('#numPagina').hide();
		if (numLeccion == "ambientacion" || numLeccion == "paraempezar") {
			$('#pagAtras').hide();
			$('#pagSiguiente').hide();
		}
	}
}
// -----------------------------------------------------------------------> Creador del Menú prinicipal
function creaMenuPpal() {
	var contenido = '<span></span>';
	contenido += '<a href="mod01paraempezar.html" title="Haga clic para ir a la sección Para empezar">Para empezar</a>';
	if (esIE7) {
		contenido += '<a href="mod01ambientacion.html" title="Haga clic para ir a la sección Ambientación">Ambientación<img id="flecha" src="img/flecha.png" /></a>';
		contenido += '<a href="#" class="submenu" title="Haga clic para desplegar el menú con las lecciones de este Módulo">Lecciones</a>';
	} else {
		contenido += '<a href="mod01ambientacion.html" title="Haga clic para ir a la sección Ambientación">Ambientación</a>';
		contenido += '<a href="#" class="submenu" title="Haga clic para desplegar el menú con las lecciones de este Módulo">Lecciones<img id="flecha" src="img/flecha.png" /></a>';
	}
	contenido += '<a href="mod01sintesis.html" title="Haga clic para ir a la sección Síntesis">Síntesis</a>';
	contenido += '<a href="mod01actividad.html" title="Haga clic para ir a la sección Actividad">Actividad</a>';
	contenido += '<span id="tituloModulo">Módulo</span>';
	contenido += '<span id="numeroModulo">*1</span>';
	$('#menuPpal').html(contenido);
}
// -----------------------------------------------------------------------> Creador del Menú secundario
function creaMenuSec() {
	var contenido = '<span></span>';
	contenido += '<a href="mod01lec01pag01.html" title="Haga clic para abrir la Lección 1">Lección 1</a>';
	contenido += '<a href="mod01lec02pag01.html" title="Haga clic para abrir la Lección 2">Lección 2</a>';
	contenido += '<a href="mod01lec03pag01.html" title="Haga clic para abrir la Lección 3">Lección 3</a>';
	contenido += '<a href="mod01lec04pag01.html" title="Haga clic para abrir la Lección 4">Lección 4</a>';
	contenido += '<a href="mod01lec05pag01.html" title="Haga clic para abrir la Lección 5">Lección 5</a>';
	$('#menuSec').html(contenido);
}
// -----------------------------------------------------------------------> Ubica el #accionPCC
function ubicarAccionPCC() {
	if (menuPlegado) {
		$('#accionPCC').position({
			of: $('#contenido'),
			my: "left top",
			at: "left top",
			offset: "0, 220",
			collision: "none, none"
		});
	}
}
// -----------------------------------------------------------------------> Ubica el Menú principal
function ubicarMenuPpal() {
	if (menuPlegado) {
		$('#menuPpal').position({
			of: $('#contenido'),
			my: "left top",
			at: "left top",
			offset: "0, 220",
			collision: "none, none"
		});
	} else {
		$('#menuPpal').position({
			of: $('#accionPCC'),
			my: "left top",
			at: "right top",
			offset: "10, 0",
			collision: "none, none"
		});
	}
}
// -----------------------------------------------------------------------> Ubica el Menú secundario
function ubicarMenuSec() {
	$('#menuSec').position({
		of: $('#menuPpal'),
		my: "left top",
		at: "right top",
		collision: "none, none"
	});
}
// -----------------------------------------------------------------------> Ajusta el scroll de las páginas, dependiendo del tamaño interno de la ventana de navegador
function ajustaScroll() {
	// Evita el scroll vertical si el espacio interno del navegador tiene mas de 699 pixeles de alto
	if ($(window).innerHeight() > 699) {
		$('html').css('overflow-y', 'hidden');
	} else {
		$('html').css('overflow-y', 'auto');
	}
	// Evita el scroll horizontal si el espacio interno del navegador tiene mas de 989 pixeles de ancho
	if ($(window).innerWidth() > 989) {
		$('html').css('overflow-x', 'hidden');
	} else {
		$('html').css('overflow-x', 'auto');
	}
}
// -----------------------------------------------------------------------> Ubica, si existe, un div flotante en la celda indicada
function ubicarObjetoFlotante() {
	if ($('#flotante').length) {
		var numCelda = Number($('#flotante').attr('class').substr(5, 2));
		var posY = Math.floor(numCelda/4);
		var posX = (numCelda-(posY*4))-1;
		posY *= 220;
		posX *= 240;
		$('#flotante').position({
			of: $('#contenido'),
			my: "left top",
			at: "left top",
			offset: posX+", "+posY,
			collision: "none, none"
		});
		$('#flotante').css('z-index', '99');
	}
}
// -----------------------------------------------------------------------> Funciones utilitarias varias

function dosDigitos(num) {
	if (num < 10) {
		return "0"+num;
	} else {
		return num;
	}
}
function dosEspaciosIE7(num) {
	if (num < 10 && esIE7) {
		return "&nbsp;&nbsp;"+num;
	} else {
		return num;
	}
}
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}








// ---------------------------------------->