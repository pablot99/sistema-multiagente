

function leerXML(mensaje){
    var contenido, xml, parser;

    parser = new DOMParser();
    xml = parser.parseFromString(mensaje, "text/xml");

    // xml = mensaje.responseXML;

    contenido = {
        head: {
            tipo: xml.getElementsByTagName('tipo')[0].childNodes[0].nodeValue,
            idCliente: xml.getElementsByTagName('idcliente')[0].childNodes[0].nodeValue,
            idTienda: xml.getElementsByTagName('idtienda')[0].childNodes[0].nodeValue,
            ip: xml.getElementsByTagName('IP')[0].childNodes[0].nodeValue,
            puerto: xml.getElementsByTagName('puerto')[0].childNodes[0].nodeValue
        },
        body:{
            productos: getProductos(xml),
            tiendas: []
        }
    };

    // Productos
    try {
        contenido["body"]['productos'] = getProductos(xml);
    } catch (error) {}
    

    // Tiendas
    try {
        contenido["body"]['tiendas'] = getTiendas(xml);
    } catch (error) {}
    

    return contenido;
}

function getProductos(xml){
    var lista = [];
    var productos = xml.getElementsByTagName('lista_productos')[0].childNodes;

    productos.forEach(
        function(valor, indice, array){
            lista.push({
                id_producto: valor.getElementsByTagName('id_producto')[0].childNodes[0].nodeValue,
                cantidad: valor.getElementsByTagName('cantidad')[0].childNodes[0].nodeValue
            });            
        }
    );

    return lista;
}

function getTiendas(xml){
    var lista = [];
    var tiendas = xml.getElementsByTagName('lista-tiendas')[0].childNodes;

        tiendas.forEach(
            function(valor, indice, array){
                lista.push({
                    id_tienda: valor.getElementsByTagName('idTienda')[0].childNodes[0].nodeValue,
                    ip_tienda: valor.getElementsByTagName('ipTienda')[0].childNodes[0].nodeValue,
                    puerto_tienda: valor.getElementsByTagName('puerto_tienda')[0].childNodes[0].nodeValue
                });
            }
        );

    return lista;
}

// TODO: Recepcion de los especialitos del Monitor
function leerMonitor(){
    var contenido, xml, parser;

    parser = new DOMParser();
    xml = parser.parseFromString(mensaje, "text/xml");

    contenido = {
        productos: getProductos(xml),
        tiendas: getTiendas(xml)
    };

    return contenido;
}