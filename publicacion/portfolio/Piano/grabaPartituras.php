<?php
$nombre = $HTTP_POST_VARS['nombre'];
$autor = $HTTP_POST_VARS['autor'];
$partitura = $HTTP_POST_VARS['partitura'];
$contenido = $partitura.",".$autor.",".$nombre;
$dir = "partituras/";
$partituras = array();
if (is_dir($dir)) {
	if ($gd = opendir($dir)) {
		while ($archivo = readdir($gd)) {
			if (filetype($dir . $archivo) == "file" && substr($archivo, -3) == "txt") {
				$nombre = basename($archivo, ".txt");
				array_push($partituras, $nombre);
			}
		}
		closedir($gd);
	}
}
sort($partituras);
$ultimaPartitura = substr($partituras[count($partituras)-1], 1);
$nombre_archivo = $dir."/p".tresDigitos($ultimaPartitura+1).".txt";
if (count($partituras) < 1)
	$nombre_archivo = $dir."/p001.txt";
if (!$gestor = fopen($nombre_archivo, 'w')) {
	 echo "No se puede abrir el archivo ($nombre_archivo)";
	 exit;
}
if (fwrite($gestor, $contenido) === FALSE) {
	echo "No se puede escribir al archivo ($nombre_archivo)";
	exit;
}
fclose($gestor);

function tresDigitos($numero) {
	if ($numero < 10)
		$salida = "00".$numero;
	elseif ($numero < 100)
		$salida = "0".$numero;
	else
		$salida = "".$numero;
	return $salida;
}
?>