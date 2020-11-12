var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var tiendaService  = require('./tiendaService').TiendaService;
var productoClienteService  = require('./productoClienteService').ProductoClienteService;
var utils = require('../../utils').utils;

var ClienteService = {}
//Creación del esquema y el modelo
const clienteSchema = new mongoose.Schema({
    ipAddress: String,
    tiendas: [Number],
    tiendaActual: Number
});
clienteSchema.plugin(autoIncrement.plugin, 'Cliente');
const Cliente = mongoose.model('Cliente', clienteSchema);
ClienteService.model = Cliente;
ClienteService.schema = clienteSchema;



Cliente.deleteMany({}, function (err) {
    console.log('Collection Cliente removed');
});


ClienteService.createCliente = async function (req, numeroProductosCliente) {
    var cliente = {};
    var ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || "1.1.1.1";
    if (ip) {
        ip = ip.replace(new RegExp("::.*:"), "")
        ip = ip === "::1" ? "127.0.0.1" : ip;
    }

    var tiendas= [] ;
    await tiendaService.getAll().then((data) => {
        utils.shuffle(data);
        tiendas = data.length >1 ? data.slice(0,2): data;
    });
    cliente["ipAddress"] = ip;
    cliente["tienda_actual"] = null;
    cliente["tiendas"] = tiendas;
    var cliente = new ClienteService.model(cliente);
    await cliente.save();
    var productos = [];
    //Asignamos producto al cliente
    await productoClienteService.asignarProductos(cliente,numeroProductosCliente).then((data)=>{
        productos = data;
    })

    // console.log({ cliente:cliente, productos: productos, tiendas:tiendas })
    return { cliente:cliente, productos: productos, tiendas:tiendas};

}


exports.ClienteService = ClienteService;