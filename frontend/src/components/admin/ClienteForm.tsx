import { useState } from "react";
import type { FormEvent } from "react";
import type { Cliente } from "../../types/models";

export interface ClienteFormData {
  nombre: string;
  email: string;
  password?: string;
}

interface Props {
  initialValue?: Cliente;
  requirePassword?: boolean;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function ClienteForm({ initialValue, requirePassword = false, onSubmit, onCancel }: Props) {
  const [nombre, setNombre] = useState(initialValue?.nombre ?? "");
  const [email, setEmail] = useState(initialValue?.email ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: ClienteFormData = { nombre, email };
      if (password) data.password = password;
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="cli-nombre">Nombre</label>
        <input id="cli-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="cli-email">Email</label>
        <input id="cli-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="cli-password">{requirePassword ? "Contraseña" : "Nueva contraseña (opcional)"}</label>
        <input
          id="cli-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={requirePassword}
          placeholder={requirePassword ? "" : "Dejar en blanco para no cambiar"}
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
