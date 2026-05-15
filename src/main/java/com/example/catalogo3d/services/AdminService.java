package com.example.catalogo3d.services;

import com.example.catalogo3d.models.Admin;
import com.example.catalogo3d.repos.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepo adminRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public List<Admin> obtenerTodos() {
        return adminRepo.findAll();
    }

    public Optional<Admin> obtenerPorId(String id) {
        return adminRepo.findById(id);
    }

    public Admin crear(Admin admin) {
        if (admin.getEmail() == null || admin.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email del admin es obligatorio.");
        }
        if (adminRepo.existsByEmail(admin.getEmail())) {
            throw new IllegalArgumentException("Ya existe un admin con ese email.");
        }
        admin.setPassword(encoder.encode(admin.getPassword()));
        return adminRepo.save(admin);
    }

    public Optional<Admin> actualizar(String id, Admin datos) {
        return adminRepo.findById(id).map(existente -> {
            if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
                existente.setNombre(datos.getNombre());
            }
            if (datos.getEmail() != null && !datos.getEmail().isBlank()) {
                existente.setEmail(datos.getEmail());
            }
            if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
                existente.setPassword(encoder.encode(datos.getPassword()));
            }
            return adminRepo.save(existente);
        });
    }

    public boolean eliminar(String id) {
        if (adminRepo.existsById(id)) {
            adminRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
