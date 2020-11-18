var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var TiendaService = {};
var productoTiendaService = require('./productoTiendaService').ProductoTiendaService;
const tiendaSchema = new mongoose.Schema({
    ipAddress: String,
    puerto: Number,
    nombre: String
});

tiendaSchema.plugin(autoIncrement.plugin, 'Tienda');

const Tienda = mongoose.model('Tienda', tiendaSchema);

TiendaService.model = Tienda;
TiendaService.schema = tiendaSchema;


Tienda.deleteMany({}, function (err) {
    console.log('Collection Tienda removed');
});

TiendaService.createTienda = async function (req, numeroProductosTienda) {
    var ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || "1.1.1.1";
    if (ip) {
        ip = ip.replace(new RegExp("::.*:"), "")
        ip = ip === "::1" ? "127.0.0.1" : ip;
    }
    var tienda = new TiendaService.model({ ipAddress: ip, puerto: req.query.puerto, nombre: req.query.nombre });
    var productos = null;
    await tienda.save().then(async (tienda) => {
        await productoTiendaService.asignarProductos(tienda._id, numeroProductosTienda).then((data) => {
            productos = data;
        });
    });
    return { tienda: tienda, productos: productos };
}

TiendaService.getNombreById = async function (id_tienda) {
    var nombreTienda = null;
    await TiendaService.model.findOne({ '_id': id_tienda }).then((tienda) => {
        if (tienda) {
            nombreTienda = tienda.nombre;
        }
    });
    return nombreTienda;
}
TiendaService.getAll = async function () {
    var tiendas = [];
    await TiendaService.model.find({}).then((data) => {
        tiendas = data;
    });
    return tiendas;
}
exports.TiendaService = TiendaService;
