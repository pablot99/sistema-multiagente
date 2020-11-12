
//Routes imports

var tiendaControlador = require('./tienda.js');
var interfazControlador = require('./interfaz.js');




//RouteMapping
function initialiseRoutes(app){
    app.use('/tienda',tiendaControlador);
    app.use('/interfaz',interfazControlador);
    
}

module.exports = initialiseRoutes;