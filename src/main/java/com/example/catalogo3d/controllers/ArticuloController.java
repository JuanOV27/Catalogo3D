package com.example.catalogo3d.controllers;

import com.example.catalogo3d.models.Articulo;
import com.example.catalogo3d.services.ArticuloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articulos")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class ArticuloController {

    @Autowired
    private ArticuloService articuloService;

    // GET /api/articulos — público
    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        return ResponseEntity.ok(articuloService.obtenerTodos());
    }

    // GET /api/articulos/{id} — público
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable String id) {
        return articuloService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/articulos/categoria/{categoriaId} — público
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<?> obtenerPorCategoria(@PathVariable String categoriaId) {
        return ResponseEntity.ok(articuloService.obtenerPorCategoria(categoriaId));
    }

    // POST /api/articulos — solo ADMIN
    @PostMapping
    public ResponseEntity<?> crear(
            @RequestBody Articulo articulo,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(articuloService.crear(articulo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/articulos/{id} — solo ADMIN
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable String id,
            @RequestBody Articulo articulo,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        return articuloService.actualizar(id, articulo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/articulos/{id} — solo ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        if (articuloService.eliminar(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
