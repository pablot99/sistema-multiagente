/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package main;

/**
 *
 * @author mg_4_
 */
public class SendPost {
    
    
    public static int enviarMensaje(Agente emisor, Agente receptor, Agente monitor, String tipoMensaje, String mensaje){
        //Envía mensaje
        //Devuelve mensaje
        System.out.println("Se envia un mensaje de la Tienda "+emisor.id+" al Cliente "+receptor.id+ " del tipo "+tipoMensaje+" con el mensaje "+mensaje);
        return 0;
    }
    
    public static int enviarMensajeMonitor(Agente emisor, Agente receptor, String tipoMensaje, String mensaje){
        System.out.println("Se envia un mensaje de la Tienda "+emisor.id+" al Monitor del tipo "+tipoMensaje+" con el mensaje "+mensaje);
        return 0;
    }
}
