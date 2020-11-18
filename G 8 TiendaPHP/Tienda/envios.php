<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

class envios{
	static function envioVenta($idDeTienda, $ipCliente, $idCliente, $idMen, $horaEntrada, $nombreProductos, $cantidades, $precios){
		
		$ventas = simplexml_load_file('/var/www/html/mensajes/Ventas.xml');
		
		#idMensaje
		$idMensaje = $ventas->cabecera->addChild('idMensaje', $idMen+1);
		
		#Emisor
		$ipEmisor = $ventas->cabecera->identificacionEmisor->addChild('ipEmisor', "63.33.189.149");
		$idEmisor = $ventas->cabecera->identificacionEmisor->addChild('idEmisor', $idDeTienda);
		
		#Receptor
		$ipReceptor = $ventas->cabecera->identificacionReceptor->addChild('ipReceptor', $ipCliente);
		$idReceptor = $ventas->cabecera->identificacionReceptor->addChild('idReceptor', $idCliente);
		
		#TipoMensaje
		$tipoMensaje = $ventas->cabecera->addChild('tipoMensaje', 'TPV');
		
		#Horas
		$horaEnvio = $ventas->cabecera->addChild('horaEnvio', '00:00');
		$horaRecepcion = $ventas->cabecera->addChild('horaRecepcion', '00:01');
		
		#Lista productos
		foreach ($precios as $z => $value) {
			if ($precios[$z] != 0){
				$producto[$z] = $ventas->cuerpo->listaCompra->addChild('producto');
				$nombre = $ventas->cuerpo->listaCompra->producto[$z]->addChild('idProducto', $nombreProductos[$z]);
				$cantidad = $ventas->cuerpo->listaCompra->producto[$z]->addChild('cantidad', $cantidades[$z]);
				$precio = $ventas->cuerpo->listaCompra->producto[$z]->addChild('precio', $precios[$z]);
			}
		}
		echo $ventas->asXML();
	}
	
	static function envioDentro($idDeTienda, $ipCliente, $idCliente, $productos){
		$root = simplexml_load_file("mensajes/protoConfirmacionCompra.xml");
		
		$head = $root->head;

		$head->id_emisor =  $idDeTienda;
		$head->ip_emisor = "0.0.0.0";
		$head->puerto_emisor = "80";
		
		$head->id_receptor = $idCliente;
		$head->ip_receptor = substr($ipCliente, 0, strpos($ipCliente, ":"));
		$head->puerto_receptor = substr($ipCliente, strpos($ipCliente, ":") + 1);
		
		$head->time_sent = time();

		$body = $root->body;
		$lista = $body->lista_productos;
		foreach ($productos as $id => $cant) {
			$p = $lista->addChild("producto");
			$p->addChild("id_producto", $id);
			$p->addChild("cantidad", $cant);
		}
		echo $root->asXML();
	}
 
 static function envioTienda($tienda, $cliente, $ipcliente, $horaEntrada, $tiendas){
	$msg = simplexml_load_file("mensajes/protoTiendasConocidas.xml");
	$msg->head->id_emisor = $tienda;
	$msg->head->ip_emisor = "127.0.0.1"; //placeholder
	$msg->head->puerto_emisor = "80";
	$msg->head->id_receptor = $cliente;
	$msg->head->ip_receptor = substr($ipcliente, 0, strpos($ipcliente, ":"));
	$msg->head->puerto_receptor = substr($ipcliente, strpos($ipcliente, ":") + 1);
	
	$msg->body->addChild("lista_tiendas");

	foreach ($tiendas as $id => $ip) {
		$t = $msg->body->lista_tiendas->addChild("tienda");
		$t->id_tienda = $id;
		$t->ip_tienda = substr($ip, 0, strpos($ip, ":"));
		$t->puerto = substr($ip, strpos($ip, ":") + 1);
	}
	
	// $monitor = "http://127.0.0.1/log";
	// funcionesGlobales::enviarMensaje($monitor, $msg->asXML());

	echo $msg->asXML();
}
 
 static function envioLista($idDeTienda, $ipCliente, $idCliente, $idMen, $hora, $nombreProductos, $cantidades, $precios){
		
		$lista = simplexml_load_file('/var/www/html/mensajes/Lista.xml');
		
		#idMensaje
		$idMensaje = $lista->cabecera->addChild('idMensaje', $idMen+1);
		
		#Emisor
		$ipEmisor = $lista->cabecera->identificacionEmisor->addChild('ipEmisor', "63.33.189.149");
		$idEmisor = $lista->cabecera->identificacionEmisor->addChild('idEmisor', $idDeTienda);
		
		#Receptor
		$ipReceptor = $lista->cabecera->identificacionReceptor->addChild('ipReceptor', $ipCliente);
		$idReceptor = $lista->cabecera->identificacionReceptor->addChild('idReceptor', $idCliente);
		
		#TipoMensaje
		$tipoMensaje = $lista->cabecera->addChild('tipoMensaje', 'TCT');
		
		#Horas
		$horaEnvio = $lista->cabecera->addChild('horaEnvio', $hora);
		$horaRecepcion = $lista->cabecera->addChild('horaRecepcion', '00:01');
		
		#Lista productos
		foreach ($precios as $z => $value) {
			if ($precios[$z] != 0){
				$producto[$z] = $lista->cuerpo->listaCompra->addChild('producto');
				$nombre = $lista->cuerpo->listaCompra->producto[$z]->addChild('idProducto', $nombreProductos[$z]);
				$cantidad = $lista->cuerpo->listaCompra->producto[$z]->addChild('cantidad', $cantidades[$z]);
				$precio = $lista->cuerpo->listaCompra->producto[$z]->addChild('precio', $precios[$z]);
			}
		}
		echo $lista->asXML();
	}

	function salida($tienda, $cliente, $ipcliente) {
		$msg = simplexml_load_file("mensajes/ack.xml");
		$msg->head->id_receptor = $cliente;
		$msg->head->ip_receptor = $ipcliente;
		$msg->head->id_emisor = $tienda;
		$msg->head->ip_emisor = "0.0.0.0"; //placeholder

		echo $msg->asXML();
	}
}
?>
