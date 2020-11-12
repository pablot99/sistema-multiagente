var express = require('express');
var router = express.Router();
var path = require('path');
var mensajeService = require('../Database/Service/mensajeService').MensajeService;
var tiendaService = require('../Database/Service/tiendaService').TiendaService;
var clienteService = require('../Database/Service/clienteService').ClienteService;
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
    var data = [
        {
            "ID": "1",
            "Nombre": "clienteX",
            "Tienda": "tienda3",
            "Entrada": "01:20:04",
            "Salida": "01:26:03"
        },
        {
            "ID": "1",
            "Nombre": "clienteX",
            "Tienda": "tienda3",
            "Entrada": "01:20:04",
            "Salida": "01:26:03"
        },
        {
            "ID": "1",
            "Nombre": "clienteX",
            "Tienda": "tienda3",
            "Entrada": "01:20:04",
            "Salida": "01:26:03"
        },
        {
            "ID": "1",
            "Nombre": "clienteX",
            "Tienda": "tienda3",
            "Entrada": "01:20:04",
            "Salida": "01:26:03"
        },
        {
            "ID": "1",
            "Nombre": "clienteX",
            "Tienda": "tienda3",
            "Entrada": "01:20:04",
            "Salida": "01:26:03"
        },
        {
            "ID": "1",
            "Nombre": "clienteX",
            "Tienda": "tienda3",
            "Entrada": "01:20:04",
            "Salida": "01:26:03"
        },
        {
            "ID": "1",
            "Nombre": "clienteX",
            "Tienda": "tienda3",
            "Entrada": "01:20:04",
            "Salida": "01:26:03"
        }
    ]
    res.send(JSON.stringify(data));
});



router.route("/log").get((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    mensajeService.getAll().then((data) => {
        res.send(JSON.stringify(data));
    });
});

router.route('/logXML').get((req, res) => {
    mensajeService.getXML(req.query["_id"]).then((data) => {
        res.send(data);
    });
});

router.route('/start').get(async (req, res) => {
    // var cantidadProductos = colaClientes.length * colaTiendas.length * numeroProductos;
    var cantidadProductos = colaClientes.length * colaTiendas.length * numeroProductos;
    var numeroProductosTienda = Math.floor(cantidadProductos / colaTiendas.length);
    while (colaTiendas.length > 0) {
        var peticion = colaTiendas.shift();
        await tiendaService.createTienda(peticion.req, numeroProductosTienda).then((data) => {
            var xmlFile = xmlCreator.createTienda(data.tienda, data.productos);
            peticion.res.setHeader('Content-Type', 'application/xml');
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

    var numeroProductosCliente = Math.floor(cantidadProductos / colaClientes.length);
    while (colaClientes.length > 0) {
        var peticion = colaClientes.shift();
        await clienteService.createCliente(peticion.req, numeroProductosCliente).then((data) => {
            var xmlFile = xmlCreator.createCliente(data.cliente, data.productos, data.tiendas);
            peticion.res.setHeader('Content-Type', 'application/xml');
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
    res.send("ACK");
});

module.exports = router;