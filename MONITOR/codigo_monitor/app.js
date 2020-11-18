
var express = require('express');
var app = express();
var path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser');
const { exit } = require('process');
var timeout = require('connect-timeout');

app.use(timeout('1000s'));
Monitor = {
    arrancado: false,
    hora_inicio: null,
    numero_clientes: 0,
    numero_tiendas: 0,
    numero_clientes_finalizados: 0,
    numero_tiendas_finalizadas: 0,
    productos_totales_tiendas: 0,   //Stock en tienda
    productos_totales_clientes: 0,  //productos que tienen que comprar
    productos_comprados: 0,
    colaTiendas: [],
    colaClientes: [],
    puerto: 3000
}

Monitor.ip = process.argv[2];
numeroProductos = 256;
//Database initialization
require("./Database/monitorDB");
const parser = require('./parser').Parser;

if (!Monitor.ip) {
    exit(1);
}

//Habilitar body y cors
app.use(bodyParser.text({ type: '*/*' }));
app.use(cors());


//Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Database initialization

//Route initialisation
require("./routes/routes")(app);


app.get(/.*/, (req, res) => {
    if (req.query["crearTienda"]) {
        req.setTimeout(1000*60*5);
        //Comprobar que estén todos los parámetros bien
        console.log("createtienda")
        Monitor.colaTiendas.push({ req: req, res: res });
    } else if (req.query["crearCliente"]) {
        req.setTimeout(1000*60*5);
        console.log("createcliente")
        Monitor.colaClientes.push({ req: req, res: res });
    }
    return
});

app.set('x-powered-by', false);
app.post(/.*/, (req, res) => {
    if (req.body) {
        var rawXML = req.body;
        try {
            Parser.validarMensaje(rawXML, (error, result) => {
                if (result && result.valid) {
                    var resultado = parser.parseaMensaje(rawXML);
                    res.send(resultado);
                } else {
                    console.log("Mensaje no válido: ",error)
                }
            });
        } catch (err){
            console.log("Error validarMensaje")


}
    }

});



// Listen to port 3000
app.listen(Monitor.puerto, function () {
    console.log('Monitor en puerto 3000!');
});