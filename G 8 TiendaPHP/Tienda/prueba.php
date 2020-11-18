<?php

	// header('Access-Control-Allow-Origin: *');
	//  header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
 	//  header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
  	// header("Allow: GET, POST, OPTIONS, PUT, DELETE");

	// $ventas = file_get_contents('pruebaxml.xml');
	// //var_dump($ventas);
	require('indexInicio.php');

?>


<form enctype="multipart/form-data" action="hotelTienda.php" method="POST">
    <!-- MAX_FILE_SIZE must precede the file input field -->
    <input type="hidden" name="MAX_FILE_SIZE" value="30000" />
    <!-- Name of input element determines name in $_FILES array -->
    Send this file: <input name="data" type="file" />
    <input type="submit" value="Send File" />
</form>
