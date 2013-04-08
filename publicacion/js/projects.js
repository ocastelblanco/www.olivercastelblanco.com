$(function() {
	var prefix = 'https://www.googleapis.com/blogger/v3/blogs/';
	var key = 'AIzaSyDdZysT6aqzo3wZv8lAiwHdiY6z-eUWpOM';
	var blog = '8460214497105138981';
	blog = '2924552721978703143';
	var user = 'g103487514475853116751';
	var fields = [{'items': ['content', 'labels', 'title']}, 'nextPageToken'];
	var pageToken = '';
	var posts = [];
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
		$('#contenido').html(posts[0].content);
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
});
// 2924552721978703143/posts?fields=items(content,labels,title),nextPageToken&key=AIzaSyDdZysT6aqzo3wZv8lAiwHdiY6z-eUWpOM
// Ajuste de compatibilidad para el método Object.keys
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