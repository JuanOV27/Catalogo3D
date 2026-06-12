# Guía interna del sistema — Catálogo 3D

## Arquitectura general

El sistema sigue una arquitectura de **4 capas** donde cada capa solo habla con la siguiente. Ninguna capa se salta otra.

```
POSTMAN / Cliente HTTP
        │
        ▼
┌─────────────────┐
│  CONTROLLERS    │  ← Recibe la petición HTTP, valida el rol, responde
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    SERVICES     │  ← Lógica de negocio, validaciones, transformaciones
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│      REPOS      │  ← Habla con MongoDB (consultas)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     MODELS      │  ← Define la estructura de los documentos en MongoDB
└─────────────────┘
```

---

## Capa 1 — Models (Modelos)

Son clases Java que **representan un documento en MongoDB**. Cada campo de la clase se convierte en un campo del documento en la base de datos.

### `Articulo.java`

```java
@Document(collection = "articulos")  // guarda en la colección "articulos" de MongoDB
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | String | Generado automáticamente por MongoDB (ObjectId) |
| `nombre` | String | Nombre del artículo |
| `descripcion` | String | Descripción del artículo |
| `material` | String | Ej: PLA, ABS, PETG |
| `color` | String | Color de impresión |
| `dimensiones` | Dimensiones | Objeto embebido (ancho, alto, largo) |
| `precio` | double | Precio en la moneda local |
| `categoriaId` | String | Referencia manual a una Categoría |
| `tiempoImpresionHoras` | double | Horas estimadas de impresión |
| `tipoFilamento` | String | Tipo de filamento usado |
| `imagenUrl` | String | URL de la imagen del artículo |
| `disponible` | boolean | Si está disponible para pedido |
| `fechaCreacion` | LocalDateTime | Fecha/hora de creación (auto-asignada) |

### `Categoria.java`

```java
@Document(collection = "categorias")
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | String | Generado por MongoDB |
| `nombre` | String | Ej: "Figuras de Acción" |
| `descripcion` | String | Descripción de la categoría |

### `Admin.java` y `Cliente.java`

Misma estructura:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | String | Generado por MongoDB |
| `nombre` | String | Nombre del usuario |
| `email` | String | Email único, usado para login |
| `password` | String | **Hasheado con BCrypt** antes de guardar |

### `Dimensiones.java`

No tiene `@Document` — **no es una colección**, es un objeto que vive **dentro** de un `Articulo` en MongoDB:

```json
"dimensiones": {
  "ancho": 4.0,
  "alto": 12.0,
  "largo": 4.0
}
```

---

## Capa 2 — Repos (Repositorios)

Son **interfaces** que extienden `MongoRepository`. Spring genera automáticamente la implementación en tiempo de ejecución — no hay código SQL ni queries manuales.

### Métodos heredados de `MongoRepository`

| Método | Qué hace |
|--------|----------|
| `findAll()` | Trae todos los documentos de la colección |
| `findById(id)` | Busca uno por su `_id`, devuelve `Optional` |
| `save(objeto)` | Inserta si es nuevo, actualiza si ya existe |
| `existsById(id)` | Devuelve `true`/`false` si existe |
| `deleteById(id)` | Elimina por `_id` |

### Métodos personalizados

Spring los implementa solo leyendo el nombre del método.

**`ArticuloRepo`**

```java
List<Articulo> findByCategoriaId(String categoriaId)
// Spring traduce esto a: db.articulos.find({ categoriaId: "..." })
```

**`AdminRepo` y `ClienteRepo`**

```java
Optional<Admin> findByEmail(String email)
// → db.admins.find({ email: "..." })

boolean existsByEmail(String email)
// → db.admins.find({ email: "..." }).count() > 0
```

---

## Capa 3 — Services (Servicios)

Aquí vive **toda la lógica de negocio**. Los controllers no deciden nada importante — solo delegan al servicio.

### `ArticuloService`

#### `crear(articulo)`
1. Valida que `nombre` no sea vacío → lanza `IllegalArgumentException` si falla
2. Valida que `precio >= 0`
3. Si `fechaCreacion` viene nula → asigna `LocalDateTime.now()`
4. Llama a `articuloRepo.save(articulo)` → MongoDB asigna el `id`
5. Retorna el artículo guardado con su `id`

#### `obtenerTodos()`
Llama a `articuloRepo.findAll()` y retorna la lista completa.

#### `obtenerPorId(id)`
Llama a `articuloRepo.findById(id)` y retorna `Optional<Articulo>`. Si no existe, el Optional viene vacío y el controller responde 404.

#### `obtenerPorCategoria(categoriaId)`
Llama a `articuloRepo.findByCategoriaId(categoriaId)` y retorna la lista filtrada.

#### `actualizar(id, datos)`
1. Busca el artículo existente con `findById(id)`
2. Solo sobreescribe los campos que vienen **no nulos** en `datos` (así puedes mandar solo `{"precio": 40}` sin perder los demás campos)
3. Guarda con `save()` → MongoDB actualiza el documento

#### `eliminar(id)`
1. Verifica que exista con `existsById(id)`
2. Si existe → `deleteById(id)` → retorna `true`
3. Si no existe → retorna `false` (el controller responde 404)

---

### `CategoriaService`

Misma lógica que `ArticuloService` pero más simple (sin `fechaCreacion` ni validación de precio).

| Método | Qué hace |
|--------|----------|
| `crear(categoria)` | Valida que `nombre` no sea vacío |
| `actualizar(id, datos)` | Actualiza solo los campos no nulos |
| `eliminar(id)` | Elimina si existe, retorna `true`/`false` |

---

### `AdminService` y `ClienteService`

Igual a los anteriores con una diferencia importante en el manejo de passwords.

#### `crear(admin)`
1. Valida que `email` no sea vacío
2. Llama a `existsByEmail()` — si ya existe ese email → lanza error
3. **Hashea el password** con BCrypt: `encoder.encode(password)`. El password plano **nunca** se guarda en MongoDB
4. Guarda el admin/cliente

#### `actualizar(id, datos)`
Si viene un `password` nuevo → también lo hashea antes de guardar.

---

### `AuthService`

#### `login(email, password)`

```
1. Busca en admins:    adminRepo.findByEmail(email)
   ├── Encontrado → encoder.matches(passwordPlano, hashGuardado)
   │   ├── Coincide  → retorna { id, nombre, email, rol: "ADMIN" }
   │   └── No coincide → sigue buscando
   └── No encontrado → sigue

2. Busca en clientes:  clienteRepo.findByEmail(email)
   ├── Encontrado → encoder.matches(passwordPlano, hashGuardado)
   │   ├── Coincide  → retorna { id, nombre, email, rol: "CLIENTE" }
   │   └── No coincide → retorna null
   └── No encontrado → retorna null

3. Si retorna null → controller responde 401 Unauthorized
```

> **¿Qué es `encoder.matches()`?**
> BCrypt no desencripta el hash — genera el hash del password que llega y lo compara con el guardado. Por eso aunque alguien robe la base de datos, no puede saber los passwords reales.

---

## Capa 4 — Controllers (Controladores)

Son la **puerta de entrada HTTP**. Cada método de un controller maneja una ruta específica.

### Anatomía de un endpoint

```java
@GetMapping("/{id}")                          // ruta y método HTTP
public ResponseEntity<?> obtenerPorId(
    @PathVariable String id,                  // toma el {id} de la URL
    @RequestHeader(value = "X-User-Rol",
                   required = false)          // lee el header (no falla si no viene)
    String rol) {

    if (!"ADMIN".equals(rol) &&              // valida el rol
        !"CLIENTE".equals(rol))
        return ResponseEntity.status(403)    // 403 si no tiene permiso
                             .body("Acceso denegado.");

    return articuloService.obtenerPorId(id)  // delega al servicio
        .map(ResponseEntity::ok)             // si existe → 200 con el objeto
        .orElse(ResponseEntity.notFound()    // si no existe → 404
                               .build());
}
```

### Códigos HTTP que retorna el sistema

| Código | Significado | Cuándo ocurre |
|--------|-------------|---------------|
| `200 OK` | Éxito con datos | GET exitoso, PUT exitoso |
| `201 Created` | Recurso creado | POST exitoso |
| `204 No Content` | Éxito sin datos | DELETE exitoso |
| `400 Bad Request` | Dato inválido | Nombre vacío, precio negativo |
| `401 Unauthorized` | Credenciales incorrectas | Login fallido |
| `403 Forbidden` | Sin permiso | CLIENTE intenta POST/PUT/DELETE |
| `404 Not Found` | No existe | ID que no existe en MongoDB |

### Control de acceso por endpoint

| Endpoint | ADMIN | CLIENTE |
|----------|-------|---------|
| `GET /api/articulos` | ✅ | ✅ |
| `GET /api/articulos/{id}` | ✅ | ✅ |
| `GET /api/articulos/categoria/{id}` | ✅ | ✅ |
| `POST /api/articulos` | ✅ | ❌ 403 |
| `PUT /api/articulos/{id}` | ✅ | ❌ 403 |
| `DELETE /api/articulos/{id}` | ✅ | ❌ 403 |
| `GET /api/categorias` | ✅ | ✅ |
| `POST /api/categorias` | ✅ | ❌ 403 |
| `PUT /api/categorias/{id}` | ✅ | ❌ 403 |
| `DELETE /api/categorias/{id}` | ✅ | ❌ 403 |
| `GET /api/clientes` | ✅ | ❌ 403 |
| `GET /api/clientes/{id}` | ✅ | ✅ (solo el propio) |
| `POST /api/clientes` | Sin rol (registro público) | Sin rol |
| `PUT /api/clientes/{id}` | ✅ | ✅ (solo el propio) |
| `DELETE /api/clientes/{id}` | ✅ | ❌ 403 |
| `POST /api/admins/init` | Sin rol (inicialización) | Sin rol |
| `POST /api/auth/login` | Sin rol | Sin rol |

---

## Flujo completo de una petición — Ejemplo: crear artículo

```
Postman
  │  POST /api/articulos
  │  Header: X-User-Rol: ADMIN
  │  Body: { "nombre": "Batman", "precio": 35.0, ... }
  │
  ▼
ArticuloController.crear()
  │  1. Lee header X-User-Rol → es "ADMIN" → pasa la validación
  │  2. Spring convierte el JSON del body → objeto Articulo
  │  3. Llama a articuloService.crear(articulo)
  │
  ▼
ArticuloService.crear()
  │  1. nombre no es vacío → OK
  │  2. precio 35.0 >= 0 → OK
  │  3. fechaCreacion es null → asigna LocalDateTime.now()
  │  4. Llama a articuloRepo.save(articulo)
  │
  ▼
ArticuloRepo.save()
  │  1. Spring Data genera la query de inserción
  │  2. MongoDB asigna el _id automáticamente
  │  3. Retorna el objeto con el id asignado
  │
  ▼ (regresa el resultado capa por capa)

Postman recibe:
  HTTP 201 Created
  {
    "id": "abc123...",
    "nombre": "Batman",
    "precio": 35.0,
    "fechaCreacion": "2026-05-07T15:56:23.307",
    ...
  }
```

---

## Resumen de archivos y su responsabilidad

```
models/
  Articulo.java      → estructura del artículo en MongoDB
  Categoria.java     → estructura de la categoría
  Admin.java         → estructura del admin
  Cliente.java       → estructura del cliente
  Dimensiones.java   → objeto embebido dentro de Articulo

repos/
  ArticuloRepo.java  → findAll, findById, save, delete, findByCategoriaId
  CategoriaRepo.java → findAll, findById, save, delete
  AdminRepo.java     → + findByEmail, existsByEmail
  ClienteRepo.java   → + findByEmail, existsByEmail

services/
  ArticuloService.java  → CRUD + validar nombre/precio + auto-fecha
  CategoriaService.java → CRUD + validar nombre
  AdminService.java     → CRUD + validar email único + hashear password
  ClienteService.java   → CRUD + validar email único + hashear password
  AuthService.java      → buscar en admins y clientes + verificar BCrypt

controllers/
  ArticuloController.java   → /api/articulos  (ADMIN=todo, CLIENTE=solo GET)
  CategoriaController.java  → /api/categorias (ADMIN=todo, CLIENTE=solo GET)
  AdminController.java      → /api/admins     (solo ADMIN, /init sin rol)
  ClienteController.java    → /api/clientes   (POST público, resto ADMIN/propio)
  AuthController.java       → /api/auth/login (sin rol)
```
=======
# Catalogo3D
