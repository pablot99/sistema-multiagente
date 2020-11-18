var express = require('express');
const { Model } = require('mongoose');
var router = express.Router();
var path = require('path');
var mensajeService = require('../Database/Service/mensajeService').MensajeService;
var tiendaService = require('../Database/Service/tiendaService').TiendaService;
var clienteService = require('../Database/Service/clienteService').ClienteService;
var llegadasService = require('../Database/Service/llegadasService').LlegadasService;
var xmlCreator = require('../xmlCreator').xmlCreator;
const parser = require('../parser').Parser;


//Controladores

//Mapping


router.route("/").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/index.html'));
});
router.route("/getNav").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/nav.html'));
});

//Apartado Cliente
router.route("/listaClientes").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Cliente/lista_clientes.html'));
});
router.route("/tiendasConocidas").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Cliente/lista_conocidas.html'));
});
router.route("/tiendasVisitadas").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Cliente/lista_visitadas.html'));
});
router.route("/ubicacionClientes").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Cliente/ubicaciones_actuales.html'));
});
router.route("/comunicacionClientes").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Cliente/comunicacion_clientes.html'));
});


//Apartado Tienda
router.route("/listaTiendas").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Tienda/listado.html'));
});
router.route("/salidasDeTienda").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Tienda/salidas.html'));
});
router.route("/llegadasATienda").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Tienda/llegadas.html'));
});
router.route("/comprasRealizadas").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Tienda/compras_realizadas.html'));
});


// Apartado Producto
router.route("/crearProducto").get((req, res) => {

    // RESTRINGIR ACCESO SI NO ES LOCALHOST

    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Productos/crea_producto.html'));
});
router.route("/listaProductos").get((req, res) => {
    res.type("text/html");
    res.sendFile(path.join(__dirname, '../views/Productos/lista_productos.html'));
});


router.route("/pruebaJson").get((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify(data));
});



router.route("/log").get((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    mensajeService.getAll().then((data) => {
        res.send(data);
    });
});

router.route('/datosMonitor').get((req, res) => {
    res.send({
        arrancado: Monitor.arrancado,
        hora_inicio: Monitor.hora_inicio,
        numero_clientes: Monitor.numero_clientes,
        numero_tiendas: Monitor.numero_tiendas,
        numero_clientes_finalizados: Monitor.numero_clientes_finalizados,
        numero_tiendas_finalizadas: Monitor.numero_tiendas_finalizadas,
        productos_totales_tiendas: Monitor.productos_totales_tiendas,   //Stock en tienda
        productos_totales_clientes: Monitor.productos_totales_clientes,  //productos que tienen que comprar
        productos_comprados: Monitor.productos_comprados,
        colaTiendas: Monitor.colaTiendas.length,
        colaClientes: Monitor.colaClientes.length,
        puerto: Monitor.puerto,
        ip: Monitor.ip
    });
});

router.route('/logXML').get((req, res) => {
    mensajeService.getXML(req.query["_id"]).then((data) => {
        res.send(data);
    });
});


router.route('/llegadas').get((req, res) => {
    llegadasService.getAll().then((data) => {
        res.send(data);
    });
});

router.route('/start').get(async (req, res) => {
    // var cantidadProductos = Monitor.colaClientes.length * Monitor.colaTiendas.length * numeroProductos;
    if (!Monitor.arrancado) {
        if (Monitor.colaClientes.length > 0 && Monitor.colaTiendas.length > 0) {
            var cantidadProductos = Monitor.colaClientes.length * Monitor.colaTiendas.length * numeroProductos;
            var numeroProductosTienda = Math.floor(cantidadProductos / Monitor.colaTiendas.length);
            while (Monitor.colaTiendas.length > 0) {
                var peticion = Monitor.colaTiendas.shift();
                Monitor.numero_tiendas++;
                Monitor.productos_totales_tiendas += numeroProductosTienda;
                await tiendaService.createTienda(peticion.req, numeroProductosTienda).then((data) => {
                    var xmlFile = xmlCreator.createTienda(data.tienda, data.productos);
                    // peticion.res.setHeader('Content-Type', 'application/xml');
                    peticion.res.send(xmlFile);
                    parser.validarMensaje(xmlFile, (err, result) => {
                        if (err) {
                            console.log("XML No Válido ", err.message)
                        }
                        if (result.valid) {
                            parser.parseaMensaje(xmlFile);
                        }
                    });
                });
            }

            var numeroProductosCliente = Math.floor(cantidadProductos / Monitor.colaClientes.length);
            while (Monitor.colaClientes.length > 0) {
                var peticion = Monitor.colaClientes.shift();
                await clienteService.createCliente(peticion.req, numeroProductosCliente).then((data) => {
                    Monitor.numero_clientes++;
                    Monitor.productos_totales_clientes += numeroProductosCliente;
                    var xmlFile = xmlCreator.createCliente(data.cliente, data.productos, data.tiendas);
                    // peticion.res.setHeader('Content-Type', 'application/xml');
                    peticion.res.send(xmlFile);
                    parser.validarMensaje(xmlFile, (err, result) => {
                        if (err) {
                            console.log("XML No Válido ", err.message)
                        }
                        if (result.valid) {
                            parser.parseaMensaje(xmlFile);
                        }
                    });
                });
            }

            // Monitor.arrancado = true;
            Monitor.hora_inicio = new Date().getTime().toString();
        }
    }

    res.status(200).send();
});

module.exports = router;