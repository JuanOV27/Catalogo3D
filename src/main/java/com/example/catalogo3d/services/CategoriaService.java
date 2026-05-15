package com.example.catalogo3d.services;

import com.example.catalogo3d.models.Categoria;
import com.example.catalogo3d.repos.CategoriaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepo categoriaRepo;

    public List<Categoria> obtenerTodas() {
        return categoriaRepo.findAll();
    }

    public Optional<Categoria> obtenerPorId(String id) {
        return categoriaRepo.findById(id);
    }

    public Categoria crear(Categoria categoria) {
        if (categoria.getNombre() == null || categoria.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre de la categoría es obligatorio.");
        }
        return categoriaRepo.save(categoria);
    }

    public Optional<Categoria> actualizar(String id, Categoria datos) {
        return categoriaRepo.findById(id).map(existente -> {
            if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
                existente.setNombre(datos.getNombre());
            }
            if (datos.getDescripcion() != null) {
                existente.setDescripcion(datos.getDescripcion());
            }
            return categoriaRepo.save(existente);
        });
    }

    public boolean eliminar(String id) {
        if (categoriaRepo.existsById(id)) {
            categoriaRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
