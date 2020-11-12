const { DOMParser } = require('xmldom');
const stringToDOM = new DOMParser();
var mensajeService = require('./Database/Service/mensajeService').MensajeService;
const validator = require('xsd-schema-validator');
var path = require('path');

Parser = {}


Parser.validarMensaje = async function (rawXML,callback) {
    // console.log("aqui")
    validator.validateXML(rawXML, path.join(__dirname, "schema.xsd"), callback);
}

//Suponemos que ya está validado
Parser.parseaMensaje = function (rawXML) {
    var xmlDoc = stringToDOM.parseFromString(rawXML, "text/xml");
    var header = Parser.parseaHeader(xmlDoc);
    mensajeService.guardarMensaje(header, rawXML);



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

exports.Parser = Parser