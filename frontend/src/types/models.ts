export interface Dimensiones {
  ancho: number;
  alto: number;
  largo: number;
}

export interface Articulo {
  id: string;
  nombre: string;
  descripcion: string;
  material: string;
  color: string;
  dimensiones: Dimensiones;
  precio: number;
  categoriaId: string;
  tiempoImpresionHoras: number;
  tipoFilamento: string;
  imagenUrl: string;
  disponible: boolean;
  enlaceWhatsapp?: string;
  fechaCreacion: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Admin {
  id: string;
  nombre: string;
  email: string;
  password: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  password: string;
}

export type Rol = "ADMIN" | "CLIENTE";

export interface LoginResponse {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}
