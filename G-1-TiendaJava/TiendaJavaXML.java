/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package tiendajava;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
import sun.applet.Main;

/**
 *
 * @author 71356277
 */
public class TiendaJavaXML {

    /**
     * Constructor de clase
     */
    public TiendaJavaXML() {

    }
    
    
    /**
     * Creamos un XML de respuesta con la lista de productos que se venden al cliente
     * El formato es el establecido en reg_cliente en GitHub
     * 
     * Lista: arraylist con los productos que se han podido vender
     * Tienda: instancia de la clase Tienda para obtener datos
     * Monito: instancia del monitor para obtener datos (hay que saber si es una clase propia de Java o una nuestra)
     *
     * https://www.lawebdelprogramador.com/codigo/Java/3202-Como-crear-un-archivo-XML-con-Java.html
     */
    public void CrearVentaProdcutosXML(ArrayList<Producto> lista, Tienda tienda, Monitor monitor) {
        
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = null;
        System.setProperty("javax.xml.transform.TransformerFactory", "org.apache.xalan.xsltc.trax.TransformerFactoryImpl");

        try {
            // Cabecera del XML
            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();

            // Creamos root
            Document doc = docBuilder.newDocument();
            Element root = doc.createElement("root");
            doc.appendChild(root);
            //Add el atributo: xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            Attr atributo = doc.createAttribute("xmlns:xsi");
            atributo.setValue("http://www.w3.org/2001/XMLSchema-instance");
            root.setAttributeNode(atributo);

            // Abrimos head
            Element head = doc.createElement("head");
            root.appendChild(head);

                // tipo de mensaje
                Element tipoMSG = doc.createElement("tipo_mensaje");
                tipoMSG.appendChild(doc.createTextNode("confirmacion_compra"));
                head.appendChild(tipoMSG);

                // Emisor
                Element emisor = doc.createElement("tipo_emisor");
                emisor.appendChild(doc.createTextNode("tienda"));
                head.appendChild(emisor);
                Element id_emisor = doc.createElement("id_emisor");
                id_emisor.appendChild(doc.createTextNode(tienda.getID()));
                head.appendChild(id_emisor);
                Element ip_emisor = doc.createElement("ip_emisor");
                ip_emisor.appendChild(doc.createTextNode(tienda.getIP()));
                head.appendChild(ip_emisor);
                Element puerto_emisor = doc.createElement("puerto_emisor");
                puerto_emisor.appendChild(doc.createTextNode(tienda.getPuerto()));
                head.appendChild(puerto_emisor);

                // Receptor
                Element receptor = doc.createElement("tipo_receptor");
                receptor.appendChild(doc.createTextNode("monitor"));
                head.appendChild(receptor);
                Element id_receptor = doc.createElement("id_emisor");
                id_receptor.appendChild(doc.createTextNode(monitor.getID()));
                head.appendChild(id_receptor);
                Element ip_receptor = doc.createElement("ip_emisor");
                ip_receptor.appendChild(doc.createTextNode(monitor.getIP()));
                head.appendChild(ip_receptor);
                Element puerto_receptor = doc.createElement("puerto_emisor");
                puerto_receptor.appendChild(doc.createTextNode(monitor.getPuerto()));
                head.appendChild(puerto_receptor);
                
                // Hora de creacion
                Element hora = doc.createElement("time_sent");
                Calendar calendario = new GregorianCalendar();
                hora.appendChild(doc.createTextNode(calendario.get(Calendar.HOUR_OF_DAY)+":"+calendario.get(Calendar.MINUTE)+":"+calendario.get(Calendar.SECOND)));
                head.appendChild(hora);
            // cerramos head

            // Abrimos Body
            Element body = doc.createElement("body");
            Attr atributo_body = doc.createAttribute("xsi:type");
            atributo_body.setNodeValue("ticket_compra");
            body.setAttributeNode(atributo_body);
            root.appendChild(body);
            
                // Add lista de productos
                Element lista_productos = doc.createElement("lista_productos");
                body.appendChild(lista_productos);

                for(int i=0;i<lista.size();i++){
                    Element producto = doc.createElement("producto");
                        Element id_producto = doc.createElement("id_producto");
                        id_producto.appendChild(doc.createTextNode(Integer.toString(lista.get(i).getId())));
                        Element cantidad_producto = doc.createElement("cantidad_producto");
                        cantidad_producto.appendChild(doc.createTextNode(Integer.toString(lista.get(i).getCantidad())));
                    producto.appendChild(id_producto);
                    producto.appendChild(cantidad_producto);
                    body.appendChild(producto);
                }
                // Cerramos lista de productos         
            
            // Cerramos Body
            
            
            // escribimos el contenido en un archivo .xml
            transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", String.valueOf(2));
            DOMSource source = new DOMSource(doc);
            StreamResult result = new StreamResult(new File(".\\src\\tiendajava\\resultadoVentaProductos.xml"));//direccion de donde queremos guardar el fichero

            //StreamResult result = new StreamResult(new File("archivo.xml"));
            // Si se quiere mostrar por la consola...
            // StreamResult result = new StreamResult(System.out);
            transformer.transform(source, result);
            System.out.println("File saved! -> .\\src\\tiendajava\\resultadoVentaProductos.xml");

        } catch (ParserConfigurationException pce) {
            pce.printStackTrace();
        } catch (TransformerException tfe) {
            tfe.printStackTrace();
        }
        transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
    }
    

    /**
     * Lee una lista de la compra y devuelve una lista con los productos y
     * cantidad que el comprador quiere.
     *
     * https://www.discoduroderoer.es/leer-xml-en-java/
     */
    public Tienda LeerDatosTiendaXML() { //public ArrayList<Producto> LeerListaCompraXML() {
        Tienda tienda = new Tienda();
        
        try {
            // Creo una instancia de DocumentBuilderFactory
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            // Creo un documentBuilder
            DocumentBuilder builder = factory.newDocumentBuilder();
            // Obtengo el documento, a partir del XML
            Document documento = builder.parse(new File(".\\src\\tiendajava\\iniciar_tienda.xml"));//se puede iniciar desde aqui o pasarlo por parametro
         
            // cogemos la etiqueta con nombre Head donde viene informacion de la tienda
            NodeList datosTienda = documento.getElementsByTagName("head");//id, producto, nombre... depende como se llame la etiqueta
            Node head = datosTienda.item(0);
            Element elemento = (Element) head;
            tienda.setId(elemento.getElementsByTagName("id_receptor").item(0).getTextContent());
            tienda.setIp(elemento.getElementsByTagName("ip_receptor").item(0).getTextContent());
            tienda.setPuerto(elemento.getElementsByTagName("puerto_receptor").item(0).getTextContent());
            
            // cogemos la etiqueta con nombre Body
            datosTienda = documento.getElementsByTagName("body");
            Node body = datosTienda.item(0);
            elemento = (Element) body;
            tienda.setNombre(elemento.getElementsByTagName("nombre_tienda").item(0).getTextContent());
            
            NodeList listaNodos = elemento.getElementsByTagName("lista_productos").item(0).getChildNodes();
            //System.out.println(listaNodos.getLength());
            for(int i=0;i<listaNodos.getLength();i++){
                Node nodo = listaNodos.item(i);
                if(nodo.getNodeType() == Node.ELEMENT_NODE){
                    Element producto = (Element) nodo;
                    Producto p = new Producto(Integer.parseInt(producto.getElementsByTagName("id_producto").item(0).getTextContent()), Integer.parseInt(producto.getElementsByTagName("cantidad").item(0).getTextContent()));
                    tienda.almacen.add(p);
                }
            }
            
            System.out.println("");
        } catch (ParserConfigurationException | SAXException | IOException ex) {
            System.out.println(ex.getMessage());
        }

        return tienda;
    }

    

    // Main de prueba para comprobar que funciona 
    public static void main(String[] args) {
        
        TiendaJavaXML prueba = new TiendaJavaXML();
        Tienda tienda = new Tienda();
        
        // leemos un XML para inicializar la tienda
        tienda = prueba.LeerDatosTiendaXML();
        System.out.println("TIENDA " + tienda.getID()+", ip: " + tienda.getIP()+", puerto: "+tienda.getPuerto());
        System.out.println(tienda.getNombre());
        for(int i=0;i<tienda.almacen.size();i++){
            System.out.println("    " + tienda.almacen.get(i).getId() + " " + tienda.almacen.get(i).getCantidad());
        }
        
        // creamos un XML con lo que ha podido vender la tienda
        ArrayList<Producto> lista = new ArrayList<>();//esto es para probar
        lista.add(new Producto(1, 2));
        lista.add(new Producto(2, 2));
        lista.add(new Producto(3, 2));
        lista.add(new Producto(4, 2));
        prueba.CrearVentaProdcutosXML(lista, tienda, new Monitor());
    }

}