const autoIncrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');

const dataBaseName = "monitorDB"
const port = 27017
const urlConexion = `mongodb://localhost:${port}/${dataBaseName}`





options = {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}
mongoose.connect(urlConexion,options); //Si no existe la crea

const db = mongoose.connection;
db.dropCollection("identitycounters", function(err, result) {console.log("identitycounters droped"); }); //Reinicializa contadores
autoIncrement.initialize(db); //Para simular el autoincrement de sql
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log("Conexion BBDD funciona!");});



ProductoService = require('./Service/productoService').ProductoService;
// console.log(ProductoService)
ProductoService.crearProductos(numeroProductos);