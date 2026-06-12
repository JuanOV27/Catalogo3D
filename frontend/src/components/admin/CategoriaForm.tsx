import { useState } from "react";
import type { FormEvent } from "react";
import type { Categoria } from "../../types/models";

interface Props {
  initialValue?: Categoria;
  onSubmit: (data: Omit<Categoria, "id">) => Promise<void>;
  onCancel: () => void;
}

export default function CategoriaForm({ initialValue, onSubmit, onCancel }: Props) {
  const [nombre, setNombre] = useState(initialValue?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(initialValue?.descripcion ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ nombre, descripcion });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="cat-nombre">Nombre</label>
        <input id="cat-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="cat-descripcion">Descripción</label>
        <textarea
          id="cat-descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
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
