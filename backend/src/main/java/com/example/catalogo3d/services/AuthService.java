package com.example.catalogo3d.services;

import com.example.catalogo3d.models.Admin;
import com.example.catalogo3d.models.Cliente;
import com.example.catalogo3d.repos.AdminRepo;
import com.example.catalogo3d.repos.ClienteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private ClienteRepo clienteRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public Map<String, String> login(String email, String password) {
        // Buscar primero en admins
        Optional<Admin> adminOpt = adminRepo.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (encoder.matches(password, admin.getPassword())) {
                Map<String, String> resp = new HashMap<>();
                resp.put("id", admin.getId());
                resp.put("nombre", admin.getNombre());
                resp.put("email", admin.getEmail());
                resp.put("rol", "ADMIN");
                return resp;
            }
        }

        // Buscar en clientes
        Optional<Cliente> clienteOpt = clienteRepo.findByEmail(email);
        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();
            if (encoder.matches(password, cliente.getPassword())) {
                Map<String, String> resp = new HashMap<>();
                resp.put("id", cliente.getId());
                resp.put("nombre", cliente.getNombre());
                resp.put("email", cliente.getEmail());
                resp.put("rol", "CLIENTE");
                return resp;
            }
        }

        return null;
    }
}
