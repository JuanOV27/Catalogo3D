package com.example.catalogo3d.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "articulos")
public class Articulo {

    @Id
    private String id;
    private String nombre;
    private String descripcion;
    private String material;
    private String color;
    private Dimensiones dimensiones;
    private double precio;
    private String categoriaId;
    private double tiempoImpresionHoras;
    private String tipoFilamento;
    private String imagenUrl;
    private boolean disponible;
    private LocalDateTime fechaCreacion;

    public Articulo() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Dimensiones getDimensiones() { return dimensiones; }
    public void setDimensiones(Dimensiones dimensiones) { this.dimensiones = dimensiones; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }

    public String getCategoriaId() { return categoriaId; }
    public void setCategoriaId(String categoriaId) { this.categoriaId = categoriaId; }

    public double getTiempoImpresionHoras() { return tiempoImpresionHoras; }
    public void setTiempoImpresionHoras(double tiempoImpresionHoras) { this.tiempoImpresionHoras = tiempoImpresionHoras; }

    public String getTipoFilamento() { return tipoFilamento; }
    public void setTipoFilamento(String tipoFilamento) { this.tipoFilamento = tipoFilamento; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
