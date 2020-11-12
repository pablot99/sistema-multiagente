var mongoose = require('mongoose');

var productoService =require("./productoService").ProductoService;
var ProductoClienteService = {};
const ProductoClienteSchema = new mongoose.Schema({
    producto: { type: Number, ref: "Producto" },
    cliente: { type: Number, ref: "Cliente" },
    cantidad: Number,
    restantes: Number
});

const ProductoCliente = mongoose.model('ProductoCliente', ProductoClienteSchema);
ProductoClienteService.model = ProductoCliente;
ProductoClienteService.schema = ProductoClienteSchema;



ProductoCliente.deleteMany({}, function (err) {
    console.log('Collection ProductoCliente removed');
});

ProductoClienteService.asignarProductos = async function (cliente, numeroProductosCliente) {

    var listaProductos = [];
    await productoService.model.find({"disponibles":{$gt:0}}).then(async (productos) => {
        for (producto of productos) {
            if (numeroProductosCliente == 0) {
                break;
            }
            var productoCliente = {};
            var cantidad = numeroProductosCliente > (producto.disponibles - producto.asignadosClientes) ? numeroProductosCliente : producto.disponibles - producto.asignadosClientes;
            productoCliente["cliente"] = cliente._id;
            productoCliente["producto"] = producto._id;
            productoCliente["cantidad"] = cantidad;
            productoCliente["restantes"] = cantidad;
            producto.asignadosClientes += productoCliente["cantidad"];
            numeroProductosCliente -= cantidad;
            await productoService.saveProduct(producto);
            (new ProductoClienteService.model(productoCliente)).save();
            listaProductos.push(productoCliente);

        }
    });

    return listaProductos;
}

exports.ProductoClienteService = ProductoClienteService;