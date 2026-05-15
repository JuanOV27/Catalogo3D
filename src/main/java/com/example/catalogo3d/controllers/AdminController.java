package com.example.catalogo3d.controllers;

import com.example.catalogo3d.models.Admin;
import com.example.catalogo3d.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // GET /api/admins — solo ADMIN
    @GetMapping
    public ResponseEntity<?> obtenerTodos(@RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        List<Admin> admins = adminService.obtenerTodos();
        // Ocultar passwords en la respuesta
        admins.forEach(a -> a.setPassword(null));
        return ResponseEntity.ok(admins);
    }

    // GET /api/admins/{id} — solo ADMIN
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        return adminService.obtenerPorId(id).map(a -> {
            a.setPassword(null);
            return ResponseEntity.ok(a);
        }).orElse(ResponseEntity.notFound().build());
    }

    // POST /api/admins/init — sin rol (creación inicial)
    @PostMapping("/init")
    public ResponseEntity<?> crearAdmin(@RequestBody Admin admin) {
        try {
            Admin creado = adminService.crear(admin);
            creado.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/admins/{id} — solo ADMIN
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable String id,
            @RequestBody Admin admin,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        return adminService.actualizar(id, admin).map(a -> {
            a.setPassword(null);
            return ResponseEntity.ok(a);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/admins/{id} — solo ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        if (adminService.eliminar(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
