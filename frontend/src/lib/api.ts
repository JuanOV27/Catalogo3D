import type {
  Admin,
  Articulo,
  Categoria,
  Cliente,
  LoginResponse,
} from "../types/models";
import { getSession } from "./session";

const BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const session = getSession();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  if (session) {
    headers["X-User-Rol"] = session.rol;
    headers["X-User-Id"] = session.id;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  let data: unknown;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    let message: string;
    if (typeof data === "string") {
      message = data;
    } else if (data && typeof data === "object" && "message" in data) {
      message = String((data as { message: unknown }).message);
    } else {
      message = res.statusText || `Error ${res.status}`;
    }
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export const authApi = {
  login(email: string, password: string) {
    return request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};

export const articulosApi = {
  getAll() {
    return request<Articulo[]>("/api/articulos");
  },
  getById(id: string) {
    return request<Articulo>(`/api/articulos/${id}`);
  },
  getByCategoria(categoriaId: string) {
    return request<Articulo[]>(`/api/articulos/categoria/${categoriaId}`);
  },
  create(data: Omit<Articulo, "id" | "fechaCreacion">) {
    return request<Articulo>("/api/articulos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<Articulo>) {
    return request<Articulo>(`/api/articulos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return request<void>(`/api/articulos/${id}`, { method: "DELETE" });
  },
};

export const categoriasApi = {
  getAll() {
    return request<Categoria[]>("/api/categorias");
  },
  getById(id: string) {
    return request<Categoria>(`/api/categorias/${id}`);
  },
  create(data: Omit<Categoria, "id">) {
    return request<Categoria>("/api/categorias", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<Categoria>) {
    return request<Categoria>(`/api/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return request<void>(`/api/categorias/${id}`, { method: "DELETE" });
  },
};

export const clientesApi = {
  getAll() {
    return request<Cliente[]>("/api/clientes");
  },
  getById(id: string) {
    return request<Cliente>(`/api/clientes/${id}`);
  },
  register(data: { nombre: string; email: string; password: string }) {
    return request<Cliente>("/api/clientes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<Cliente>) {
    return request<Cliente>(`/api/clientes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return request<void>(`/api/clientes/${id}`, { method: "DELETE" });
  },
};

export const adminsApi = {
  getAll() {
    return request<Admin[]>("/api/admins");
  },
  getById(id: string) {
    return request<Admin>(`/api/admins/${id}`);
  },
  init(data: { nombre: string; email: string; password: string }) {
    return request<Admin>("/api/admins/init", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: Partial<Admin>) {
    return request<Admin>(`/api/admins/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  remove(id: string) {
    return request<void>(`/api/admins/${id}`, { method: "DELETE" });
  },
};
