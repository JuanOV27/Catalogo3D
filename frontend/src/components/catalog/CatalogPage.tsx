import { useEffect, useState } from "react";
import { ApiError, articulosApi, categoriasApi } from "../../lib/api";
import { useSession } from "../../lib/useSession";
import type { Articulo, Categoria } from "../../types/models";
import CategoriaFilter from "./CategoriaFilter";
import ArticuloGrid from "./ArticuloGrid";
import ArticuloDetailModal from "./ArticuloDetailModal";
import ErrorBanner from "../common/ErrorBanner";
import LoadingSpinner from "../common/LoadingSpinner";

export default function CatalogPage() {
  const { session, ready } = useSession();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [selectedArticulo, setSelectedArticulo] = useState<Articulo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const [cats, arts] = await Promise.all([categoriasApi.getAll(), articulosApi.getAll()]);
        if (cancelled) return;
        setCategorias(cats);
        setArticulos(arts);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, session]);

  if (!ready) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return (
      <div className="card">
        <p>Inicia sesión o regístrate para ver el catálogo de artículos.</p>
        <div className="form-actions">
          <a className="btn btn-primary" href="/login">
            Iniciar sesión
          </a>
          <a className="btn" href="/registro">
            Registrarse
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const articulosFiltrados = selectedCategoria
    ? articulos.filter((articulo) => articulo.categoriaId === selectedCategoria)
    : articulos;

  return (
    <div>
      <ErrorBanner message={error} />
      <CategoriaFilter categorias={categorias} selected={selectedCategoria} onSelect={setSelectedCategoria} />
      <ArticuloGrid articulos={articulosFiltrados} onSelect={setSelectedArticulo} />
      {selectedArticulo && (
        <ArticuloDetailModal
          articulo={selectedArticulo}
          categoria={categorias.find((categoria) => categoria.id === selectedArticulo.categoriaId)}
          onClose={() => setSelectedArticulo(null)}
        />
      )}
    </div>
  );
}
