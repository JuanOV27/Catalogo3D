import { useEffect, useState } from "react";
import { ApiError, clientesApi } from "../../lib/api";
import type { Cliente } from "../../types/models";
import AdminGuard from "./AdminGuard";
import ClienteForm, { type ClienteFormData } from "./ClienteForm";
import ConfirmDialog from "../common/ConfirmDialog";
import DataTable from "../common/DataTable";
import ErrorBanner from "../common/ErrorBanner";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";

function ClientesAdminContent() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Cliente | "new" | null>(null);
  const [deleting, setDeleting] = useState<Cliente | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setClientes(await clientesApi.getAll());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (data: ClienteFormData) => {
    setError(null);
    try {
      if (editing === "new") {
        await clientesApi.register({ nombre: data.nombre, email: data.email, password: data.password ?? "" });
      } else if (editing) {
        await clientesApi.update(editing.id, data);
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el cliente.");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setError(null);
    try {
      await clientesApi.remove(deleting.id);
      setDeleting(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar el cliente.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBanner message={error} />
      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>
          Nuevo cliente
        </button>
      </div>
      <DataTable<Cliente>
        columns={[
          { header: "Nombre", render: (c) => c.nombre },
          { header: "Email", render: (c) => c.email },
          {
            header: "Acciones",
            render: (c) => (
              <div className="btn-row" style={{ margin: 0 }}>
                <button type="button" className="btn btn-sm" onClick={() => setEditing(c)}>
                  Editar
                </button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => setDeleting(c)}>
                  Eliminar
                </button>
              </div>
            ),
          },
        ]}
        rows={clientes}
        rowKey={(c) => c.id}
        emptyMessage="No hay clientes registrados."
      />
      {editing && (
        <Modal title={editing === "new" ? "Nuevo cliente" : "Editar cliente"} onClose={() => setEditing(null)}>
          <ClienteForm
            initialValue={editing === "new" ? undefined : editing}
            requirePassword={editing === "new"}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar cliente"
          message={`¿Eliminar al cliente "${deleting.nombre}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

export default function ClientesAdmin() {
  return (
    <AdminGuard>
      <ClientesAdminContent />
    </AdminGuard>
  );
}
