package com.example.catalogo3d.controllers;

import com.example.catalogo3d.models.Cliente;
import com.example.catalogo3d.services.ClienteService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
// @CrossOrigin ya se maneja en SecurityConfig
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public ResponseEntity<?> obtenerTodos() {
        List<Cliente> clientes = clienteService.obtenerTodos();
        clientes.forEach(c -> c.setPassword(null));
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(
            @PathVariable String id,
            HttpServletRequest request) {
        
        String userRol = (String) request.getAttribute("userRol");
        String userId = (String) request.getAttribute("userId");
        
        boolean esAdmin = "ADMIN".equals(userRol);
        boolean esPropioCliente = "CLIENTE".equals(userRol) && id.equals(userId);
        
        if (!esAdmin && !esPropioCliente) return ResponseEntity.status(403).body("Acceso denegado.");
        
        return clienteService.obtenerPorId(id).map(c -> {
            c.setPassword(null);
            return ResponseEntity.ok(c);
        }).orElse(ResponseEntity.notFound().build());
    }

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

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable String id,
            @RequestBody Cliente cliente,
            HttpServletRequest request) {
        
        String userRol = (String) request.getAttribute("userRol");
        String userId = (String) request.getAttribute("userId");

        boolean esAdmin = "ADMIN".equals(userRol);
        boolean esPropioCliente = "CLIENTE".equals(userRol) && id.equals(userId);
        
        if (!esAdmin && !esPropioCliente) return ResponseEntity.status(403).body("Acceso denegado.");
        
        return clienteService.actualizar(id, cliente).map(c -> {
            c.setPassword(null);
            return ResponseEntity.ok(c);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable String id) {
        if (clienteService.eliminar(id)) return ResponseEntity.noContent().build();
        return ResponseEntity.notFound().build();
    }
}
