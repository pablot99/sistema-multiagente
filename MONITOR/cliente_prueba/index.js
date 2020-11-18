

var confirmacion_compra = `<?xml version="1.0" encoding="utf-8"?>
<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<head>
		<tipo_mensaje>confirmacion_compra</tipo_mensaje>

		<tipo_emisor>tienda</tipo_emisor>
		<id_emisor>1</id_emisor>
		<ip_emisor>192.168.1.4</ip_emisor>
		<puerto_emisor>1234</puerto_emisor>

		<tipo_receptor>comprador</tipo_receptor>
		<id_receptor>1</id_receptor>
		<ip_receptor>192.168.1.4</ip_receptor>
		<puerto_receptor>-1</puerto_receptor>

		<time_sent>00:00:00</time_sent>
	</head>
	<body xsi:type="confirmacion_compra">
		<lista_productos>
			<producto>
				<id_producto>1</id_producto>
				<cantidad>3</cantidad>
			</producto>
			<producto>
				<id_producto>2</id_producto>
				<cantidad>5</cantidad>
			</producto>
			<producto>
				<id_producto>3</id_producto>
				<cantidad>7</cantidad>
			</producto>
			<producto>
				<id_producto>4</id_producto>
				<cantidad>30</cantidad>
			</producto>
		</lista_productos>
	</body>
</root>`



var entrada_tienda = `<?xml version="1.0" encoding="utf-8"?>
<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<head>
		<tipo_mensaje>entrada_tienda</tipo_mensaje>

		<tipo_emisor>comprador</tipo_emisor>
		<id_emisor>1</id_emisor>
		<ip_emisor>192.168.1.4</ip_emisor>
		<puerto_emisor>-1</puerto_emisor>

		<tipo_receptor>tienda</tipo_receptor>
		<id_receptor>0</id_receptor>
		<ip_receptor>192.168.1.4</ip_receptor>
		<puerto_receptor>1234</puerto_receptor>

		<time_sent>00:00:00</time_sent>
	</head>
	<body xsi:type="entrada_tienda">
		<lista_productos>
			<producto>
				<id_producto>1</id_producto>
				<cantidad>3</cantidad>
			</producto>
		</lista_productos>
	</body>
</root>`


var xmlFile = entrada_tienda;
$(document).ready(function () {
    $('#creaTienda').on("click", () => {
        console.log("Creando Tienda")
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/?crearTienda=2&puerto=122&nombre=Mercadona",
            success: function (res) {
                console.log(res);
            },
            error: function (res) {
                console.log("GET CREATIENDA FALLIDO");
            }
        });
    });

    $('#creaCliente').on("click", () => {
        console.log("Creando Cliente")
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/?crearCliente=2",
            success: function (res) {
                console.log(res);
            },
            error: function (res) {
                console.log("GET CREACLIENTE FALLIDO");
            }
        });
    });
    
    $('#enviaXML').on("click", () => {
        console.log("Enviando XML");
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/",
            dataType: "xml",
            contentType: "application/xml",
            data: xmlFile,
            success: function (res) {
                console.log("XML creación Tienda enviado!");
            },
            error: function (res) {
                console.log("XML creación Tienda error!");
            }
        });
    });
});
