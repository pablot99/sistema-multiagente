/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package paquete1;

import java.util.ArrayList;

/**
 *
 * @author Jesús, Andrés y Marina
 */
public class Tienda {

    public ArrayList<Producto> listaProductos=new ArrayList<Producto>();
    public ArrayList<Cliente> listaClientes=new ArrayList<Cliente>();
    public int id;
    public String ip;
    public int puerto;
    public int nClientes;

    //tiendas que son nuestras
    public Tienda(ArrayList<Producto> listaProductos, int id, String ip, int puerto) {
        this.listaProductos = listaProductos;
        this.id = id;
        this.ip = ip;
        this.puerto = puerto;
        this.nClientes=0;
    }

    //tiendas que no son nuestras
    public Tienda(int id, String ip, int puerto) {
        this.id = id;
        this.ip = ip;
        this.puerto = puerto;
        this.nClientes=0;
    }
    public Tienda(){
        
    }
    

    //entra un cliente nuevo, se añade a la lista de clientes de la tienda
    public void entraUnNuevoCliente(Cliente c) {
        listaClientes.add(c);
        nClientes++;
    }

    //sale un nuevo cliente, lo eliminamos de la lista de clientes
    public void saleUnCliente(Cliente c) {
        listaClientes.remove(c);
        nClientes--;
    }

    //devolver lista de tiendas al cliente cuando nos lo solicita
    public String DevolverListaTiendas() {
        String resultado = "<lista_tiendas>";
        for (Cliente c : listaClientes) {
            for (Tienda t : c.listaTiendas) {
                resultado += "<tienda><id_tienda>" + t.id + "</id_tienda><ip_tienda>" + t.ip + "</ip_tienda><puerto>"+ t.puerto + "</puerto></tienda>";

            }

        }
        resultado=resultado+"</lista_tiendas>";
        return resultado;
    }

    //comprueba los productos de los que dispone la tienda en función a la lista de productos pasada por el cliente
    public String Comprar(ArrayList<Producto> listaCompra) {
        String resultado = "<lista_productos>";
        boolean encontrado=false;
        for (Producto c : listaCompra) {
            for (Producto p : listaProductos) {
                
                if (p.id==c.id) {
                    
                    float cantidadProducto = p.cantidadProductoDisponible(c.cantidad);
                    resultado += "<producto><id_producto>" + p.id + "</id_producto><cantidad>" + cantidadProducto + "</cantidad></producto>";
                    encontrado=true;
                    break; //si encuentra el producto, pasa a comprobar el siguiente
                }
            }
            if(!encontrado){
                resultado += "<producto><id_producto>" + c.id + "</id_producto><cantidad>" + 0 + "</cantidad></producto>";
            }
            encontrado=false;
        }
        resultado=resultado+"<lista_productos>";
        return resultado;
    }
    
    public boolean compruebaStock(){
        boolean sinStock=true;
        for(Producto p: listaProductos){
            if(p.cantidad>0){
                sinStock=false;
            }
        }
        return sinStock;
    }
    
    @Override
    public String toString() { 
        return "Tienda con id"+id;
    } 
}
