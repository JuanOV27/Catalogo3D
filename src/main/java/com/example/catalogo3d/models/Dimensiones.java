package com.example.catalogo3d.models;

public class Dimensiones {

    private double ancho;
    private double alto;
    private double largo;

    public Dimensiones() {}

    public Dimensiones(double ancho, double alto, double largo) {
        this.ancho = ancho;
        this.alto = alto;
        this.largo = largo;
    }

    public double getAncho() { return ancho; }
    public void setAncho(double ancho) { this.ancho = ancho; }

    public double getAlto() { return alto; }
    public void setAlto(double alto) { this.alto = alto; }

    public double getLargo() { return largo; }
    public void setLargo(double largo) { this.largo = largo; }
}
