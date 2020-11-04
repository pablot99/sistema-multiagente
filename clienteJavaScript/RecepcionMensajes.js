/*
    Autores:
     - Carlos Morote García
     - Sara López Matilla
     - David Lorenzo Alfaro
     - Mª Elena Pretel Fernández
     - Daniel García Carretero
*/

// Procesas los mensajes llegados como respuesta
function leerXML(mensaje){
    var contenido, xml, parser;

    parser = new DOMParser();
    xml = parser.parseFromString(mensaje, "text/xml");

    // xml = mensaje.responseXML;

    /*
        Se tragará cualquier mensaje con la estructura:
         - head
           - tipo
           - idCliente
           - idTienda
           - ip
           - puerto
         - body
           - productos (no obligatorio)
           - tiendas (no obligatorio)
    */
    contenido = {
        head: {
            tipo: xml.getElementsByTagName('tipo')[0].childNodes[0].nodeValue,
            idCliente: xml.getElementsByTagName('idcliente')[0].childNodes[0].nodeValue,
            idTienda: xml.getElementsByTagName('idtienda')[0].childNodes[0].nodeValue,
            ip: xml.getElementsByTagName('IP')[0].childNodes[0].nodeValue,
            puerto: xml.getElementsByTagName('puerto')[0].childNodes[0].nodeValue
        },
        body:{
            productos: [],
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

// Procesa los productos
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

// Procesa las tiendas
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

// TODO: Esperar a como son finalmente los mensajes del Monitor
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


/*
    Ejemplo del return tras procesar el mensaje
    repuesta = {
        head:{
            tipo: 'entrada_tienda',
            idCliente: 3,
            idTienda: 10,
            ip: '198.161.1.1',
            puerto: '80'
        },
        body:{
            productos: [
                {id: 5, cantidad: 45},
                {id: 13, cantidad: 100}
            ],
            tiendas: []
        }
    }
*/