package tiendasax;

import paquete1.Producto;
import paquete1.Tienda;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import org.xml.sax.SAXException;

public class TiendaSAX {

    private Emisor emisor;
    private Receptor receptor;
    private String tipo;
    private ArrayList<Producto> listaProductos;
    private String tipoEvento;
    private int nuevoID = 0;
    private ArrayList<Tienda> listaTiendas;

    /**
     * -Metodo SAX- Inicializador de la secuencia de parseador SAX, sele pasa un
     * file que contenga un xml, lo trata y devuelve los valores asignados
     *
     * @param file
     * @throws ParserConfigurationException
     * @throws SAXException
     * @throws IOException
     */
    public void Sax(File file) throws ParserConfigurationException, SAXException, IOException {

        SAXParserFactory saxParserFactory = SAXParserFactory.newInstance();
        SAXParser saxParser = saxParserFactory.newSAXParser();
        //File file = new File(f); //f = fichero, si se lee desde un archivo local, si no, quitar esta linea
        TiendaHandler th = new TiendaHandler();
        saxParser.parse(file, th); //file = fichero, dh = manejador

        //Guardamos los valores parseados del XML en sus respectivas variables
        emisor = th.getEmisor();
        receptor = th.getReceptor();
        tipo = th.getTipo();
        listaProductos = th.getListaProductos();
        tipoEvento = th.getTipoEvento();
        nuevoID = th.getNuevoID();
        listaTiendas=th.getListaTiendas();

        //System.out.println("Emisor: "+emisor+", Receptor: "+receptor+", Tipo: "+tipo+", Lista de productos: "+listaProductos+", tipo de evento: "+tipoEvento);
    }

    // Gets
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
