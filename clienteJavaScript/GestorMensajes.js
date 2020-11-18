/*
    Autores:
     - Carlos Morote García
     - Sara López Matilla
     - David Lorenzo Alfaro
     - Mª Elena Pretel Fernández
     - Daniel García Carretero
*/

class MessageManager {
    constructor(ip_monitor, puerto_monitor, ip_emisor, log) {

        this.ip_monitor = ip_monitor;
        this.puerto_monitor = puerto_monitor;
        this.ip_emisor = ip_emisor;
        this.id_emisor = -1;
        this.interfaceCrearCliente = 'crearCliente=1';
        this.interfaceDuplicados = 'nolose:(';
        this.interfaceFinalizacion = 'nolose:(';

        this.tipo_emisor = 'comprador';
        this.puerto_emisor = -1;

        this.urlMonitor = 'http://' + this.ip_monitor + ':' + this.puerto_monitor;
        this.urlMonitorDuplicados = this.urlMonitor + '?' + this.interfaceDuplicados;
        this.urlMonitorCrearCliente = this.urlMonitor + "?" + this.interfaceCrearCliente;

        this.log = log;
    }

    //Funcion JQuery ajax para mandar mensajes y recibir respuesta
    enviarXML(infoMensaje) {
        var respuesta = -1, thisClass=this;
        var mensaje = this._crearMensaje(infoMensaje);

        // console.log(mensaje);

        $.ajax({
            url: 'http://' + infoMensaje.ip_receptor + ":" + infoMensaje.puerto_receptor,
            data: mensaje,
            type: 'POST',
            async: false,
            // dataType: 'text',
            // contentType: 'text/xml',

            beforeSend: function () {
                if (infoMensaje.tipo_receptor != 'monitor') {
                    $.post(
                        thisClass.urlMonitorDuplicados,
                        mensaje
                    )
                }
                //TODO: Actualizar html
                // console.log("Envio mensaje a: "+infoMensaje.ip_receptor);
                // console.log(mensaje)
            },

            // Recepcion del mensaje
            success: function (response) {
                console.log("Mensaje recibido de: " + infoMensaje.ip_receptor);
                console.log(response)
                respuesta = thisClass.leerXML(response);
                console.log("Mensaje recibido de " + infoMensaje.ip_receptor + " procesado");
            },

            // En caso de error
            error: function (response) {
                console.log("Error enviando a " + infoMensaje.ip_receptor + ": " + response);
                //TODO: Actualizar html con error
            }
        });

        return respuesta;
    }

    // Procesas los mensajes llegados como respuesta
    leerXML(xml) {
        var contenido, parser;
        // TODO: Si hay un campo vacio que pasa --> Return -1 (Se debe validar el mensaje eso. Eso garantiza que no haya vacios)
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
            body: {
                lista_productos: [],
                lista_tiendas: []
            }
        };

        // Productos
        try {
            contenido["body"]['lista_productos'] = this._getProductos(xml);
        } catch (error) { }


        // Tiendas
        try {
            contenido["body"]['lista_tiendas'] = this._getTiendas(xml);
        } catch (error) { }


        return contenido;
    }

    get_Monitor() {
        // https://www.w3schools.com/jquery/ajax_get.asp

        var respuesta = -1, thisClass = this;

        $.ajax({
            url: this.urlMonitorCrearCliente,
            type: "GET",
            async: false,
            datatype: "text",
            contentType:"text",

            beforeSend: function(){
                console.log("Intentando obtener datos de: " + thisClass.urlMonitorCrearCliente);
            },

            success: function (data) {
                console.log("Conexion realizada con el Monitor");
                console.log(data);
                respuesta = thisClass.leerXML(data);
                this.id_emisor = respuesta.body.id_receptor;
            },

            error: function (response) {
                console.log("No se pudo conectar con el Monitor");
            }
        });

        // var parser, xml, respuesta;

        // parser = new DOMParser();
        // xml = parser.parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?><root xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"><head><tipo_mensaje>reg_cliente</tipo_mensaje><tipo_emisor>monitor</tipo_emisor><id_emisor>-1</id_emisor><ip_emisor>192.168.1.4</ip_emisor><puerto_emisor>1234</puerto_emisor><tipo_receptor>comprador</tipo_receptor><id_receptor>3</id_receptor><ip_receptor>192.168.1.4</ip_receptor><puerto_receptor>-1</puerto_receptor><time_sent>00:00:00</time_sent></head><body xsi:type=\"reg_cliente\"><lista_productos><producto><id_producto>1</id_producto><cantidad>3</cantidad></producto><producto><id_producto>3</id_producto><cantidad>5</cantidad></producto><producto><id_producto>7</id_producto><cantidad>100</cantidad></producto></lista_productos><lista_tiendas><tienda><id_tienda>10</id_tienda><ip_tienda>192.168.1.5</ip_tienda><puerto>8000</puerto></tienda><tienda><id_tienda>11</id_tienda><ip_tienda>192.168.1.10</ip_tienda><puerto>8000</puerto></tienda></lista_tiendas></body></root>", "text/xml");
        
        // respuesta = this.leerXML(xml);

        return respuesta;
    }

    // Genera el mensaje XML completo
    _crearMensaje(infoMensaje) {

        //TODO: Cambiar modelo de mensaje cuando se tenga el completo
        var mensaje = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation=\"../esquemas/TodosMensajes.xsd\">' +
            this._escribirCabecera(infoMensaje) +
            this._escribirCuerpo(infoMensaje) +
            "</root>";

        return mensaje;
    }

    // Genera la cabezara de un mensaje XML para enviar
    _escribirCabecera(infoMensaje) {
        return "<head>" +
            "<tipo_mensaje>" +
            infoMensaje.tipo_mensaje +
            "</tipo_mensaje>" +

            "<tipo_emisor>" +
            this.tipo_emisor +
            "</tipo_emisor>" +
            "<id_emisor>" +
            this.id_emisor +
            "</id_emisor>" +
            "<ip_emisor>" +
            this.ip_emisor +
            "</ip_emisor>" +
            "<puerto_emisor>" +
            this.puerto_emisor +
            "</puerto_emisor>" +

            "<tipo_receptor>" +
            infoMensaje.tipo_receptor +
            "</tipo_receptor>" +
            "<id_receptor>" +
            infoMensaje.id_receptor +
            "</id_receptor>" +
            "<ip_receptor>" +
            infoMensaje.ip_receptor +
            "</ip_receptor>" +
            "<puerto_receptor>" +
            infoMensaje.puerto_receptor +
            "</puerto_receptor>" +

            "<time_sent>" +
            this._getTime() +
            "</time_sent>" +
            "</head>";
    }

    // Genera el cuerpo del mensaje XML en funcion del tipo
    _escribirCuerpo(infoMensaje) {
        var mensaje = "<body xsi:type=\"" + infoMensaje.tipo_mensaje + "\">";

        switch (infoMensaje.tipo_mensaje) {
            case 'entrada_tienda':
                mensaje += this._escribir_productos(infoMensaje);
                break;

            case 'solicitar_tiendas':
                mensaje += this._escribir_tiendas(infoMensaje);
                break;

            case 'finalizacion_cliente':
                mensaje += this._escribir_productos(infoMensaje);
                break;

            case 'salida_tienda':
                break;

            default:
                console.log('Error: ' + infoMensaje.tipo_mensaje);
                break;
        }

        return mensaje + "</body>";
    }

    //Obtiene la hora actual (LUNA)
    _getTime() {
        var date = new Date();
        var hours = this._addZero(date.getHours());
        var minutes = this._addZero(date.getMinutes());
        var seconds = this._addZero(date.getSeconds());

        var time = hours + ":" + minutes + ":" + seconds;
        return time;
    }

    //Funcion para añadir ceros a la izquierda en caso necesario para la fecha y la hora (LUNA)
    _addZero(i) {
        if (i < 10) {
            i = '0' + i;
        }
        return i;
    }

    // Genera cuerpo para el mensaje de entrar a tiendas
    _escribir_productos(infoMensaje) {
        var mensajes = "<lista_productos>";
        for (let i = 0; i < infoMensaje.productos.length; i++) {
            mensajes += "<producto>" +
                "<id_producto>" +
                infoMensaje.productos[i].id_producto +
                "</id_producto>" +
                "<cantidad>" +
                infoMensaje.productos[i].cantidad +
                "</cantidad>" +
                "</producto>";
        }
        return mensajes += "</lista_productos>";

    }

    // Genera cuerpo para el mensaje para pedir tiendas TODO
    _escribir_tiendas(infoMensaje) {
        var mensajes = "<lista_tiendas>";
        for (let i = 0; i < infoMensaje.tiendas.length; i++) {
            mensajes += "<tienda>" +
                "<id_tienda>" +
                infoMensaje.tiendas[i].id_tienda +
                "</id_tienda>" +
                "<ip_tienda>" +
                infoMensaje.tiendas[i].ip_tienda +
                "</ip_tienda>" +
                "<puerto>" +
                infoMensaje.tiendas[i].puerto_tienda +
                "</puerto>" +
                "</tienda>";
        }
        return mensajes += "</lista_tiendas>";
    }

    // Procesa los productos
    _getProductos(xml) {
        var lista = [];
        var productos = xml.getElementsByTagName('lista_productos')[0].childNodes;

        productos.forEach(
            function (valor) {
                lista.push({
                    id_producto: valor.getElementsByTagName('id_producto')[0].childNodes[0].nodeValue,
                    cantidad: valor.getElementsByTagName('cantidad')[0].childNodes[0].nodeValue
                });
            }
        );
        return lista;
    }

    // Procesa las tiendas
    _getTiendas(xml) {
        var lista = [];
        var tiendas = xml.getElementsByTagName('lista_tiendas')[0].childNodes;

        tiendas.forEach(
            function (valor) {
                lista.push({
                    id_tienda: valor.getElementsByTagName('id_tienda')[0].childNodes[0].nodeValue,
                    ip_tienda: valor.getElementsByTagName('ip_tienda')[0].childNodes[0].nodeValue,
                    puerto_tienda: valor.getElementsByTagName('puerto')[0].childNodes[0].nodeValue
                });
            }
        );

        return lista;
    }

}

/* ONLY FOR TESTING PURPOSES. 

**** PARA EL ENVÍO ****

gestor = new MessageManager('192.168.1.35', '8000', '192.168.1.33', '3');

var infoM = {
    tipo_mensaje: 'entrada_tienda',
    id_emisor: 3,
    ip_emisor: '192.168.1.4',
    tipo_receptor: 'tienda',
    id_receptor: 10,
    ip_receptor: '198.161.1.1',
    puerto_receptor: '8000',
    productos: [
        {id: 5, cantidad: 45},
        {id: 13, cantidad: 100}
    ],
    tiendas: [
        {id:4, ip: "192.168.1.3", puerto: "8000"},
        {id:4, ip: "192.168.1.3", puerto: "8000"}
    ]
}

**** PARA RECEPCIÓN ****
--> ANTES: obtener xml de infoM con _crearMensaje

parser = new DOMParser();
xml = parser.parseFromString(mensaje, "text/xml");

xml = mensaje.responseXML;


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