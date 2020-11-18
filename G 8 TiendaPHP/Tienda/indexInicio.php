<?php
    include 'Tienda.php';
    include_once 'funcionesGlobales.php';

      #Constructor
    class Inicializador
    {
        function __construct(){
            #Conectamos con BB.DD
            $mysqli = funcionesGlobales::conectBBDD();

            $mysqli->query("create table tiendas(Id int, dinero float);");
            $mysqli->query("create table productos(Id int, Nombre varchar(20));");
            $mysqli->query("create table tiendasConocidas(idCliente int, idTiendaDentro int, idTiendaConocida int, ipTiendaConocida varchar(20));");
            $mysqli->query("create table tiendaProducto(idTienda int, idProducto int, precio int, cantidad int);");
            $mysqli->query("create table tiendaCliente(idTienda int, idCliente int);");

    //         #Creamos tabla tiendas
    //         funcionesGlobales::logs("logInicializacion.txt", "Conectado a la Base de Datos.");
    //         $xml = simplexml_load_file($monitor."/iniciaTienda?ip=sss&puerto=sss");
    //   #Creamos tabla de tiendas conocidas por los clientes que entran
    //         #Introducimos datos a las tiendas
    //         for($i = 1; $i < 11; ++$i) {
    //             $result = $mysqli->query("INSERT INTO tiendas (Id, dinero) VALUES ($i, 0)"); //dinero innecesario de momento
    //         }

    //         #Introducimos datos a los productos
    //         for($i = 0; $i < 50; ++$i) {
    //             $result = $mysqli->query("INSERT INTO productos (Id, Nombre) VALUES ($i, 'product$i')");
    //         }

    //         #Inicializamos las tiendas
    //         $res = $mysqli->query("SELECT Id FROM tiendas");
    //         $f=1;
    //         while($f < 11){
    //             funcionesGlobales::logs("logInicializacion.txt", "Creamos la tienda: ".$f);
    //             $workers[$f] = new Tienda($f);
    //             proveer($f);
    //             echo "Creamos tienda " .$f.' <br/>';
    //             $f = $f +1;

    //         }
            // echo "Se completa el inicio";

        }

        // function proveer($id){

        //     #Conectamos con BB.DD
        //     $mysqli = funcionesGlobales::conectBBDD();

        //     for ($i=0; $i< random_int(1000,2000); $i++){
        //         #Sacamos un Id aleatorio de los productos
        //         $result = $mysqli->query("SELECT Id FROM productos");
        //         $cantProductos =(int) $result -> num_rows;
        //         $IDRandom = random_int(0, ($cantProductos-1));
        //         #Seleccionamos cantidad aleatoria del producto y sus datos
        //         $result2 = $mysqli->query("SELECT * FROM productos WHERE Id LIKE ".$IDRandom);
        //         $row = $result2->fetch_assoc();
        //         $cantidadEnTienda = random_int(10,30); #Obtenemos la cantidad de productos para la tienda 
        //         $nr = $row["Nombre"]; #Obtenemos nombre del producto
        //         $pr = 10; #Obtenemos el precio del producto

        //         #Comprobamos si el producto elegido ya esta en la tienda
        //         $sql = "SELECT * FROM tiendaProducto WHERE idProducto LIKE '$IDRandom' AND idTienda = '$id' ";
        //         $result = $mysqli->query($sql);
        //         $row = $result->fetch_assoc();
        //         if ($row != NULL){ #Si esta en la tienda solo aumentamos su cantidad
        //             $cant = $row["cantidad"];
        //             $nuevaCantidad = $cant + $cantidadEnTienda;
        //             $sql = "UPDATE tiendaProducto
        //                         SET Cantidad = '$nuevaCantidad'
        //                         WHERE idProducto LIKE '$IDRandom' AND idTienda = '$id' ";
        //             $mysqli->query($sql);
        //         }
        //         else{ #Si no esta en la tienda creamos la nueva relacion entre tiedna producto
        //             #Introducimos los datos
        //             $sql2 = "INSERT INTO tiendaProducto (idTienda, idProducto, precio, cantidad) VALUES ('$id', '$IDRandom', '$pr', '$cantidadEnTienda')";
        //             $mysqli->query($sql2);
        //         }

        //         #Escribimos en log
        //         funcionesGlobales::logs("logInicializacion.txt", "Añadimos a la tienda: ".$id. " el producto ".$nr. ", cantidad: ".$cantidadEnTienda);
        //     }
        
    }

    #Creamos el objeto inicializador
    $obj = new Inicializador();

?>
