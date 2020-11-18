package tiendasax;

import paquete1.Producto;
import java.util.ArrayList;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;
import paquete1.Tienda;

/**
 * -Clase TiendaHandler- Handler del parseador, es el que se encarga de tratar
 * el archivo, como hablamos del parseador SAX, este handler se ocupa de
 * identificar el valor de las etiquedas y realizar acciones consecuentes a
 * estas
 * Parseador SAX: parseador de gran eficiencia (O(n), donde n es el numero
 * de caracteres del archivo) pero de alta complejidad en grandes proyectos
 *
 * @author Oskar-MSI
 */
public class TiendaHandler extends DefaultHandler {

    //Necesarios para leer
    private Emisor emisor;
    private Receptor receptor;
    private String tipo;
    private ArrayList<Producto> listaProductos = new ArrayList<Producto>();
    private String tipoEvento;
    private int nuevoID;
    private ArrayList<Tienda> listaTiendas = new ArrayList<Tienda>();

    //Necesarios para operar
    private String rol, ip;
    private int puerto, id;
    private Producto producto;
    private StringBuilder buffer = new StringBuilder();
    private int aux;

    //Parseador
    /**
     * -Metodo characters- Metodo generado automaticamente por el parseador, que
     * lee y almacena en un buffer los nodos hoja (nodos sin <> o </>)
     *
     * @param ch
     * @param start
     * @param length
     * @throws SAXException
     */
    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        super.characters(ch, start, length); //To change body of generated methods, choose Tools | Templates.
        buffer.append(ch, start, length);
    }

    /**
     * -Metodo endElement- metodo generado automaticamente por el parseador, que
     * se encarga de detectar un nodo fin (denotado por la etiqueta </>) y
     * realizar una accion definida dependiendo de su qName (valor de atributo).
     * Normalmente se encarga de asignar los valores a las variables
     * correspondientes
     *
     * @param uri
     * @param localName
     * @param qName
     * @throws SAXException
     */
    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
        super.endElement(uri, localName, qName); //To change body of generated methods, choose Tools | Templates.
        try {
            switch (qName) {                    
                case "ip_emisor":
                    this.ip = buffer.toString();
                    break;
                case "puerto_emisor":
                    this.puerto = Integer.parseInt(buffer.toString());
                    emisor.setIp(ip);
                    emisor.setPuerto(puerto);
                    emisor.setId(this.id);
                    emisor.setRol(rol);
                    break;
                case "id_emisor":
                    this.id = Integer.parseInt(buffer.toString());
                    break;
                case "tipo_emisor":
                    rol = buffer.toString();
                    break;
                    
                case "ip_receptor":
                    this.ip = buffer.toString();
                    break;
                case "puerto_receptor":
                    this.puerto = Integer.parseInt(buffer.toString());
                    receptor.setIp(ip);
                    receptor.setPuerto(puerto);
                    receptor.setId(id);
                    receptor.setRol(rol);
                    break;
                case "id_receptor":
                    this.id = Integer.parseInt(buffer.toString());
                    break;
                case "tipo_receptor":
                    rol = buffer.toString();
                    break;
                    
                case "tipo_mensaje":
                    tipo = buffer.toString();
                    break;
                    
                case "id_producto":
                    producto.id=Integer.parseInt(buffer.toString());
                    break;
                case "cantidad":
                    producto.cantidad=Integer.parseInt(buffer.toString());
                    break;
                case "producto":
                    listaProductos.add(producto);
                    break;

                case "nuevoID":
                    nuevoID = Integer.parseInt(buffer.toString());
                    break; 
                case "tienda":
                    listaTiendas.add(new Tienda(id, ip, puerto));
                    id = aux;
                    break;
                    
                case "id_tienda":
                    id=Integer.parseInt(buffer.toString());
                    break;
                case "ip_tienda":
                    ip=buffer.toString();
                    break;
                case "puerto_tieda":
                    puerto=Integer.parseInt(buffer.toString());
                    break;
            }
        } catch (NumberFormatException e) {
        }
    }

    /**
     * -Metodo startElement- metodo generado automaticamente por el parseador,
     * que se encarga de detectar un nodo inicio (denotado por la etiqueta <>) y
     * realizar una accion definida dependiendo de su qName (valor de atributo).
     * Normalmente se encarga de inicalizar y de vaciar el buffer.
     *
     * @param uri
     * @param localName
     * @param qName
     * @param attributes
     * @throws SAXException
     */
    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        super.startElement(uri, localName, qName, attributes); //To change body of generated methods, choose Tools | Templates.
        switch (qName) {
            case "tipo_emisor":
                ip = null;
                puerto = 0;
                id = 0;
                emisor = new Emisor();
                break;
            case "tipo_receptor":
                ip = null;
                puerto = 0;
                id = 0;
                receptor = new Receptor();
                break;
            case "idCliente":
            case "nuevoID":
            case "tipoEvento":
            case "ip_emisor":
            case "puerto_emisor":
            case "id_emisor":
            case "ip_receptor":
            case "id_producto":
            case "puerto_receptor":
            case "id_receptor":
            case "rol":
            case "tipo_mensaje":
            case "nombre":
            case "cantidad":
                buffer.delete(0, buffer.length());
                break;
            case "tienda":
                buffer.delete(0, buffer.length());
                aux = id;
                break;
            case "producto":
                producto = new Producto(0,0);
                break;
            case "body":
                try {
                    if (tipo == null) {
                        tipo = attributes.getValue("orden");
                    }
                } catch (Exception ex) {
                }
                break;
        }
    }

    //Gets
    public Emisor getEmisor() {
        return emisor;
    }

    public Receptor getReceptor() {
        return receptor;
    }

    public String getTipo() {
        return tipo;
    }

    public ArrayList<Producto> getListaProductos() {
        return listaProductos;
    }

    public String getTipoEvento() {
        return tipoEvento;
    }

    public int getNuevoID() {
        return nuevoID;
    }

    public ArrayList<Tienda> getListaTiendas() {
        return listaTiendas;
    }

}
