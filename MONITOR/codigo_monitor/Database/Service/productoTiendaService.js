var mongoose = require('mongoose');
var productoService = require('./productoService').ProductoService;
var utils = require('../../utils').utils;

var ProductoTiendaService = {};
const productoTiendaSchema = new mongoose.Schema({
    producto: { type: Number, ref: "Producto" },
    tienda: { type: Number, ref: "Tienda" },
    cantidad: Number
});

const ProductoTienda = mongoose.model('ProductoTienda', productoTiendaSchema);

ProductoTiendaService.model = ProductoTienda;
ProductoTiendaService.schema = productoTiendaSchema;


ProductoTienda.deleteMany({}, function (err) {
    console.log('Collection ProductoTienda removed');
});

ProductoTiendaService.asignarProductos = async function (idTienda, numeroProductosTienda) {
    var listaProductos = [];
    await productoService.model.find({}).then(async (productos) => {
        var cantidades = []
        while (numeroProductosTienda > 0) {
            var cantidad = utils.getRandomInt(1, numeroProductosTienda);
            cantidades.push(cantidad);
            numeroProductosTienda -= cantidad;
        }
        utils.shuffle(productos)
        var productoTienda;
        for (let i = 0; i < cantidades.length; i++) {
            productos[i].disponibles += cantidades[i];
            productoService.model.updateOne({ _id: productos[i]._id }, productos[i]);
            productoTienda = {
                producto: productos[i]._id,
                tienda: idTienda,
                cantidad: cantidades[i]
            };
            listaProductos.push(productoTienda);
            productos[i].disponibles+= cantidades[i];
            await productoService.saveProduct(productos[i]);
            (new ProductoTiendaService.model(productoTienda)).save();
        }
    });

    return listaProductos;
}

exports.ProductoTiendaService = ProductoTiendaService;