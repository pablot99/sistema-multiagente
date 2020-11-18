/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package paquete1;

/**
 *
 * @author Jesús, Andrés y Marina
 */
public class Producto {
    public int id;
    public int cantidad;
    //public float precio;
    
    //De la tienda
    public Producto(int id, int cantidad /*, float precio*/){
        this.id=id;
        this.cantidad=cantidad;
        //this.precio=precio;
    }
    
    
    //deuelve la cantidad de productos que el cliente podrá comprar
    public int cantidadProductoDisponible(int cantidad){
        if(this.cantidad == 0 ){
            return 0; //no queda nada 
        }
        if(cantidad>this.cantidad){
            int cantAux=this.cantidad;
            this.cantidad=0;
            return cantAux; //el cliente solo podrá comprar la cantidad de productos que tenemos en la tienda 
        }else{
            this.cantidad-=cantidad;
            return cantidad; //el cliente podrá comprar la cantidad de productos que quería
        } 
    }
    
     @Override
    public String toString() { 
        return "Producto "+id+" con cantidad "+cantidad; 
    } 
    
    /*public float precioProductoTotal(int cantidad){
        
        return cantidad * this.precio;
    }*/
}
