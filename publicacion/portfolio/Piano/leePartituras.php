<?php
$dir = "partituras/";
$partituras = array();
if (is_dir($dir)) {
	if ($gd = opendir($dir)) {
		while ($archivo = readdir($gd)) {
			if (filetype($dir . $archivo) == "file" && substr($archivo, -3) == "txt") {
				chmod($dir . $archivo, 0777);
				array_push($partituras, $archivo);
			}
		}
		closedir($gd);
	}
}
sort($partituras);
echo "partituras=";
for ($i=0;$i<count($partituras);$i++) {
	echo $partituras[$i];
	if ($i != (count($partituras)-1))
		echo ",";
}
?>