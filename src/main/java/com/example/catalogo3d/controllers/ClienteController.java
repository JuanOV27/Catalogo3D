package com.example.catalogo3d.controllers;

import com.example.catalogo3d.models.Cliente;
import com.example.catalogo3d.services.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // GET /api/clientes — solo ADMIN
    @GetMapping
    public ResponseEntity<?> obtenerTodos(@RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        List<Cliente> clientes = clienteService.obtenerTodos();
        clientes.forEach(c -> c.setPassword(null));
        return ResponseEntity.ok(clientes);
    }

    // GET /api/clientes/{id} — ADMIN o propio CLIENTE
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Rol", required = false) String rol,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        boolean esAdmin = "ADMIN".equals(rol);
        boolean esPropioCliente = "CLIENTE".equals(rol) && id.equals(userId);
        if (!esAdmin && !esPropioCliente) return ResponseEntity.status(403).body("Acceso denegado.");
        return clienteService.obtenerPorId(id).map(c -> {
            c.setPassword(null);
            return ResponseEntity.ok(c);
        }).orElse(ResponseEntity.notFound().build());
    }

    // POST /api/clientes — registro público, sin rol
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Cliente cliente) {
        try {
            Cliente creado = clienteService.crear(cliente);
            creado.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/clientes/{id} — ADMIN o propio CLIENTE
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable String id,
            @RequestBody Cliente cliente,
            @RequestHeader(value = "X-User-Rol", required = false) String rol,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        boolean esAdmin = "ADMIN".equals(rol);
        boolean esPropioCliente = "CLIENTE".equals(rol) && id.equals(userId);
        if (!esAdmin && !esPropioCliente) return ResponseEntity.status(403).body("Acceso denegado.");
        return clienteService.actualizar(id, cliente).map(c -> {
            c.setPassword(null);
            return ResponseEntity.ok(c);
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/clientes/{id} — solo ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");
        if (clienteService.eliminar(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
