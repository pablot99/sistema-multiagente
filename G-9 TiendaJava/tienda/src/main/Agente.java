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
public class Agente {
    public String ip;
    public int puerto;
    public String rol;
    public int id;
    
    public Agente(String ip, int puerto, String rol, int id){
        this.ip=ip;
        this.puerto=puerto;
        this.id=id;
        this.rol=rol;
    }
}
