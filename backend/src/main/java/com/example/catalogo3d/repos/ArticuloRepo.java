package com.example.catalogo3d.repos;

import com.example.catalogo3d.models.Articulo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticuloRepo extends MongoRepository<Articulo, String> {
    List<Articulo> findByCategoriaId(String categoriaId);
}
