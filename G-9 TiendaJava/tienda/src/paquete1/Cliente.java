/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package paquete1;

import java.util.ArrayList;

/**
 *
 * 
 * @author jesus,andrés y marina
 */
public class Cliente {

    int puerto;
    public int id;
    String ip;
    ArrayList<Tienda> listaTiendas = new ArrayList<Tienda>(); //guradamos el id de las tiendas que conoce

    public Cliente(String ip, int puerto, int id) {
        this.puerto = puerto;
        this.id = id;
        this.ip = ip;
    }
   
    
    //añadimos las tiendas conocidas por el cliente a la lista de tiendas conocidas
    
   public void AddTiendasConocidas(ArrayList<Tienda> listaTiendas){
       this.listaTiendas=listaTiendas;
   }

}
