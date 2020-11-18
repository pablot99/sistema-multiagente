<?php
// header('Access-Control-Allow-Origin: *');
// header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
// header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
// header("Allow: GET, POST, OPTIONS, PUT, DELETE");
	
	class funcionesGlobales{
		
		
		#Conectamos con la BB.DD
		static function conectBBDD() : mysqli{
			$mysqli = new mysqli('127.0.0.1', 'admin', 'json', 'my_database');
			return $mysqli;
		}
		
		#Escribimos en logs
		static function logs($f, $esc){
			$file = fopen($f, "a");
				fwrite($file, $esc. PHP_EOL);
		}

		static function enviarMensaje($url, $mensaje) {
			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, "data=".urlencode($msg));
			
			$result = curl_exec();
			curl_close($ch);
			
			return $result;

		}
		
	}

?>
