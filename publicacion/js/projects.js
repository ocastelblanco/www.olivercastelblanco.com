$(function() {
	var prefix = 'https://www.googleapis.com/blogger/v3/blogs/';
	var key = 'AIzaSyDdZysT6aqzo3wZv8lAiwHdiY6z-eUWpOM';
	var blog = '8460214497105138981';
	//blog = '2924552721978703143';
	var user = 'g103487514475853116751';
	var fields = [{'items': ['content', 'labels', 'title', 'url']}, 'nextPageToken'];
	var pageToken = '';
	var posts = [];
	var projects = [];
	var numPosts = [];
	var keyProjects = [];
	var imgProjects = [];
	var regXimg = /<img\s.*src=([^>]*[^\/]).>/i;
	iniciarCargaDatos();
	function iniciarCargaDatos() {
		var llamado = llamadoAPI(prefix, blog, key, fields, pageToken);
		$.getJSON(llamado, function(datos) {
			// Apenas se cargan los datos
			posts = posts.concat(datos.items);
			if(datos.nextPageToken) {
				pageToken = '&pageToken='+datos.nextPageToken;
				iniciarCargaDatos();
			} else {
				pageToken = '';
				imprimirDatos();
			}
		}).error(function(){
			$('#contenido').html('<span style="font-size: 16px">A communication error happened. Try reloading the page to see this content. Are you using Internet Explorer?</span>');
		}).complete(function() {
			// Cuando termina la carga de datos, con o sin error
		});
	}
	function imprimirDatos() {
		// Todo este inmenso ciclo para extraer el nombre de los proyectos, el número de posts por proyecto
		for (var cont in posts) {
			for (var numLabel in posts[cont].labels) {
				if (posts[cont].labels[numLabel].toString().substr(0, 1) == '#') {
					var nomProject = posts[cont].labels[numLabel].toString();
					var yaExiste = false;
					for (var numProjects in projects) {
						if (nomProject == projects[numProjects]) {
							numPosts[numProjects]++;
							yaExiste = true;
						}
					}
					if (!yaExiste) {
						projects.push(nomProject);
						numPosts.push(1);
						keyProjects.push([]);
					}
				}
			}
		}
		// Todo este inmenso ciclo para extraer las palabras clave por proyecto 
		for (var cont in projects) {
			var finalImgs = [];
			for (var np in posts) {
				if (posts[np].labels.some(function(element, index, array) {
											return (element == projects[cont]);
											})) {
					var imgs = posts[np].content.match(regXimg);
					for (var numStrings in imgs) {
						if (imgs[numStrings].toString().substr(0, 4) == "<img") {
							finalImgs.push(imgs[numStrings]);
						}
					}
					imgProjects[cont] = finalImgs;
					for (var numLabel in posts[np].labels) {
						var yaExiste = false;
						for (var numKeys in keyProjects[cont]) {
							if (keyProjects[cont][numKeys] == posts[np].labels[numLabel]) {
								yaExiste = true;
							}
						}
						if (!yaExiste) {
							if (posts[np].labels[numLabel].toString().substr(0, 1) != '#') {
								keyProjects[cont].push(posts[np].labels[numLabel]);
							}
						}
					}
				}
			}
		}
		console.log(imgProjects);
		var paq1 = '<div class="grid_4 proyecto"><div id="texto" class="cerrado"><div id="indicador"></div><div id="titulo">';
		var paq2 = '</div><div id="numPosts">'
		var paq3 = '</div><div id="keywords">'
		var paq4 = '</div></div><div id="imgBkg">';
		var paq5 = '</div></div>';
		for (var cont in projects) {
			$('#contenido').append(paq1+ajustaTitulo(projects[cont])+paq2+numPosts[cont]+paq3+keyProjects[cont].join(', ')+paq4+imgProjects[cont].join('')+paq5);
		}
		ajustaContenidos();
	}
	function ajustaContenidos() {
		$('#contenido .proyecto #texto').each(function() {
			ocultaTextos($(this));
		});
		$('#contenido .proyecto').mouseenter(function(e) {
			$(this).children('#texto').switchClass('cerrado', 'abierto');
			$(this).children('#texto').children('#indicador').css('border-top', 'none');
			$(this).children('#texto').children('#indicador').css('border-bottom', '0.5em solid white');
			$(this).children('#texto').children('#titulo').switchClass('cerrado', 'abierto', function(){
				muestraTextos($(this).parent());
				$(this).parent().children('#indicador').css('border-top', '0.5em solid white');
				$(this).parent().children('#indicador').css('border-bottom', 'none');
			});
		});
		$('#contenido .proyecto').mouseleave(function(e) {
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
		$('#contenido .proyecto').click(function(e) {
            // Se dispara la acción al hacer clic
        });
		$('#contenido .proyecto #imgBkg').cycle({
			fx: 'fade', 
			speed:    300, 
			timeout:  10000
		});
	}
	function llamadoAPI(prefix, blog, key, fields, pageToken) {
		var salida;
		var campos = '';
		var valCampos = new Array();
		if (fields.length > 0) {
			campos = '&fields=';
			for (var i = 0; i<fields.length;i++) {
				if (typeof fields[i] == 'object') {
					valCampos.push(Object.keys(fields[i])+'('+fields[i][Object.keys(fields[i])].join(',')+')');
				} else if (typeof fields[i] == 'string'){
					valCampos.push(fields[i]);
				}
			}
			campos += valCampos.join(',');
		}
		salida = prefix+blog+'/posts?key='+key+campos+pageToken;
		return salida;
	}
	/* Funciones generales */
	function ocultaTextos(obj) {
		$(obj).children('#numPosts').hide();
		$(obj).children('#keywords').hide();
	}
	function muestraTextos(obj) {
		$(obj).children('#numPosts').show();
		$(obj).children('#keywords').show();
	}
	function ajustaTitulo(titulo) {
		var mayuscula = titulo.substr(1, 1).toUpperCase();
		return mayuscula+titulo.substr(2);
	}
});
/* Funciones de compatibilidad para Object.keys y para Array.prototype.some */
if (!Object.keys) {
  Object.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;
    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');
      var result = [];
      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop);
      }
      if (hasDontEnumBug) {
        for (var i=0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
        }
      }
      return result;
    }
  })()
};
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisp */){
    "use strict";
    if (this == null)
      throw new TypeError();
 
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisp, t[i], i, t))
        return true;
    }
 
    return false;
  };
}