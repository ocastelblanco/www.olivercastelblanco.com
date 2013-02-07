<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Untitled Document</title>
</head>

<body>
<table width="800" border="1" cellspacing="0" cellpadding="2">
  <tr>
  	<td width="39" align="center" valign="middle"><strong>ID</strong></td>
    <td width="312" align="center" valign="middle"><strong>Nombre</strong></td>
    <td width="216" align="center" valign="middle"><strong>Empresa</strong></td>
    <td width="207" align="center" valign="middle"><strong>Email</strong></td>
  </tr>
<?php
$config['servidor'] = "nextmedia3.imagine.com.co";
$config['usuario'] = "root";
$config['clave'] = "alemania2006";
$config['basedatos'] = "navidadProximity";
$config['invitados'] = "`invitados`";
$config['accesos'] = "`accesos`";
$con = mysql_connect($config['servidor'], $config['usuario'], $config['clave']) or die ("Error: ".mysql_error());
$db = mysql_select_db($config['basedatos'], $con) or die ("Error: ".mysql_error());
$query = "SELECT * FROM ".$config['invitados'];
$res = mysql_query($query, $con) or die ("Error: ".mysql_error());
while ($fila = mysql_fetch_assoc($res)) {
?>
  <tr>
  	<td><?php echo $fila['id'] ?></td>
    <td><?php echo $fila['nombre'] ?></td>
    <td><?php echo $fila['empresa'] ?></td>
    <td><?php echo $fila['email'] ?></td>
  </tr>
<?php
}
mysql_close($con);
?>
</table>
</body>
</html>
