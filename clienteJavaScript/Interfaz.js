/*Autores
    Nikola Dyulgerov
    Ramón Jesús Martínez
    Cristian Petrov */


//Lista de compradores 
var compradores = [
    {id:109, ip: "192.168.1.106", puerto: 80, ipMonitor: "192.168.1.110", puertoMonitor: 80, listaCompra: [{id_producto: 1, cantidad: 4},{id_producto: 2, cantidad: 1},{id_producto: 3, cantidad: 10}], listaTiendas: [{id_tienda: 2, ip_tienda: "192,168.1.5"}], dineroGastado: 0, tiempoConsumido: 0, log: ["El cliente " + 109 + " se ha conectado\n"]},
    {id:201, ip: "192.168.1.107", puerto: 80, ipMonitor: "192.168.1.110", puertoMonitor: 80, listaCompra: [], listaTiendas: [{id_tienda: 1, ip_tienda: "192,168.1.2"}], dineroGastado: 0, tiempoConsumido: 0, log: ["El cliente " + 201 + " se ha conectado\n"]}
];

var compradorMostrado = 0;

//Función principal para controlar eventos
$(document).ready(
    function () {
        $('#panel').hide();
        $('#enviar').click(
            //Inicializamos los clientes, escondemos el panel de inicio y se construye dinámicamente el panel de los compradores lanzados
            function (e) {
                e.preventDefault();
                var form = document.getElementById("formulario");
                form.classList.add("was-validated");
                if (form.checkValidity()) {
                    $("#monitor").hide();
                    $("#panel").show();
                    $("#log").css('height', 200 + 'px');
                    console.log("Aqui");
                    crearCompradores();
                }
            }
        );
        console.log("Lista compra", $("#comprador1 .card-body#listaCompra").html());
        $('#refresca').click(
            function(e){
                e.preventDefault();
                compradores[0].listaCompra.push({id_producto: 9, cantidad: "99"});
                compradores[0].listaTiendas.push({id_tienda: 10, ip_tienda: "123.456.789"});
                compradores[0].dineroGastado += 2;
                compradores[0].tiempoConsumido += 1;
                compradores[0].log.push("Añadido un nuevo elemento \n");
                requestUpdate(compradores[0].id);
            }
        );
    }
    
)

// Crea los compradores al pulsar el botón de enviar 
function crearCompradores() {

    //Recogemos los valores de los campos
    const ipComprador = $('#ipComprador').val();
    const ipMonitor = $('#ipMonitor').val();
    const numCompradores = $('#numCompradores').val();

    //Establecemos los puertos por defecto 
    const puerto = 80;

    //Creamos la lista de compradores
    // for (let i = 0; i < numCompradores; i++) {
    //     const comprador = new Comprador(ipComprador, puerto, ipMonitor, puerto, []);
    //     comprador.push(comprador);
    //     //comprador.run();
    // }
    if (numCompradores - 2 > 0){
        auxid = 3
        for (let i = 0; i < numCompradores - 2; i++){
            compradores.push({id:auxid + i, ip: "192.168.1."+ (111+i), puerto: 80, ipMonitor: "192.168.1.110", puertoMonitor: 80, listaCompra: [{id_producto: 3, cantidad: 3}], listaTiendas: [{id_tienda: 1, ip_tienda: "192,168.1.2"}], dineroGastado: 0, tiempoConsumido: 0, log: ["El cliente " + (auxid + i) + " se ha conectado\n"]})
        }
    }
    //Creamos la tabla de compradores
    crearTabCompradores();
}

function crearTabCompradores() {
    compradores.forEach(
        function (c, i) {

            //Primero recogemos el contenido
            var contenido = $('#TabContenido');

            //Como queremos mostrar la información del primer comprador por defecto, distinguimos la primera iteración de las demas. La estructura es la misma, tan solo cambian algunos atributos
            //En los dos casos añadimos primeramente un tab para el cliente y después creamos el panel al que añadir la información a desplegar de este
            if( i == 0){
                $('#TabCompradores').append('<li class="nav-item"><a class="nav-link active" id="comprador' + c.id + '-tab" onclick="selectComprador('+i+')" data-toggle="tab" role="tab"  aria-selected="true">C '+ (i+1) + '</a></li>');
            } else {
                $('#TabCompradores').append('<li class="nav-item"><a class="nav-link" id="comprador' + c.id + '-tab" onclick="selectComprador('+i+')"  data-toggle="tab" role="tab"  aria-selected="true">C '+ (i+1) + '</a></li>');
            }
        }
    );
    selectComprador(0)
}

// funcion que te genera una tabla con los elementos de una lista
function creaTabla(lista){
    if (lista.length == 0){
        return "No hay elementos"
    }
    else{
        var tabla = '<table class="table table-striped" style="table-layout: fixed;"><thead class="thead-dark"><tr>'
        elementos = Object.keys(lista[0])
        for (var i = 0; i < elementos.length; i++){
            tabla += '<th scope="col">'+ elementos[i]+'</th>'
        }
        tabla += '</tr></thead><tbody>'
        for (var i = 0; i < lista.length; i++){
            tabla += '<tr>'
            elementos.forEach(function (item) {
                tabla += '<td>' + lista[i][item] +'</td>'
            });
            tabla += '</tr>'
        }
        tabla += '</tbody></table>'
        return tabla
    }

}

// Función que cambia el contenido al comprador seleccionado
function selectComprador(index){
    compradorMostrado = index;
    requestUpdate(compradores[index].id)
}

// Tiene que ser llamada por los compradores cada vez que realicen una accion
function requestUpdate(id) {
    if (posId(id) == compradorMostrado){
        $("#idComprador").html("#"+compradores[compradorMostrado].id)
        $("#listaCompra").html(creaTabla(compradores[compradorMostrado].listaCompra));
        $("#listaTiendas").html(creaTabla(compradores[compradorMostrado].listaTiendas));
        $("#dineroGastado").html(compradores[compradorMostrado].dineroGastado);
        $("#tiempoConsumido").html(compradores[compradorMostrado].tiempoConsumido);
        $("#log").html(compradores[compradorMostrado].log.slice().reverse());
        console.log(compradores[compradorMostrado].log[0])
        $("#log").css('height', 15 + 'px');
        var scroll_height = $("#log").get(0).scrollHeight;
	    $("#log").css('height', scroll_height + 'px');
    }
}

// Función que devuelve en indice del comprador
function posId(id){
    return compradores.findIndex((c) => c.id === id)
}