package com.example.catalogo3d.repos;

import com.example.catalogo3d.models.Categoria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepo extends MongoRepository<Categoria, String> {
}
