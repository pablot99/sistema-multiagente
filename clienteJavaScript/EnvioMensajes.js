// Genera la cabezara de un mensaje XML para enviar
function escribirCabecera(infoMensaje){
    
    return  "<head>" + 
                "<tipo>" +
                    infoMensaje.tipo +
                "</tipo>" +
                "<idcliente>" +
                    infoMensaje.idCliente + 
                "</idcliente>" +
                "<idtienda>" + 
                    infoMensaje.idTienda +
                "</idtienda>" +
                "<time>" +
                    getTime() +
                "</time>" +
                "<IP>" +
                    infoMensaje.ip + 
                "</IP>" +
                "<puerto>" +
                    infoMensaje.puerto +
                "</puerto>" +
            "</head>";

}

// Genera el cuerpo del mensaje XML a mandar
function escribirCuerpo(infoMensaje){

    var mensaje = "<body>";

    switch (infoMensaje.tipo){
        case 'entrada_tienda':
            mensaje += entrada_tienda(infoMensaje);
            break;

        case 'Pide_Tiendas':
            mensaje += pedir_tiendas(infoMensaje);
            break;

        default:
            alert('Error: ' + infoMensaje.tipo);
            break;
    }

    return mensaje + "</body>";
}

// Genera el mensaje XML completo
function crearMensaje(infoMensaje){

    mensaje="<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + 
            '<?xml-model href="'+infoMensaje.tipo+'.xsd" type="application/xml" schematypens="http://www.w3.org/2001/XMLSchema"?>' +
            // '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation='+infoMensaje.tipo+'.xsd">' +
            "<root>" +
                escribirCabecera(infoMensaje)+
                escribirCuerpo(infoMensaje)+
            "</root>";

    return mensaje
    // parser = new DOMParser();
    // return parser.parseFromString(mensaje,"text/xml");
}

//Obtiene la hora actual (LUNA)
function getTime(){
    var date = new Date();
    var hours = addZero(date.getHours());
    var minutes = addZero(date.getMinutes());
    var seconds = addZero(date.getSeconds());

    var time = hours + ":" + minutes + ":" + seconds;
    return time;
}

//Funcion para añadir ceros a la izquierda en caso necesario para la fecha y la hora (LUNA)
function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

function entrada_tienda(infoMensaje){
    var mensajes = "<lista_productos>";
    for(let i=0; i<infoMensaje.productos.length; i++){
        mensajes += "<producto>" +
                        "<id_producto>" +
                            infoMensaje.productos[i].id +
                        "</id_producto>"+
                        "<cantidad>"+
                            infoMensaje.productos[i].cantidad +
                        "</cantidad>"+
                    "</producto>";
    }
    return mensajes +="</lista_productos>";
    
}

function pedir_tiendas(infoMensaje){

}


//Funcion JQuery ajax para mandar mensajes
function enviarXML(direccion, mensaje, asincrono){
    var respuesta;

    $.ajax({
        url: 'http://' + direccion.replace("http://", "").replace(/\/\//g,"/"),
        data: mensaje,
        type: 'POST',
        async: asincrono,
        dataType: 'text',
        contentType: 'text/xml',

        beforeSend: function(request){
            //TODO: Actualizar html
            console.log("Envio mensaje a: "+direccion);
        },

        success: function(response){
            console.log("Mensaje recibido de: "+direccion);
            respuesta = leerXML(response);
            console.log("Mensaje recibido de "+direccion+" procesado");
        },

        error: function(response){
            console.log("Error enviando a "+ direccion +": "+response);
            //TODO: Actualizar html con error
        }
    });
}


// var infoM = {
//     tipo: 'entrada_tienda',
//     idCliente: 3,
//     idTienda: 10,
//     ip: '198.161.1.1',
//     puerto: '80',
//     productos: [
//         {id: 5, cantidad: 45},
//         {id: 13, cantidad: 100}
//     ]
// }