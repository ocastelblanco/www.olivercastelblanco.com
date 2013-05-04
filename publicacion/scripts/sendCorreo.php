<?php
	require_once("email_message.php");
	require_once("sendmail_message.php");
	
	$nombre = $_POST['name'];
	$email = $_POST['email'];
	$mensaje = $_POST['comment'];
	
	$salida = "Has recibido un mensaje de $nombre, con el email $email y con el mensaje $mensaje";
	
	$message_object=new sendmail_message_class;
	$message_object->delivery_mode=SENDMAIL_DELIVERY_DEFAULT;
	
	function sendmail_mail($to,$subject,$message,$additional_headers="",$additional_parameters=""){
		global $message_object;
		return($message_object->Mail($to,$subject,$message,$additional_headers,$additional_parameters));
	}
	if (sendmail_mail("ocastelblanco@gmail.com", "Mensaje desde el website", $salida))
		echo '{ "respuesta": "true" }';
	else
		echo '{ "respuesta": "false" }';
?>