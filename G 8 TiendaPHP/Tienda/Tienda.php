<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
 
  
include_once 'funcionesGlobales.php';
include 'envios.php';
class Tienda extends funcionesGlobales
	{
	
  	#Atributos
		// var $id ;
			
		// #Constructor
		// function __construct($i){
		// 	$this->id=$i;
			
		// 	#Escribimos en el log
		// 	funcionesGlobales::logs("logTienda.txt", "Abrimos una nueva tienda con identificador: " .$this->id);
			
		// }
		
		#Funcion para entrar a la tienda 
		static function entrada($tienda, $ipCliente, $cliente, $productos){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			#Añadimos registro de entrada del cliente
			$consult = "INSERT INTO tiendaCliente (idTienda, idCliente) values ($tienda, $cliente)";
			$mysqli -> query($consult);
			
			// #hay que coger tambien las tiendas que conoce el cliente
      		// 	foreach ($idTiendaConocida as $i => $value) {
			// 	$idTiendaC = $idTiendaConocida[$i];
			// 	$ipTiendaC = $ipTiendaConocida[$i];
        	// 		$mysqli = funcionesGlobales::conectBBDD();
          	// 		$consult2 = "INSERT INTO tiendasConocidas (idCliente, idTiendaDentro, idTiendaConocida, ipTiendaConocida) VALUES ('$cliente', '$idDeTienda', '$idTiendaC', '$ipTiendaC')";

			//    	$mysqli -> query($consult2);      
					
			  // 	}
			  
			$q = "SELECT idProducto, cantidad FROM tiendaProducto WHERE idTienda = $tienda;";
			$r = $mysqli->query($q);
			$stock = [];
			for ($i = 0; $i < $r->num_rows; $i++) {
				$row = $r->fetch_assoc();
				$stock[$row["idProducto"]] = $row["cantidad"];
			}

			foreach($productos as $id => $cant) {
				if(!key_exists($id, $stock)) {
					unset($productos[$id]);
					continue;
				}
				if($stock[$id] < $cant) {
					$productos[$id] = $stock[$id];
					$cant = $stock[$id];
				}
				$stock[$id] -= $cant;
				if ($stock[$id] > 0) {
					$mysqli->query("UPDATE tiendaProducto SET cantidad = $stock[$id] WHERE idTienda = $tienda AND idProducto = $id");
				}
				else {
					$mysqli->query("DELETE FROM tiendaProducto WHERE idTienda = $tienda AND idProducto = $id");
				}
			}
			
			#Mandamos mensaje a comprador
			envios::envioDentro($tienda, $ipCliente, $cliente, $productos);
			
		}
		
		#Funcion salida de tienda
		static function salida($idDeTienda, $cliente, $ipcliente){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			funcionesGlobales::logs("logTienda.txt", "Sale la tienda: ".$cliente);
			
			#Eliminamos los registros pertenecientes a ese cliente
				$sql = "DELETE FROM tiendaCliente WHERE idCliente = '$cliente'";
				$mysqli->query($sql);	
      
      			#Eliminamos las tiendas que conoce este cliente
      			$sql = "DELETE FROM tiendasConocidas WHERE idCliente = '$cliente' AND idTiendaDentro = '$tienda'";
			$mysqli->query($sql);	
			envios::salida($idDeTienda, $cliente, $ipcliente);
		}
		
		#vendemos un producto a un cliente
		static function venderProducto($idDeTienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			
			#Comprobamos si el cliente esta dentro de la tienda
			$sql = "SELECT * FROM tiendaCliente WHERE idTienda LIKE '$idDeTienda' AND idCliente LIKE '$cliente' AND accion LIKE 'Dentro'";
			$result = $mysqli->query($sql);
			$row = $result->fetch_assoc();
			if($row != NULL){
				$precios = array();
				foreach ($nombreProductos as $i => $value) {
					$nombreProducto = $nombreProductos[$i];
					$cantidadP = $cantidades[$i];
					#Vemos si el producto esta disponible
					$sql = "SELECT * FROM tiendaProducto WHERE idTienda LIKE '$idDeTienda' AND idProducto LIKE '$nombreProducto' AND '$cantidadP' <= cantidad ";
					$result = $mysqli->query($sql);
					$row = $result->fetch_assoc();
					if($row != NULL){
						#Se actualiza la cantidad de la Tienda
						$cant = $row["Cantidad"];
						$nuevaCantidad = $cant - $cantidadP;
						$sql = "UPDATE tiendaProducto SET cantidad = '$nuevaCantidad' WHERE nombreProducto LIKE '$nombreProducto' AND idTienda = '$idDeTienda' ";
						$mysqli->query($sql);
						
						#Añadimos la compra
						$consult = "INSERT INTO tiendaCliente (idTienda, idCliente, idMensaje, horaMensaje, accion, productoVendido, cantidadProducto) VALUES ('$idDeTienda', '$cliente', '$idMen', '$horaEntrada', 'Compra', '$nombreProducto', '$cantidadP')";
						$mysqli -> query($consult);
						
						#Añadimos ganancias a la tienda
						$precio = $row["Precio"];
						$sql = "UPDATE tiendas SET Dinero = Dinero + ('$precio' * '$cantidadP') WHERE ID LIKE '$idDeTienda' ";
						$mysqli->query($sql);
						
						array_push($precios, ($precio * $cantidadP));
						
						#Escribimos log
						funcionesGlobales::logs("logTienda.txt", "Men: ".$idMen." -- Tienda: " .$idDeTienda. " : vende al comprador " .$cliente. " " .$cantidadP. " de " .$nombreProducto. " por " .($cantidadP * $precio). " euros");
					}
				}

				#Mandamos mensaje a comprador 
				envios::envioVenta($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios);
				
			}
			else {
				###############################################
				#Mandamos mensaje a comprador OJO FALTA ESTOOOOOOO!!!!!!!!!!!!!!!!!!!
				###############################################
				 "El comprador no esta en la tienda";
			}	
		}
		
		#pasamos una lista de productos disponibles al cliente
		static function listaCompra($idDeTienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades){
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			
			#Comprobamos si el cliente esta dentro de la tienda
			$sql = "SELECT * FROM tiendaCliente WHERE idTienda LIKE '$idDeTienda' AND idCliente LIKE '$cliente' AND accion LIKE 'Dentro'";
			$result = $mysqli->query($sql);
			$row = $result->fetch_assoc();
			if($row != NULL){
				$precios = array();
				foreach ($nombreProductos as $i => $value) {
					$nombreProducto = $nombreProductos[$i];
					$cantidadP = $cantidades[$i];
					#Vemos si el producto esta disponible
					$sql = "SELECT * FROM tiendaProducto WHERE idTienda LIKE '$idDeTienda' AND idProducto LIKE '$nombreProducto' AND '$cantidadP' <= cantidad ";
					$result = $mysqli->query($sql);
					$row = $result->fetch_assoc();
					if($row != NULL){
						$precio = $row["Precio"];
						array_push($precios, ($precio * $cantidadP));
						#Escribimos log
						funcionesGlobales::logs("logTienda.txt", "Men: ".$idMen." -- Tienda: " .$idDeTienda. " : pasamos lista a " .$cliente. " " .$cantidadP. " de " .$nombreProducto. " por " .($cantidadP * $precio). " euros");
					}
									
				}
				#Mandamos mensaje a comprador 
				envios::envioLista($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios);
				
			}
			else {
				###############################################
				#Mandamos mensaje a comprador OJO FALTA ESTOOOOOOO!!!!!!!!!!!!!!!!!!!
				###############################################
				echo "El comprador no esta en la tienda";
			}	
		}
		
		#Funcion para cerrar la tienda 
		static function cerrar($a){
			
			#Conectamos con BB.DD
			$mysqli = funcionesGlobales::conectBBDD();
			
			#Eliminamos la relacion entre producto-tienda y cliente-tienda
			$sql = "DELETE FROM tiendaProducto WHERE idTienda = '$a'";
			$mysqli->query($sql);
			
			$sql = "DELETE FROM tiendacliente WHERE idTienda = '$a'";
			$mysqli->query($sql);
			
			#Escribimos en el log
			funcionesGlobales::logs("logTienda.txt", "Cerramos la tienda con identificador: " .$a);
		}
		
		#Dar las tiendas que conocen los demas clientes
		static function dameTienda($tienda, $cliente, $ipCliente, $tiendas, $tiempo){
			$mysqli = funcionesGlobales::conectBBDD();
			foreach ($tiendas as $id => $ip) {
				$q = "INSERT INTO tiendasConocidas VALUES ($cliente, $tienda, $id, '$ip');";
				$mysqli->query($q);
			}

			$q = $mysqli->query("SELECT idTiendaConocida, ipTiendaConocida FROM tiendasConocidas WHERE ipTiendaDentro = $tienda;");
			for ($i = 0; $i < $q->num_rows; $i++) {
				$row = $q->fetch_assoc();
				if(!array_key_exists($row["idTiendaConocida"], $tiendas)) {
					$tiendas[$row["idTiendaConocida"]] = $row["ipTiendaConocida"];
				}
			}
			envios::envioTienda($tienda, $cliente, $ipCliente, $tiempo, $tiendas);
		}
	}
?>
