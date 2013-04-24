// ------------------------------ Menú de Guías --------------------------
function creaPaginacion(num) {
	var actual = nombrePag();
	var numUnidad = num - 1;
	var numPagActual;
	var numGuiaActual;
	var nombreGuiaActual;
	var tituloGuiaActual;
	var momentoActual;
	var nombresGuias = new Array();
	var titulosGuias = new Array();
	var paginasIniciales = new Array();
	var paginas = new Array();
	$.ajax({
		url: "../js/paginador.xml",	dataType : "xml", success: function(xml, status){
			// ------> alert($(xml).text());
    		$(xml).find('unidad').each(function(i, c) {
				if (i == numUnidad) {
					$('#tituloUnidad h1').html($(this).find('nombreUnidad').text());
					$('#tituloUnidad span').html($(this).find('tituloUnidad').text());
					$(this).find('guia').each(function(n, v) {
						nombresGuias[n] = $(this).find('nombreGuia').text();
						titulosGuias[n] = $(this).find('tituloGuia').text();
						paginasIniciales[n] = $(this).find('paginas').find('pagina:first').find('archivoPagina').text();
						var cont = 0;
						var pagsGuia = new Array();
						$(this).find('paginas').find('pagina').each(function(h, j) {
							pagsGuia[cont] = $(this).find('archivoPagina').text();
							cont++;
							if($(this).find('archivoPagina').text() == actual) {
								numPagActual = h;
								numGuiaActual = n;
								nombreGuiaActual = nombresGuias[n];
								tituloGuiaActual = titulosGuias[n];
								momentoActual = $(this).find('momento').text();
							}
						});
						paginas[n] = pagsGuia;
					});
				}
			});
			$('#menu').html('');
			$.each(nombresGuias, function(k) {
				if (numGuiaActual == k) {
					$('#menu').append('<span id="actual">'+nombreGuiaActual+'</span>');
				} else {
					$('#menu').append('<a href="'+paginasIniciales[k]+'">'+nombresGuias[k]+'</a>');
				}
			});
			ajustaMenu();
			creaBreadcrumb(tituloGuiaActual, momentoActual);
			ajustaPaginacionInferior(paginas[numGuiaActual], actual, numPagActual);
		}, error: function(obj, status, err) {
			$("body").html("Error: "+status+" "+err);
		}
	});
}
function creaMargenesEspeciales(clave) {
	var cont = clave.length, propiedad;
	$('*').attr('class', function(indice, atributo) {
		if (atributo != "") {
			var clases = atributo.split(" ");
			for (var i=0;i<clases.length;i++) {
				if (clases[i].substr(0, cont) == clave) {
					if (clases[i].substr(cont) < 0) {
						propiedad = 'margin-top';
					} else {
						propiedad = 'padding-top';
					}
					$(this).css(propiedad, clases[i].substr(cont)+"px");
				}
			}
		}
	});
}
// ------------ Funciones de apoyo  --------------------------------------
function ajustaMenu() {
	var numElementos = 0;
	$('#menu *').width(function(i, w) {
		numElementos++;
	});
	var anchoParcial = $('#menu').width()/numElementos;
	$('#menu *').width(anchoParcial);
}
function nombrePag() {
	var ruta = $(location).attr('pathname');
	var pos = ruta.lastIndexOf('/')+1;
	var nombre = ruta.substr(pos);
	return nombre;
}
function creaBreadcrumb(paso1, paso2) {
	$('#breadcrumb').html('<span>'+paso1+'</span><span>'+paso2+'</span>');
}
function ajustaPaginacionInferior(pags, html, num) {
	var contenido = "";
	if (num > 0) {
		contenido += '<a href="'+pags[num-1]+'" id="anterior">ANTERIOR</a>';
	} else {
		contenido += '<span id="pagDesactivado">ANTERIOR</span>';
	}
	for (i = 0; i<pags.length; i++) {
		if (i == num) {
			contenido += '<span id="actual">'+(i+1)+'</span>';
		} else {
			contenido += '<a href="'+pags[i]+'">'+(i+1)+'</a>';
		}
	}
	if (num < pags.length-1) {
		contenido += '<a href="'+pags[num+1]+'" id="siguiente">SIGUIENTE</a>';
	} else {
		contenido += '<span id="pagDesactivado">SIGUIENTE</span>';
	}
	$('#paginacion div').html(contenido);
	centraPaginacion();
	creaPieFoto();
	seleccionaPersonajesOver();
}
function centraPaginacion() {
	var anchoDiv = 0;
	$('#paginacion div > *').width(function(i, w) {
		anchoDiv += w;
	});
	var margen = ($('#paginacion').width() - anchoDiv)/2;
	$('#paginacion>div').css('margin-left', margen);
}
function creaPieFoto() {
	$('img#foto').text(function(i, t) {
		$(this).wrap("<div />");
		var imagen = $(this).parent().html();
		var pieFoto = '<span id="pieFoto">'+$(this).attr('title')+'</span>';
		$(this).parent().wrap('<div id="marcoFoto" />');
		$(this).parent().parent().html(imagen+pieFoto);
	});
}
function seleccionaPersonajesOver() {
	$('#seleccionaPersonaje #patricia').hover(
		function() {
			$(this).children('img').attr("src", "../img/seleccionaPatriciaOver.jpg");
		},
		function() {
			$(this).children('img').attr("src", "../img/seleccionaPatricia.jpg");
		}
	);
	$('#seleccionaPersonaje #orlando').hover(
		function() {
			$(this).children('img').attr("src", "../img/seleccionaOrlandoOver.jpg");
		},
		function() {
			$(this).children('img').attr("src", "../img/seleccionaOrlando.jpg");
		}
	);
}












// --------------------------------/