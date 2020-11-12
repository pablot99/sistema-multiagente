var express = require('express');
var router = express.Router();


var tiendaService = require('../Database/Service/tiendaService');
var productoTiendaService = require('../Database/Service/productoTiendaService');
var productoService = require('../Database/Service/productoService');


var o2x = require('object-to-xml');

//Controladores
async function createGet(req, res) {
    var ip = req.ip.replace(new RegExp("::.*:"), "")
    ip = ip === "::1" ? "127.0.0.1" : ip;

    var tiendaNueva = new tiendaService.Tienda({
        ipAddress: ip,
        puerto: req.query.port
    });

    await tiendaNueva.save();

    //Hacer un find y coger ids aleatorios
    var productos = [];
    await productoService.Producto.find({}, '_id').then((pt) => { productos = pt });
    for (var producto of productos) {
        let pt = new productoTiendaService.ProductoTienda({
            tienda: tiendaNueva._id,
            producto: producto._id
        });
        await pt.save()
    }

    console.log(tiendaNueva)
    res.type('application/xml');
    var xml = o2x(tiendaNueva.transform())
    res.send(xml);
}

//Mapping

router.route('/create')
    .get(createGet);
module.exports = router;