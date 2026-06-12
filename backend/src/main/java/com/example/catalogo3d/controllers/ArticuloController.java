package com.example.catalogo3d.controllers;

import com.example.catalogo3d.models.Articulo;
import com.example.catalogo3d.services.ArticuloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articulos")
// @CrossOrigin ya se maneja en SecurityConfig
public class ArticuloController {

    @Autowired
    private ArticuloService articuloService;

    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(articuloService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable String id) {
        return articuloService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<?> obtenerPorCategoria(@PathVariable String categoriaId) {
        return ResponseEntity.ok(articuloService.obtenerPorCategoria(categoriaId));
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Articulo articulo) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(articuloService.crear(articulo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable String id,
            @RequestBody Articulo articulo) {
        return articuloService.actualizar(id, articulo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable String id) {
        if (articuloService.eliminar(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
