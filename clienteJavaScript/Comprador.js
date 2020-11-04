class Comprador {
    constructor(ip, puerto, ipMonitor, puertoMonitor) {
      this.ip = ip;
      this.puerto = puerto;
      this.ipMonitor = ipMonitor;
      this.puertoMonitor = puertoMonitor;
  
      this.listaCompra = [];
      this.listaTiendas = [];
      this.dineroGastado = 0;
      this.tiempoConsumido = 0;
    }
    // Comprueba si el producto está incluido en la lista
	isIn(id, list){
		//Si la lista tiene algún objeto con el mismo ID que el pasado por parametro, devuelve verdadero
		for(var object of list){
			if(id == (object.getId())){
				return true;
			}
		}
		// Falso en cualquier otro caso
		return false;
    }
    
    //Quita los productos especificados en la lista de los productos por comprar
	//(reduce la cantidad restante a 0)
	reduceProducts(products){
		for(var product1 of products){
			for(var product2 of productList){
				//Si el producto está dentro de la lista de productos a comprar por ese cliente, reduce la cantidad
				if(product1.getId() == product2.getId()){
					//Busca el producto
					var item = list.find(function(element) { 
						return element.getId() == product1.getId(); 
					})
					//Reduce la cantidad que hay de ese producto a 0
					item.reduceQuantity(product1.getQuantity());
				}
			}
		}
    }

    //Encuentra al producto en la lista y reduce la cantidad especificada
	reduceProductQuantity(id, quantity){
		for(var i = 0; i < this.productList.length; i++){
            //Si encuentra el producto con la misma id en la lista de la compra del cliente le quita la cantidad especifica
			if(this.productList[i].getId() == id){
				this.productList[i].reduceQuantity(quantity);
				return;
			}
		}
	}
	
	//Comprueba si le quedan productos por comprar
	productsLeft(){
        //recorre todos los productos de la lista de la compra
		for (var product of this.productList) {
            if (product.getQuantity() != 0)
            //si hay un producto con una cantidad superior a 0 devuelve true para especificar que hay productos para comprar
				return true;
		}
		return false;		
	}

    
  }
