# 02020-KML.py
# # -*- coding: utf-8 -*-
""""
Crea archivos KML con puntos y líneas

@version 1.0 17/Noviembre/2023
@author: Juan Manuel Cueva Lovelle. Universidad de Oviedo
"""

import xml.etree.ElementTree as ET

class Kml(object):
    """
    Genera archivo KML con puntos y líneas
    @version 1.0 17/Noviembre/2023
    @author: Juan Manuel Cueva Lovelle. Universidad de Oviedo
    """
    def __init__(self):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz,'Document')

    def addPlacemark(self,nombre,descripcion,long,lat,alt, modoAltitud):
        """
        Añade un elemento <Placemark> con puntos <Point>
        """
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = '\n' + nombre + '\n'
        ET.SubElement(pm,'description').text = '\n' + descripcion + '\n'
        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = '\n{},{},{}\n'.format(long,lat,alt)
        ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'

    def addLineString(self,nombre,extrude,tesela, listaCoordenadas, modoAltitud, color, ancho):
        """
        Añade un elemento <Placemark> con líneas <LineString>
        """
        ET.SubElement(self.doc,'name').text = '\n' + nombre + '\n'
        pm = ET.SubElement(self.doc,'Placemark')
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls,'extrude').text = '\n' + extrude + '\n'
        ET.SubElement(ls,'tessellation').text = '\n' + tesela + '\n'
        ET.SubElement(ls,'coordinates').text = '\n' + listaCoordenadas + '\n'
        ET.SubElement(ls,'altitudeMode').text = '\n' + modoAltitud + '\n'

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement (linea, 'color').text = '\n' + color + '\n'
        ET.SubElement (linea, 'width').text = '\n' + ancho + '\n'

    def escribir(self,nombreArchivoKML):
        """
        Escribe el archivo KML con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

    def ver(self):
        """
        Muestra el archivo KML. Se utiliza para depurar
        """
        print("\nElemento raiz = ", self.raiz.tag)

        if self.raiz.text != None:
            print("Contenido = "    , self.raiz.text.strip('\n')) #strip() elimina los '\n' del string
        else:
            print("Contenido = "    , self.raiz.text)

        print("Atributos = "    , self.raiz.attrib)

        # Recorrido de los elementos del árbol
        for hijo in self.raiz.findall('.//'): # Expresión XPath
            print("\nElemento = " , hijo.tag)
            if hijo.text != None:
                print("Contenido = ", hijo.text.strip('\n')) #strip() elimina los '\n' del string
            else:
                print("Contenido = ", hijo.text)
            print("Atributos = ", hijo.attrib)


def obtenerCoordenadas(archivoXML):
    """Función obtenerCoordenadas(archivoXML)
    Extrae las coordenadas de los tramos en un archivo XML y las guarda en una lista.
    """

    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print('No se encuentra el archivo', archivoXML)
        return []
    except ET.ParseError:
        print("Error procesando el archivo XML =", archivoXML)
        return []

    ns = {'uniovi': 'http://www.uniovi.es'}

    # Lista para guardar las coordenadas
    coordenadas_tramos = []

    # Obtener la raíz del XML
    raiz = arbol.getroot()
    # Encontrar todos los tramos
    for tramo in raiz.findall('.//uniovi:tramo', ns):
        nombre_tramo = tramo.attrib.get('nombre', 'Sin nombre')

        # Lista para almacenar las coordenadas de este tramo
        coordenadas_list = []

        # Buscar todas las coordenadas en el tramo
        for coordenadas in tramo.findall('uniovi:coordenadas',ns):
            latitud = coordenadas.attrib.get('latitud', 'Sin latitud')
            longitud = coordenadas.attrib.get('longitud', 'Sin longitud')
            altitud = coordenadas.attrib.get('altitud', 'Sin altitud')

            cadena = f"{longitud},{latitud},0.0\n"

            coordenadas_list.append(cadena)

        coordenadas_tramos.append(coordenadas_list)
    return coordenadas_tramos


def main():
    nombreKML = "circuito.kml"

    nuevoKML = Kml()

    coordenadas_resultantes = obtenerCoordenadas("circuitoEsquema.xml")
    cadena = ""
    primer_tramo = ""
    count = 0
    for cord in coordenadas_resultantes:
        if(count==0):
            primer_tramo = cord[0]
            count+=1
        cadena += cord[0]
        count+=1
    cadena+=primer_tramo
    cadena.strip()

    nuevoKML.addLineString("Circuito Interlagos","1","1",
                           cadena,'relativeToGround',
                           '#ff0000ff',"5")

    """Visualización del KML creado"""
    nuevoKML.ver()

    """Creación del archivo en formato KML"""
    nuevoKML.escribir(nombreKML)
    print("Creado el archivo: ", nombreKML)

if __name__ == "__main__":
    main()
