/*  Poned los grupos que modifican este archivo*/
/*  Este es un constructor que hicimos, añadid los métodos para manejar los datos y atributos que creais convenientes*/

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
}

