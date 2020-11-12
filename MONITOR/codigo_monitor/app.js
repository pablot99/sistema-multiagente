
var express = require('express');
var app = express();
var path = require('path');
const cors = require('cors');
var bodyParser = require('body-parser');
const { exit } = require('process');
colaTiendas = [];
colaClientes = [];
puerto = 3000;
ipMonitor = process.argv[2];
numeroProductos = 256;
//Database initialization
require("./Database/monitorDB");
const parser = require('./parser').Parser;

if(!ipMonitor){
    exit(1);
}




//Habilitar body y cors
app.use(bodyParser.text({ type: 'xml' }));
app.use(cors());


//Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Database initialization

//Route initialisation
require("./routes/routes")(app);


app.get(/.*/, (req, res) => {
    if (req.query["crearTienda"]) {
        //Comprobar que estén todos los parámetros bien
        console.log("createtienda")
        colaTiendas.push({ req: req, res: res });
    } else if (req.query["crearCliente"]) {
        console.log("createcliente")
        colaClientes.push({ req: req, res: res });
    }
});
app.set('x-powered-by', false);
app.post(/.*/, (req, res) => {
    if (req.body) {
        // console.log(req.body);
        var rawXML = req.body;
        Parser.validarMensaje(rawXML,(error,result)=>{
            if (result.valid) {
                var resultado = parser.parseaMensaje(rawXML);
                res.send(resultado);
            }else{
                console.log("Mensaje no válido")
            }
        });
    }

});



// Listen to port 3000
app.listen(puerto, function () {
    console.log('Monitor en puerto 3000!');
});