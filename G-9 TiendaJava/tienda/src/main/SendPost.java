/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package main;

import java.util.ArrayList;
import paquete1.Producto;
import paquete1.Tienda;

/**
 *
 * @author mg_4_
 */
public class SendPost {
    
    public static int enviaMensajeInicializacion(Agente emisor, Agente receptor, String tipoMensaje){
        System.out.println("Se envia un mensaje de inicialización al monitor");
        return 0;
    }
    
    public static int enviaMensajeProductosDisponibles(Agente emisor, Agente receptor, String tipoMensaje, ArrayList<Producto> lista){
        System.out.println("Se envia un mensaje de productos disponibles al cliente "+receptor.id+" de la tienda "+emisor.id+" con los productos "+lista);
        return 0;
    }
    
    public static int enviaMensajeTiendasConocidas(Agente emisor, Agente receptor, String tipoMensaje, ArrayList<Tienda> tiendas){
        System.out.println("Se envia un mensaje de tiendas conocidas al cliente "+receptor.id+" de la tienda "+emisor.id+" con las tiendas "+tiendas);
        return 0;
    }
    
    public static int enviaMensajeConfirmaSalida(Agente emisor, Agente receptor, String tipoMensaje){
        System.out.println("Se envia un mensaje de salida del cliente "+receptor.id+" de la tienda "+emisor.id);
        return 0;
    }
    
    public static int enviaMensajeFinalizaTienda(Agente emisor, Agente receptor, String tipoMensaje){
        System.out.println("Se envia un mensaje de finalización de la tienda "+emisor.id);
        return 0;
    }
            
}
