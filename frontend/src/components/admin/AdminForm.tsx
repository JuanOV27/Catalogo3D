import { useState } from "react";
import type { FormEvent } from "react";
import type { Admin } from "../../types/models";

export interface AdminFormData {
  nombre: string;
  email: string;
  password?: string;
}

interface Props {
  initialValue?: Admin;
  requirePassword?: boolean;
  onSubmit: (data: AdminFormData) => Promise<void>;
  onCancel: () => void;
}

export default function AdminForm({ initialValue, requirePassword = false, onSubmit, onCancel }: Props) {
  const [nombre, setNombre] = useState(initialValue?.nombre ?? "");
  const [email, setEmail] = useState(initialValue?.email ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: AdminFormData = { nombre, email };
      if (password) data.password = password;
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="adm-nombre">Nombre</label>
        <input id="adm-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="adm-email">Email</label>
        <input id="adm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="adm-password">{requirePassword ? "Contraseña" : "Nueva contraseña (opcional)"}</label>
        <input
          id="adm-password"
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
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
