var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var format = require('xml-formatter');



var MensajeService = {};
//Creación del esquema y el modelo
const mensajeSchema = new mongoose.Schema({
    tipo_mensaje: String,
    id_emisor : Number,
    ip_emisor : String,
    puerto_emisor : Number,
    tipo_emisor : String,
    id_receptor : Number,
    ip_receptor : String,
    puerto_receptor : Number,
    tipo_receptor : String,
    time_sent: String,
    mensaje_xml: String,
    hora_recepcion: Date
});
mensajeSchema.plugin(autoIncrement.plugin, 'Mensaje');

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

MensajeService.model = Mensaje;
MensajeService.schema = mensajeSchema;


Mensaje.deleteMany({}, function(err) { 
    console.log('Collection Mensaje removed');
 });



MensajeService.getAll = async function() {
    var logs = null;
    await MensajeService.model.find({}, 'id_emisor id_receptor tipo_mensaje _id hora_recepcion').then(function(res){
        logs = res;
    });
    return logs;
}

MensajeService.getXML = async function(id) {
    var xml = null;
    if (id) {
        await MensajeService.model.findOne({'_id': id}, 'mensaje_xml').then(function(res){
            xml = res;
        });
    }
    return xml;
}


MensajeService.guardarMensaje = function(header,xml){
    header["mensaje_xml"] = format(xml);
    header["hora_recepcion"] = new Date();
    var mensaje  = new Mensaje(header);
    mensaje.save(function(err,result){ 
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log('\x1b[36m%s\x1b[0m',`MensajeService: ${header["tipo_mensaje"]} guardado`) 
        } 
    });
}


exports.MensajeService = MensajeService;