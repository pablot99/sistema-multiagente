xmlCreator = {}

xmlCreator.createTienda = function (tienda, productos) {
    var time = new Date();
    var hour = time.getHours().toString().padStart(2, 0);
    var minutes = time.getMinutes().toString().padStart(2, 0);
    var seconds = time.getSeconds().toString().padStart(2, 0);
    var xml = `<?xml version="1.0" encoding="utf-8"?>
    <root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <head>
            <tipo_mensaje>reg_tienda</tipo_mensaje>
    
            <tipo_emisor>monitor</tipo_emisor>
            <id_emisor>-1</id_emisor>
            <ip_emisor>${Monitor.ip}</ip_emisor>
            <puerto_emisor>${Monitor.puerto}</puerto_emisor>
    
            <tipo_receptor>tienda</tipo_receptor>
            <id_receptor>${tienda._id}</id_receptor>
            <ip_receptor>${tienda.ipAddress}</ip_receptor>
            <puerto_receptor>${tienda.puerto}</puerto_receptor>
    
            <time_sent>${hour}:${minutes}:${seconds}</time_sent>
        </head>
        <body xsi:type="reg_tienda">
            <nombre_tienda>${tienda.nombre}</nombre_tienda>
            <lista_productos>`;
    for (producto of productos) {
        xml += `<producto>
                            <id_producto>${producto.producto}</id_producto>
                            <cantidad>${producto.cantidad}</cantidad>
                        </producto>`
    }
    return xml + `</lista_productos>
        </body>
    </root>`;
}

xmlCreator.createCliente = function (cliente, productos,tiendas) {
    var time = new Date();
    var hour = time.getHours().toString().padStart(2, 0);
    var minutes = time.getMinutes().toString().padStart(2, 0);
    var seconds = time.getSeconds().toString().padStart(2, 0);

    var xml = `<?xml version="1.0" encoding="utf-8"?>
<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<head>
		<tipo_mensaje>reg_cliente</tipo_mensaje>

		<tipo_emisor>monitor</tipo_emisor>
		<id_emisor>-1</id_emisor>
        <ip_emisor>${Monitor.ip}</ip_emisor>
        <puerto_emisor>${Monitor.puerto}</puerto_emisor>

		<tipo_receptor>comprador</tipo_receptor>
		<id_receptor>${cliente._id}</id_receptor>
		<ip_receptor>${cliente.ipAddress}</ip_receptor>
		<puerto_receptor>-1</puerto_receptor>

		<time_sent>${hour}:${minutes}:${seconds}</time_sent>
	</head>
	<body xsi:type="reg_cliente">
        <lista_productos>`;
    for (producto of productos) {
        xml += `<producto>
				<id_producto>${producto.producto}</id_producto>
				<cantidad>${producto.cantidad}</cantidad>
			</producto>`;
    }

    xml += `</lista_productos>
        <lista_tiendas>`;
    for (tienda of tiendas) {
        xml += `<tienda>
                <id_tienda>${tienda._id}</id_tienda>
                <ip_tienda>${tienda.ipAddress}</ip_tienda>
                <puerto>${tienda.puerto}</puerto>
            </tienda>`
    }
    xml += `</lista_tiendas>
	</body>
</root>`;
    return xml;
}



exports.xmlCreator = xmlCreator