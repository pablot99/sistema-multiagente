var mongoose = require('mongoose');



var ProductoService = {}
const autoIncrement = require('mongoose-auto-increment');
const productoSchema = new mongoose.Schema({
    disponibles: Number,
    asignadosClientes: Number
});
productoSchema.plugin(autoIncrement.plugin, 'Producto');

const Producto = mongoose.model('Producto', productoSchema);


ProductoService.model = Producto;
ProductoService.schema = productoSchema;

Producto.deleteMany({}, function (err) {
    console.log('Collection Producto removed');
});


ProductoService.crearProductos = function (n) {
    var productos = [];
    for (let i = 0; i < n; i++) {
        productos.push({
            disponibles: 0,
            asignadosClientes: 0
        });
    }

    for (producto of productos) {
        (new ProductoService.model(producto)).save().then(function () {
        }).catch(function (error) {
            console.log(error)
        });
    }

}


ProductoService.saveProduct = async function(producto){
    delete producto["_id"];
    await ProductoService.model.updateOne({"_id":producto._id},producto).then((producto)=>{
        // console.log("Producto updeteado");
    });
}
exports.ProductoService = ProductoService;