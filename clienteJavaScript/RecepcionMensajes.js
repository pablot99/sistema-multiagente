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
           - (Y todos los campos)
         - body
           - productos (no obligatorio)
           - tiendas (no obligatorio)
    */
    // TODO: Si hay un campo vacio que pasa
    contenido = {
        head: {
            tipo_mensaje: xml.getElementsByTagName('tipo_mensaje')[0].childNodes[0].nodeValue,
            tipo_emisor: xml.getElementsByTagName('tipo_emisor')[0].childNodes[0].nodeValue,
            id_emisor: xml.getElementsByTagName('id_emisor')[0].childNodes[0].nodeValue,
            ip_emisor: xml.getElementsByTagName('ip_emisor')[0].childNodes[0].nodeValue,
            puerto_emisor: xml.getElementsByTagName('puerto_emisor')[0].childNodes[0].nodeValue,
            tipo_receptor: xml.getElementsByTagName('tipo_receptor')[0].childNodes[0].nodeValue,
            id_receptor: xml.getElementsByTagName('id_receptor')[0].childNodes[0].nodeValue,
            ip_receptor: xml.getElementsByTagName('ip_receptor')[0].childNodes[0].nodeValue,
            puerto_receptor: xml.getElementsByTagName('puerto_receptor')[0].childNodes[0].nodeValue,
            time_sent: xml.getElementsByTagName('time_sent')[0].childNodes[0].nodeValue,
            },
        body:{
            lista_productos: [],
            lista_tiendas: []
        }
    };

    // Productos
    try {
        contenido["body"]['lista_productos'] = getProductos(xml);
    } catch (error) {}
    

    // Tiendas
    try {
        contenido["body"]['lista_tiendas'] = getTiendas(xml);
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
    var tiendas = xml.getElementsByTagName('lista_tiendas')[0].childNodes;

        tiendas.forEach(
            function(valor, indice, array){
                lista.push({
                    id_tienda: valor.getElementsByTagName('id_tienda')[0].childNodes[0].nodeValue,
                    ip_tienda: valor.getElementsByTagName('ip_tienda')[0].childNodes[0].nodeValue,
                    puerto_tienda: valor.getElementsByTagName('puerto')[0].childNodes[0].nodeValue
                });
            }
        );

    return lista;
}


/*
    Ejemplo del return tras procesar el mensaje
    repuesta = {
        head:{
            tipo_mensaje: 'whatever',
            tipo_emisor: "cliente",
            id_emisor: "3",
            ip_emisor: "192.168.1.33",
            puerto_emisor: "-1",
            tipo_receptor: "tienda",
            id_receptor: "10",
            ip_receptor: "192.168.1.35",
            puerto_receptor: "8000",
            time_sent: "18:09:10",
        },
        body:{
            productos: [
                {id: "5", cantidad: "45"},
                {id: "13", cantidad: "100"}
            ],
            tiendas: [
                {id_tienda: "4", ip_tienda: "192.168.54", puerto_tienda: "8000"}
                {id_tienda: "5", ip_tienda: "192.168.12", puerto_tienda: "8000"}
            ]
        }
    }
*/
