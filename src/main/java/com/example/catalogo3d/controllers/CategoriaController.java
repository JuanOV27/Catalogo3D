package com.example.catalogo3d.controllers;

import com.example.catalogo3d.models.Categoria;
import com.example.catalogo3d.services.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // GET /api/categorias — ADMIN o CLIENTE
    @GetMapping
    public ResponseEntity<?> obtenerTodas(@RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol) && !"CLIENTE".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        return ResponseEntity.ok(categoriaService.obtenerTodas());
    }

    // GET /api/categorias/{id} — ADMIN o CLIENTE
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol) && !"CLIENTE".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        return categoriaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/categorias — solo ADMIN
    @PostMapping
    public ResponseEntity<?> crear(
            @RequestBody Categoria categoria,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(categoriaService.crear(categoria));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/categorias/{id} — solo ADMIN
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable String id,
            @RequestBody Categoria categoria,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        return categoriaService.actualizar(id, categoria)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/categorias/{id} — solo ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        if (categoriaService.eliminar(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
