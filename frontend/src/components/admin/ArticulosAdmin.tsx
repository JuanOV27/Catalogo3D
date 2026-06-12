import { useEffect, useState } from "react";
import { ApiError, articulosApi, categoriasApi } from "../../lib/api";
import type { Articulo, Categoria } from "../../types/models";
import AdminGuard from "./AdminGuard";
import ArticuloForm from "./ArticuloForm";
import ConfirmDialog from "../common/ConfirmDialog";
import DataTable from "../common/DataTable";
import ErrorBanner from "../common/ErrorBanner";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";

type ArticuloInput = Omit<Articulo, "id" | "fechaCreacion">;

function ArticulosAdminContent() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Articulo | "new" | null>(null);
  const [deleting, setDeleting] = useState<Articulo | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [arts, cats] = await Promise.all([articulosApi.getAll(), categoriasApi.getAll()]);
      setArticulos(arts);
      setCategorias(cats);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categoriaNombre = (categoriaId: string) =>
    categorias.find((c) => c.id === categoriaId)?.nombre ?? "Sin categoría";

  const handleSubmit = async (data: ArticuloInput) => {
    setError(null);
    try {
      if (editing === "new") {
        await articulosApi.create(data);
      } else if (editing) {
        await articulosApi.update(editing.id, data);
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el artículo.");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setError(null);
    try {
      await articulosApi.remove(deleting.id);
      setDeleting(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar el artículo.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBanner message={error} />
      <div className="btn-row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setEditing("new")}
          disabled={categorias.length === 0}
        >
          Nuevo artículo
        </button>
      </div>
      {categorias.length === 0 && (
        <p className="muted">Crea al menos una categoría antes de añadir artículos.</p>
      )}
      <DataTable<Articulo>
        columns={[
          { header: "Nombre", render: (a) => a.nombre },
          { header: "Categoría", render: (a) => categoriaNombre(a.categoriaId) },
          { header: "Precio", render: (a) => `$${a.precio.toFixed(2)}` },
          { header: "Material", render: (a) => a.material },
          {
            header: "Disponible",
            render: (a) => (
              <span className={`badge ${a.disponible ? "badge-success" : "badge-muted"}`}>
                {a.disponible ? "Sí" : "No"}
              </span>
            ),
          },
          {
            header: "Acciones",
            render: (a) => (
              <div className="btn-row" style={{ margin: 0 }}>
                <button type="button" className="btn btn-sm" onClick={() => setEditing(a)}>
                  Editar
                </button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => setDeleting(a)}>
                  Eliminar
                </button>
              </div>
            ),
          },
        ]}
        rows={articulos}
        rowKey={(a) => a.id}
        emptyMessage="No hay artículos registrados."
      />
      {editing && (
        <Modal title={editing === "new" ? "Nuevo artículo" : "Editar artículo"} onClose={() => setEditing(null)}>
          <ArticuloForm
            initialValue={editing === "new" ? undefined : editing}
            categorias={categorias}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar artículo"
          message={`¿Eliminar el artículo "${deleting.nombre}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

export default function ArticulosAdmin() {
  return (
    <AdminGuard>
      <ArticulosAdminContent />
    </AdminGuard>
  );
}
