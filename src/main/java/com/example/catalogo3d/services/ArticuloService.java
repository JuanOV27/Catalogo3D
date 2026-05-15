package com.example.catalogo3d.services;

import com.example.catalogo3d.models.Articulo;
import com.example.catalogo3d.repos.ArticuloRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ArticuloService {

    @Autowired
    private ArticuloRepo articuloRepo;

    public List<Articulo> obtenerTodos() {
        return articuloRepo.findAll();
    }

    public Optional<Articulo> obtenerPorId(String id) {
        return articuloRepo.findById(id);
    }

    public List<Articulo> obtenerPorCategoria(String categoriaId) {
        return articuloRepo.findByCategoriaId(categoriaId);
    }

    public Articulo crear(Articulo articulo) {
        if (articulo.getNombre() == null || articulo.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre del artículo es obligatorio.");
        }
        if (articulo.getPrecio() < 0) {
            throw new IllegalArgumentException("El precio no puede ser negativo.");
        }
        if (articulo.getFechaCreacion() == null) {
            articulo.setFechaCreacion(LocalDateTime.now());
        }
        return articuloRepo.save(articulo);
    }

    public Optional<Articulo> actualizar(String id, Articulo datos) {
        return articuloRepo.findById(id).map(existente -> {
            if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
                existente.setNombre(datos.getNombre());
            }
            if (datos.getDescripcion() != null) {
                existente.setDescripcion(datos.getDescripcion());
            }
            if (datos.getMaterial() != null) {
                existente.setMaterial(datos.getMaterial());
            }
            if (datos.getColor() != null) {
                existente.setColor(datos.getColor());
            }
            if (datos.getDimensiones() != null) {
                existente.setDimensiones(datos.getDimensiones());
            }
            if (datos.getPrecio() >= 0) {
                existente.setPrecio(datos.getPrecio());
            }
            if (datos.getCategoriaId() != null) {
                existente.setCategoriaId(datos.getCategoriaId());
            }
            if (datos.getTiempoImpresionHoras() > 0) {
                existente.setTiempoImpresionHoras(datos.getTiempoImpresionHoras());
            }
            if (datos.getTipoFilamento() != null) {
                existente.setTipoFilamento(datos.getTipoFilamento());
            }
            if (datos.getImagenUrl() != null) {
                existente.setImagenUrl(datos.getImagenUrl());
            }
            existente.setDisponible(datos.isDisponible());
            return articuloRepo.save(existente);
        });
    }

    public boolean eliminar(String id) {
        if (articuloRepo.existsById(id)) {
            articuloRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
