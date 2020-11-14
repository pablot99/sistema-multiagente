/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package main;

import java.io.IOException;
import java.util.ArrayList;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import org.xml.sax.SAXException;
import paquete1.Tienda;
import paquete1.Producto;

/**
 *
 * @author mg_4_
 */
public class Main {
    //Datos del servidor
    private static final String iplocal = "10.0.69.175";//No la sabemos aun 
    private static final int portlocal = 80;
    private static final String rollocal = "tienda";
    //Datos monitor
    private static final String ipmonitor = "10.0.69.39";//No la sabemos aún
    private static final int puertomonitor = 3000;
    private static final int idmonitor = 0; //Aunque monitor no tiene id, lo identificaremos como 0, para evitar que algun otro agente que no lo tenga contemplado y de error de ejecucion
    private static final String rolmonitor = "monitor";
    //Array donde almacenamos las tiendas que creamos
    private static ArrayList<Tienda> listaTiendas = new ArrayList<Tienda>();    
    
    public static void main(String[] args) throws IOException, ParserConfigurationException, SAXException, TransformerException, InterruptedException {

        inicializaTiendas();
        startServer();
    }
    
    private static void inicializaTiendas(){ 
        //Primero creamos n tiendas.
        //int n = (int) (Math.random() * 11) + 5; // Esto crea un numero N entre 5 y 15 (incluidos)
        int n=3;
        for (int i = 0; i < n; i++) {
            SendPost.enviarMensajeMonitor(new Agente(iplocal, portlocal, rollocal, 0), new Agente(ipmonitor, puertomonitor, rolmonitor, idmonitor), "inicializa", "");
        }
    }
    
    
    private static void startServer(){
        //Se crea el server que implementa la interfaz HttpHandler creada por el otro grupo.
        //Lo simulamos
        Server s=new Server(iplocal, portlocal, ipmonitor, puertomonitor);
        
        //Nos llegan todos los mensajes de inicializacion de la tienda por parte del monitor
        
        //TIENDA 1
        ArrayList<Producto> listaProductos1= new ArrayList<Producto>();
        listaProductos1.add(new Producto(1, 5));
        listaProductos1.add(new Producto(2, 10));
        listaProductos1.add(new Producto(3, 15));
        listaProductos1.add(new Producto(4, 3));
        s.recibeInicializacion(1, listaProductos1);
        
        //TIENDA 2
        ArrayList<Producto> listaProductos2= new ArrayList<Producto>();
        listaProductos2.add(new Producto(3, 3));
        listaProductos2.add(new Producto(5, 2));
        s.recibeInicializacion(2, listaProductos2);
        
        //TIENDA 3
        ArrayList<Producto> listaProductos3= new ArrayList<Producto>();
        listaProductos3.add(new Producto(1, 1));
        listaProductos3.add(new Producto(3, 5));
        listaProductos3.add(new Producto(6, 10));
        s.recibeInicializacion(3, listaProductos3);

        
        //CREAMOS LISTA DE COMPRA DE CLIENTES:
        ArrayList<Producto> listaCompra1= new ArrayList<Producto>();
        listaCompra1.add(new Producto(5, 5));
        listaCompra1.add(new Producto(2, 4));
        listaCompra1.add(new Producto(3, 20));
        listaCompra1.add(new Producto(4, 2));
        
        ArrayList<Producto> listaCompra2= new ArrayList<Producto>();
        listaCompra2.add(new Producto(1, 3));
        
        ArrayList<Producto> listaCompra3= new ArrayList<Producto>();
        listaCompra3.add(new Producto(6, 5));
        listaCompra3.add(new Producto(2, 4));
        listaCompra3.add(new Producto(1, 2));
        
        //Cliente 1 entra a la tienda 1
        System.out.println("*******************************************************");
        s.entraCliente(1, "0.0.0.0", 3000, listaCompra1, 1);
        listaCompra1= new ArrayList<Producto>();
        listaCompra1.add(new Producto(5, 5));
        listaCompra1.add(new Producto(3, 5));
        System.out.println("A la tienda 1 le queda"+s.listaTiendas.get(0).listaProductos);
        //Cliente 2 entra a la tienda 2
        System.out.println("*******************************************************");
        s.entraCliente(2, "0.0.0.0", 3000, listaCompra3, 2);
        listaCompra2= new ArrayList<Producto>();//Ya ha terminado el cliente 4
        listaCompra2.add(new Producto(1, 3));
        System.out.println("A la tienda 2 le queda"+s.listaTiendas.get(1).listaProductos);
        //Cliente 3 entra a la tienda 1
        System.out.println("*******************************************************");
        s.entraCliente(3, "0.0.0.0", 3000, listaCompra3, 1);
        listaCompra3= new ArrayList<Producto>();
        listaCompra3.add(new Producto(6, 5));
        System.out.println("A la tienda 1 le queda"+s.listaTiendas.get(0).listaProductos);
        //Cliente 1 pregunta por tiendas al 1
        System.out.println("*******************************************************");
        ArrayList<Tienda> tiendasConocidas1 = new ArrayList<Tienda>();
        tiendasConocidas1.add(new Tienda(4, "1.1.1.1", 3000));
        tiendasConocidas1.add(new Tienda(5, "1.1.1.1", 3000));
        s.clientePideTiendas(1, "0.0.0.0", 3000, tiendasConocidas1 , 1);
        //Cliente 3 pregunta por tiendas al 1
        System.out.println("*******************************************************");
        ArrayList<Tienda> tiendasConocidas3 = new ArrayList<Tienda>();
        tiendasConocidas3.add(new Tienda(8, "1.1.1.1", 3000));
        tiendasConocidas3.add(new Tienda(9, "1.1.1.1", 3000));
        s.clientePideTiendas(3, "0.0.0.0", 3000, tiendasConocidas3 , 1);
        //Cliente 1 entra a la tienda 2
        System.out.println("*******************************************************");
        s.entraCliente(1, "0.0.0.0", 3000, listaCompra1, 2);
        listaCompra1= new ArrayList<Producto>();
        listaCompra1.add(new Producto(5, 3));
        listaCompra1.add(new Producto(3, 2));
        System.out.println("A la tienda 2 le queda"+s.listaTiendas.get(1).listaProductos);
        //Cliente 2 pregunta por tiendas al 2
        System.out.println("*******************************************************");
        ArrayList<Tienda> tiendasConocidas2 = new ArrayList<Tienda>();
        tiendasConocidas2.add(new Tienda(4, "1.1.1.1", 3000));
        tiendasConocidas2.add(new Tienda(5, "1.1.1.1", 3000));
        s.clientePideTiendas(2, "0.0.0.0", 3000, tiendasConocidas2 , 2);
        //cliente 2 entra a la tienda 3
        System.out.println("*******************************************************");
        s.entraCliente(2, "0.0.0.0", 3000, listaCompra2, 2);
        listaCompra2= new ArrayList<Producto>();//Ya ha terminado el cliente 4
        listaCompra2.add(new Producto(1, 1));
        System.out.println("A la tienda 3 le queda"+s.listaTiendas.get(2).listaProductos);
        //cliente 1 pregunta por tiendas a la 2
        System.out.println("*******************************************************");
        s.clientePideTiendas(1, "0.0.0.0", 3000, tiendasConocidas1 , 2);
        //cliente 1 entra a la 3
        System.out.println("*******************************************************");
        s.entraCliente(1, "0.0.0.0", 3000, listaCompra1, 3);
        listaCompra1= new ArrayList<Producto>();
        listaCompra1.add(new Producto(5, 3));
        System.out.println("A la tienda 3 le queda"+s.listaTiendas.get(2).listaProductos);
        //cliente 3 entra a la 2
        System.out.println("*******************************************************");
        s.entraCliente(3, "0.0.0.0", 3000, listaCompra3, 2);
        System.out.println("A la tienda 2 le queda"+s.listaTiendas.get(1).listaProductos);
        //cliente 2 pregunta por tiendas a la 3
        System.out.println("*******************************************************");
        s.clientePideTiendas(2, "0.0.0.0", 3000, tiendasConocidas2 , 3);
        //cliente 1 pregunta por tiendas a la 3
        System.out.println("*******************************************************");
        s.clientePideTiendas(1, "0.0.0.0", 3000, tiendasConocidas1 , 3);
        //cliente 3 pregunta por tiendas a la 2
        System.out.println("*******************************************************");
        s.clientePideTiendas(3, "0.0.0.0", 3000, tiendasConocidas3 , 2);
        //Cliente 2 entra a la tienda 1
        System.out.println("*******************************************************");
        s.entraCliente(2, "0.0.0.0", 3000, listaCompra2, 1);
        listaCompra2= new ArrayList<Producto>();
        System.out.println("A la tienda 1 le queda"+s.listaTiendas.get(0).listaProductos);
        //Cliente 3 entra a la tienda 3
        System.out.println("*******************************************************");
        s.entraCliente(3, "0.0.0.0", 3000, listaCompra3, 3);
        listaCompra3= new ArrayList<Producto>();
        System.out.println("A la tienda 3 le queda"+s.listaTiendas.get(2).listaProductos);
        //Cliente 3 pregunta por tiendas a la 3
        System.out.println("*******************************************************");
        s.clientePideTiendas(3, "0.0.0.0", 3000, tiendasConocidas3 , 3);
        //Cliente 2 pregunta por tiendas a la 1
        System.out.println("*******************************************************");
        s.clientePideTiendas(2, "0.0.0.0", 3000, tiendasConocidas2 , 1);
    }
    
    
    
}
