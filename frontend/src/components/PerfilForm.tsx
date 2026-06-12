import { useEffect, useState } from "react";
import { ApiError, clientesApi } from "../lib/api";
import { useSession } from "../lib/useSession";
import type { Cliente } from "../types/models";
import ClienteForm, { type ClienteFormData } from "./admin/ClienteForm";
import ErrorBanner from "./common/ErrorBanner";
import LoadingSpinner from "./common/LoadingSpinner";

export default function PerfilForm() {
  const { session, ready } = useSession();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!session || session.rol !== "CLIENTE") {
      window.location.href = "/login";
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await clientesApi.getById(session.id);
        if (!cancelled) setCliente(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, session]);

  const handleSubmit = async (data: ClienteFormData) => {
    if (!session) return;
    setError(null);
    setSuccess(false);
    try {
      const updated = await clientesApi.update(session.id, data);
      setCliente(updated);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar el perfil.");
    }
  };

  if (!ready || loading) return <LoadingSpinner />;
  if (!cliente) return <ErrorBanner message={error ?? "No se encontró el perfil."} />;

  return (
    <div className="card" style={{ maxWidth: "420px" }}>
      <ErrorBanner message={error} />
      {success && <div className="success-banner">Perfil actualizado correctamente.</div>}
      <ClienteForm initialValue={cliente} onSubmit={handleSubmit} />
    </div>
  );
}
