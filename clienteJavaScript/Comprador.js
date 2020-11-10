class Comprador {
	constructor(ip, puerto, ipMonitor, puertoMonitor, log) {
		this.ip = ip;
		this.puerto = puerto;
		this.ipMonitor = ipMonitor;
		this.puertoMonitor = puertoMonitor;
		this.id = 0;
		this.listaCompra = [];
		this.listaTiendas = [];
		//this.dineroGastado = 0;
		this.tiempoConsumido = 0;
		this.log = log;

	}

	// Comprueba si el producto está incluido en la lista
	isIn(id, list) {
		//Si la lista tiene algún objeto con el mismo ID que el pasado por parametro, devuelve verdadero
		for (var object of list) {
			if (id == (object.id)) {
				return true;
			}
		}
		// Falso en cualquier otro caso
		return false;
	}

	//Quita los productos especificados en la lista de los productos por comprar
	//(reduce la cantidad restante a 0)
	reduceProducts(products) {
		for (var product1 of products) {
			for (var product2 of productList) {
				//Si el producto está dentro de la lista de productos a comprar por ese cliente, reduce la cantidad
				if (product1.id == product2.id) {
					//Busca el producto
					var item = list.find(function (element) {
						return element.id == product1.id;
					})
					//Reduce la cantidad que hay de ese producto a 0
					item.reduceQuantity(product1.cantidad);
				}
			}
		}
	}

	//Encuentra al producto en la lista y reduce la cantidad especificada
	reduceProductsQuantity(id, quantity) {
		for (var i = 0; i < this.listaCompra.length; i++) {
			//Si encuentra el producto con la misma id en la lista de la compra del cliente le quita la cantidad especifica
			if (this.listaCompra[i].id_producto == id) {
				if (this.listaCompra[i].cantidad < quantity) quantity = this.listaCompra[i].cantidad; //Si es superior pone la cantidad al numero que necesitemos de dicho producto
				this.listaCompra[i].cantidad = this.listaCompra[i].cantidad - quantity;
			}
		}
	}

	//Comprueba si le quedan productos por comprar
	productsLeft() {
		//recorre todos los productos de la lista de la compra
		for (var product of this.listaCompra) {
			if (product.getQuantity() != 0)
				//si hay un producto con una cantidad superior a 0 devuelve true para especificar que hay productos para comprar
				return true;
		}
		return false;
	}

	//Agrega de la lista de tiendas pasada, las tiendas que no conozca el cliente
	agregarTiendas(tiendas) {
		// Suponemos que la lista tiendas que nos pasan no tiene duplicados de tiendas
		var tiendaActual = {};

		//Tiendas por añadir
		var tiendasNuevas = [];

		//Saca las tiendas
		for (var i = 0; i < tiendas.length; i++) {
			tiendaActual = tiendas[i];

			var isNueva = true;
			//Comprueba si la tienda está en las listas conocidas
			for (var tiendaConocida in this.listaTiendas) {

				if (tiendaActual == tiendaConocida) {
					isNueva = false;
				}
			}

			//Si la tienda es nueva, se introduce a la lista de tienda y a la lista de tiendas nuevas
			if (isNueva) {
				this.listaTiendas.push(tiendaActual);
				tiendasNuevas.push(tiendaActual);
			}
		}

		//Mensaje de log correspondiente
		console.log(tiendasNuevas)

	}

	//Pide productos y tiendas
	async pideIni() {
		//CAMBIOS AQUI
		var respuesta = await get_Monitor(this.ipMonitor, this.ip);
		if(respuesta!=-1){
			this.listaCompra = respuesta["body"]['lista_productos'];
			this.listaTiendas = respuesta["body"]['lista_tiendas'];
			this.id = respuesta["head"]['id'];
			this.tiempoConsumido = this.tiempoConsumido + respuesta["head"]['time_sent']
		}
		return respuesta;
	}

	async senalaEntrada() { 
		//CAMBIOS AQUI
		var infoM = {
			tipo_mensaje: 'entrada_tienda',
			id_emisor: this.id,
			ip_emisor: this.ip,
			tipo_receptor: 'tienda',
			id_receptor: this.listaTiendas[0].id_tienda,
			ip_receptor: this.listaTiendas[0].ip_tienda,
			puerto_receptor: this.listaTiendas[0].puerto_tienda,
			productos: this.listaCompra,
			tiendas: this.listaTiendas
		}
		var respuesta = await enviarXML(infoM);
		return respuesta;
	}

	//Imprime en el log informacion util al inicio
	inicializaLog() {
		//Imprime su ID
		this.addToLog("Comprador " + this.id + " inicializado.");
		//Imprime las tiendas iniciales conocidas
		this.addToLog("Las tiendas iniciales que conoce el comprador " + this.id + " son: ");
		for (var shop of this.knownShops) {
			this.addToLog("* " + shop.getString());
		}
	}

	//Actualiza el log
	addToLog(string) {
		this.log.push(string);
		//Actualiza el monitor en pantalla si el monitor activo es el del comprador
		requestUpdate(this.id);
	}

	async iniciaCompra() {
		//CAMBIOS AQUI
		var infoM = {
			tipo_mensaje: 'entrada_tienda',
			id_emisor: this.id,
			ip_emisor: this.ip,
			tipo_receptor: 'tienda',
			id_receptor: this.listaTiendas[0].id_tienda,
			ip_receptor: this.listaTiendas[0].ip_tienda,
			puerto_receptor: this.listaTiendas[0].puerto_tienda,
			productos: this.listaCompra,
			tiendas: this.listaTiendas
		}
		await EnvioMensajes.enviarXML(infoM)
	}

	async askForShops() { 
		//CAMBIOS AQUI
		var infoM = {
			tipo_mensaje: 'solicitar_tiendas',
			id_emisor: this.id,
			ip_emisor: this.ip,
			tipo_receptor: 'tienda',
			id_receptor: this.listaTiendas[0].id_tienda,
			ip_receptor: this.listaTiendas[0].ip_tienda,
			puerto_receptor: this.listaTiendas[0].puerto_tienda,
			productos: this.listaCompra,
			tiendas: this.listaTiendas
		}
		var respuesta = await EnvioMensajes.enviarXML(infoM);
		return respuesta;

	}

	async run() {
		// Pide productos y tiendas al monitor
		var resp = await this.pideIni();
		if (resp==-1){
			this.addToLog("El cliente " + this.id + " ha obtenido los datos del monitor " + this.ipMonitor + " con fracaso.");
			return null; // Fianliza si error devolviendo nulo
		}
	
		this.addToLog("El cliente " + this.id + " ha obtenido los datos del monitor " + this.ipMonitor + " con exito.");
		var tiendaActual = 0;
		// Mientras queden productos por comprar
		while (this.productsLeft() && tiendaActual < this.listaTiendas.length) {

			var error = false; // Para indicar cuando hay algun error

			// Coge la tienda de la lista
			var tienda = this.listaTiendas[tiendaActual];

			// Mensaje para indicar que ha entrado en la tienda
			var res = await this.senalaEntrada();

			// Si no hay ningun error al entrar en la tienda
			if (res != -1) {
				this.addToLog("El cliente " + this.id + " se ha conectado a la tienda " + this.listaTiendas[0].id_tienda + " y comprado con exito.");
				var productos = res["body"]['lista_productos']
				//Comprueba si tiene algun producto que necesite el cliente
				var i = 0;
				while (i < productos.length) {
					// Procesa los productos comprados
					this.reduceProductsQuantity(productos[i].id_producto, productos[i].cantidad);
					i++;
				}

			} else {
				// Error en el envio de la lista de la compra
				this.addToLog("El cliente " + this.id + " ha obtenido un error al comprar productos");
				error = true;
			}

			//Si aun quedan productos por comprar, preguntamos a los compradores por otras tiendas
			if (this.listaCompra.length != 0 && !error) {
				//Añadimos al log y preguntamos
				this.addToLog("El cliente " + this.id + " tiene productos restantes por comprar.");
				// Espera a que un cliente le pase la lista de las tiendas
				resultado = this.askForShops(shop);
				if (resultado != -1) {
					var tiendas = resultado["body"]['lista_tiendas'];
					//Añadimos las tiendas nuevas a las actuales
					this.listaTiendas = this.agregarTiendas(tiendas);
				} else {
					//Error a la hora de recibir una lista de tiendas
					this.addToLog("El cliente " + this.id + " ha obtenido un error al recibir tiendas");
					error = true;
					//Termina la conexion

				}
			}

			// Avanzamos a la siguiente tienda
			this.listaTiendas.pop();

			// Comprobamos si quedan productos por comprar, y no conocemos mas tiendas a las que ir
			if ((!this.productsLeft() && this.listaTiendas.length == 0) || (this.listaTiendas.length == 0)) {
				//Fin de la compra
				if (this.productsLeft()) {
					//Compra fallida (no hemos comprado todos los productos)
					this.addToLog("El cliente " + this.id + " no ha sido capaz de terminar sus compras con exito.");
				} else {
					this.addToLog("El cliente " + this.id + " ha terminado sus compras con exito.");
				}
			}
			// Ha cumplido su mision
			//CAMBIOS AQUI
			var mensaje = {
				tipo_mensaje: 'finalizacion_cliente',
				id_emisor: this.id,
				ip_emisor: this.ip,
				tipo_receptor: 'monitor',
				id_receptor: 0,
				ip_receptor: this.ipMonitor,
				puerto_receptor: this.puertoMonitor,
				productos: this.listaCompra,
				tiendas: this.listaTiendas
			}
			// Envia un mensaje al monitor indicando que ha terminado
			await enviarXML(mensaje);
		}
	}

}