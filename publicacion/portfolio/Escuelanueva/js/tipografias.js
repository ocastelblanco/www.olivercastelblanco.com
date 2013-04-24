// JavaScript Document
function cargaFuentes() {
	var listado = new Array(
		"http://fonts.googleapis.com/css?family=Anton",
		"http://fonts.googleapis.com/css?family=Muli:300,400,300italic,400italic"
	);
	var i = 0;
	var url;
	for (var e in listado) {
		url = listado[i];
		i++;
		tipo(url);
	}
}
function tipo(url) {
	$("head").append("<link>");
		css = $("head").children(":last");
		css.attr({
		rel: "stylesheet",
		type: "text/css",
		href: url
	});
}