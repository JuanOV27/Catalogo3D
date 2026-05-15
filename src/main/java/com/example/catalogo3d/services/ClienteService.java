package com.example.catalogo3d.services;

import com.example.catalogo3d.models.Cliente;
import com.example.catalogo3d.repos.ClienteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepo clienteRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public List<Cliente> obtenerTodos() {
        return clienteRepo.findAll();
    }

    public Optional<Cliente> obtenerPorId(String id) {
        return clienteRepo.findById(id);
    }

    public Cliente crear(Cliente cliente) {
        if (cliente.getEmail() == null || cliente.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email del cliente es obligatorio.");
        }
        if (clienteRepo.existsByEmail(cliente.getEmail())) {
            throw new IllegalArgumentException("Ya existe un cliente con ese email.");
        }
        cliente.setPassword(encoder.encode(cliente.getPassword()));
        return clienteRepo.save(cliente);
    }

    public Optional<Cliente> actualizar(String id, Cliente datos) {
        return clienteRepo.findById(id).map(existente -> {
            if (datos.getNombre() != null && !datos.getNombre().isBlank()) {
                existente.setNombre(datos.getNombre());
            }
            if (datos.getEmail() != null && !datos.getEmail().isBlank()) {
                existente.setEmail(datos.getEmail());
            }
            if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
                existente.setPassword(encoder.encode(datos.getPassword()));
            }
            return clienteRepo.save(existente);
        });
    }

    public boolean eliminar(String id) {
        if (clienteRepo.existsById(id)) {
            clienteRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
