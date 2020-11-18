<?php

require("funcionesGlobales.php");

function crearBaseDeDatos() {
    #Conectamos con BB.DD
    $mysqli = funcionesGlobales::conectBBDD();

    $mysqli->query("CREATE TABLE tiendas(Id INT, nombre VARCHAR(20), dinero FLOAT);");
    $mysqli->query("CREATE TABLE productos(Id INT, Nombre VARCHAR(20));");
    $mysqli->query("CREATE TABLE tiendasConocidas(idCliente INT, idTiendaDentro INT, idTiendaConocida INT, ipTiendaConocida VARCHAR(20));");
    $mysqli->query("CREATE TABLE tiendaProducto(idTienda INT, idProducto INT, precio FLOAT, cantidad INT);");
    $mysqli->query("CREATE TABLE tiendaCliente(idTienda INT, idCliente INT);");
}

function crearTienda($nombre, $puerto) {
    $monitor = "http://127.0.0.1/monitor.php?puerto=$puerto&nombre=$nombre";
    $xml = simplexml_load_string(file_get_contents($monitor));
    $id = $xml->head->id_receptor;

    $mysqli = funcionesGlobales::conectBBDD();
    $mysqli->query("INSERT INTO tiendas(Id, nombre, dinero) VALUES ($id, '$nombre', 0);");
    foreach ($xml->body->lista_productos->children() as $prod) {
        $q = "INSERT INTO tiendaProducto(idTienda, idProducto, precio, cantidad) VALUES ($id, ".$prod->id_producto.", 0, ".$prod->cantidad.");";
        $mysqli->query($q);
    }
}

function eliminarBaseDeDatos() {
    $mysqli = funcionesGlobales::conectBBDD();
    $mysqli->query("DROP TABLE tiendas, productos, tiendasConocidas, tiendaProducto, tiendaCliente;");
}

function cerrarTienda($id) {
    $mysqli = funcionesGlobales::conectBBDD();
    $mysqli->query("REMOVE FROM tiendas WHERE Id = $id;");
    $mysqli->query("REMOVE FROM tiendasConocidas WHERE idTiendaDentro = $id OR idTiendaConocida = $id;");
    $mysqli->query("REMOVE FROM tiendaProducto WHERE idTienda = $id;");
    $mysqli->query("REMOVE FROM tiendaCliente WHERE idTienda = $id;");
    
    $msg = file_get_contents("mensajes/cerrar.xml");
    
    $monitor = "monitor.php/cerrarTienda?puertoTienda=$puerto&nombreTienda=$nombre";
    echo funcionesGlobales::enviarMensaje($monitor, $msg);
}

?>

<html>
<body>
    <form method="post">
        <input type="submit" name="start" value="Iniciar base de datos"/>
    </form>

    <form method="post">
        <input type="submit" name="stop" value="Eliminar base de datos"/>
    </form>

    <form method="post">
        <input type="text" name="nombre" />
        <input type="submit" name="nueva" value="Nueva Tienda"/>
    </form>

    <form method="post" action="index.php">
        <input type="submit" value="Prueba entrada cliente" />
        <input type="hidden" name="data" value=<?php echo urlencode(file_get_contents("mensajes/pruebaEntradaCliente.xml"));?> />
    </form>

    <form action="index.php" method="post">
        <input type="submit" value="Prueba pedir tiendas" />
        <input type="hidden" name="data" value=<?php echo urlencode(file_get_contents("mensajes/pruebaPedirTiendas.xml"));?> />
    </form>

    <form action="index.php" method="post">
        <input type="submit" value="Prueba salida cliente" />
        <input type="hidden" value=<?php echo urlencode(file_get_contents("mensajes/pruebaSalida.xml"));?> name="data" />
    </form>
</body>

<?php

if (isset($_POST["start"])) {
    crearBaseDeDatos();
}
elseif (isset($_POST["nueva"])) {
    crearTienda($_POST["nombre"], 80);
}
elseif (isset($_POST["stop"])) {
    eliminarBaseDeDatos();
}

$msqli = funcionesGlobales::conectBBDD();
$q = $msqli->query("SELECT * from tiendas;");
for ($i = 0; $i < $q->num_rows; $i++) {
    $row = $q->fetch_assoc();
    if ($row) {
        echo "Tienda ".$row["Id"]."(".$row["nombre"]."): </br>";
        $q2 = $msqli->query("SELECT idProducto, cantidad FROM tiendaProducto WHERE idTienda = ". $row['Id']);
        echo "<ul>";
        for ($j = 0; $j < $q2->num_rows; $j++) {
            $prod = $q2->fetch_assoc();
            echo "<li>Producto ". $prod["idProducto"] . "(" . $prod["cantidad"] . ")</li>";
            echo "</br>";
        }
        echo "</ul>";
    }
}
?>
</html>