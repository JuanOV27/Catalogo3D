package com.example.catalogo3d.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class UploadController {

    private static final Set<String> EXTENSIONES_PERMITIDAS = Set.of("jpg", "jpeg", "png", "gif", "webp");
    private static final long TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> subirImagen(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-User-Rol", required = false) String rol) {
        if (!"ADMIN".equals(rol)) return ResponseEntity.status(403).body("Acceso denegado.");

        if (file.isEmpty()) return ResponseEntity.badRequest().body("El archivo está vacío.");
        if (file.getSize() > TAMANO_MAXIMO) return ResponseEntity.badRequest().body("El archivo supera el tamaño máximo de 5MB.");

        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
        if (extension == null || !EXTENSIONES_PERMITIDAS.contains(extension.toLowerCase())) {
            return ResponseEntity.badRequest().body("Formato no permitido. Usa jpg, png, gif o webp.");
        }

        try {
            Path dir = Path.of(uploadDir);
            Files.createDirectories(dir);

            String nombreArchivo = UUID.randomUUID() + "." + extension.toLowerCase();
            Path destino = dir.resolve(nombreArchivo);
            file.transferTo(destino);

            String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/" + nombreArchivo)
                    .toUriString();

            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("No se pudo guardar el archivo.");
        }
    }
}
