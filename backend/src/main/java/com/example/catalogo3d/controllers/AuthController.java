package com.example.catalogo3d.controllers;

import com.example.catalogo3d.security.JwtUtil;
import com.example.catalogo3d.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// @CrossOrigin ya se maneja en SecurityConfig
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email y password son obligatorios.");
        }

        Map<String, String> usuario = authService.login(email, password);
        if (usuario == null) {
            return ResponseEntity.status(401).body("Credenciales incorrectas.");
        }

        // Generar JWT
        String token = jwtUtil.generateToken(usuario.get("id"), usuario.get("email"), usuario.get("rol"));

        Map<String, Object> response = new HashMap<>(usuario);
        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}
