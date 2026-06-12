import { useEffect, useState } from "react";
import { ApiError, adminsApi } from "../../lib/api";
import { useSession } from "../../lib/useSession";
import type { Admin } from "../../types/models";
import AdminGuard from "./AdminGuard";
import AdminForm, { type AdminFormData } from "./AdminForm";
import ConfirmDialog from "../common/ConfirmDialog";
import DataTable from "../common/DataTable";
import ErrorBanner from "../common/ErrorBanner";
import LoadingSpinner from "../common/LoadingSpinner";
import Modal from "../common/Modal";

function AdminsAdminContent() {
  const { session } = useSession();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Admin | "new" | null>(null);
  const [deleting, setDeleting] = useState<Admin | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setAdmins(await adminsApi.getAll());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (data: AdminFormData) => {
    setError(null);
    try {
      if (editing === "new") {
        await adminsApi.init({ nombre: data.nombre, email: data.email, password: data.password ?? "" });
      } else if (editing) {
        await adminsApi.update(editing.id, data);
      }
      setEditing(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el administrador.");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setError(null);
    try {
      await adminsApi.remove(deleting.id);
      setDeleting(null);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo eliminar el administrador.");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <ErrorBanner message={error} />
      <div className="btn-row">
        <button type="button" className="btn btn-primary" onClick={() => setEditing("new")}>
          Nuevo administrador
        </button>
      </div>
      <DataTable<Admin>
        columns={[
          { header: "Nombre", render: (a) => a.nombre },
          { header: "Email", render: (a) => a.email },
          {
            header: "Acciones",
            render: (a) => (
              <div className="btn-row" style={{ margin: 0 }}>
                <button type="button" className="btn btn-sm" onClick={() => setEditing(a)}>
                  Editar
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setDeleting(a)}
                  disabled={a.id === session?.id}
                  title={a.id === session?.id ? "No puedes eliminar tu propia cuenta" : undefined}
                >
                  Eliminar
                </button>
              </div>
            ),
          },
        ]}
        rows={admins}
        rowKey={(a) => a.id}
        emptyMessage="No hay administradores registrados."
      />
      {editing && (
        <Modal title={editing === "new" ? "Nuevo administrador" : "Editar administrador"} onClose={() => setEditing(null)}>
          <AdminForm
            initialValue={editing === "new" ? undefined : editing}
            requirePassword={editing === "new"}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
      {deleting && (
        <ConfirmDialog
          title="Eliminar administrador"
          message={`¿Eliminar al administrador "${deleting.nombre}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}

export default function AdminsAdmin() {
  return (
    <AdminGuard>
      <AdminsAdminContent />
    </AdminGuard>
  );
}
