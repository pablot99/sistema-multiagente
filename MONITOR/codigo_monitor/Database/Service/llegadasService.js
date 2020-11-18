var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var tiendaService = require('./tiendaService').TiendaService;
var LlegadasService = {};
const llegadasSchema = new mongoose.Schema({
    id_tienda: String,
    id_cliente: String,
    nombre_tienda: String,
    hora_llegada: String
});

llegadasSchema.plugin(autoIncrement.plugin, 'Llegadas');

const Llegadas = mongoose.model('Llegadas', llegadasSchema);

LlegadasService.model = Llegadas;
LlegadasService.schema = llegadasSchema;


Llegadas.deleteMany({}, function (err) {
    console.log('Collection Llegadas removed');
});



LlegadasService.create = function (id_tienda, id_cliente, hora_llegada) {
    tiendaService.getNombreById(id_tienda).then(
        (nombre_tienda) => {
            if (nombre_tienda) {
                var llegada = new LlegadasService.model({
                    id_tienda: id_tienda,
                    id_cliente: id_cliente,
                    nombre_tienda: nombre_tienda,
                    hora_llegada: hora_llegada
                });
                llegada.save();
            }
        });
}

LlegadasService.getAll = async function () {
    var llegadas = [];
    await LlegadasService.model.find({}).then((data) => {
        llegadas = data;
    });
    return llegadas;
}
exports.LlegadasService = LlegadasService;
