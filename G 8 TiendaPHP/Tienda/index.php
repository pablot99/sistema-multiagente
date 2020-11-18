<?php

	header("Status: 200");
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	header("Allow: GET, POST, OPTIONS, PUT, DELETE");
	header("Content-type: text/xml");
	
	include 'Tienda.php';
	include_once 'funcionesGlobales.php';
	
	class hotelTienda {
		#Construimos el hotel
		function __construct($msg){
			redireccionTienda($msg);
		}	
	}
	
	#Desglosamos y pasamos el mensaje a la tienda 
	function redireccionTienda($msg){ 
	
			#Conectamos a BB.DD
			$mysqli = funcionesGlobales::conectBBDD();

			#Vemos si la tienda esta disponible
			$tienda = $msg->head->id_receptor;
			$result = $mysqli->query("SELECT * FROM tiendas WHERE id LIKE ".$tienda); 
			$row = $result->fetch_assoc();
			
			#Llamamos al metodo de tienda dependiendo de la accion que quiere realizar el cliente
			if($row != NULL){
				#Sacamos informacion del mensaje
				$cliente = $msg->head->id_emisor;  
				$ipcliente = $msg->head->ip_emisor . ":" . $msg->head->puerto_emisor;
				$tipoDeMensaje = $msg->head->tipo_mensaje;
				$horaEntrada = $msg->head->time_sent;
				
				#entrarde la tienda ----------------------------------------------------------------------------------------- 
				if(strcmp($tipoDeMensaje, 'entrada_tienda') === 0){
					$productos = [];

					foreach($msg->body->lista_productos->children() as $p) {
						$productos["$p->id_producto"] = "$p->cantidad";
					}

					Tienda::entrada($tienda, $ipcliente, $cliente, $productos);

					// foreach ($msg->body->lista_tiendas->tienda.children() as $tiendas){
					// 	array_push($idTiendas, $tiendas->id);
					// 	array_push($ipTiendas, $tiendas->ip);
					// }
					// Tienda::entrada($tienda, $ipcliente, $cliente, $horaEntrada, $idTiendas, $ipTiendas);
					#Escribimos log
					funcionesGlobales::logs("logHotel.txt", "Tienda: " .$tienda. " : entra el comprador: " .$cliente);

				#Salir de tienda -------------------------------------------------------------------------------------------
				}elseif (strcmp($tipoDeMensaje, 'salida_tienda') === 0){
					Tienda::salida($tienda, $cliente, $ipcliente);
					#Escribimos log
					funcionesGlobales::logs("logHotel.txt", "Men: ".$idMen." -- Tienda: " .$tienda. " : sale el comprador: " .$cliente);                                      
				#Comprar en tienda --------------------------------------------------------------------------------------
				}elseif (strcmp($tipoDeMensaje, 'confirmacion_compra') === 0){
					$nombreProductos = array(); #Array para los productos que nos piden
					$cantidades = array();
					foreach ($msg->body->lista_productos->producto as $producto){ #Rellenamos arrays
						array_push($nombreProductos, $producto->id_producto);
						array_push($cantidades, $producto->cantidad);
					}
					Tienda::venderProducto($tienda, $cliente, $horaEntrada, $nombreProductos, $cantidades); #Llamamos a la tienda con la venta
                                          
				// #Pedir lista de compra -----------------------------------------------------------------------------------
				// }elseif (strcmp($tipoDeMensaje, 'TLC') === 0){
				// 	$nombreProductos = array(); #Array con los productos que nos piden
				// 	$cantidades = array();
				// 	foreach ($msg->cuerpo->listaCompra->producto as $producto){ #Rellenamos arrays
				// 		array_push($nombreProductos, $producto->idProducto);
				// 		array_push($cantidades, $producto->cantidad);
				// 	}
				// 	Tienda::listaCompra($tienda, $ipCliente, $idCliente, $cliente, $idMen, $horaEntrada, $nombreProductos, $cantidades); #Llamamos a la tienda con la lista de la compra
				
        #Pedir otras tiendas -------------------------------------------------------------------------------------
				}elseif (strcmp($tipoDeMensaje, 'solicitar_tiendas') === 0){
					$tiendas = [];
					foreach ($msg->body->lista_tiendas->children() as $t) {
						$tiendas["$t->id_tienda"] = $t->ip_tienda . ":" . $t->puerto;
					}
					Tienda::dameTienda($tienda, $cliente, $ipcliente, $tiendas, $horaEntrada); #Llamamos a la tienda para que le pase las tiendas que conocen los demas clientes
				}
				#Si la tienda no está abierta
			}else {
				echo "La tienda no existe";
			}	
		}

	#leemos y parseamos el mensaje del cliente
	$xml = simplexml_load_string(urldecode($_POST["data"]));
	
	#Creamos un objeto hotelTienda
	$obj = new hotelTienda($xml);
?>
