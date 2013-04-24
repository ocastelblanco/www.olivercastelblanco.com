<?php
require_once('twitteroauth.php');
require_once('twitter-conf.php');
function getConnectionWithAccessToken($oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $oauth_token, $oauth_token_secret);
  return $connection;
}
$connection = getConnectionWithAccessToken(OAUTH_TOKEN, OAUTH_TOKEN_SECRET);
$content = $connection->get("statuses/user_timeline", array('screen_name' => 'ocastelblanco'));
$salida = '[';
$patron = '/(https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/i';
$remplazo = '<a href="$1" target="_blank">$1</a>';
foreach ($content as $valor) {
	$salida .= '"'.str_replace('"', '\\"', preg_replace($patron, $remplazo, $valor->text)).'",';
}
$contenido = rtrim($salida, ",").']';
echo $contenido;
?>