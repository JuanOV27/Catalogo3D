package com.example.catalogo3d.controllers;

import com.example.catalogo3d.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email y password son obligatorios.");
        }

        Map<String, String> resultado = authService.login(email, password);
        if (resultado == null) {
            return ResponseEntity.status(401).body("Credenciales incorrectas.");
        }
        return ResponseEntity.ok(resultado);
    }
}
