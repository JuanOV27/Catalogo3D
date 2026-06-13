import type { Articulo, Categoria } from "../../types/models";
import Modal from "../common/Modal";
import WhatsAppButton from "../common/WhatsAppButton";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='280' viewBox='0 0 400 280'%3E%3Crect width='400' height='280' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='16'%3ESin imagen%3C/text%3E%3C/svg%3E";

interface Props {
  articulo: Articulo;
  categoria?: Categoria;
  onClose: () => void;
}

export default function ArticuloDetailModal({ articulo, categoria, onClose }: Props) {
  return (
    <Modal title={articulo.nombre} onClose={onClose}>
      <img
        className="detail-image"
        src={articulo.imagenUrl || PLACEHOLDER_IMG}
        alt={articulo.nombre}
        onError={(e) => {
          (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
        }}
      />
      <p>{articulo.descripcion}</p>
      <dl className="detail-grid">
        <dt>Precio</dt>
        <dd>${articulo.precio.toFixed(2)}</dd>

        <dt>Categoría</dt>
        <dd>{categoria?.nombre ?? "Sin categoría"}</dd>

        <dt>Material</dt>
        <dd>{articulo.material}</dd>

        <dt>Color</dt>
        <dd>{articulo.color}</dd>

        <dt>Tipo de filamento</dt>
        <dd>{articulo.tipoFilamento}</dd>

        <dt>Tiempo de impresión</dt>
        <dd>{articulo.tiempoImpresionHoras} h</dd>

        <dt>Dimensiones (A x H x L)</dt>
        <dd>
          {articulo.dimensiones.ancho} x {articulo.dimensiones.alto} x {articulo.dimensiones.largo} cm
        </dd>

        <dt>Disponibilidad</dt>
        <dd>
          <span className={`badge ${articulo.disponible ? "badge-success" : "badge-muted"}`}>
            {articulo.disponible ? "Disponible" : "No disponible"}
          </span>
        </dd>

        <dt>Fecha de creación</dt>
        <dd>{new Date(articulo.fechaCreacion).toLocaleString("es-PE")}</dd>
      </dl>
      <div className="form-actions">
        {articulo.enlaceWhatsapp && <WhatsAppButton href={articulo.enlaceWhatsapp} />}
        <button type="button" className="btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
}
