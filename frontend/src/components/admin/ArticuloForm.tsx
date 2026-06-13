import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Articulo, Categoria } from "../../types/models";
import { uploadApi, ApiError } from "../../lib/api";

type ArticuloInput = Omit<Articulo, "id" | "fechaCreacion">;

interface Props {
  initialValue?: Articulo;
  categorias: Categoria[];
  onSubmit: (data: ArticuloInput) => Promise<void>;
  onCancel: () => void;
}

export default function ArticuloForm({ initialValue, categorias, onSubmit, onCancel }: Props) {
  const [nombre, setNombre] = useState(initialValue?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(initialValue?.descripcion ?? "");
  const [material, setMaterial] = useState(initialValue?.material ?? "");
  const [color, setColor] = useState(initialValue?.color ?? "");
  const [ancho, setAncho] = useState(initialValue?.dimensiones.ancho ?? 0);
  const [alto, setAlto] = useState(initialValue?.dimensiones.alto ?? 0);
  const [largo, setLargo] = useState(initialValue?.dimensiones.largo ?? 0);
  const [precio, setPrecio] = useState(initialValue?.precio ?? 0);
  const [categoriaId, setCategoriaId] = useState(initialValue?.categoriaId ?? categorias[0]?.id ?? "");
  const [tiempoImpresionHoras, setTiempoImpresionHoras] = useState(initialValue?.tiempoImpresionHoras ?? 0);
  const [tipoFilamento, setTipoFilamento] = useState(initialValue?.tipoFilamento ?? "");
  const [imagenUrl, setImagenUrl] = useState(initialValue?.imagenUrl ?? "");
  const [disponible, setDisponible] = useState(initialValue?.disponible ?? true);
  const [enlaceWhatsapp, setEnlaceWhatsapp] = useState(initialValue?.enlaceWhatsapp ?? "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const { url } = await uploadApi.upload(file);
      setImagenUrl(url);
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        nombre,
        descripcion,
        material,
        color,
        dimensiones: { ancho: Number(ancho), alto: Number(alto), largo: Number(largo) },
        precio: Number(precio),
        categoriaId,
        tiempoImpresionHoras: Number(tiempoImpresionHoras),
        tipoFilamento,
        imagenUrl,
        disponible,
        enlaceWhatsapp: enlaceWhatsapp || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="art-nombre">Nombre</label>
        <input id="art-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="art-descripcion">Descripción</label>
        <textarea
          id="art-descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="art-material">Material</label>
          <input id="art-material" value={material} onChange={(e) => setMaterial(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="art-color">Color</label>
          <input id="art-color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="art-tipoFilamento">Tipo de filamento</label>
          <input id="art-tipoFilamento" value={tipoFilamento} onChange={(e) => setTipoFilamento(e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="art-precio">Precio</label>
          <input
            id="art-precio"
            type="number"
            step="0.01"
            min="0"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="art-tiempo">Tiempo de impresión (h)</label>
          <input
            id="art-tiempo"
            type="number"
            step="0.1"
            min="0"
            value={tiempoImpresionHoras}
            onChange={(e) => setTiempoImpresionHoras(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="art-categoria">Categoría</label>
          <select id="art-categoria" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Dimensiones (cm) — ancho / alto / largo</label>
        <div className="form-row">
          <input
            type="number"
            step="0.1"
            min="0"
            value={ancho}
            onChange={(e) => setAncho(Number(e.target.value))}
            aria-label="Ancho"
          />
          <input
            type="number"
            step="0.1"
            min="0"
            value={alto}
            onChange={(e) => setAlto(Number(e.target.value))}
            aria-label="Alto"
          />
          <input
            type="number"
            step="0.1"
            min="0"
            value={largo}
            onChange={(e) => setLargo(Number(e.target.value))}
            aria-label="Largo"
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="art-imagen">Imagen del artículo</label>
        {imagenUrl && (
          <div className="image-preview">
            <img src={imagenUrl} alt="Vista previa" />
            <button type="button" className="btn btn-sm" onClick={() => setImagenUrl("")}>
              Quitar imagen
            </button>
          </div>
        )}
        <input id="art-imagen" type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={handleImageChange} />
        {uploading && <p className="muted">Subiendo imagen...</p>}
        {uploadError && <p className="error-banner">{uploadError}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="art-whatsapp">Enlace de WhatsApp (compra)</label>
        <input
          id="art-whatsapp"
          value={enlaceWhatsapp}
          onChange={(e) => setEnlaceWhatsapp(e.target.value)}
          placeholder="https://wa.me/..."
        />
      </div>
      <div className="checkbox-row">
        <input
          id="art-disponible"
          type="checkbox"
          checked={disponible}
          onChange={(e) => setDisponible(e.target.checked)}
        />
        <label htmlFor="art-disponible">Disponible</label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
