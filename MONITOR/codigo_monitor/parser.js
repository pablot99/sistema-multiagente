const { DOMParser } = require('xmldom');
const stringToDOM = new DOMParser();
var mensajeService = require('./Database/Service/mensajeService').MensajeService;
const validator = require('xsd-schema-validator');
var path = require('path');
var llegadasService= require('./Database/Service/llegadasService').LlegadasService;

Parser = {}


Parser.validarMensaje = async function (rawXML, callback) {
    // console.log("aqui")
    validator.validateXML(rawXML, path.join(__dirname, "schema.xsd"), callback);
}

//Suponemos que ya está validado
Parser.parseaMensaje = function (rawXML) {
    var xmlDoc = stringToDOM.parseFromString(rawXML, "text/xml");
    var header = Parser.parseaHeader(xmlDoc);
    mensajeService.guardarMensaje(header, rawXML);

    if (header.tipo_mensaje == "confirmacion_compra") {
        var datos = Parser.confirmacionCompra(xmlDoc);
        Monitor.productos_comprados += datos.cantidad_total;
    }
    else if (header.tipo_mensaje == "entrada_tienda"){
        id_tienda= header.id_receptor;
        id_cliente= header.id_emisor;
        hora_llegada= header.time_sent;
        llegadasService.create(id_tienda, id_cliente, hora_llegada);
    }
    else if (header.tipo_mensaje == "finalizacion_cliente"){
        Monitor.numero_clientes_finalizados +=1;
    }
    else if (header.tipo_mensaje == "finalizacion_tienda"){
        Monitor.numero_tiendas_finalizadas +=1;
    }
}


Parser.parseaHeader = function (xmlDoc) {
    var header = {};

    var headerDOM = xmlDoc.getElementsByTagName("head")[0];
    header["tipo_mensaje"] = headerDOM.getElementsByTagName("tipo_mensaje")[0].firstChild.nodeValue;
    header["ip_emisor"] = headerDOM.getElementsByTagName("ip_emisor")[0].firstChild.nodeValue;
    header["puerto_emisor"] = parseInt(headerDOM.getElementsByTagName("puerto_emisor")[0].firstChild.nodeValue);
    header["id_emisor"] = parseInt(headerDOM.getElementsByTagName("id_emisor")[0].firstChild.nodeValue);
    header["tipo_emisor"] = headerDOM.getElementsByTagName("tipo_emisor")[0].firstChild.nodeValue;

    header["ip_receptor"] = headerDOM.getElementsByTagName("ip_receptor")[0].firstChild.nodeValue;
    header["puerto_receptor"] = parseInt(headerDOM.getElementsByTagName("puerto_receptor")[0].firstChild.nodeValue);
    header["id_receptor"] = parseInt(headerDOM.getElementsByTagName("id_receptor")[0].firstChild.nodeValue);
    header["tipo_receptor"] = headerDOM.getElementsByTagName("tipo_receptor")[0].firstChild.nodeValue;

    header["time_sent"] = headerDOM.getElementsByTagName("time_sent")[0].firstChild.nodeValue;

    return header;
}


Parser.confirmacionCompra = function (xmlDoc) {
    var datos = {
        lista_productos: [],
        cantidad_total: 0
    };

    var bodyDOM = xmlDoc.getElementsByTagName("body")[0];

    var listaProductos = bodyDOM.getElementsByTagName("lista_productos")[0];
    for (var i = 0; i < listaProductos.childNodes.length; i++) {
        if (listaProductos.childNodes[i].tagName == "producto") {
            let productoDOM = listaProductos.childNodes[i];
            var producto = {
                id: 0,
                cantidad: 0
            };
            producto.id = productoDOM.getElementsByTagName("id")[0].firstChild.nodeValue;
            producto.cantidad = productoDOM.getElementsByTagName("cantidad")[0].firstChild.nodeValue;

            datos.lista_productos.push(producto);
            datos.cantidad += producto.cantidad;
        }
    }
    return datos;
}





exports.Parser = Parser